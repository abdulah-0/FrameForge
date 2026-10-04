import puppeteer, { Browser } from "puppeteer-core";
import { spawn } from "node:child_process";
import { existsSync, statSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import {
  Project,
  calculateTotalDuration,
} from "@frameforge/project-schema";
import { generateHyperframesHTML } from "@frameforge/composition";
import { RESOLUTIONS, RenderStage } from "@frameforge/shared";

export interface RenderProgressEvent {
  stage: RenderStage;
  frame?: number;
  totalFrames?: number;
  progressPercent: number;
  message: string;
}

export interface RenderOptions {
  outputPath: string;
  quality?: "draft" | "standard" | "high";
  fps?: number;
  onProgress?: (event: RenderProgressEvent) => void;
}

export interface RenderResult {
  success: boolean;
  outputPath: string;
  durationSeconds: number;
  totalFrames: number;
  fileSizeBytes: number;
  error?: string;
}

function findChromePath(): string {
  const candidates = [
    process.env.CHROME_BIN,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];

  for (const c of candidates) {
    if (c && existsSync(c)) {
      return c;
    }
  }

  throw new Error("No compatible Chrome or Chromium browser executable found.");
}

/**
 * Renders a canonical Project directly to an MP4 video file.
 */
export async function renderProjectToMP4(
  project: Project,
  options: RenderOptions
): Promise<RenderResult> {
  const { outputPath, onProgress } = options;
  const fps = options.fps || project.fps || 30;
  const totalDuration = calculateTotalDuration(project.scenes);
  const totalFrames = Math.max(1, Math.round(totalDuration * fps));

  const ratioKey = project.aspectRatio === "16:9" ? "16:9" : "9:16";
  const resolutionConfig = RESOLUTIONS[ratioKey];
  const width = resolutionConfig.cloudPreviewWidth;
  const height = resolutionConfig.cloudPreviewHeight;

  mkdirSync(dirname(outputPath), { recursive: true });

  onProgress?.({
    stage: "preparing",
    progressPercent: 5,
    message: `Preparing composition for ${totalFrames} frames (${totalDuration}s)...`,
  });

  const html = generateHyperframesHTML(project);
  const chromePath = findChromePath();

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        `--window-size=${width},${height}`,
      ],
      defaultViewport: {
        width,
        height,
        deviceScaleFactor: 1,
      },
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height });

    onProgress?.({
      stage: "preparing",
      progressPercent: 15,
      message: "Loading HyperFrames DOM runtime in Chromium...",
    });

    await page.setContent(html, { waitUntil: "load" });

    // Ensure GSAP and DOM elements are ready
    await page.evaluate(() => {
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.overflow = "hidden";
    });

    onProgress?.({
      stage: "rendering",
      frame: 0,
      totalFrames,
      progressPercent: 20,
      message: `Starting frame-by-frame capture (0 / ${totalFrames})...`,
    });

    // Start FFmpeg subprocess
    const ffmpegArgs = [
      "-y",
      "-f", "image2pipe",
      "-vcodec", "png",
      "-r", String(fps),
      "-i", "-",
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-preset", "veryfast",
      "-movflags", "+faststart",
      outputPath,
    ];

    const ffmpeg = spawn("ffmpeg", ffmpegArgs);

    let ffmpegErr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      ffmpegErr += chunk.toString();
    });

    const ffmpegPromise = new Promise<void>((resolve, reject) => {
      ffmpeg.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`FFmpeg exited with code ${code}: ${ffmpegErr.slice(-300)}`));
      });
      ffmpeg.on("error", reject);
    });

    // Seek and capture each frame deterministically
    for (let frame = 0; frame < totalFrames; frame++) {
      const timeSeconds = frame / fps;

      // Update GSAP timelines and media elements in page
      await page.evaluate((t) => {
        const root = document.getElementById("root");
        if (!root) return;

        // Hide/show scenes based on data-start and data-duration
        const clips = document.querySelectorAll(".clip");
        clips.forEach((el) => {
          const start = parseFloat(el.getAttribute("data-start") || "0");
          const dur = parseFloat(el.getAttribute("data-duration") || "0");
          const htmlEl = el as HTMLElement;
          if (t >= start && t < start + dur) {
            htmlEl.style.display = "flex";
            htmlEl.style.visibility = "visible";
          } else {
            htmlEl.style.display = "none";
            htmlEl.style.visibility = "hidden";
          }
        });

        // Seek registered GSAP timelines
        const win = window as any;
        if (win.__timelines) {
          Object.entries(win.__timelines).forEach(([id, tl]: [string, any]) => {
            const el = document.getElementById(id);
            if (el) {
              const start = parseFloat(el.getAttribute("data-start") || "0");
              const localT = Math.max(0, t - start);
              if (tl && typeof tl.seek === "function") {
                tl.seek(localT, false);
              }
            }
          });
        }
      }, timeSeconds);

      const buffer = await page.screenshot({
        type: "png",
        optimizeForSpeed: true,
      });

      // Write frame to FFmpeg stdin
      const canWrite = ffmpeg.stdin.write(buffer);
      if (!canWrite) {
        await new Promise((r) => ffmpeg.stdin.once("drain", r));
      }

      if (frame % 5 === 0 || frame === totalFrames - 1) {
        const percent = Math.round(20 + ((frame + 1) / totalFrames) * 70);
        onProgress?.({
          stage: "rendering",
          frame: frame + 1,
          totalFrames,
          progressPercent: percent,
          message: `Captured frame ${frame + 1} of ${totalFrames} (${timeSeconds.toFixed(2)}s)...`,
        });
      }
    }

    onProgress?.({
      stage: "encoding",
      progressPercent: 95,
      message: "Finalizing H.264 video container with FFmpeg...",
    });

    ffmpeg.stdin.end();
    await ffmpegPromise;

    await browser.close();
    browser = null;

    const stats = statSync(outputPath);

    onProgress?.({
      stage: "complete",
      progressPercent: 100,
      message: `Render complete! Output saved to ${outputPath}`,
    });

    return {
      success: true,
      outputPath,
      durationSeconds: totalDuration,
      totalFrames,
      fileSizeBytes: stats.size,
    };
  } catch (err: any) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    onProgress?.({
      stage: "failed",
      progressPercent: 0,
      message: `Render failed: ${err.message}`,
    });
    return {
      success: false,
      outputPath,
      durationSeconds: totalDuration,
      totalFrames,
      fileSizeBytes: 0,
      error: err.message,
    };
  }
}

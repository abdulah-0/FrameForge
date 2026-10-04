import http from "node:http";
import { resolve } from "node:path";
import { existsSync, createReadStream, statSync } from "node:fs";
import { renderProjectToMP4 } from "./renderer.js";
import { validateProject } from "@frameforge/project-schema";
import { LIMITS, isSafeMediaUrl } from "@frameforge/shared";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3100;
const jobs = new Map();
const MAX_REQUEST_BODY_SIZE = 10 * 1024 * 1024; // 10MB limit for JSON payload
const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    // Health check
    if (url.pathname === "/health" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", service: "frameforge-render-worker", port: PORT }));
        return;
    }
    // Serve completed MP4 video files
    if (url.pathname.startsWith("/renders/") && req.method === "GET") {
        const filename = url.pathname.replace(/^\/renders\//, "");
        // Prevent directory traversal
        if (filename.includes("..") || filename.includes("/")) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid filename" }));
            return;
        }
        const filePath = resolve(process.cwd(), "renders", filename);
        if (!existsSync(filePath)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Video file not found" }));
            return;
        }
        const stat = statSync(filePath);
        res.writeHead(200, {
            "Content-Type": "video/mp4",
            "Content-Length": stat.size,
            "Content-Disposition": `inline; filename="${filename}"`,
        });
        createReadStream(filePath).pipe(res);
        return;
    }
    // POST /api/render-jobs
    if (url.pathname === "/api/render-jobs" && req.method === "POST") {
        let body = "";
        let bodyExceeded = false;
        req.on("data", (chunk) => {
            body += chunk;
            if (body.length > MAX_REQUEST_BODY_SIZE) {
                bodyExceeded = true;
                req.destroy();
                res.writeHead(413, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Payload too large. Exceeds 10MB limit." }));
            }
        });
        req.on("end", async () => {
            if (bodyExceeded)
                return;
            try {
                const payload = JSON.parse(body);
                const val = validateProject(payload.project);
                if (!val.success) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid project schema", details: val.errors }));
                    return;
                }
                const project = val.data;
                // SSRF validation across all URLs in the project (PRD Section 12)
                const urlsToCheck = [
                    project.branding.logoUrl,
                    project.audio.musicUrl,
                    project.audio.narrationUrl,
                    ...project.scenes.map((s) => s.media?.url),
                ].filter(Boolean);
                for (const u of urlsToCheck) {
                    const check = isSafeMediaUrl(u);
                    if (!check.safe) {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            error: `Security violation (SSRF Prevention): ${check.error || "Unsafe URL detected."}`,
                        }));
                        return;
                    }
                }
                // PRD Section 6.11: Quota check (max 30 seconds for cloud export)
                if ((val.totalDurationSeconds || 0) > LIMITS.MAX_CLOUD_EXPORT_DURATION_SECONDS) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        error: `Project duration exceeds cloud export quota (${LIMITS.MAX_CLOUD_EXPORT_DURATION_SECONDS}s max).`,
                    }));
                    return;
                }
                const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                const outputPath = resolve(process.cwd(), "renders", `${jobId}.mp4`);
                const initialJob = {
                    id: jobId,
                    projectId: project.projectId,
                    stage: "queued",
                    progressPercent: 0,
                    stageMessage: "Render job queued",
                    startedAt: new Date().toISOString(),
                };
                jobs.set(jobId, initialJob);
                res.writeHead(202, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ jobId, status: "queued" }));
                // Run render in background
                (async () => {
                    try {
                        await renderProjectToMP4(project, {
                            outputPath,
                            fps: project.fps || 30,
                            onProgress: (p) => {
                                const j = jobs.get(jobId);
                                if (j) {
                                    j.stage = p.stage;
                                    j.progressPercent = p.progressPercent;
                                    j.stageMessage = p.message;
                                }
                            },
                        });
                        const j = jobs.get(jobId);
                        if (j) {
                            j.stage = "complete";
                            j.progressPercent = 100;
                            j.stageMessage = "Video rendered successfully";
                            j.outputPath = outputPath;
                            j.downloadUrl = `http://localhost:${PORT}/renders/${jobId}.mp4`;
                            j.completedAt = new Date().toISOString();
                        }
                    }
                    catch (err) {
                        const j = jobs.get(jobId);
                        if (j) {
                            j.stage = "failed";
                            j.error = err.message;
                            j.stageMessage = `Render error: ${err.message}`;
                        }
                    }
                })();
            }
            catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }
    // GET /api/render-jobs/:id
    if (url.pathname.startsWith("/api/render-jobs/") && req.method === "GET") {
        const jobId = url.pathname.split("/").pop();
        const job = jobId ? jobs.get(jobId) : null;
        if (!job) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Job not found" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(job));
        return;
    }
    // POST /api/render-jobs/:id/cancel
    if (url.pathname.match(/\/api\/render-jobs\/[^/]+\/cancel/) && req.method === "POST") {
        const parts = url.pathname.split("/");
        const jobId = parts[parts.length - 2];
        const job = jobId ? jobs.get(jobId) : null;
        if (!job) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Job not found" }));
            return;
        }
        job.stage = "failed";
        job.stageMessage = "Job cancelled by user";
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "cancelled", jobId }));
        return;
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
});
server.listen(PORT, () => {
    console.log(`[FrameForge Render Worker] listening on http://localhost:${PORT}`);
});

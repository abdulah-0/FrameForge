import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { renderProjectToMP4 } from "./renderer.js";
import { validateProject, createDefaultProject } from "@frameforge/project-schema";

async function main() {
  const args = process.argv.slice(2);
  const projectFile = args[0];
  const outputFile = args[1] || "renders/test_output.mp4";

  let project;
  if (projectFile && existsSync(projectFile)) {
    const raw = JSON.parse(readFileSync(projectFile, "utf-8"));
    const val = validateProject(raw);
    if (!val.success) {
      console.error("Invalid project schema:", val.errors);
      process.exit(1);
    }
    project = val.data!;
  } else {
    console.log("No input project file specified. Using default sample Product Ad project...");
    project = createDefaultProject({
      title: "FrameForge Proof Of Concept",
      videoType: "product-ad",
      aspectRatio: "9:16",
    });
    // Set to 6 seconds (2 scenes) for quick proof of concept verification
    project.scenes = project.scenes.slice(0, 2);
    project.scenes[0].durationSeconds = 3;
    project.scenes[1].durationSeconds = 3;
  }

  console.log(`Starting render: ${project.title} (${project.aspectRatio}, ${project.scenes.length} scenes)`);
  const resolvedOut = resolve(process.cwd(), outputFile);

  const result = await renderProjectToMP4(project, {
    outputPath: resolvedOut,
    fps: 30,
    onProgress: (p) => {
      console.log(`[${p.stage.toUpperCase()}] ${p.progressPercent}% - ${p.message}`);
    },
  });

  if (result.success) {
    console.log(`\n🎉 SUCCESS! Video exported to: ${result.outputPath}`);
    console.log(`Duration: ${result.durationSeconds}s | Frames: ${result.totalFrames} | Size: ${(result.fileSizeBytes / 1024 / 1024).toFixed(2)} MB`);
    process.exit(0);
  } else {
    console.error(`\n❌ Render failed: ${result.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});

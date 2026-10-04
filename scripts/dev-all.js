import { spawn } from "node:child_process";

console.log("\x1b[36m%s\x1b[0m", "==================================================");
console.log("\x1b[36m%s\x1b[0m", "   FrameForge Development Suite (Web + Worker)    ");
console.log("\x1b[36m%s\x1b[0m", "==================================================");

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

// 1. Start render-worker on :3100
const worker = spawn(npmCmd, ["run", "serve", "--workspace=apps/render-worker"], {
  stdio: "inherit",
  shell: true,
});

// 2. Start web frontend on :3000
const web = spawn(npmCmd, ["run", "dev", "--workspace=apps/web"], {
  stdio: "inherit",
  shell: true,
});

function cleanup() {
  console.log("\nShutting down FrameForge services...");
  worker.kill();
  web.kill();
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

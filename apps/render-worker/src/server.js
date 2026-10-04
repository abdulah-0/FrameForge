import http from "node:http";
import { resolve } from "node:path";
import { renderProjectToMP4 } from "./renderer.js";
import { validateProject } from "@frameforge/project-schema";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3100;
const jobs = new Map();
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
    if (url.pathname === "/health" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", service: "frameforge-render-worker" }));
        return;
    }
    // POST /api/render-jobs
    if (url.pathname === "/api/render-jobs" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                const val = validateProject(payload.project);
                if (!val.success) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid project schema", details: val.errors }));
                    return;
                }
                const project = val.data;
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
                            j.downloadUrl = `/renders/${jobId}.mp4`;
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
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
});
server.listen(PORT, () => {
    console.log(`[FrameForge Render Worker] listening on http://localhost:${PORT}`);
});

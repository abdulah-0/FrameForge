import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import http from "node:http";
import { spawn, ChildProcess } from "node:child_process";
import { createDefaultProject } from "../../packages/project-schema/src/index.js";

describe("Render Worker HTTP API Integration", () => {
  let workerProcess: ChildProcess;
  const API_URL = "http://localhost:3100";

  before(async () => {
    // Launch server process
    workerProcess = spawn("node", ["apps/render-worker/src/server.js"], {
      env: { ...process.env, PORT: "3100" },
      stdio: "pipe",
    });

    // Wait until server is reachable
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`${API_URL}/health`);
        if (res.ok) break;
      } catch {
        await new Promise((r) => setTimeout(r, 250));
      }
    }
  });

  after(() => {
    if (workerProcess) {
      workerProcess.kill();
    }
  });

  it("responds to /health with status ok", async () => {
    const res = await fetch(`${API_URL}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, "ok");
  });

  it("rejects invalid project schema with 400", async () => {
    const res = await fetch(`${API_URL}/api/render-jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: { title: "Bad Project" } }),
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes("Invalid project schema"));
  });

  it("rejects projects that exceed the 30s cloud duration quota", async () => {
    const project = createDefaultProject();
    // Force scene duration to exceed 30 seconds
    project.scenes.push({
      id: "scene_extra_1",
      layout: "hook",
      durationSeconds: 15,
      headline: "Extra scene 1",
      motion: "smooth-fade",
    });
    project.scenes.push({
      id: "scene_extra_2",
      layout: "hook",
      durationSeconds: 15,
      headline: "Extra scene 2",
      motion: "smooth-fade",
    });

    const res = await fetch(`${API_URL}/api/render-jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes("exceeds cloud export quota"));
  });

  it("accepts valid project, returns 202, and tracks job status", async () => {
    const project = createDefaultProject({
      title: "API Integration Test",
      videoType: "product-ad",
    });
    // Set minimal duration for quick test
    project.scenes = project.scenes.slice(0, 3);
    project.scenes[0].durationSeconds = 2.0;
    project.scenes[1].durationSeconds = 2.0;
    project.scenes[2].durationSeconds = 2.0;

    const res = await fetch(`${API_URL}/api/render-jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });

    assert.strictEqual(res.status, 202);
    const data = await res.json();
    assert.ok(data.jobId);
    assert.strictEqual(data.status, "queued");

    // Fetch job status
    const statusRes = await fetch(`${API_URL}/api/render-jobs/${data.jobId}`);
    assert.strictEqual(statusRes.status, 200);
    const job = await statusRes.json();
    assert.strictEqual(job.id, data.jobId);
    assert.strictEqual(job.projectId, project.projectId);
  });

  it("blocks SSRF attack attempts against private IP addresses or AWS metadata", async () => {
    const project = createDefaultProject({
      title: "SSRF Attack Test",
      videoType: "faceless",
    });
    // Target AWS metadata endpoint
    project.scenes[0].media = {
      type: "image",
      url: "http://169.254.169.254/latest/meta-data/",
    };

    const res = await fetch(`${API_URL}/api/render-jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes("Security violation (SSRF Prevention)"));
  });
});

import { describe, it } from "node:test";
import assert from "node:assert";
import {
  validateProject,
  createDefaultProject,
  calculateTotalDuration,
} from "../../packages/project-schema/src/index.js";

describe("FrameForge Project Schema & Helpers", () => {
  it("creates a valid default project for each workflow", () => {
    const workflows = ["faceless", "product-ad", "explainer"] as const;

    for (const wf of workflows) {
      const proj = createDefaultProject({ videoType: wf, aspectRatio: "9:16" });
      const val = validateProject(proj);
      assert.strictEqual(val.success, true, `Validation failed for workflow ${wf}`);
      assert.strictEqual(proj.videoType, wf);
      assert.ok(proj.scenes.length >= 3);
    }
  });

  it("calculates total duration deterministically", () => {
    const proj = createDefaultProject({ videoType: "product-ad" });
    const calculated = calculateTotalDuration(proj.scenes);
    const sum = proj.scenes.reduce((acc, s) => acc + s.durationSeconds, 0);
    assert.strictEqual(calculated, Number(sum.toFixed(2)));
  });

  it("rejects projects with invalid schema versions or out-of-bound scenes", () => {
    const proj: any = createDefaultProject();
    proj.schemaVersion = "99.0.0";
    const val = validateProject(proj);
    assert.strictEqual(val.success, false);
  });

  it("rejects scene durations exceeding limit", () => {
    const proj = createDefaultProject();
    proj.scenes[0].durationSeconds = 999;
    const val = validateProject(proj);
    assert.strictEqual(val.success, false);
  });
});

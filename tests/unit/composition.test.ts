import { describe, it } from "node:test";
import assert from "node:assert";
import { createDefaultProject } from "../../packages/project-schema/src/index.js";
import { generateHyperframesHTML } from "../../packages/composition/src/index.js";

describe("FrameForge Composition Generator", () => {
  it("generates valid HyperFrames HTML for 9:16 and 16:9 compositions", () => {
    const proj916 = createDefaultProject({ videoType: "product-ad", aspectRatio: "9:16" });
    const html916 = generateHyperframesHTML(proj916);

    assert.ok(html916.includes('data-composition-id="root"'));
    assert.ok(html916.includes('data-width="1080"'));
    assert.ok(html916.includes('data-height="1920"'));
    assert.ok(html916.includes('data-start="0"'));

    const proj169 = createDefaultProject({ videoType: "explainer", aspectRatio: "16:9" });
    const html169 = generateHyperframesHTML(proj169);

    assert.ok(html169.includes('data-width="1920"'));
    assert.ok(html169.includes('data-height="1080"'));
  });

  it("includes all scenes with correct data-start and data-duration attributes", () => {
    const proj = createDefaultProject({ videoType: "faceless" });
    const html = generateHyperframesHTML(proj);

    for (const scene of proj.scenes) {
      assert.ok(html.includes(`id="scene_${scene.id}"`));
      assert.ok(html.includes(`data-duration="${scene.durationSeconds}"`));
    }
  });

  it("embeds GSAP animation registration into window.__timelines", () => {
    const proj = createDefaultProject();
    const html = generateHyperframesHTML(proj);

    assert.ok(html.includes("window.__timelines = window.__timelines || {};"));
    assert.ok(html.includes("gsap.timeline({ paused: true })"));
  });
});

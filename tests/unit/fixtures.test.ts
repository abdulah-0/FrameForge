import { describe, it } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateProject, calculateTotalDuration } from "../../packages/project-schema/src/index.js";
import { generateHyperframesHTML } from "../../packages/composition/src/index.js";

describe("Workflow Fixtures Validation & Composition Generation", () => {
  const fixtures = [
    { name: "faceless", file: "packages/project-schema/fixtures/faceless-fixture.json", ratio: "9:16" },
    { name: "product-ad", file: "packages/project-schema/fixtures/product-ad-fixture.json", ratio: "9:16" },
    { name: "explainer", file: "packages/project-schema/fixtures/explainer-fixture.json", ratio: "16:9" },
  ];

  for (const f of fixtures) {
    it(`validates fixture: ${f.name}`, () => {
      const fullPath = resolve(process.cwd(), f.file);
      const raw = JSON.parse(readFileSync(fullPath, "utf-8"));
      const val = validateProject(raw);

      assert.strictEqual(val.success, true, `Validation failed for ${f.name}: ${val.errors?.join(", ")}`);
      assert.strictEqual(val.data?.videoType, f.name);
      assert.strictEqual(val.data?.aspectRatio, f.ratio);

      const duration = calculateTotalDuration(val.data!.scenes);
      assert.ok(duration > 0 && duration <= 30, `Duration ${duration}s within bounds`);

      const html = generateHyperframesHTML(val.data!);
      assert.ok(html.includes('data-composition-id="root"'));
      assert.ok(html.includes(`data-duration="${duration}"`));
      assert.ok(html.includes(val.data!.scenes[0].headline));
    });
  }
});

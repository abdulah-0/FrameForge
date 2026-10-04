import test from "node:test";
import assert from "node:assert";
import { validateImageSignature, ASSET_LIMITS } from "../../packages/shared/src/security.ts";

test("Image Signature Validation - Security", async (t) => {
  await t.test("accepts valid JPEG magic bytes (FF D8 FF)", () => {
    const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const result = validateImageSignature(jpegBytes);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.mimeType, "image/jpeg");
  });

  await t.test("accepts valid PNG magic bytes (89 50 4E 47 0D 0A 1A 0A)", () => {
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    const result = validateImageSignature(pngBytes);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.mimeType, "image/png");
  });

  await t.test("accepts valid WebP magic bytes (RIFF .... WEBP)", () => {
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, // RIFF
      0x00, 0x00, 0x00, 0x00, // size
      0x57, 0x45, 0x42, 0x50, // WEBP
    ]);
    const result = validateImageSignature(webpBytes);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.mimeType, "image/webp");
  });

  await t.test("rejects disguised executable or script file disguised as image", () => {
    // Windows PE EXE (MZ...)
    const exeBytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);
    const result = validateImageSignature(exeBytes);
    assert.strictEqual(result.valid, false);
    assert.match(result.error || "", /Invalid image signature/);
  });

  await t.test("rejects file buffers smaller than 12 bytes", () => {
    const shortBuffer = new Uint8Array([0xff, 0xd8, 0xff]);
    const result = validateImageSignature(shortBuffer);
    assert.strictEqual(result.valid, false);
    assert.match(result.error || "", /File too small/);
  });
});

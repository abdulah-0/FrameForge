/**
 * Supported MIME types and maximum file size limits for assets
 * PRD Section 12: Validate file signatures and MIME types, not only file extensions.
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
] as const;

export const ASSET_LIMITS = {
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_AUDIO_SIZE_BYTES: 15 * 1024 * 1024, // 15MB
} as const;

export interface FileSignatureValidationResult {
  valid: boolean;
  mimeType?: string;
  error?: string;
}

/**
 * Validates a file's magic bytes/signature from an ArrayBuffer or Uint8Array.
 * Prevents disguised files, malicious payloads, and invalid extensions.
 */
export function validateImageSignature(buffer: ArrayBuffer | Uint8Array): FileSignatureValidationResult {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  if (bytes.length < 12) {
    return { valid: false, error: "File too small to determine format." };
  }

  // JPEG magic bytes: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { valid: true, mimeType: "image/jpeg" };
  }

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { valid: true, mimeType: "image/png" };
  }

  // WebP magic bytes: RIFF .... WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { valid: true, mimeType: "image/webp" };
  }

  return {
    valid: false,
    error: "Invalid image signature. Only JPEG, PNG, and WebP files are supported.",
  };
}

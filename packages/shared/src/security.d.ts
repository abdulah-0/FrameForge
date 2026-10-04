/**
 * Supported MIME types and maximum file size limits for assets
 * PRD Section 12: Validate file signatures and MIME types, not only file extensions.
 */
export declare const ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
export declare const ALLOWED_AUDIO_TYPES: readonly ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
export declare const ASSET_LIMITS: {
    readonly MAX_IMAGE_SIZE_BYTES: number;
    readonly MAX_AUDIO_SIZE_BYTES: number;
};
export interface FileSignatureValidationResult {
    valid: boolean;
    mimeType?: string;
    error?: string;
}
/**
 * Validates a file's magic bytes/signature from an ArrayBuffer or Uint8Array.
 * Prevents disguised files, malicious payloads, and invalid extensions.
 */
export declare function validateImageSignature(buffer: ArrayBuffer | Uint8Array): FileSignatureValidationResult;
/**
 * Validates a URL to prevent SSRF (Server-Side Request Forgery) attacks.
 * Blocks private IPv4/IPv6 networks, cloud metadata endpoints, loopback, and dangerous protocols (PRD Section 12).
 */
export declare function isSafeMediaUrl(urlString: string): {
    safe: boolean;
    error?: string;
};

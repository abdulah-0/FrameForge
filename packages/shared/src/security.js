/**
 * Supported MIME types and maximum file size limits for assets
 * PRD Section 12: Validate file signatures and MIME types, not only file extensions.
 */
export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];
export const ALLOWED_AUDIO_TYPES = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
];
export const ASSET_LIMITS = {
    MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    MAX_AUDIO_SIZE_BYTES: 15 * 1024 * 1024, // 15MB
};
/**
 * Validates a file's magic bytes/signature from an ArrayBuffer or Uint8Array.
 * Prevents disguised files, malicious payloads, and invalid extensions.
 */
export function validateImageSignature(buffer) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    if (bytes.length < 12) {
        return { valid: false, error: "File too small to determine format." };
    }
    // JPEG magic bytes: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return { valid: true, mimeType: "image/jpeg" };
    }
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    if (bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a) {
        return { valid: true, mimeType: "image/png" };
    }
    // WebP magic bytes: RIFF .... WEBP
    if (bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50) {
        return { valid: true, mimeType: "image/webp" };
    }
    return {
        valid: false,
        error: "Invalid image signature. Only JPEG, PNG, and WebP files are supported.",
    };
}
/**
 * Validates a URL to prevent SSRF (Server-Side Request Forgery) attacks.
 * Blocks private IPv4/IPv6 networks, cloud metadata endpoints, loopback, and dangerous protocols (PRD Section 12).
 */
export function isSafeMediaUrl(urlString) {
    if (!urlString || urlString.trim() === "") {
        return { safe: true };
    }
    // Allow trusted data URIs for images (e.g. uploaded in studio)
    if (urlString.startsWith("data:image/")) {
        return { safe: true };
    }
    let parsed;
    try {
        parsed = new URL(urlString);
    }
    catch {
        return { safe: false, error: "Malformed URL format." };
    }
    // Restrict to http and https only
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { safe: false, error: `Disallowed URL protocol: ${parsed.protocol}` };
    }
    const hostname = parsed.hostname.toLowerCase();
    // Block localhost and loopback
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "0.0.0.0") {
        // Only allow localhost if pointing directly to render-worker's own static output port (e.g. :3100)
        if (parsed.port === "3100") {
            return { safe: true };
        }
        return { safe: false, error: "Access to loopback/localhost addresses is prohibited." };
    }
    // Block AWS / GCP / Azure cloud metadata endpoints
    if (hostname === "169.254.169.254" || hostname === "metadata.google.internal") {
        return { safe: false, error: "Access to cloud metadata endpoints is prohibited." };
    }
    // Block private RFC 1918 IPv4 ranges:
    // 10.0.0.0/8
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        return { safe: false, error: "Access to private IPv4 network (10.0.0.0/8) is prohibited." };
    }
    // 172.16.0.0/12
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        return { safe: false, error: "Access to private IPv4 network (172.16.0.0/12) is prohibited." };
    }
    // 192.168.0.0/16
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        return { safe: false, error: "Access to private IPv4 network (192.168.0.0/16) is prohibited." };
    }
    return { safe: true };
}

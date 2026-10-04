export const FRAMEFORGE_VERSION = "1.0.0";
export const PROJECT_SCHEMA_VERSION = "1.0.0";
export const LIMITS = {
    MIN_SCENE_DURATION_SECONDS: 2,
    MAX_SCENE_DURATION_SECONDS: 15,
    MIN_SCENES: 3,
    MAX_SCENES: 12,
    MAX_CLOUD_EXPORT_DURATION_SECONDS: 30,
    MAX_CLOUD_EXPORTS_PER_MONTH: 2,
    DEFAULT_FPS: 30,
    MAX_HEADLINE_LENGTH: 120,
    MAX_BODY_LENGTH: 300,
    MAX_CAPTION_LENGTH: 200,
    MAX_NARATION_LENGTH: 500,
};
export const RESOLUTIONS = {
    "9:16": {
        width: 1080,
        height: 1920,
        label: "Vertical (9:16 - TikTok, Shorts, Reels)",
        cloudPreviewWidth: 720,
        cloudPreviewHeight: 1280,
    },
    "16:9": {
        width: 1920,
        height: 1080,
        label: "Horizontal (16:9 - YouTube, Web)",
        cloudPreviewWidth: 1280,
        cloudPreviewHeight: 720,
    },
};
export const VIDEO_WORKFLOWS = [
    "faceless",
    "product-ad",
    "explainer",
];
export const SCENE_LAYOUTS = [
    "hook",
    "text-over-media",
    "split-screen",
    "product-showcase",
    "benefits-listicle",
    "statistic-chart",
    "quote-takeaway",
    "call-to-action",
];
export const MOTION_PRESETS = [
    "smooth-fade",
    "slide-up",
    "pop-in",
    "zoom-cut",
    "minimal",
];
export const RENDER_STAGES = [
    "queued",
    "preparing",
    "rendering",
    "encoding",
    "complete",
    "failed",
];

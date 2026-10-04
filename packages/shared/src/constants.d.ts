export declare const FRAMEFORGE_VERSION = "1.0.0";
export declare const PROJECT_SCHEMA_VERSION = "1.0.0";
export declare const LIMITS: {
    readonly MIN_SCENE_DURATION_SECONDS: 2;
    readonly MAX_SCENE_DURATION_SECONDS: 15;
    readonly MIN_SCENES: 3;
    readonly MAX_SCENES: 12;
    readonly MAX_CLOUD_EXPORT_DURATION_SECONDS: 30;
    readonly MAX_CLOUD_EXPORTS_PER_MONTH: 2;
    readonly DEFAULT_FPS: 30;
    readonly MAX_HEADLINE_LENGTH: 120;
    readonly MAX_BODY_LENGTH: 300;
    readonly MAX_CAPTION_LENGTH: 200;
    readonly MAX_NARATION_LENGTH: 500;
};
export declare const RESOLUTIONS: {
    readonly "9:16": {
        readonly width: 1080;
        readonly height: 1920;
        readonly label: "Vertical (9:16 - TikTok, Shorts, Reels)";
        readonly cloudPreviewWidth: 720;
        readonly cloudPreviewHeight: 1280;
    };
    readonly "16:9": {
        readonly width: 1920;
        readonly height: 1080;
        readonly label: "Horizontal (16:9 - YouTube, Web)";
        readonly cloudPreviewWidth: 1280;
        readonly cloudPreviewHeight: 720;
    };
};
export declare const VIDEO_WORKFLOWS: readonly ["faceless", "product-ad", "explainer"];
export declare const SCENE_LAYOUTS: readonly ["hook", "text-over-media", "split-screen", "product-showcase", "benefits-listicle", "statistic-chart", "quote-takeaway", "call-to-action"];
export declare const MOTION_PRESETS: readonly ["smooth-fade", "slide-up", "pop-in", "zoom-cut", "minimal"];
export declare const RENDER_STAGES: readonly ["queued", "preparing", "rendering", "encoding", "complete", "failed"];

import { ProjectSchema, } from "./schema.js";
import { PROJECT_SCHEMA_VERSION, LIMITS, } from "@frameforge/shared";
/**
 * Calculates total duration strictly from scene durations.
 * PRD: Must not trust client or model-supplied duration totals.
 */
export function calculateTotalDuration(scenes) {
    return Number(scenes.reduce((acc, scene) => acc + scene.durationSeconds, 0).toFixed(2));
}
/**
 * Sanitizes plain text input for templates to prevent HTML injection.
 */
export function sanitizeText(text) {
    if (!text)
        return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
/**
 * Validates untrusted project data against the canonical schema.
 */
export function validateProject(raw) {
    const parseResult = ProjectSchema.safeParse(raw);
    if (!parseResult.success) {
        return {
            success: false,
            errors: parseResult.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`),
        };
    }
    const project = parseResult.data;
    const totalDuration = calculateTotalDuration(project.scenes);
    return {
        success: true,
        data: project,
        totalDurationSeconds: totalDuration,
    };
}
/**
 * Generates an initial schema-compliant project based on workflow.
 */
export function createDefaultProject(options = {}) {
    const projectId = options.projectId || `proj_${Date.now()}`;
    const videoType = options.videoType || "product-ad";
    const aspectRatio = options.aspectRatio || "9:16";
    const title = options.title || "My New Video";
    let starterScenes = [];
    if (videoType === "product-ad") {
        starterScenes = [
            {
                id: "scene_1",
                layout: "hook",
                durationSeconds: 3,
                headline: "Tired of Complicated Video Tools?",
                body: "Create studio-quality videos in seconds without writing code.",
                caption: "Stop wasting hours on complex software.",
                narrationText: "Tired of complicated video tools? Here is the smarter way.",
                media: { type: "none" },
                motion: "pop-in",
            },
            {
                id: "scene_2",
                layout: "product-showcase",
                durationSeconds: 4,
                headline: "Meet FrameForge",
                body: "AI-assisted storyboarding, deterministic rendering, zero headache.",
                caption: "Everything you need in one browser studio.",
                narrationText: "Meet FrameForge. Powerful video creation right in your browser.",
                media: { type: "none" },
                motion: "smooth-fade",
            },
            {
                id: "scene_3",
                layout: "benefits-listicle",
                durationSeconds: 4,
                headline: "Why Creators Love It",
                body: "• Lightning Fast\n• True Determinism\n• Ready for Shorts & Reels",
                caption: "Designed for speed and reliability.",
                narrationText: "It is lightning fast, reliable, and built for modern creators.",
                media: { type: "none" },
                motion: "slide-up",
            },
            {
                id: "scene_4",
                layout: "call-to-action",
                durationSeconds: 3,
                headline: "Start Creating Today",
                body: "Visit FrameForge.dev to claim your free trial.",
                caption: "Link in bio / Click below!",
                narrationText: "Start creating today and elevate your content.",
                media: { type: "none" },
                motion: "pop-in",
            },
        ];
    }
    else if (videoType === "faceless") {
        starterScenes = [
            {
                id: "scene_1",
                layout: "hook",
                durationSeconds: 3,
                headline: "3 Secrets You Didn't Know",
                body: "Number 2 will completely change how you work.",
                caption: "Watch till the end!",
                narrationText: "Here are three secrets that most people never realize.",
                media: { type: "none" },
                motion: "pop-in",
            },
            {
                id: "scene_2",
                layout: "text-over-media",
                durationSeconds: 4,
                headline: "Secret #1: Leverage Systems",
                body: "Automate repetitive steps and focus on high-impact creativity.",
                caption: "Work smart, not hard.",
                narrationText: "First, automate repetitive tasks and focus on what matters.",
                media: { type: "none" },
                motion: "smooth-fade",
            },
            {
                id: "scene_3",
                layout: "statistic-chart",
                durationSeconds: 4,
                headline: "85% Higher Output",
                body: "Creators using structured workflows produce 5x more content.",
                caption: "Data from 2026 creator benchmark study.",
                narrationText: "Structured workflows increase output by over eighty-five percent.",
                media: { type: "none" },
                motion: "slide-up",
            },
            {
                id: "scene_4",
                layout: "call-to-action",
                durationSeconds: 3,
                headline: "Follow For More",
                body: "Drop a like and subscribe for daily tips.",
                caption: "New insights every day.",
                narrationText: "Follow for more productivity tips.",
                media: { type: "none" },
                motion: "zoom-cut",
            },
        ];
    }
    else {
        // Explainer
        starterScenes = [
            {
                id: "scene_1",
                layout: "hook",
                durationSeconds: 4,
                headline: "How HTML Video Works",
                body: "A quick explainer on deterministic browser rendering.",
                caption: "Understanding modern web animation.",
                narrationText: "Have you ever wondered how videos can be rendered directly from HTML?",
                media: { type: "none" },
                motion: "smooth-fade",
            },
            {
                id: "scene_2",
                layout: "split-screen",
                durationSeconds: 4,
                headline: "DOM Timing vs Playhead",
                body: "Instead of real-time playback, each frame is stepped deterministically.",
                caption: "Exact frame 0 to N rendering.",
                narrationText: "HyperFrames steps through the DOM frame by frame for perfect determinism.",
                media: { type: "none" },
                motion: "slide-up",
            },
            {
                id: "scene_3",
                layout: "quote-takeaway",
                durationSeconds: 4,
                headline: "The Power of Determinism",
                body: "“Every frame is identical across every render machine.”",
                caption: "Zero dropped frames or glitches.",
                narrationText: "Every single frame is guaranteed identical across machines.",
                media: { type: "none" },
                motion: "pop-in",
            },
            {
                id: "scene_4",
                layout: "call-to-action",
                durationSeconds: 3,
                headline: "Learn More at FrameForge",
                body: "Explore the open documentation and templates.",
                caption: "Thanks for watching!",
                narrationText: "Check out the documentation to learn more.",
                media: { type: "none" },
                motion: "smooth-fade",
            },
        ];
    }
    return {
        schemaVersion: PROJECT_SCHEMA_VERSION,
        projectId,
        title,
        videoType,
        aspectRatio,
        fps: LIMITS.DEFAULT_FPS,
        scenes: starterScenes,
        branding: {
            primaryColor: "#3b82f6",
            secondaryColor: "#1d4ed8",
            backgroundColor: "#090d16",
            textColor: "#f8fafc",
            fontFamily: "Inter, sans-serif",
            logoUrl: "",
        },
        audio: {
            musicUrl: "",
            musicVolume: 0.35,
            narrationUrl: "",
            narrationVolume: 1.0,
        },
        metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            briefPrompt: options.briefPrompt || "",
        },
    };
}

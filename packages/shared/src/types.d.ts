import { VIDEO_WORKFLOWS, SCENE_LAYOUTS, MOTION_PRESETS, RESOLUTIONS, RENDER_STAGES } from "./constants.js";
export type VideoWorkflow = (typeof VIDEO_WORKFLOWS)[number];
export type SceneLayout = (typeof SCENE_LAYOUTS)[number];
export type MotionPreset = (typeof MOTION_PRESETS)[number];
export type AspectRatio = keyof typeof RESOLUTIONS;
export type RenderStage = (typeof RENDER_STAGES)[number];
export interface RenderJobState {
    id: string;
    projectId: string;
    stage: RenderStage;
    progressPercent: number;
    stageMessage: string;
    outputPath?: string;
    downloadUrl?: string;
    error?: string;
    startedAt?: string;
    completedAt?: string;
}

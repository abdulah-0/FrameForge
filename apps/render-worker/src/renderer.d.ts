import { Project } from "@frameforge/project-schema";
import { RenderStage } from "@frameforge/shared";
export interface RenderProgressEvent {
    stage: RenderStage;
    frame?: number;
    totalFrames?: number;
    progressPercent: number;
    message: string;
}
export interface RenderOptions {
    outputPath: string;
    quality?: "draft" | "standard" | "high";
    fps?: number;
    onProgress?: (event: RenderProgressEvent) => void;
}
export interface RenderResult {
    success: boolean;
    outputPath: string;
    durationSeconds: number;
    totalFrames: number;
    fileSizeBytes: number;
    error?: string;
}
/**
 * Renders a canonical Project directly to an MP4 video file.
 */
export declare function renderProjectToMP4(project: Project, options: RenderOptions): Promise<RenderResult>;

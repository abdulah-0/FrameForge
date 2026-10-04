import { Project } from "@frameforge/project-schema";
export interface GenerateCompositionOptions {
    includeScriptRuntime?: boolean;
}
/**
 * Generates valid, deterministic HyperFrames HTML from a canonical Project model.
 */
export declare function generateHyperframesHTML(project: Project, options?: GenerateCompositionOptions): string;

import { Project, Scene } from "./schema.js";
import { VideoWorkflow, AspectRatio } from "@frameforge/shared";
/**
 * Calculates total duration strictly from scene durations.
 * PRD: Must not trust client or model-supplied duration totals.
 */
export declare function calculateTotalDuration(scenes: readonly Scene[]): number;
/**
 * Sanitizes plain text input for templates to prevent HTML injection.
 */
export declare function sanitizeText(text: string): string;
export interface ValidationResult {
    success: boolean;
    data?: Project;
    errors?: string[];
    totalDurationSeconds?: number;
}
/**
 * Validates untrusted project data against the canonical schema.
 */
export declare function validateProject(raw: unknown): ValidationResult;
export interface CreateProjectOptions {
    projectId?: string;
    title?: string;
    videoType?: VideoWorkflow;
    aspectRatio?: AspectRatio;
    briefPrompt?: string;
}
/**
 * Generates an initial schema-compliant project based on workflow.
 */
export declare function createDefaultProject(options?: CreateProjectOptions): Project;

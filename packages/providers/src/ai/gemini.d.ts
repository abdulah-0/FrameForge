import { AIProvider, GenerateStoryboardInput } from "../types.js";
import { Project, Scene } from "@frameforge/project-schema";
export declare class GeminiAIProvider implements AIProvider {
    name: string;
    private apiKey;
    private model;
    constructor(apiKey?: string, model?: string);
    healthCheck(): Promise<{
        ok: boolean;
        provider: string;
        message?: string;
    }>;
    generateStoryboard(input: GenerateStoryboardInput): Promise<Project>;
    regenerateScene(project: Project, sceneId: string, instructions: string): Promise<Scene>;
}

import { AIProvider, GenerateStoryboardInput } from "../types.js";
import { Project, Scene } from "@frameforge/project-schema";
export declare class OllamaAIProvider implements AIProvider {
    name: string;
    private baseUrl;
    private model;
    constructor(baseUrl?: string, model?: string);
    healthCheck(): Promise<{
        ok: boolean;
        provider: string;
        message?: string;
    }>;
    generateStoryboard(input: GenerateStoryboardInput): Promise<Project>;
    regenerateScene(project: Project, sceneId: string, instructions: string): Promise<Scene>;
}

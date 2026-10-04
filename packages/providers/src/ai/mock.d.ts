import { AIProvider, GenerateStoryboardInput } from "../types.js";
import { Project, Scene } from "@frameforge/project-schema";
export declare class MockAIProvider implements AIProvider {
    name: string;
    generateStoryboard(input: GenerateStoryboardInput): Promise<Project>;
    regenerateScene(project: Project, sceneId: string, instructions: string): Promise<Scene>;
    healthCheck(): Promise<{
        ok: boolean;
        provider: string;
    }>;
}

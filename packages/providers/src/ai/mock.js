import { createDefaultProject, } from "@frameforge/project-schema";
export class MockAIProvider {
    name = "mock";
    async generateStoryboard(input) {
        const project = createDefaultProject({
            title: input.topic.length > 50 ? input.topic.substring(0, 47) + "..." : input.topic,
            videoType: input.videoType,
            aspectRatio: input.aspectRatio,
            briefPrompt: input.topic,
        });
        if (input.brandColors?.primary) {
            project.branding.primaryColor = input.brandColors.primary;
        }
        if (input.brandColors?.secondary) {
            project.branding.secondaryColor = input.brandColors.secondary;
        }
        if (input.brandColors?.background) {
            project.branding.backgroundColor = input.brandColors.background;
        }
        // Contextualize first scene headline based on topic
        if (input.topic) {
            project.scenes[0].headline = input.topic.toUpperCase();
        }
        return project;
    }
    async regenerateScene(project, sceneId, instructions) {
        const existing = project.scenes.find((s) => s.id === sceneId);
        if (!existing) {
            throw new Error(`Scene ${sceneId} not found in project`);
        }
        return {
            ...existing,
            headline: instructions ? instructions.slice(0, 60) : existing.headline,
            body: `Regenerated copy focusing on: ${instructions}`,
            narrationText: `Here is the revised narration focusing on ${instructions}.`,
        };
    }
    async healthCheck() {
        return { ok: true, provider: "mock" };
    }
}

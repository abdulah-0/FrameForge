import {
  AIProvider,
  GenerateStoryboardInput,
} from "../types.js";
import {
  Project,
  createDefaultProject,
  Scene,
} from "@frameforge/project-schema";

export class MockAIProvider implements AIProvider {
  name = "mock";

  async generateStoryboard(input: GenerateStoryboardInput): Promise<Project> {
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

  async regenerateScene(
    project: Project,
    sceneId: string,
    instructions: string
  ): Promise<Scene> {
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

  async healthCheck(): Promise<{ ok: boolean; provider: string }> {
    return { ok: true, provider: "mock" };
  }
}

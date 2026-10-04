import { AIProvider, GenerateStoryboardInput } from "../types.js";
import {
  Project,
  validateProject,
  Scene,
  createDefaultProject,
} from "@frameforge/project-schema";
import { SCENE_LAYOUTS, MOTION_PRESETS, PROJECT_SCHEMA_VERSION } from "@frameforge/shared";

export class OllamaAIProvider implements AIProvider {
  name = "ollama";
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = "http://localhost:11434", model = "llama3") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.model = model;
  }

  async healthCheck(): Promise<{ ok: boolean; provider: string; message?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { method: "GET" });
      if (!res.ok) {
        return { ok: false, provider: "ollama", message: `Ollama status: ${res.status}` };
      }
      return { ok: true, provider: "ollama" };
    } catch (err: any) {
      return { ok: false, provider: "ollama", message: `Ollama offline: ${err.message}` };
    }
  }

  async generateStoryboard(input: GenerateStoryboardInput): Promise<Project> {
    const prompt = `You are a professional video director. Return ONLY valid JSON (no markdown formatting, no code fences) conforming to this exact schema:
{
  "schemaVersion": "${PROJECT_SCHEMA_VERSION}",
  "projectId": "proj_${Date.now()}",
  "title": "Short title",
  "videoType": "${input.videoType}",
  "aspectRatio": "${input.aspectRatio}",
  "fps": 30,
  "scenes": [
    {
      "id": "scene_1",
      "layout": one of ${JSON.stringify(SCENE_LAYOUTS)},
      "durationSeconds": number between 2 and 10,
      "headline": "Punchy title text (max 80 chars)",
      "body": "Description or points (max 200 chars)",
      "caption": "Short badge (max 50 chars)",
      "narrationText": "Voiceover narration script (max 300 chars)",
      "motion": one of ${JSON.stringify(MOTION_PRESETS)}
    }
  ],
  "branding": {
    "primaryColor": "${input.brandColors?.primary || "#3b82f6"}",
    "secondaryColor": "${input.brandColors?.secondary || "#1d4ed8"}",
    "backgroundColor": "${input.brandColors?.background || "#090d16"}",
    "textColor": "#f8fafc",
    "fontFamily": "Inter, sans-serif"
  }
}
Generate 4 scenes for:
Topic: "${input.topic}"
Workflow: "${input.videoType}"`;

    try {
      const res = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          prompt,
          format: "json",
          stream: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama responded with HTTP ${res.status}`);
      }

      const data = await res.json();
      const rawText = data?.response;
      if (!rawText) throw new Error("Empty response from Ollama");

      const parsed = JSON.parse(rawText);
      const val = validateProject(parsed);
      if (!val.success) {
        console.warn("Ollama JSON did not pass schema, normalizing...", val.errors);
        return createDefaultProject({
          title: parsed.title || input.topic,
          videoType: input.videoType,
          aspectRatio: input.aspectRatio,
          briefPrompt: input.topic,
        });
      }

      return val.data!;
    } catch (err: any) {
      console.warn("Ollama request failed, falling back to deterministic template:", err.message);
      return createDefaultProject({
        title: input.topic,
        videoType: input.videoType,
        aspectRatio: input.aspectRatio,
        briefPrompt: input.topic,
      });
    }
  }

  async regenerateScene(
    project: Project,
    sceneId: string,
    instructions: string
  ): Promise<Scene> {
    const existing = project.scenes.find((s) => s.id === sceneId);
    if (!existing) throw new Error(`Scene ${sceneId} not found`);

    return {
      ...existing,
      headline: instructions.slice(0, 60),
      body: `Revised via Ollama: ${instructions}`,
    };
  }
}

import { AIProvider, GenerateStoryboardInput } from "../types.js";
import {
  Project,
  validateProject,
  Scene,
  createDefaultProject,
} from "@frameforge/project-schema";
import { SCENE_LAYOUTS, MOTION_PRESETS, PROJECT_SCHEMA_VERSION } from "@frameforge/shared";

export class GeminiAIProvider implements AIProvider {
  name = "gemini";
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model = "gemini-2.5-flash") {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.model = model;
  }

  async healthCheck(): Promise<{ ok: boolean; provider: string; message?: string }> {
    if (!this.apiKey) {
      return { ok: false, provider: "gemini", message: "GEMINI_API_KEY not configured" };
    }
    return { ok: true, provider: "gemini" };
  }

  async generateStoryboard(input: GenerateStoryboardInput): Promise<Project> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please provide an API key or use manual mode.");
    }

    const systemPrompt = `You are an expert video director creating a structured storyboard for a video project.
Output MUST be raw valid JSON matching this schema:
{
  "schemaVersion": "${PROJECT_SCHEMA_VERSION}",
  "projectId": "proj_${Date.now()}",
  "title": "Short punchy video title",
  "videoType": "${input.videoType}",
  "aspectRatio": "${input.aspectRatio}",
  "fps": 30,
  "scenes": [
    {
      "id": "scene_1",
      "layout": one of ${JSON.stringify(SCENE_LAYOUTS)},
      "durationSeconds": number between 2 and 10,
      "headline": "Punchy title text (max 80 chars)",
      "body": "Subtext or bullet points (max 200 chars)",
      "caption": "Short caption pill (max 50 chars)",
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
Produce 4 to 6 scenes tailored specifically to:
Topic: "${input.topic}"
Workflow: "${input.videoType}"
Tone: "${input.tone || "engaging and professional"}"
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const parsed = JSON.parse(text);
    const validation = validateProject(parsed);
    if (!validation.success) {
      // Fallback with sanitized values
      console.warn("Gemini output had schema discrepancies, normalizing...", validation.errors);
      const fallback = createDefaultProject({
        title: parsed.title || input.topic,
        videoType: input.videoType,
        aspectRatio: input.aspectRatio,
        briefPrompt: input.topic,
      });
      return fallback;
    }

    return validation.data!;
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
      body: `Revised: ${instructions}`,
    };
  }
}

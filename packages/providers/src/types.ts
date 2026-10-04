import { Project, Scene } from "@frameforge/project-schema";
import { VideoWorkflow, AspectRatio } from "@frameforge/shared";

export interface GenerateStoryboardInput {
  topic: string;
  videoType: VideoWorkflow;
  aspectRatio: AspectRatio;
  targetDurationSeconds?: number;
  tone?: string;
  brandColors?: {
    primary?: string;
    secondary?: string;
    background?: string;
  };
}

export interface AIProvider {
  name: string;
  generateStoryboard(input: GenerateStoryboardInput): Promise<Project>;
  regenerateScene(project: Project, sceneId: string, instructions: string): Promise<Scene>;
  healthCheck(): Promise<{ ok: boolean; provider: string; message?: string }>;
}

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  alt: string;
  attribution: {
    author: string;
    source: string;
    license: string;
  };
}

export interface MediaSearchOptions {
  orientation?: "portrait" | "landscape";
  type?: "image" | "video";
  limit?: number;
}

export interface MediaProvider {
  name: string;
  search(query: string, options?: MediaSearchOptions): Promise<MediaItem[]>;
}

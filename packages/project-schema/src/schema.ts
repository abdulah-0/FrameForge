import { z } from "zod";
import {
  LIMITS,
  VIDEO_WORKFLOWS,
  SCENE_LAYOUTS,
  MOTION_PRESETS,
  RESOLUTIONS,
  PROJECT_SCHEMA_VERSION,
} from "@frameforge/shared";

export const MediaSchema = z.object({
  type: z.enum(["image", "video", "none"]).default("none"),
  url: z.string().url().optional().or(z.literal("")),
  assetId: z.string().optional(),
  alt: z.string().optional(),
  fit: z.enum(["cover", "contain", "fill"]).optional(),
});

export const SceneSchema = z.object({
  id: z.string().min(1),
  layout: z.enum(SCENE_LAYOUTS),
  durationSeconds: z
    .number()
    .min(LIMITS.MIN_SCENE_DURATION_SECONDS)
    .max(LIMITS.MAX_SCENE_DURATION_SECONDS)
    .default(3),
  headline: z.string().max(LIMITS.MAX_HEADLINE_LENGTH).default(""),
  body: z.string().max(LIMITS.MAX_BODY_LENGTH).optional().default(""),
  caption: z.string().max(LIMITS.MAX_CAPTION_LENGTH).optional().default(""),
  narrationText: z.string().max(LIMITS.MAX_NARATION_LENGTH).optional().default(""),
  media: MediaSchema.optional().default({ type: "none" }),
  motion: z.enum(MOTION_PRESETS).default("smooth-fade"),
});

export const BrandingSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#3b82f6"),
  secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#1d4ed8"),
  backgroundColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#0f172a"),
  textColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#f8fafc"),
  fontFamily: z.string().default("Inter, sans-serif"),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const AudioSchema = z.object({
  musicUrl: z.string().url().optional().or(z.literal("")),
  musicVolume: z.number().min(0).max(1).default(0.4),
  narrationUrl: z.string().url().optional().or(z.literal("")),
  narrationVolume: z.number().min(0).max(1).default(1.0),
});

export const MetadataSchema = z.object({
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  briefPrompt: z.string().optional(),
  author: z.string().optional(),
});

export const ProjectSchema = z.object({
  schemaVersion: z.literal(PROJECT_SCHEMA_VERSION),
  projectId: z.string().min(1),
  title: z.string().min(1).max(100),
  videoType: z.enum(VIDEO_WORKFLOWS),
  aspectRatio: z.enum(["9:16", "16:9"]),
  fps: z.number().int().min(15).max(60).default(LIMITS.DEFAULT_FPS),
  scenes: z
    .array(SceneSchema)
    .min(LIMITS.MIN_SCENES)
    .max(LIMITS.MAX_SCENES),
  branding: BrandingSchema.default({
    primaryColor: "#3b82f6",
    secondaryColor: "#1d4ed8",
    backgroundColor: "#0f172a",
    textColor: "#f8fafc",
    fontFamily: "Inter, sans-serif",
  }),
  audio: AudioSchema.default({
    musicVolume: 0.4,
    narrationVolume: 1.0,
  }),
  metadata: MetadataSchema.default({}),
});

export type Media = z.infer<typeof MediaSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type Audio = z.infer<typeof AudioSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type Project = z.infer<typeof ProjectSchema>;

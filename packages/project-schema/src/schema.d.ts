import { z } from "zod";
export declare const MediaSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<["image", "video", "none"]>>;
    url: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    assetId: z.ZodOptional<z.ZodString>;
    alt: z.ZodOptional<z.ZodString>;
    fit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill"]>>;
}, "strip", z.ZodTypeAny, {
    type: "image" | "video" | "none";
    url?: string | undefined;
    assetId?: string | undefined;
    alt?: string | undefined;
    fit?: "fill" | "cover" | "contain" | undefined;
}, {
    type?: "image" | "video" | "none" | undefined;
    url?: string | undefined;
    assetId?: string | undefined;
    alt?: string | undefined;
    fit?: "fill" | "cover" | "contain" | undefined;
}>;
export declare const SceneSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodEnum<["hook", "text-over-media", "split-screen", "product-showcase", "benefits-listicle", "statistic-chart", "quote-takeaway", "call-to-action"]>;
    durationSeconds: z.ZodDefault<z.ZodNumber>;
    headline: z.ZodDefault<z.ZodString>;
    body: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    caption: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    narrationText: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    media: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        type: z.ZodDefault<z.ZodEnum<["image", "video", "none"]>>;
        url: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        assetId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        fit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "image" | "video" | "none";
        url?: string | undefined;
        assetId?: string | undefined;
        alt?: string | undefined;
        fit?: "fill" | "cover" | "contain" | undefined;
    }, {
        type?: "image" | "video" | "none" | undefined;
        url?: string | undefined;
        assetId?: string | undefined;
        alt?: string | undefined;
        fit?: "fill" | "cover" | "contain" | undefined;
    }>>>;
    motion: z.ZodDefault<z.ZodEnum<["smooth-fade", "slide-up", "pop-in", "zoom-cut", "minimal"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    layout: "hook" | "text-over-media" | "split-screen" | "product-showcase" | "benefits-listicle" | "statistic-chart" | "quote-takeaway" | "call-to-action";
    durationSeconds: number;
    headline: string;
    body: string;
    caption: string;
    narrationText: string;
    media: {
        type: "image" | "video" | "none";
        url?: string | undefined;
        assetId?: string | undefined;
        alt?: string | undefined;
        fit?: "fill" | "cover" | "contain" | undefined;
    };
    motion: "smooth-fade" | "slide-up" | "pop-in" | "zoom-cut" | "minimal";
}, {
    id: string;
    layout: "hook" | "text-over-media" | "split-screen" | "product-showcase" | "benefits-listicle" | "statistic-chart" | "quote-takeaway" | "call-to-action";
    durationSeconds?: number | undefined;
    headline?: string | undefined;
    body?: string | undefined;
    caption?: string | undefined;
    narrationText?: string | undefined;
    media?: {
        type?: "image" | "video" | "none" | undefined;
        url?: string | undefined;
        assetId?: string | undefined;
        alt?: string | undefined;
        fit?: "fill" | "cover" | "contain" | undefined;
    } | undefined;
    motion?: "smooth-fade" | "slide-up" | "pop-in" | "zoom-cut" | "minimal" | undefined;
}>;
export declare const BrandingSchema: z.ZodObject<{
    primaryColor: z.ZodDefault<z.ZodString>;
    secondaryColor: z.ZodDefault<z.ZodString>;
    backgroundColor: z.ZodDefault<z.ZodString>;
    textColor: z.ZodDefault<z.ZodString>;
    fontFamily: z.ZodDefault<z.ZodString>;
    logoUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    logoUrl?: string | undefined;
}, {
    primaryColor?: string | undefined;
    secondaryColor?: string | undefined;
    backgroundColor?: string | undefined;
    textColor?: string | undefined;
    fontFamily?: string | undefined;
    logoUrl?: string | undefined;
}>;
export declare const AudioSchema: z.ZodObject<{
    musicUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    musicVolume: z.ZodDefault<z.ZodNumber>;
    narrationUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    narrationVolume: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    musicVolume: number;
    narrationVolume: number;
    musicUrl?: string | undefined;
    narrationUrl?: string | undefined;
}, {
    musicUrl?: string | undefined;
    musicVolume?: number | undefined;
    narrationUrl?: string | undefined;
    narrationVolume?: number | undefined;
}>;
export declare const MetadataSchema: z.ZodObject<{
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
    briefPrompt: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    briefPrompt?: string | undefined;
    author?: string | undefined;
}, {
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    briefPrompt?: string | undefined;
    author?: string | undefined;
}>;
export declare const ProjectSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"1.0.0">;
    projectId: z.ZodString;
    title: z.ZodString;
    videoType: z.ZodEnum<["faceless", "product-ad", "explainer"]>;
    aspectRatio: z.ZodEnum<["9:16", "16:9"]>;
    fps: z.ZodDefault<z.ZodNumber>;
    scenes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodEnum<["hook", "text-over-media", "split-screen", "product-showcase", "benefits-listicle", "statistic-chart", "quote-takeaway", "call-to-action"]>;
        durationSeconds: z.ZodDefault<z.ZodNumber>;
        headline: z.ZodDefault<z.ZodString>;
        body: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        caption: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        narrationText: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        media: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            type: z.ZodDefault<z.ZodEnum<["image", "video", "none"]>>;
            url: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            assetId: z.ZodOptional<z.ZodString>;
            alt: z.ZodOptional<z.ZodString>;
            fit: z.ZodOptional<z.ZodEnum<["cover", "contain", "fill"]>>;
        }, "strip", z.ZodTypeAny, {
            type: "image" | "video" | "none";
            url?: string | undefined;
            assetId?: string | undefined;
            alt?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
        }, {
            type?: "image" | "video" | "none" | undefined;
            url?: string | undefined;
            assetId?: string | undefined;
            alt?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
        }>>>;
        motion: z.ZodDefault<z.ZodEnum<["smooth-fade", "slide-up", "pop-in", "zoom-cut", "minimal"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        layout: "hook" | "text-over-media" | "split-screen" | "product-showcase" | "benefits-listicle" | "statistic-chart" | "quote-takeaway" | "call-to-action";
        durationSeconds: number;
        headline: string;
        body: string;
        caption: string;
        narrationText: string;
        media: {
            type: "image" | "video" | "none";
            url?: string | undefined;
            assetId?: string | undefined;
            alt?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
        };
        motion: "smooth-fade" | "slide-up" | "pop-in" | "zoom-cut" | "minimal";
    }, {
        id: string;
        layout: "hook" | "text-over-media" | "split-screen" | "product-showcase" | "benefits-listicle" | "statistic-chart" | "quote-takeaway" | "call-to-action";
        durationSeconds?: number | undefined;
        headline?: string | undefined;
        body?: string | undefined;
        caption?: string | undefined;
        narrationText?: string | undefined;
        media?: {
            type?: "image" | "video" | "none" | undefined;
            url?: string | undefined;
            assetId?: string | undefined;
            alt?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
        } | undefined;
        motion?: "smooth-fade" | "slide-up" | "pop-in" | "zoom-cut" | "minimal" | undefined;
    }>, "many">;
    branding: z.ZodDefault<z.ZodObject<{
        primaryColor: z.ZodDefault<z.ZodString>;
        secondaryColor: z.ZodDefault<z.ZodString>;
        backgroundColor: z.ZodDefault<z.ZodString>;
        textColor: z.ZodDefault<z.ZodString>;
        fontFamily: z.ZodDefault<z.ZodString>;
        logoUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        textColor: string;
        fontFamily: string;
        logoUrl?: string | undefined;
    }, {
        primaryColor?: string | undefined;
        secondaryColor?: string | undefined;
        backgroundColor?: string | undefined;
        textColor?: string | undefined;
        fontFamily?: string | undefined;
        logoUrl?: string | undefined;
    }>>;
    audio: z.ZodDefault<z.ZodObject<{
        musicUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        musicVolume: z.ZodDefault<z.ZodNumber>;
        narrationUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        narrationVolume: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        musicVolume: number;
        narrationVolume: number;
        musicUrl?: string | undefined;
        narrationUrl?: string | undefined;
    }, {
        musicUrl?: string | undefined;
        musicVolume?: number | undefined;
        narrationUrl?: string | undefined;
        narrationVolume?: number | undefined;
    }>>;
    metadata: z.ZodDefault<z.ZodObject<{
        createdAt: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
        briefPrompt: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
        briefPrompt?: string | undefined;
        author?: string | undefined;
    }, {
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
        briefPrompt?: string | undefined;
        author?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: "1.0.0";
    projectId: string;
    title: string;
    videoType: "faceless" | "product-ad" | "explainer";
    aspectRatio: "9:16" | "16:9";
    fps: number;
    scenes: {
        id: string;
        layout: "hook" | "text-over-media" | "split-screen" | "product-showcase" | "benefits-listicle" | "statistic-chart" | "quote-takeaway" | "call-to-action";
        durationSeconds: number;
        headline: string;
        body: string;
        caption: string;
        narrationText: string;
        media: {
            type: "image" | "video" | "none";
            url?: string | undefined;
            assetId?: string | undefined;
            alt?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
        };
        motion: "smooth-fade" | "slide-up" | "pop-in" | "zoom-cut" | "minimal";
    }[];
    branding: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        textColor: string;
        fontFamily: string;
        logoUrl?: string | undefined;
    };
    audio: {
        musicVolume: number;
        narrationVolume: number;
        musicUrl?: string | undefined;
        narrationUrl?: string | undefined;
    };
    metadata: {
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
        briefPrompt?: string | undefined;
        author?: string | undefined;
    };
}, {
    schemaVersion: "1.0.0";
    projectId: string;
    title: string;
    videoType: "faceless" | "product-ad" | "explainer";
    aspectRatio: "9:16" | "16:9";
    scenes: {
        id: string;
        layout: "hook" | "text-over-media" | "split-screen" | "product-showcase" | "benefits-listicle" | "statistic-chart" | "quote-takeaway" | "call-to-action";
        durationSeconds?: number | undefined;
        headline?: string | undefined;
        body?: string | undefined;
        caption?: string | undefined;
        narrationText?: string | undefined;
        media?: {
            type?: "image" | "video" | "none" | undefined;
            url?: string | undefined;
            assetId?: string | undefined;
            alt?: string | undefined;
            fit?: "fill" | "cover" | "contain" | undefined;
        } | undefined;
        motion?: "smooth-fade" | "slide-up" | "pop-in" | "zoom-cut" | "minimal" | undefined;
    }[];
    fps?: number | undefined;
    branding?: {
        primaryColor?: string | undefined;
        secondaryColor?: string | undefined;
        backgroundColor?: string | undefined;
        textColor?: string | undefined;
        fontFamily?: string | undefined;
        logoUrl?: string | undefined;
    } | undefined;
    audio?: {
        musicUrl?: string | undefined;
        musicVolume?: number | undefined;
        narrationUrl?: string | undefined;
        narrationVolume?: number | undefined;
    } | undefined;
    metadata?: {
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
        briefPrompt?: string | undefined;
        author?: string | undefined;
    } | undefined;
}>;
export type Media = z.infer<typeof MediaSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type Audio = z.infer<typeof AudioSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type Project = z.infer<typeof ProjectSchema>;

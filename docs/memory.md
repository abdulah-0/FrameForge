# FrameForge Development Memory & Audit Log

This document tracks all architectural decisions, implementations, removals, and milestones in the FrameForge project, updated after each major task.

---

## Architecture Overview & Philosophy

FrameForge is an AI-assisted video creation studio built on HyperFrames, React, and modern web standards.
- **Source of Truth**: Canonical, versioned Project JSON (`schemaVersion: "1.0.0"`).
- **Composition Foundation**: HyperFrames HTML + CSS + GSAP deterministic frame rendering.
- **Browser Preview**: High-fidelity browser preview via standard HTML/DOM + Web Animation/GSAP.
- **Export Engine**: Isolated Node.js rendering worker using Chromium BeginFrame / Puppeteer and native FFmpeg 9.0 to produce crisp MP4 video files.
- **Modularity**: Clean monorepo structure with distinct packages for schema, composition generator, providers, web app, and render worker.

---

## Log of Changes

### Initial Setup & HyperFrames Analysis
- **Task**: Analyzed `hyperframes-main` using `graphify` knowledge graph extraction.
- **Findings**:
  - Full AST extracted: 31,477 nodes, 100,843 edges across packages.
  - Identified God nodes: `initSandboxRuntimeModular` (Core runtime), `executeRenderPipeline` (Producer rendering), `HyperFramesPlayer` (Player component), and `TimelineElement` / `usePlayerStore` (Studio).
  - Identified essential HyperFrames modules:
    - `@hyperframes/core`: Composition runtime, frame timing, timeline synchronization.
    - `@hyperframes/producer`: Headless Chrome + FFmpeg rendering pipeline to MP4.
    - `@hyperframes/player`: Lightweight browser preview component.
    - `@hyperframes/parsers`: GSAP and HTML template parsers.
    - `@hyperframes/shader-transitions`: WebGL shader transitions.
  - Identified junk/unnecessary components for removal:
    - Outdated vendor deployment packages (`aws-lambda`, `gcp-cloud-run`).
    - Huge legacy internal timeline studio (`packages/studio`, `packages/studio-server` - 1800+ files) that does not match FrameForge's no-code browser studio specification.
    - Agent plugins (`.agents`, `.claude`, `.claude-plugin`, `.codex`, `.codex-plugin`, `.cursor-plugin`), old release tarballs, triage docs, and redundant build configs.
- **Why**: Keeps repository lightweight, modular, maintainable, and aligned with the PRD specification without obsolete dependencies.

### Codebase Pruning & Junk Removal
- **Task**: Removed redundant legacy packages, outdated cloud deployers, agent configs, and unneeded assets from `hyperframes-main`.
- **Changes**:
  - Removed `packages/studio` and `packages/studio-server` (1,800+ legacy editor files superseded by FrameForge's custom React studio).
  - Removed `packages/aws-lambda`, `packages/gcp-cloud-run`, `packages/sdk-playground`.
  - Removed vendor plugins (`.agents`, `.claude`, `.claude-plugin`, `.codex`, `.codex-plugin`, `.cursor-plugin`), obsolete plans/updates/releases, and unneeded config files.
  - Preserved critical HyperFrames runtime and rendering packages: `core`, `engine`, `parsers`, `player`, `producer`, `cli`, `lint`, `sdk`, and `shader-transitions`.
- **Why**: Drastically reduced repository footprint while preserving 100% of the core rendering, composition runtime, and player engines needed for FrameForge.

### Modular FrameForge Monorepo Architecture
- **Task**: Implemented the modular packages and apps structure per PRD Section 8.7.
- **Packages Created**:
  - `packages/shared`: Shared constants (duration bounds, 9:16 and 16:9 resolutions, quotas), types, error codes, and render stages.
  - `packages/project-schema`: Canonical Project data model, Zod validation, deterministic duration calculation, and sanitization.
  - `packages/composition`: Trusted HyperFrames HTML + CSS + GSAP composition generator supporting all 8 core layouts and motion presets.
  - `packages/providers`: Extensible AI provider adapter (Mock, Gemini, Ollama) and media provider adapter (Curated stock imagery).
  - `apps/render-worker`: Dedicated Node.js MP4 rendering worker service and CLI using Puppeteer/Chromium and FFmpeg.
  - `apps/web`: Creator Studio React 19 + Vite + Tailwind application featuring Dashboard, New Project Wizard, Scene Editor, Live Interactive Preview Player, Property Inspector, and Export Dialog.
  - `supabase/migrations`: PostgreSQL database schema with Row Level Security (RLS) for projects, assets, render jobs, and usage events.
- **Why**: Enforces clean boundaries between validation, composition generation, external providers, browser UI, and rendering execution.

### Phase 1 Proof of Concept & Rendering Verification
- **Task**: Verified deterministic MP4 rendering with Chromium and FFmpeg 9.0.
- **Results**:
  - Exported vertical (9:16) MP4: 720x1280 @ 30fps, 180 frames (6.0s), H.264 video container verified with `ffprobe`.
  - Exported horizontal (16:9) MP4: 1280x720 @ 30fps, 180 frames (6.0s), H.264 video container verified with `ffprobe`.
  - Verified unit test suite with Node.js native test runner: 7 tests passed (schema validation, duration calculation, composition generation).
  - Phase 1 exit criteria completely satisfied.

### Remote GitHub Deployment
- **Task**: Pushed codebase to `https://github.com/abdulah-0/FrameForge.git`.
- **Status**: Successfully pushed `main` branch to remote origin. Working tree is clean and synchronized.

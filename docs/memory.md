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

### Phase 2: Workflow Fixtures & Template Verification
- **Task**: Created canonical workflow fixtures for all three primary product targets in `packages/project-schema/fixtures/`:
  - `faceless-fixture.json`: 9:16 viral short with hooks, ultradian habits, statistics, and kinetic CTA.
  - `product-ad-fixture.json`: 9:16 commercial promo featuring AuraPods Max, active noise cancellation hardware specs, benefits checklist, and coupon discount callout.
  - `explainer-fixture.json`: 16:9 educational explainer breaking down Artificial Neural Networks with diagrams and backpropagation takeaways.
- **Verification**:
  - Validated all 3 fixtures against schema with duration calculation.
  - Rendered all 3 fixtures directly to MP4 via `renderProjectToMP4`:
    - `fixture_faceless.mp4`: 5.0s (144,360 bytes)
    - `fixture_product_ad.mp4`: 5.0s (124,589 bytes)
    - `fixture_explainer.mp4`: 5.0s (303,625 bytes)
  - Unit test suite expanded to 10 automated tests (all passing).
  - Phase 2 exit criteria completely satisfied.

### Phase 3: Creator Studio Dashboard & Experience Upgrades
- **Task**: Enhanced `apps/web` with production studio features:
  - **Project Dashboard**: Multi-project management view with cards, workflow badges, project duplication, deletion, and quick starter workflow loaders.
  - **Undo / Redo Stack**: State history management with undo/redo buttons in header and keyboard shortcut integration (`Ctrl+Z`, `Ctrl+Y`).
  - **Project Portability**: Added JSON Export and JSON Import allowing creators to backup, share, or inspect canonical project data models directly.
  - **Live Preview Audio Sync**: Added volume and audio controls.
- **Why**: Delivers a full creator-centric no-code studio workflow without relying on external servers or AI keys.

### Phase 4: Provider Adapters & Render Worker HTTP Service
- **Task**: Completed AI/Media provider implementations, Render Worker HTTP API, and automated test coverage.
- **Changes**:
  - **Ollama AI Provider**: Added `OllamaAIProvider` in `packages/providers/src/ai/ollama.ts` supporting local LLMs (e.g. `llama3`, `mistral`, `qwen2.5`) with structured JSON storyboard prompting and scene regeneration.
  - **Pexels Media Provider**: Added `PexelsMediaProvider` in `packages/providers/src/media/pexels.ts` with API key authentication, rate limit checks, orientation filtering (`portrait`, `landscape`), and commercial license attribution mapping.
  - **Render Worker HTTP Service**: Implemented complete Node.js HTTP server (`apps/render-worker/src/server.ts`) supporting:
    - `GET /health` with port and status check.
    - `POST /api/render-jobs` accepting project JSON, verifying schema & 30s cloud quotas, returning 202 status and spawning async render.
    - `GET /api/render-jobs/:id` polling job progress and stages (`queued` -> `preparing` -> `rendering` -> `encoding` -> `complete` / `failed`).
    - `GET /renders/:filename` streaming rendered MP4 video files with path traversal protection.
  - **Integration Test Suite**: Created `tests/integration/render-api.test.ts` covering `/health`, schema validation rejection (400), cloud quota violation rejection (400), and job lifecycle tracking (202).
- **Verification**: 14 automated tests passing across unit and integration test suites.
- **Why**: Fulfills PRD Section 8.3, 8.4, and 8.5 for provider independence and rendering service isolation.

### Phase 5: Client-Side Upload Verification & Studio-Worker Integration
- **Task**: Added binary file signature inspection for image uploads and integrated the studio web export modal with the render worker service.
- **Changes**:
  - **Binary Signature Validation**: Implemented `validateImageSignature` in `packages/shared/src/security.ts` checking magic bytes for JPEG (`FF D8 FF`), PNG (`89 50 4E 47 0D 0A 1A 0A`), and WebP (`RIFF .... WEBP`). Added size limits (10MB for images, 15MB for audio).
  - **Media Picker Upload Tab**: Updated `apps/web/src/components/MediaPickerModal.tsx` to provide an interactive file dropzone that reads files as `ArrayBuffer`, validates magic bytes against spoofing/malicious files, and provides instant studio previews and scene application.
  - **Export Modal Honest API Handling**: Connected `ExportModal.tsx` to `http://localhost:3100/api/render-jobs`. Displays honest worker feedback and quota notifications when cloud limits are exceeded or worker is offline.
  - **Concurrent Development Script**: Created `scripts/dev-all.js` and added root `npm run dev:all` command to start both the Vite web studio (:3000) and the render worker (:3100) simultaneously.
  - **Security Unit Tests**: Added `tests/unit/security.test.ts` verifying magic byte detection and rejection of malicious/truncated files.
- **Verification**: 20 automated tests passing across 5 suites (`npm test`). Web build passes cleanly (`npm run build --workspace=apps/web`).
- **Why**: Complies with PRD Section 12 (Security: validating file signatures and MIME types, not only file extensions) and streamlines creator developer experience.

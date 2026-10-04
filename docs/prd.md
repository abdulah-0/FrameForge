# Product Requirements Document (PRD)

## HyperFrames-Based AI Video Studio --- MVP

**Document status:** MVP specification\
**Version:** 1.0\
**Product type:** Browser-first AI-assisted video creation SaaS\
**Primary users:** Social media creators, small businesses, educators,
and solo marketers\
**Core workflows:** Faceless YouTube videos, product advertisements,
educational explainers

------------------------------------------------------------------------

## 1. Executive Summary

Build a browser-first video creation studio that turns a user's idea,
product, or educational topic into an editable video project and an
exportable MP4. Users should not need to write code or operate a coding
agent.

The product uses HyperFrames as its HTML-based composition and rendering
foundation. A React application provides the user experience, a
structured JSON project format represents the video, an AI provider
generates scripts and storyboards, licensed stock media and user uploads
supply visual assets, and a separate rendering worker produces MP4
files.

The MVP prioritizes affordability and reliability over advanced
generative video. It uses motion graphics, animated typography,
captions, stock footage, uploaded product images, optional AI-generated
still images, and optional narration. AI-generated moving footage,
avatars, and a full nonlinear editing timeline are out of scope.

### Product promise

**Describe a video, edit the storyboard, preview it, and export
it---without writing code.**

### Cost principle

Editing and browser preview should work without paid AI services. Local
rendering should be supported where technically feasible. Cloud
rendering and hosted AI must have explicit quotas and must never
silently incur paid usage.

------------------------------------------------------------------------

## 2. Problem Statement

Creators often need to combine scripting, stock footage, product images,
captions, motion graphics, voiceover, and video editing across several
tools. This workflow is time-consuming and can be intimidating for
nontechnical users. Existing AI video tools may impose credits,
subscriptions, export restrictions, or limited control over the final
composition.

The product will simplify the workflow by generating a structured
storyboard, rendering it through reusable HTML-based templates, and
exposing common edits through a visual interface.

### User problems to solve

1.  Starting a video from a blank timeline takes too long.
2.  Nontechnical users cannot easily customize code-based video
    templates.
3.  Repeated video production requires recreating captions, layouts,
    transitions, and branding.
4.  Hosted AI and rendering costs can make unlimited free video
    generation unsustainable.
5.  Users need control over the final script, scene order, media,
    branding, and export.

------------------------------------------------------------------------

## 3. Goals and Non-Goals

### 3.1 MVP goals

-   Generate an editable storyboard from a text prompt or a
    user-provided script.
-   Support three workflows: faceless short-form videos, product ads,
    and explainers.
-   Provide reusable, polished motion-graphics templates.
-   Allow users to edit text, scene order, duration, media, colors, and
    basic animation settings.
-   Preview the composition in the browser.
-   Export short MP4 videos through a controlled HyperFrames rendering
    worker.
-   Define a stable rendering interface so local desktop rendering can
    be added without redesigning projects.
-   Provide optional stock-media search and user-uploaded assets.
-   Support optional uploaded narration and background music.
-   Provide user authentication, project persistence, job status, usage
    limits, and secure downloads.
-   Keep the prototype deployable with minimal fixed infrastructure and
    make paid services optional.

### 3.2 Explicit non-goals for the MVP

-   Text-to-video generation of photorealistic moving footage.
-   AI avatars, lip-sync, voice cloning, or advanced dubbing.
-   A full nonlinear editor with arbitrary tracks, keyframes, and
    complex effects.
-   Collaborative editing or team workspaces.
-   A template marketplace.
-   Subscription billing and payment processing.
-   Unlimited cloud rendering or unlimited paid AI generation.
-   4K export, long-form documentary production, or guaranteed hour-long
    videos.
-   Executing arbitrary user-supplied HTML, JavaScript, shell commands,
    or model-generated code.
-   Guaranteeing that MP4 encoding works entirely inside every browser.

------------------------------------------------------------------------

## 4. Target Users and Personas

### Persona A --- Short-form content creator

Needs frequent vertical videos for YouTube Shorts, Instagram Reels, or
TikTok. Values speed, readable captions, strong hooks, and reusable
styles.

### Persona B --- Small-business marketer

Needs product promotions with uploaded product photos, benefits, offers,
brand colors, and a call to action. Values brand consistency and the
ability to replace imagery and copy.

### Persona C --- Educator or explainer creator

Needs to explain a topic using diagrams, statistics, lists, captions,
stock visuals, and a clear narrative. Values structure, readability, and
control over factual content.

### Initial audience priority

1.  Product-ad creators and small businesses.
2.  Explainer and educational creators.
3.  Faceless short-form video creators.

Product ads and explainers are good first workflows because
well-designed motion graphics and still imagery can produce useful
results without expensive generative-video APIs.

------------------------------------------------------------------------

## 5. Core User Journeys

### Journey A --- Generate a video from a prompt

1.  User signs in or selects a permitted demo mode.
2.  User selects a workflow: Faceless Video, Product Ad, or Explainer.
3.  User enters a topic or brief and chooses aspect ratio, target
    duration, visual style, and language.
4.  For product ads, the user can upload product images and enter
    product details.
5.  User chooses whether to use AI generation or start from a manual
    template.
6.  The application generates a script and structured scene storyboard.
7.  User reviews and edits the script and scenes.
8.  The application searches for relevant stock media when enabled; the
    user may replace assets or upload their own.
9.  User previews the composition.
10. User selects Local Export if a supported local renderer is
    available, or Cloud Export if they have remaining quota.
11. The application shows render progress and meaningful errors.
12. On completion, the user downloads the MP4. The project remains
    editable until deleted.

### Journey B --- Start without AI

1.  User selects a template.
2.  User enters text and uploads or selects media.
3.  User edits scene order, duration, colors, and basic motion.
4.  User previews and exports using an available rendering path.

This journey must remain usable when no AI API key is configured or a
provider is unavailable.

### Journey C --- Edit an existing project

1.  User opens a saved project.
2.  Application loads the versioned project JSON and its asset
    references.
3.  User edits one or more fields.
4.  Changes autosave with visible save status.
5.  Preview updates from the current project state.
6.  User exports a new render without losing the prior project.

### Journey D --- Cloud render

1.  Client submits a project ID and render settings.
2.  Server authenticates the user and checks ownership and quotas.
3.  Server validates the project schema, assets, and render limits.
4.  Server creates an idempotent render job.
5.  Isolated worker renders the approved composition.
6.  Worker stores the output in private storage and updates job status.
7.  Client polls job status or receives equivalent status updates.
8.  Authorized user receives a short-lived download URL.
9.  Temporary output and intermediate files expire under retention
    policy.

------------------------------------------------------------------------

## 6. Functional Requirements

Priority labels: **P0** = required for MVP; **P1** = valuable after core
functionality; **P2** = future enhancement.

### 6.1 Authentication and account

-   **P0:** Sign up, sign in, sign out, and session persistence through
    Supabase Auth.
-   **P0:** Enforce ownership for all projects, assets, render jobs, and
    outputs.
-   **P0:** Provide a useful empty state for new users.
-   **P1:** Account settings and account deletion workflow.
-   **P2:** Social login and team accounts.

### 6.2 Project dashboard

-   **P0:** List the user's projects with title, workflow type,
    thumbnail if available, last-updated time, and status.
-   **P0:** Create, rename, duplicate, open, and delete projects.
-   **P0:** Display helpful empty, loading, and error states.
-   **P0:** Prevent access to another user's projects.
-   **P1:** Search, filters, folders, and archive.

### 6.3 New-project wizard

-   **P0:** Choose one of three workflows.
-   **P0:** Accept a topic, creative brief, or existing script.
-   **P0:** Choose 9:16 or 16:9 aspect ratio.
-   **P0:** Configure a target duration within server-configured limits.
-   **P0:** Choose a starter visual theme and primary color.
-   **P0:** Allow manual-template mode without an AI key.
-   **P1:** Language, tone, audience, platform, and call-to-action
    presets.
-   **P1:** Brand kit with logo, colors, and fonts.

### 6.4 AI script and storyboard generation

-   **P0:** Use a provider adapter so the model can be changed without
    rewriting business logic.
-   **P0:** Return structured JSON that conforms to a strict project
    schema.
-   **P0:** Generate a hook, scene sequence, on-screen copy, optional
    narration script, and call to action appropriate to the selected
    workflow.
-   **P0:** Validate and normalize all model output on the server.
-   **P0:** Reject unsupported layout, motion, or media values.
-   **P0:** Provide retry and manual-edit paths when the model fails.
-   **P0:** Do not generate or execute arbitrary HTML, JavaScript, or
    shell commands from model output.
-   **P1:** Regenerate a single scene while preserving the rest of the
    project.
-   **P1:** Offer alternate hooks, calls to action, or script tones.
-   **P2:** Multiple storyboard variants and automated content-quality
    scoring.

### 6.5 Template and composition system

-   **P0:** Use HyperFrames according to the current official repository
    and package documentation.
-   **P0:** Maintain canonical, versioned project JSON; generated HTML
    is derived output, not the source of truth.
-   **P0:** Implement at least one complete reusable template for each
    workflow.
-   **P0:** Implement reusable scene layouts:
    -   Hook/title
    -   Text over media
    -   Split-screen
    -   Product showcase
    -   Benefits/listicle
    -   Statistic/chart
    -   Quote or key takeaway
    -   Call to action
-   **P0:** Support a limited set of tested transitions and motion
    presets.
-   **P0:** Validate aspect ratio, frame rate, scene duration, total
    duration, and allowed template identifiers.
-   **P1:** Expand the template library and support saved brand presets.

### 6.6 Scene editor

-   **P0:** Display scenes in order with a thumbnail or visual
    placeholder, title, and duration.
-   **P0:** Edit headline, body text, captions, narration text, and call
    to action.
-   **P0:** Reorder scenes.
-   **P0:** Change scene duration within configured bounds.
-   **P0:** Replace, remove, or upload scene media.
-   **P0:** Edit theme colors and selected typography options.
-   **P0:** Provide undo for basic editing operations if feasible;
    otherwise ensure edits save reliably and are reversible through
    ordinary controls.
-   **P0:** Show autosave state: saving, saved, or failed.
-   **P1:** Duplicate scenes and regenerate individual scenes.
-   **P2:** Freeform timeline, keyframes, multi-track editing, and
    arbitrary effects.

### 6.7 Browser preview

-   **P0:** Preview the current project using the supported HyperFrames
    player or another documented integration.
-   **P0:** Provide play/pause, seek, and scene navigation as supported
    by the player.
-   **P0:** Update the preview after project edits.
-   **P0:** Clearly distinguish preview from a completed MP4 export.
-   **P0:** Display missing-media placeholders and preview errors.
-   **P1:** Low-resolution proxy preview and thumbnail generation.

### 6.8 Media and assets

-   **P0:** Support user uploads for common image, audio, and video
    formats that are verified compatible with the rendering pipeline.
-   **P0:** Enforce upload size, MIME type, file signature, and duration
    limits.
-   **P0:** Store asset ownership, source, type, dimensions/duration
    where applicable, and storage location.
-   **P0:** Support manually selecting or replacing scene media.
-   **P0:** Make external media-provider integration optional.
-   **P1:** Integrate Pexels API after verifying current API terms,
    limits, and licensing requirements.
-   **P1:** Add optional AI-generated still-image provider through an
    adapter.
-   **P0:** Never assume any internet image or music is licensed for
    commercial use.
-   **P0:** Record attribution and licensing metadata where available;
    show attribution when required.
-   **P0:** Revalidate external URLs and prevent server-side request
    forgery when downloading remote assets.

### 6.9 Audio and captions

-   **P0:** Support uploaded narration and background music if the
    chosen formats can be safely processed.
-   **P0:** Provide volume controls for narration and music.
-   **P0:** Generate simple caption segments from the script for
    motion-graphics scenes.
-   **P0:** Mix audio in the render pipeline when supported by the
    verified HyperFrames/FFmpeg integration.
-   **P0:** Handle absent audio gracefully.
-   **P1:** Add a configurable text-to-speech provider.
-   **P1:** Add timing/alignment support for captions based on actual
    narration.
-   **P2:** Advanced voice choices, dubbing, and multilingual audio
    tracks.

### 6.10 Rendering and export

-   **P0:** Verify actual MP4 output from the supported HyperFrames CLI
    or Producer pipeline before building the complete application.
-   **P0:** Implement a stable render adapter independent of the UI.
-   **P0:** Support a configurable set of output dimensions, aspect
    ratios, frame rate, and maximum duration.
-   **P0:** Provide an authenticated render-job API.
-   **P0:** Validate ownership, project schema, media, and quota before
    starting a render.
-   **P0:** Render only trusted templates in a restricted environment.
-   **P0:** Track queued, running, completed, failed, cancelled, and
    expired job states.
-   **P0:** Show progress where available; otherwise show honest
    stage-based progress without fabricating percentage completion.
-   **P0:** Provide useful error codes and retry behavior.
-   **P0:** Store outputs privately and use short-lived download URLs.
-   **P0:** Add job timeout, cancellation where supported, idempotency,
    bounded retries, and cleanup.
-   **P0:** Do not claim standard browser preview can export MP4.
-   **P1:** Desktop companion for local HyperFrames rendering.
-   **P2:** Browser-native MP4 rendering experiment using
    Canvas/WebCodecs or MediaRecorder, treated as a separate
    implementation with compatibility testing.

### 6.11 Usage quotas and cost controls

Initial values are configuration defaults for a private beta, not
permanent product guarantees:

-   **P0:** Maximum 2 cloud exports per user per calendar month.
-   **P0:** Maximum 30 seconds per cloud export.
-   **P0:** Initial cloud resolution capped at 720p, 30 fps.
-   **P0:** Limit concurrent render jobs per user.
-   **P0:** Limit script/storyboard requests, token usage, upload bytes,
    asset count, and output storage.
-   **P0:** Record usage events for AI calls, image generation, render
    duration, and storage.
-   **P0:** Enforce quotas server-side, not only in the UI.
-   **P0:** Stop paid provider calls when the configured budget or quota
    is reached.
-   **P0:** Show clear quota and provider-unavailable messages.
-   **P0:** Never silently switch from a free/local provider to a paid
    provider.
-   **P1:** Admin-adjustable quotas and cost dashboard.

### 6.12 Notifications and error states

-   **P0:** Display render progress and completion/failure state in the
    application.
-   **P0:** Provide retry actions only when retry is safe.
-   **P0:** Distinguish user-correctable errors, provider failures,
    quota exhaustion, and internal failures.
-   **P0:** Avoid exposing secrets, filesystem paths, stack traces, or
    internal infrastructure details.
-   **P1:** Email notification for completed renders.

------------------------------------------------------------------------

## 7. Product Limits for the MVP

These are initial defaults and must be configurable.

  Setting                 Initial limit
  ----------------------- -------------------------------------------
  Aspect ratios           9:16 and 16:9
  Frame rate              30 fps
  Cloud export duration   30 seconds maximum
  Cloud output            720p maximum
  Cloud exports           2 per user per month
  Scene duration          2--15 seconds by default, with validation
  Project scenes          3--12 scenes for generated projects
  User media              Configurable per-file and per-user limits
  AI images               Disabled by default
  Paid text-to-speech     Disabled by default
  Long-form video         Out of scope
  4K output               Out of scope

The application must calculate total duration from validated scene
durations. It must not trust a model-supplied duration total.

------------------------------------------------------------------------

## 8. Technical Architecture

### 8.1 Frontend

-   React, TypeScript, Vite, and Tailwind CSS.
-   Responsive dashboard and editor.
-   A typed client for project, asset, AI-generation, and render-job
    APIs.
-   Supabase client for authentication and permitted data access.
-   Preview integration based on current HyperFrames documentation.
-   No provider secrets in browser code.
-   Clear UI separation between preview, local export, and cloud export.

### 8.2 Backend and data

-   Supabase Auth for identity.
-   PostgreSQL for project metadata, jobs, quotas, and usage events.
-   Supabase Storage for private user assets and output files initially,
    subject to current plan limits.
-   Row Level Security on user-owned records.
-   Server-side validation and authorization for privileged operations.
-   Server-only provider credentials.
-   Migrations committed to source control.

### 8.3 AI provider adapter

Define an internal interface similar to:

-   `generateStoryboard(input) -> validated project JSON`
-   `regenerateScene(project, sceneId, instructions) -> validated scene`
-   `healthCheck() -> provider status`

Implement a local Ollama adapter as an optional path and a hosted
text-model adapter as an optional path. A model such as Qwen3 4B
Instruct may be evaluated, but its current identifier, hardware needs,
license, and runtime behavior must be verified before use. Model names
must be configurable, not hard-coded throughout the app.

Use deterministic validation and defaults after model generation. AI
output is untrusted input.

### 8.4 Media provider adapter

Define an interface for searching and resolving media. Start with user
uploads and built-in sample assets. Add Pexels or another provider only
after verifying current terms, API limits, attribution requirements, and
commercial use permissions. Do not make core project editing dependent
on a third-party media API.

### 8.5 Rendering service

-   Separate Node.js worker using the currently documented HyperFrames
    CLI or Producer.
-   Chrome/Chromium and FFmpeg versions pinned and tested.
-   One worker is sufficient for the initial private beta.
-   Render only approved composition templates generated from validated
    project JSON.
-   Run as non-root in an isolated process/container with CPU, memory,
    disk, time, and network restrictions.
-   Keep temporary workspaces isolated per job.
-   Store logs with correlation/job IDs but without secrets.
-   Clean up intermediates after success, failure, cancellation, and
    timeout.

### 8.6 Rendering modes

**Browser preview:** Available in the web app where supported.

**Local export:** Design a stable adapter for a future Tauri/Electron
desktop companion. It will run the supported local renderer on the
user's device. This is not a requirement to ship a desktop installer in
the first milestone.

**Cloud export:** Available through a controlled API and worker, subject
to quotas. The web app must not expose an unrestricted rendering
endpoint.

### 8.7 Suggested project layout

``` text
apps/
  web/                  # React application
  render-worker/        # Isolated HyperFrames rendering worker
packages/
  project-schema/       # Versioned JSON schema and validation
  composition/          # Trusted HyperFrames template generation
  providers/            # AI and media provider adapters
  shared/               # Shared types and utilities
supabase/
  migrations/
  seed.sql
tests/
  unit/
  integration/
  e2e/
docs/
  architecture.md
  security.md
  deployment.md
  cost-controls.md
```

This is a suggested organization. Use a simpler layout if it materially
reduces setup burden; avoid unnecessary packages or services.

------------------------------------------------------------------------

## 9. Canonical Project Data Model

The project JSON is the source of truth. A versioned schema should
include:

-   `schemaVersion`
-   `projectId`
-   `title`
-   `videoType`
-   `aspectRatio`
-   `fps`
-   `scenes[]`
-   `branding`
-   `audio`
-   `metadata`

Each scene should include:

-   Stable `id`
-   `layout` from an allowlist
-   `durationSeconds`
-   `headline`
-   `body`
-   `caption`
-   `narrationText`
-   `media` reference or media query
-   `motion` from an allowlist

Media should reference an asset ID or a validated provider result. Do
not embed untrusted arbitrary URLs into executable HTML. The server
resolves approved assets to controlled local files or safe, validated
resources for rendering.

### Validation rules

-   Reject unknown schema versions.
-   Reject unsupported properties where strict validation is
    appropriate.
-   Enforce scene count and duration bounds.
-   Validate strings and impose maximum lengths.
-   Enforce allowlists for layouts, transitions, fonts, and motion
    presets.
-   Calculate total duration from scene values.
-   Validate that referenced assets belong to the authenticated user or
    are approved shared assets.
-   Sanitize text before rendering.
-   Keep template generation deterministic for the same project data and
    template version.

------------------------------------------------------------------------

## 10. Database Requirements

### `profiles`

-   `id` --- references authenticated user ID
-   `display_name`
-   `created_at`
-   `updated_at`

### `projects`

-   `id`
-   `user_id`
-   `title`
-   `video_type`
-   `aspect_ratio`
-   `status`
-   `project_json`
-   `template_version`
-   `created_at`
-   `updated_at`

### `assets`

-   `id`
-   `user_id`
-   `project_id`
-   `storage_path`
-   `asset_type`
-   `mime_type`
-   `file_size_bytes`
-   `source_url`
-   `source_provider`
-   `license_info`
-   `attribution`
-   `metadata_json`
-   `created_at`
-   `expires_at` where applicable

### `render_jobs`

-   `id`
-   `user_id`
-   `project_id`
-   `status`
-   `render_mode`
-   `settings_json`
-   `output_path`
-   `output_size_bytes`
-   `duration_seconds`
-   `idempotency_key`
-   `error_code`
-   `created_at`
-   `started_at`
-   `completed_at`
-   `expires_at`

### `usage_events`

-   `id`
-   `user_id`
-   `event_type`
-   `units`
-   `provider`
-   `metadata_json`
-   `created_at`

### Database and access requirements

-   Use UUID primary keys and appropriate foreign keys.
-   Index common filters such as `user_id`, `project_id`, `status`, and
    timestamps.
-   Enable Row Level Security on all user-facing tables.
-   Verify ownership in server-side endpoints in addition to database
    policies.
-   Keep service-role credentials server-side only.
-   Use private storage buckets for user media and outputs.
-   Ensure output download authorization checks the owning user and job
    state.

------------------------------------------------------------------------

## 11. API Contract (Proposed)

The final API may vary with deployment architecture, but it must provide
equivalent behavior.

-   `POST /api/projects` --- create project
-   `GET /api/projects` --- list current user's projects
-   `GET /api/projects/:id` --- fetch owned project
-   `PATCH /api/projects/:id` --- update owned project
-   `DELETE /api/projects/:id` --- delete project and schedule asset
    cleanup
-   `POST /api/projects/:id/generate-storyboard` --- generate or
    regenerate storyboard
-   `POST /api/assets/upload-url` --- request authorized upload
-   `POST /api/media/search` --- search configured media provider
-   `POST /api/render-jobs` --- validate project and create render job
-   `GET /api/render-jobs/:id` --- fetch owned job status
-   `POST /api/render-jobs/:id/cancel` --- request cancellation
-   `POST /api/render-jobs/:id/download-url` --- create short-lived
    authorized download URL

All endpoints must authenticate the user where required, validate
inputs, enforce rate limits, return consistent error codes, and avoid
leaking information about resources owned by other users.

------------------------------------------------------------------------

## 12. Security, Privacy, and Abuse Prevention

Security is a release requirement, not a future enhancement.

1.  Treat prompts, model outputs, uploaded files, metadata, and remote
    media as untrusted.
2.  Do not execute arbitrary HTML, JavaScript, shell commands, or
    model-generated code.
3.  Generate compositions only through trusted templates and validated
    JSON.
4.  Run rendering in an isolated, non-root environment with resource
    limits.
5.  Restrict worker outbound network access.
6.  Prevent SSRF, including private IPv4/IPv6 addresses, loopback,
    link-local, cloud metadata endpoints, and unsafe redirects.
7.  Validate file signatures and MIME types, not only file extensions.
8.  Limit upload size, audio/video duration, scene count, render time,
    and storage.
9.  Use short-lived signed URLs for private outputs.
10. Apply per-user and per-IP rate limits.
11. Store secrets only in server-side environment configuration or a
    secrets manager.
12. Never log provider keys, access tokens, or sensitive full prompts
    unnecessarily.
13. Delete expired temporary outputs and abandoned intermediate files.
14. Provide a project and account deletion process consistent with the
    storage architecture.
15. Keep an audit trail for render jobs and quota consumption.
16. Review provider terms, content licenses, and commercial usage rights
    before public launch.

------------------------------------------------------------------------

## 13. UI and Design Requirements

### Overall visual direction

-   Modern, premium creator-studio interface.
-   Dark-first theme with strong contrast, clean typography, restrained
    gradients, and purposeful motion.
-   Workspace should prioritize the preview and scene editing over
    decorative dashboard elements.
-   Responsive behavior for laptop and tablet; mobile users can view
    projects and make simple edits, but complex editing may be
    desktop-oriented.
-   Accessible labels, keyboard focus, readable text, and non-color-only
    status indicators.

### Required screens

1.  Landing or welcome screen.
2.  Sign-in and sign-up.
3.  Project dashboard.
4.  New-project wizard.
5.  Template gallery.
6.  Storyboard/editor workspace.
7.  Asset upload and selection.
8.  Render progress and job details.
9.  Export/download screen.
10. Account/settings and usage display.
11. Useful empty, loading, offline, quota-exceeded, and error states.

### Editor layout

-   Left panel: scene list and reordering.
-   Center: video preview in selected aspect ratio.
-   Right panel: selected scene properties, text, media, colors,
    duration, and motion.
-   Top bar: project title, save status, undo/redo if implemented,
    preview controls, and export.
-   Export dialog: render mode, output settings, quota impact, and clear
    estimated limits.

Do not display fabricated render percentages. If the worker cannot
provide real progress, show named stages such as Queued, Preparing,
Rendering, Encoding, and Uploading.

------------------------------------------------------------------------

## 14. Non-Functional Requirements

### Reliability

-   Failed AI generation must not destroy an existing project.
-   Failed renders must leave the project editable.
-   Duplicate requests must not unintentionally consume multiple quotas.
-   Job retries must be bounded and idempotent.
-   A stale job must be recoverable or marked failed after a timeout.

### Performance

-   Dashboard and editor should remain responsive while generation or
    rendering occurs.
-   Use thumbnails and lazy-load large assets.
-   Avoid loading full-resolution source video into the editor
    unnecessarily.
-   Use background processing for rendering and expensive media
    operations.
-   Establish performance targets after measuring the first working
    prototype on representative hardware.

### Compatibility

-   Support current stable desktop versions of Chrome and Edge as the
    initial browser target.
-   Verify any additional browsers before advertising support.
-   Test the render worker on a pinned, reproducible runtime.
-   Document Windows PowerShell setup steps for developers.

### Maintainability

-   Use TypeScript types and runtime validation.
-   Keep provider integrations behind adapters.
-   Keep template identifiers and limits centralized.
-   Pin critical rendering dependencies and document upgrades.
-   Maintain database migrations and automated tests.
-   Provide actionable errors and structured logs.

### Privacy

-   Projects and assets are private by default.
-   Do not use user uploads or prompts for model training.
-   Disclose when prompts or media are sent to third-party providers.
-   Minimize retention of generated output and temporary files.
-   Document data deletion and provider data handling before public
    launch.

------------------------------------------------------------------------

## 15. Analytics and Success Metrics

Instrument the MVP with privacy-conscious product events.

### Activation

-   Percentage of new users who create a project.
-   Percentage who generate or manually create a storyboard.
-   Percentage who reach preview.
-   Percentage who complete their first export.

### Product quality

-   Render success rate.
-   Render failure rate by error category.
-   Median and 95th-percentile render duration.
-   AI generation failure rate.
-   Percentage of projects that require manual repair after generation.
-   Percentage of users who edit the generated storyboard before export.

### Retention and usefulness

-   Projects created per active user.
-   Repeat export rate.
-   Seven-day return rate for pilot users.
-   Template/workflow usage.
-   User-reported video quality and usefulness.

### Cost

-   AI cost per successful project.
-   Cloud compute cost per successful export.
-   Storage cost per active user.
-   Average render duration and output size.
-   Quota exhaustion and abuse rate.

### Initial pilot acceptance targets

These are proposed targets to validate, not existing performance claims:

-   At least 80% of valid test projects render successfully in the
    controlled test environment.
-   At least 70% of pilot users can create and preview a project without
    developer assistance.
-   At least 50% of pilot users complete an export.
-   No cross-user access to projects or outputs in authorization tests.
-   No known critical or high-severity security issue at pilot launch.
-   All configured quotas are enforced server-side.
-   Actual AI and cloud-render costs are measurable before any public
    free-tier expansion.

------------------------------------------------------------------------

## 16. Testing and Acceptance Criteria

### Project creation and editing

-   A user can create a project from a prompt or a manual template.
-   A project saves and reloads with its scene order, text, durations,
    branding, and asset references intact.
-   Unsupported fields and invalid scene durations are rejected.
-   A user cannot read or modify another user's project.

### AI generation

-   Valid model output produces a schema-valid project.
-   Malformed JSON and unsupported layout names are rejected or safely
    normalized.
-   Provider timeout and rate-limit responses show actionable errors.
-   Manual project creation remains available if AI is not configured.

### Media

-   Valid uploads are stored privately and can be attached to owned
    projects.
-   Unsupported file types and oversized files are rejected.
-   Missing or unavailable stock media does not make the whole project
    unusable.
-   Asset attribution and license metadata are preserved where supplied.

### Preview and rendering

-   A test project previews at 9:16 and 16:9.
-   At least one actual MP4 is rendered from the supported HyperFrames
    pipeline.
-   Output dimensions, approximate duration, video stream, and audio
    behavior are checked with a media inspection tool such as `ffprobe`
    when available.
-   Missing media, invalid audio, worker timeout, cancellation, and
    encoder errors are handled.
-   A failed render leaves the project editable.
-   Cloud download links are private, short-lived, and authorized.
-   Duplicate submissions do not unintentionally consume multiple
    quotas.

### Security

-   RLS policies and server-side ownership checks are tested.
-   Attempts to access another user's project, asset, render job, or
    output fail.
-   Remote-media retrieval blocks unsafe internal destinations and
    redirects.
-   Worker processes have resource and time limits.
-   No provider secret appears in browser bundles, logs, or error
    responses.
-   Expired files and intermediate render artifacts are cleaned up.

### Build quality

-   Lint passes.
-   Type checking passes.
-   Unit and integration tests pass.
-   Production build succeeds.
-   End-to-end render test is run in an environment with the required
    dependencies.
-   Documentation clearly identifies tests that could not be run and
    why.

------------------------------------------------------------------------

## 17. Delivery Roadmap

### Phase 1 --- HyperFrames proof of concept

-   Inspect the current repository and official documentation.
-   Confirm licensing and runtime requirements.
-   Build a tiny composition with animated text, an image, captions, and
    audio.
-   Verify preview, lint/check, and an actual MP4 render.
-   Test portrait and landscape output.
-   Record exact working commands and dependency versions.

**Exit criterion:** a reproducible local MP4 render from structured
project data.

### Phase 2 --- Project schema and templates

-   Define and validate the versioned project schema.
-   Implement trusted template generation.
-   Create one template for each workflow.
-   Add a fixture project for each workflow.
-   Add unit tests for validation and duration calculation.

**Exit criterion:** three valid sample projects render using approved
templates.

### Phase 3 --- Creator interface

-   Implement authentication and dashboard.
-   Implement project wizard and manual-template path.
-   Implement scene editor, preview, save/load, and media replacement.
-   Add responsive and accessible states.

**Exit criterion:** a user can create, edit, save, and preview a video
without AI.

### Phase 4 --- AI and media

-   Implement provider adapters.
-   Add structured storyboard generation.
-   Add stock-media search only after validating provider terms and
    credentials.
-   Add user uploads, attribution metadata, and optional narration.
-   Add provider failure handling and quotas.

**Exit criterion:** a prompt can create an editable storyboard with safe
media references.

### Phase 5 --- Secure cloud export

-   Build the isolated render worker.
-   Add authenticated job API, status tracking, cancellation, and
    idempotency.
-   Add private output storage and short-lived downloads.
-   Add usage accounting, quotas, timeouts, and cleanup.
-   Run end-to-end export and security tests.

**Exit criterion:** authorized users can render and download MP4 within
configured limits.

### Phase 6 --- Private beta

-   Invite a small test group.
-   Measure generation and render reliability.
-   Review output quality and editing friction.
-   Measure real provider and infrastructure costs.
-   Fix reliability and security issues before expanding quotas.

**Exit criterion:** pilot users can complete the full workflow, and
costs are measurable and controllable.

------------------------------------------------------------------------

## 18. Deployment and Environment Configuration

Keep the first deployment simple:

-   Static frontend hosting for the React app.
-   Supabase for authentication, database, and private asset storage,
    after checking current plan limits.
-   One separately deployed render worker or on-demand render
    environment.
-   Local Ollama as an optional development provider.
-   Optional hosted AI and media APIs with explicit credentials and
    spending controls.

Example environment variable names:

``` dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

LLM_PROVIDER=ollama
LLM_MODEL=
OLLAMA_BASE_URL=

PEXELS_API_KEY=

RENDER_WORKER_URL=
RENDER_WORKER_SECRET=

MAX_CLOUD_EXPORTS_PER_MONTH=2
MAX_CLOUD_EXPORT_SECONDS=30
MAX_CLOUD_EXPORT_HEIGHT=1280
MAX_CLOUD_EXPORT_FPS=30
MAX_RENDER_CONCURRENCY_PER_USER=1
MAX_UPLOAD_BYTES=
OUTPUT_RETENTION_HOURS=
```

The exact variables depend on implementation. Never place service-role
keys, worker secrets, or paid provider keys in `VITE_` variables,
because those may be exposed to the browser.

Before deployment, verify current pricing, free-tier quotas, region
availability, data-retention terms, and commercial API permissions. Do
not design the product around a free tier that has not been confirmed.

------------------------------------------------------------------------

## 19. Risks and Mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  HyperFrames API or CLI differs from Inspect current official docs and
  assumptions                         prove a real render before building
                                      the app

  Browser-only MP4 export is          Treat it as a separate experimental
  unreliable                          renderer; use the supported
                                      local/cloud pipeline

  Free hosted AI limits change        Provider adapters, local/manual
                                      fallback, configurable budgets

  Rendering becomes expensive         Short-duration limits, 720p output,
                                      strict quotas, concurrency limits

  Generated storyboard is poor        Editable scenes, deterministic
                                      templates, schema validation,
                                      regenerate individual scenes

  Media licensing issues              Approved providers, user uploads,
                                      license metadata, attribution and
                                      usage review

  Malicious uploads or remote URLs    Validation, isolated worker, SSRF
                                      defenses, resource limits

  Public rendering endpoint abuse     Authentication, quotas, rate
                                      limits, job isolation, spending
                                      ceiling

  User data leaks between accounts    RLS, server-side ownership checks,
                                      authorization tests, private
                                      storage

  Scope grows too large               No avatars, text-to-video, complex
                                      timeline, payments, or
                                      collaboration in MVP
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 20. Open Decisions

Resolve these during implementation, without blocking the first proof of
concept:

1.  Exact Supabase and hosting plans after reviewing current free-tier
    limits.
2.  Whether the private beta uses only a developer-operated render
    worker or an on-demand cloud provider.
3.  Whether to ship a Tauri/Electron local-render companion after
    measuring user demand.
4.  Which hosted LLM provider, if any, meets quality, price, regional
    availability, and terms requirements.
5.  Whether stock-media search is enabled in the first public build or
    deferred until licensing and quota behavior are verified.
6.  Whether a TTS provider is justified by pilot feedback.

------------------------------------------------------------------------

## 21. Definition of MVP Done

The MVP is ready for a private beta when:

-   A user can sign in and create a project.
-   The user can choose one of the three video workflows.
-   The user can generate a storyboard or start manually.
-   The storyboard uses validated, editable project data.
-   The user can edit scenes, media, text, duration, and branding.
-   The browser preview reflects those edits.
-   At least one actual MP4 can be produced using the supported
    HyperFrames pipeline.
-   The user can retrieve the finished output securely.
-   Usage quotas and cost ceilings are enforced server-side.
-   AI and media providers can be disabled without breaking manual
    editing.
-   Core tests, authorization tests, and a real render test pass.
-   Setup, deployment, security, and troubleshooting documentation is
    available.
-   All paid-service dependencies and remaining limitations are clearly
    documented.

## 22. Product Principle

**Build a dependable video-production workflow first, then expand the
AI.** HyperFrames provides the composition/rendering foundation; the
product's value comes from excellent templates, structured generation,
no-code editing, reliable exports, and transparent costs. A small,
trustworthy tool that consistently exports useful videos is a stronger
MVP than a broad "unlimited AI video" promise that cannot be delivered
sustainably.

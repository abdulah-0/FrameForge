# FrameForge — AI Video Studio (MVP)

> **Describe a video, edit the storyboard, preview it, and export it — without writing code.**

FrameForge is a browser-first, AI-assisted video creation studio powered by [HyperFrames](https://hyperframes.dev) for deterministic HTML-based composition and rendering.

---

## 🌟 Core Features

- **Workflow-Driven Generation**:
  - 📱 **Faceless Shorts**: Vertical high-hook videos with animated typography & captions for YouTube Shorts, TikTok, and Reels.
  - 🛍️ **Product Ads**: Showcase product imagery, key value propositions, pricing/discounts, and high-converting CTAs.
  - 🎓 **Educational Explainers**: Break down complex concepts with clear titles, key takeaways, diagrams, and statistics.
- **Visual Scene Editor**: Reorder scenes, tweak durations, edit copy, change media, and adjust branding without touching code.
- **In-Browser Preview**: Real-time canvas and DOM animation preview matching the rendered composition.
- **Deterministic MP4 Export**: High-performance local and cloud render pipeline leveraging Chromium BeginFrame and FFmpeg.
- **AI & Media Provider Adapters**: Pluggable support for Gemini, local Ollama, and royalty-free stock media with offline/manual fallback.
- **Cost Controls & Quotas**: Explicit quotas, honest render stages, and zero silent paid provider consumption.

---

## 🏗️ Architecture

```text
FrameForge/
├── apps/
│   ├── web/                  # React 19 + Vite + Tailwind creator studio UI
│   └── render-worker/        # Isolated HyperFrames MP4 rendering worker (Puppeteer + FFmpeg)
├── packages/
│   ├── project-schema/       # Canonical JSON project schema, Zod validation, duration math
│   ├── composition/          # Trusted HyperFrames template generation (HTML + CSS + GSAP)
│   ├── providers/            # AI (Gemini, Ollama, Mock) & media provider adapters
│   └── shared/               # Shared constants, presets, and error codes
├── docs/
│   ├── prd.md                # Comprehensive Product Requirements Document
│   └── memory.md             # Continuous audit log of changes and decisions
└── supabase/
    └── migrations/           # PostgreSQL schema with Row Level Security (RLS)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20+ (v26 recommended)
- **FFmpeg**: v6+ (in system PATH)
- **Google Chrome** or **Chromium**

### Installation
```bash
npm install
```

### Running the Web Studio
```bash
npm run dev
```

### Running the Render Worker
```bash
npm run render-worker
```

---

## 📄 License
MIT License

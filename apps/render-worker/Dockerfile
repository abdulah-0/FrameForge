# ==============================================================================
# FrameForge Render Worker - Production Dockerfile
# Pinned Node.js 22 LTS, Chromium, and FFmpeg in an isolated non-root container
# PRD Section 8.5 & Section 12: Isolated, non-root environment with resource limits
# ==============================================================================

FROM node:22-bookworm-slim

# Install Chromium and FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ffmpeg \
    fonts-liberation \
    fonts-noto-color-emoji \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Environment paths for Chromium & FFmpeg
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    CHROME_BIN=/usr/bin/chromium \
    PORT=3100 \
    NODE_ENV=production

WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/project-schema/package*.json ./packages/project-schema/
COPY packages/composition/package*.json ./packages/composition/
COPY packages/providers/package*.json ./packages/providers/
COPY apps/render-worker/package*.json ./apps/render-worker/

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/project-schema ./packages/project-schema
COPY packages/composition ./packages/composition
COPY packages/providers ./packages/providers
COPY apps/render-worker ./apps/render-worker

# Build TypeScript packages
RUN npm run build --workspace=packages/shared && \
    npm run build --workspace=packages/project-schema && \
    npm run build --workspace=packages/composition && \
    npm run build --workspace=apps/render-worker

# Create renders directory and run as unprivileged node user
RUN mkdir -p /app/renders && chown -R node:node /app

USER node

EXPOSE 3100

CMD ["node", "apps/render-worker/src/server.js"]

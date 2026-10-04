import { Scene, sanitizeText } from "@frameforge/project-schema";

export function renderSceneHTML(scene: Scene, index: number): string {
  const headline = sanitizeText(scene.headline);
  const body = sanitizeText(scene.body || "");
  const caption = sanitizeText(scene.caption || "");
  const mediaUrl = scene.media?.url || "";
  const mediaType = scene.media?.type || "none";

  let mediaTag = "";
  if (mediaType === "image" && mediaUrl) {
    mediaTag = `<img class="media-backdrop" src="${mediaUrl}" alt="Visual" />`;
  } else if (mediaType === "video" && mediaUrl) {
    mediaTag = `<video class="media-backdrop" src="${mediaUrl}" muted playsinline></video>`;
  }

  const captionHTML = caption
    ? `<div class="caption-pill scene-anim-caption">${caption}</div>`
    : "";
  const headlineHTML = headline
    ? `<h1 class="headline scene-anim-headline">${headline}</h1>`
    : "";
  const bodyHTML = body
    ? `<p class="body-text scene-anim-body">${body}</p>`
    : "";

  switch (scene.layout) {
    case "hook":
      return `
        ${mediaTag}
        <div class="content-overlay">
          ${captionHTML}
          ${headlineHTML}
          ${bodyHTML}
        </div>
      `;

    case "text-over-media":
      return `
        ${mediaTag}
        <div class="content-overlay">
          ${captionHTML}
          ${headlineHTML}
          ${bodyHTML}
        </div>
      `;

    case "split-screen":
      return `
        <div class="layout-split">
          <div class="content-left">
            ${captionHTML}
            ${headlineHTML}
            ${bodyHTML}
          </div>
          <div class="content-right" style="position:relative; height:100%; border-radius:24px; overflow:hidden;">
            ${mediaTag ? mediaTag.replace('class="media-backdrop"', 'style="width:100%; height:100%; object-fit:cover; border-radius:24px;"') : '<div style="background:rgba(255,255,255,0.05); width:100%; height:100%; border-radius:24px; display:flex; align-items:center; justify-content:center; border:2px dashed rgba(255,255,255,0.15);">FrameForge Visual</div>'}
          </div>
        </div>
      `;

    case "product-showcase":
      return `
        ${mediaTag}
        <div class="content-overlay">
          ${captionHTML}
          ${headlineHTML}
          ${bodyHTML}
        </div>
      `;

    case "benefits-listicle":
      return `
        ${mediaTag}
        <div class="content-overlay">
          ${captionHTML}
          ${headlineHTML}
          <div class="body-text scene-anim-body" style="text-align:left; max-width:800px;">
            ${body}
          </div>
        </div>
      `;

    case "statistic-chart":
      return `
        ${mediaTag}
        <div class="content-overlay">
          ${captionHTML}
          <div class="stat-number scene-anim-headline">${headline}</div>
          ${bodyHTML}
        </div>
      `;

    case "quote-takeaway":
      return `
        ${mediaTag}
        <div class="content-overlay">
          <div class="quote-mark">“</div>
          ${headlineHTML}
          ${bodyHTML}
          ${captionHTML}
        </div>
      `;

    case "call-to-action":
      return `
        ${mediaTag}
        <div class="content-overlay">
          ${captionHTML}
          ${headlineHTML}
          ${bodyHTML}
          <div class="cta-button scene-anim-cta">Get Started</div>
        </div>
      `;

    default:
      return `
        ${mediaTag}
        <div class="content-overlay">
          ${captionHTML}
          ${headlineHTML}
          ${bodyHTML}
        </div>
      `;
  }
}

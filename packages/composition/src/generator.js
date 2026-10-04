import { calculateTotalDuration, sanitizeText, } from "@frameforge/project-schema";
import { RESOLUTIONS } from "@frameforge/shared";
import { generateBaseCSS } from "./styles.js";
import { renderSceneHTML } from "./layouts.js";
/**
 * Generates valid, deterministic HyperFrames HTML from a canonical Project model.
 */
export function generateHyperframesHTML(project, options = {}) {
    const resolution = RESOLUTIONS[project.aspectRatio] || RESOLUTIONS["9:16"];
    const width = resolution.width;
    const height = resolution.height;
    const totalDuration = calculateTotalDuration(project.scenes);
    const css = generateBaseCSS(project.branding, width, height);
    let currentStart = 0;
    const scenesHTML = [];
    const animationScripts = [];
    for (let i = 0; i < project.scenes.length; i++) {
        const scene = project.scenes[i];
        const sceneStart = Number(currentStart.toFixed(2));
        const sceneDuration = scene.durationSeconds;
        // Strictly alphanumeric sceneId to prevent DOM injection
        const safeId = String(scene.id).replace(/[^a-zA-Z0-9_-]/g, "");
        const sceneId = `scene_${safeId || i}`;
        const innerHTML = renderSceneHTML(scene, i);
        scenesHTML.push(`
      <!-- Scene ${i + 1}: ${scene.layout} (${sceneDuration}s) -->
      <div
        id="${sceneId}"
        class="clip scene-container"
        data-composition-id="${sceneId}"
        data-start="${sceneStart}"
        data-duration="${sceneDuration}"
        data-track-index="1"
      >
        ${innerHTML}
      </div>
    `);
        // Motion presets using GSAP
        let motionTweens = "";
        if (scene.motion === "slide-up") {
            motionTweens = `
        tl.from("#${sceneId} .scene-anim-headline", { y: 60, opacity: 0, duration: 0.8, ease: "power2.out" }, 0.1);
        tl.from("#${sceneId} .scene-anim-caption", { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" }, 0);
        tl.from("#${sceneId} .scene-anim-body", { y: 40, opacity: 0, duration: 0.8, ease: "power2.out" }, 0.25);
        tl.from("#${sceneId} .scene-anim-cta", { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(1.5)" }, 0.4);
      `;
        }
        else if (scene.motion === "pop-in") {
            motionTweens = `
        tl.from("#${sceneId} .scene-anim-headline", { scale: 0.8, opacity: 0, duration: 0.6, ease: "back.out(1.7)" }, 0.1);
        tl.from("#${sceneId} .scene-anim-caption", { scale: 0.9, opacity: 0, duration: 0.5, ease: "power1.out" }, 0);
        tl.from("#${sceneId} .scene-anim-body", { opacity: 0, duration: 0.7, ease: "power2.out" }, 0.25);
        tl.from("#${sceneId} .scene-anim-cta", { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.4);
      `;
        }
        else if (scene.motion === "zoom-cut") {
            motionTweens = `
        tl.from("#${sceneId}", { scale: 1.15, opacity: 0, duration: 0.5, ease: "power3.out" }, 0);
        tl.from("#${sceneId} .scene-anim-headline", { scale: 0.9, opacity: 0, duration: 0.5 }, 0.1);
        tl.from("#${sceneId} .scene-anim-body", { opacity: 0, duration: 0.6 }, 0.2);
      `;
        }
        else {
            // Default: smooth-fade
            motionTweens = `
        tl.from("#${sceneId} .scene-anim-caption", { opacity: 0, y: -20, duration: 0.6, ease: "power2.out" }, 0.1);
        tl.from("#${sceneId} .scene-anim-headline", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, 0.2);
        tl.from("#${sceneId} .scene-anim-body", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" }, 0.35);
        tl.from("#${sceneId} .scene-anim-cta", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, 0.5);
      `;
        }
        animationScripts.push(`
      (function() {
        if (typeof gsap !== 'undefined') {
          const tl = gsap.timeline({ paused: true });
          ${motionTweens}
          window.__timelines = window.__timelines || {};
          window.__timelines["${sceneId}"] = tl;
        }
      })();
    `);
        currentStart += sceneDuration;
    }
    // Audio elements
    let audioClips = "";
    if (project.audio.musicUrl) {
        const safeMusic = sanitizeText(project.audio.musicUrl);
        audioClips += `
      <audio
        class="clip"
        src="${safeMusic}"
        data-start="0"
        data-duration="${totalDuration}"
        data-volume="${project.audio.musicVolume}"
        data-track-index="0"
      ></audio>
    `;
    }
    if (project.audio.narrationUrl) {
        const safeNarration = sanitizeText(project.audio.narrationUrl);
        audioClips += `
      <audio
        class="clip"
        src="${safeNarration}"
        data-start="0"
        data-duration="${totalDuration}"
        data-volume="${project.audio.narrationVolume}"
        data-track-index="0"
      ></audio>
    `;
    }
    let logoHTML = "";
    if (project.branding.logoUrl) {
        const safeLogo = sanitizeText(project.branding.logoUrl);
        logoHTML = `<img src="${safeLogo}" class="brand-logo" alt="Logo" />`;
    }
    const safeTitle = sanitizeText(project.title);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${safeTitle}</title>
  <meta name="viewport" content="width=${width}, height=${height}, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <style>
${css}
  </style>
</head>
<body>
  <div
    id="root"
    data-composition-id="root"
    data-start="0"
    data-duration="${totalDuration}"
    data-width="${width}"
    data-height="${height}"
    data-fps="${project.fps}"
  >
    ${logoHTML}
    ${scenesHTML.join("\n")}
    ${audioClips}
  </div>

  <script>
    window.__timelines = window.__timelines || {};
    ${animationScripts.join("\n")}
  </script>
</body>
</html>`;
}

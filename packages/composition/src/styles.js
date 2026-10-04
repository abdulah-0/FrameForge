export function generateBaseCSS(branding, width, height) {
    return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: ${width}px;
      height: ${height}px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: ${branding.backgroundColor};
      color: ${branding.textColor};
      font-family: ${branding.fontFamily};
      -webkit-font-smoothing: antialiased;
    }

    #root {
      position: relative;
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      background-color: ${branding.backgroundColor};
    }

    .clip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .scene-container {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5% 7%;
      text-align: center;
      background: radial-gradient(circle at 50% 20%, rgba(255,255,255,0.06), transparent 75%), ${branding.backgroundColor};
    }

    .brand-logo {
      position: absolute;
      top: 50px;
      left: 50px;
      height: 60px;
      max-width: 200px;
      object-fit: contain;
      z-index: 10;
    }

    .headline {
      font-size: ${width > 1200 ? "64px" : "54px"};
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      color: ${branding.textColor};
      text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }

    .body-text {
      font-size: ${width > 1200 ? "32px" : "28px"};
      font-weight: 400;
      line-height: 1.45;
      color: rgba(248, 250, 252, 0.85);
      max-width: 85%;
      margin-bottom: 30px;
      white-space: pre-line;
      text-shadow: 0 2px 10px rgba(0,0,0,0.4);
    }

    .caption-pill {
      display: inline-block;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 12px 24px;
      border-radius: 9999px;
      font-size: 22px;
      font-weight: 600;
      color: ${branding.primaryColor};
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .badge-accent {
      color: ${branding.primaryColor};
    }

    .media-backdrop {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.4;
      filter: saturate(1.1) brightness(0.7);
      z-index: 0;
    }

    .content-overlay {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    /* Layout specific */
    .layout-split {
      display: grid;
      grid-template-columns: ${width > height ? "1fr 1fr" : "1fr"};
      gap: 40px;
      align-items: center;
      height: 100%;
      width: 100%;
      text-align: ${width > height ? "left" : "center"};
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor});
      color: #ffffff;
      padding: 20px 48px;
      font-size: 32px;
      font-weight: 700;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
      margin-top: 20px;
      letter-spacing: -0.01em;
    }

    .stat-number {
      font-size: ${width > 1200 ? "110px" : "90px"};
      font-weight: 900;
      background: linear-gradient(135deg, ${branding.primaryColor}, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 16px;
    }

    .quote-mark {
      font-size: 80px;
      color: ${branding.primaryColor};
      opacity: 0.6;
      line-height: 0.5;
      margin-bottom: 10px;
    }
  `;
}

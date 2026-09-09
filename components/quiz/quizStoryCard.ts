export interface StoryCardOptions {
  quizTitle: string;
  isTrivia: boolean;
  score?: number;
  total?: number;
  percent?: number;
  tierLabel?: string;
  resultTitle?: string;
  resultDescription?: string;
  traits?: string[];
  labels: {
    resultBadge: string;
    scoreBadge: string;
    hits: string;
    brandFooter: string;
  };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export function generateStoryCardDataUrl(options: StoryCardOptions): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGrad.addColorStop(0, "#0f1114");
  bgGrad.addColorStop(0.5, "#181a1f");
  bgGrad.addColorStop(1, "#0a0b0d");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Outer border
  ctx.strokeStyle = "#2c3038";
  ctx.lineWidth = 4;
  ctx.beginPath();
  drawRoundedRect(ctx, 40, 40, 1000, 1840, 24);
  ctx.stroke();

  // Corner accents in primary green (#c3e652)
  ctx.strokeStyle = "#c3e652";
  ctx.lineWidth = 6;
  const accentLen = 40;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(40, 40 + accentLen);
  ctx.lineTo(40, 40);
  ctx.lineTo(40 + accentLen, 40);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(1040 - accentLen, 40);
  ctx.lineTo(1040, 40);
  ctx.lineTo(1040, 40 + accentLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(40, 1880 - accentLen);
  ctx.lineTo(40, 1880);
  ctx.lineTo(40 + accentLen, 1880);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(1040 - accentLen, 1880);
  ctx.lineTo(1040, 1880);
  ctx.lineTo(1040, 1880 - accentLen);
  ctx.stroke();

  // Top header: Brand & Category
  ctx.fillStyle = "#c3e652";
  ctx.font = "bold 24px monospace";
  ctx.letterSpacing = "4px";
  ctx.fillText("TOOLNOTCH.COM", 90, 140);

  ctx.fillStyle = "#a8a8a8";
  ctx.font = "bold 20px monospace";
  ctx.letterSpacing = "2px";
  ctx.fillText(
    options.isTrivia ? "TRIVIA INTERATIVA" : "QUIZ DE PERSONALIDADE",
    90,
    180,
  );

  // Quiz Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.letterSpacing = "0px";
  const titleLines = wrapText(ctx, options.quizTitle.toUpperCase(), 900);
  let titleY = 250;
  titleLines.slice(0, 2).forEach((line) => {
    ctx.fillText(line, 90, titleY);
    titleY += 56;
  });

  // Divider line
  ctx.strokeStyle = "#2c3038";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, titleY + 20);
  ctx.lineTo(990, titleY + 20);
  ctx.stroke();

  // Central Card Panel
  const panelY = titleY + 60;
  const panelHeight = 1180;
  ctx.fillStyle = "#1e2126";
  ctx.beginPath();
  drawRoundedRect(ctx, 90, panelY, 900, panelHeight, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Result Badge inside panel
  let cursorY = panelY + 90;
  ctx.fillStyle = "#5ce4dd";
  ctx.font = "bold 26px monospace";
  ctx.letterSpacing = "3px";
  ctx.fillText(
    options.isTrivia
      ? options.labels.scoreBadge.toUpperCase()
      : options.labels.resultBadge.toUpperCase(),
    150,
    cursorY,
  );

  cursorY += 60;

  // Trivia Score or Personality Title
  if (options.isTrivia) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 100px sans-serif";
    ctx.fillText(`${options.score ?? 0} / ${options.total ?? 0}`, 150, cursorY + 40);
    cursorY += 120;

    ctx.fillStyle = "#5ce4dd";
    ctx.font = "bold 32px monospace";
    ctx.fillText(
      `${options.percent ?? 0}% ${options.labels.hits.toUpperCase()} • ${options.tierLabel ?? ""}`,
      150,
      cursorY,
    );
    cursorY += 70;
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px sans-serif";
    const mainTitle = (options.resultTitle ?? "").toUpperCase();
    const resultLines = wrapText(ctx, mainTitle, 780);
    resultLines.slice(0, 2).forEach((line) => {
      ctx.fillText(line, 150, cursorY + 10);
      cursorY += 74;
    });
    cursorY += 20;
  }

  // Inner Divider
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, cursorY);
  ctx.lineTo(930, cursorY);
  ctx.stroke();
  cursorY += 50;

  // Description
  ctx.fillStyle = "#d1d5db";
  ctx.font = "30px sans-serif";
  const desc =
    options.isTrivia
      ? options.resultDescription ?? ""
      : options.resultDescription ?? "";
  const descLines = wrapText(ctx, desc, 780);
  descLines.slice(0, 7).forEach((line) => {
    ctx.fillText(line, 150, cursorY);
    cursorY += 46;
  });

  // Traits Pills (if personality)
  if (!options.isTrivia && options.traits && options.traits.length > 0) {
    cursorY += 30;
    let pillX = 150;
    ctx.font = "bold 24px monospace";
    options.traits.slice(0, 4).forEach((trait) => {
      const tagText = `#${trait}`;
      const textWidth = ctx.measureText(tagText).width;
      const pillWidth = textWidth + 36;
      if (pillX + pillWidth > 930) return;

      ctx.fillStyle = "#2a2d34";
      ctx.beginPath();
      drawRoundedRect(ctx, pillX, cursorY, pillWidth, 48, 8);
      ctx.fill();
      ctx.strokeStyle = "#d83e9d";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#d83e9d";
      ctx.fillText(tagText, pillX + 18, cursorY + 33);

      pillX += pillWidth + 18;
    });
  }

  // Footer CTA
  ctx.fillStyle = "#a8a8a8";
  ctx.font = "24px sans-serif";
  ctx.fillText("Descubra o seu resultado em:", 90, 1720);

  ctx.fillStyle = "#c3e652";
  ctx.font = "bold 38px monospace";
  ctx.fillText("toolnotch.com/quizzes", 90, 1775);

  ctx.fillStyle = "#6b7280";
  ctx.font = "20px sans-serif";
  ctx.fillText("Quizzes interativos e ferramentas 100% gratuitas", 90, 1820);

  return canvas.toDataURL("image/png");
}

import type { SupportedFormat } from "./imageTypes";

export type FitMode = "cover" | "contain" | "stretch";

export interface ResizeOptions {
  file: File;
  targetWidth: number;
  targetHeight: number;
  format?: SupportedFormat | "original";
  quality?: number; // 1 - 100
  rotation?: number; // 0, 90, 180, 270
  flipH?: boolean;
  flipV?: boolean;
  fitMode?: FitMode;
  bgColor?: string;
}

export interface ResizeResult {
  blob: Blob;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  originalSize: number;
  newSize: number;
}

export async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number; img: HTMLImageElement }> {
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height, img });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };
    img.src = objectUrl;
  });
}

export async function resizeImage(options: ResizeOptions): Promise<ResizeResult> {
  const {
    file,
    targetWidth,
    targetHeight,
    format = "original",
    quality = 90,
    rotation = 0,
    flipH = false,
    flipV = false,
    fitMode = "cover",
    bgColor,
  } = options;

  const { width: origWidth, height: origHeight, img } = await getImageDimensions(file);

  const canvas = document.createElement("canvas");
  const isRotated90or270 = rotation === 90 || rotation === 270;

  const outWidth = isRotated90or270 ? targetHeight : targetWidth;
  const outHeight = isRotated90or270 ? targetWidth : targetHeight;

  canvas.width = outWidth;
  canvas.height = outHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Preenche fundo se especificado ou se for JPG em contain
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (format === "jpg" && fitMode === "contain") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Aplica transformações (rotação e espelhamento)
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  const scaleX = flipH ? -1 : 1;
  const scaleY = flipV ? -1 : 1;
  if (flipH || flipV) {
    ctx.scale(scaleX, scaleY);
  }

  const containerW = isRotated90or270 ? outHeight : outWidth;
  const containerH = isRotated90or270 ? outWidth : outHeight;

  let drawW = containerW;
  let drawH = containerH;

  if (fitMode === "cover") {
    const scale = Math.max(containerW / origWidth, containerH / origHeight);
    drawW = Math.round(origWidth * scale);
    drawH = Math.round(origHeight * scale);
  } else if (fitMode === "contain") {
    const scale = Math.min(containerW / origWidth, containerH / origHeight);
    drawW = Math.round(origWidth * scale);
    drawH = Math.round(origHeight * scale);
  } else {
    // stretch
    drawW = containerW;
    drawH = containerH;
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  // Determinar formato de saída
  let mimeType = file.type || "image/png";
  if (format === "jpg") mimeType = "image/jpeg";
  else if (format === "png") mimeType = "image/png";
  else if (format === "webp") mimeType = "image/webp";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to export resized image"));
      },
      mimeType,
      quality / 100,
    );
  });

  return {
    blob,
    originalWidth: origWidth,
    originalHeight: origHeight,
    newWidth: outWidth,
    newHeight: outHeight,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export interface CropOptions {
  file: File;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  format?: SupportedFormat | "original";
  quality?: number;
}

export interface CropResult {
  blob: Blob;
  originalWidth: number;
  originalHeight: number;
  cropWidth: number;
  cropHeight: number;
  originalSize: number;
  newSize: number;
}

export async function cropImage(options: CropOptions): Promise<CropResult> {
  const {
    file,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    format = "original",
    quality = 92,
  } = options;

  const { width: origWidth, height: origHeight, img } = await getImageDimensions(file);

  const canvas = document.createElement("canvas");
  const targetW = Math.max(1, Math.round(cropWidth));
  const targetH = Math.max(1, Math.round(cropHeight));

  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    img,
    Math.max(0, cropX),
    Math.max(0, cropY),
    Math.min(origWidth - cropX, cropWidth),
    Math.min(origHeight - cropY, cropHeight),
    0,
    0,
    targetW,
    targetH,
  );

  let mimeType = file.type || "image/png";
  if (format === "jpg") mimeType = "image/jpeg";
  else if (format === "png") mimeType = "image/png";
  else if (format === "webp") mimeType = "image/webp";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to export cropped image"));
      },
      mimeType,
      quality / 100,
    );
  });

  return {
    blob,
    originalWidth: origWidth,
    originalHeight: origHeight,
    cropWidth: targetW,
    cropHeight: targetH,
    originalSize: file.size,
    newSize: blob.size,
  };
}

export type CensorType = "blur" | "pixelate" | "blackout";

export interface CensorArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: CensorType;
  strength?: number;
}

export interface CensorOptions {
  file: File;
  areas: CensorArea[];
  format?: SupportedFormat | "original";
  quality?: number;
}

export interface CensorResult {
  blob: Blob;
  originalWidth: number;
  originalHeight: number;
  areasCount: number;
  originalSize: number;
  newSize: number;
}

export async function censorImage(options: CensorOptions): Promise<CensorResult> {
  const { file, areas, format = "original", quality = 92 } = options;
  const { width: origWidth, height: origHeight, img } = await getImageDimensions(file);

  const canvas = document.createElement("canvas");
  canvas.width = origWidth;
  canvas.height = origHeight;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context not available");

  // Desenha imagem original
  ctx.drawImage(img, 0, 0, origWidth, origHeight);

  // Aplica cada área censurada
  for (const area of areas) {
    const { x, y, width, height, type, strength = 16 } = area;
    const boxX = Math.max(0, Math.round(x));
    const boxY = Math.max(0, Math.round(y));
    const boxW = Math.min(origWidth - boxX, Math.round(width));
    const boxH = Math.min(origHeight - boxY, Math.round(height));

    if (boxW <= 0 || boxH <= 0) continue;

    if (type === "blackout") {
      ctx.fillStyle = "#000000";
      ctx.fillRect(boxX, boxY, boxW, boxH);
    } else if (type === "pixelate") {
      const blockSize = Math.max(4, Math.min(50, Math.round(strength)));
      const tempCanvas = document.createElement("canvas");
      const tempW = Math.max(1, Math.floor(boxW / blockSize));
      const tempH = Math.max(1, Math.floor(boxH / blockSize));
      tempCanvas.width = tempW;
      tempCanvas.height = tempH;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(canvas, boxX, boxY, boxW, boxH, 0, 0, tempW, tempH);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, tempW, tempH, boxX, boxY, boxW, boxH);
        ctx.imageSmoothingEnabled = true;
      }
    } else if (type === "blur") {
      const blurRadius = Math.max(4, Math.min(40, Math.round(strength)));
      ctx.save();
      ctx.beginPath();
      ctx.rect(boxX, boxY, boxW, boxH);
      ctx.clip();
      ctx.filter = `blur(${blurRadius}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
  }

  let mimeType = file.type || "image/png";
  if (format === "jpg") mimeType = "image/jpeg";
  else if (format === "png") mimeType = "image/png";
  else if (format === "webp") mimeType = "image/webp";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to export censored image"));
      },
      mimeType,
      quality / 100,
    );
  });

  return {
    blob,
    originalWidth: origWidth,
    originalHeight: origHeight,
    areasCount: areas.length,
    originalSize: file.size,
    newSize: blob.size,
  };
}

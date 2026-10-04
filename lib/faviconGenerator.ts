import JSZip from "jszip";
import { getImageDimensions } from "./imageManipulation";

export interface FaviconItem {
  name: string;
  size: number;
  blob: Blob;
  previewUrl: string;
}

export interface FaviconPackageResult {
  zipBlob: Blob;
  zipSize: number;
  items: FaviconItem[];
  htmlSnippet: string;
}

export interface FaviconOptions {
  file: File;
  siteName?: string;
  backgroundColor?: string;
}

/**
 * Redimensiona a imagem para um tamanho quadrado em PNG
 */
async function renderSquarePng(img: HTMLImageElement, size: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Encaixa proporcionalmente com preenchimento transparente centralizado
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  const aspect = srcW / srcH;
  let drawW = size;
  let drawH = size;
  let offsetX = 0;
  let offsetY = 0;

  if (aspect > 1) {
    drawH = Math.round(size / aspect);
    offsetY = Math.round((size - drawH) / 2);
  } else if (aspect < 1) {
    drawW = Math.round(size * aspect);
    offsetX = Math.round((size - drawW) / 2);
  }

  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error(`Failed to render ${size}x${size} png`));
      },
      "image/png",
    );
  });
}

/**
 * Cria um arquivo .ico multi-resolução válido em formato binário embedding PNGs
 */
async function createIcoFile(pngs: { size: number; blob: Blob }[]): Promise<Blob> {
  const numImages = pngs.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirTotalSize = headerSize + numImages * dirEntrySize;

  const pngBuffers: Uint8Array[] = [];
  for (const item of pngs) {
    const arrayBuffer = await item.blob.arrayBuffer();
    pngBuffers.push(new Uint8Array(arrayBuffer));
  }

  let totalFileSize = dirTotalSize;
  for (const buf of pngBuffers) {
    totalFileSize += buf.length;
  }

  const icoBuffer = new Uint8Array(totalFileSize);
  const view = new DataView(icoBuffer.buffer);

  // ICONDIR header
  view.setUint16(0, 0, true); // Reserved (0)
  view.setUint16(2, 1, true); // Type (1 = ICO)
  view.setUint16(4, numImages, true); // Count

  let currentOffset = dirTotalSize;

  for (let i = 0; i < numImages; i++) {
    const png = pngs[i];
    const buf = pngBuffers[i];
    const entryOffset = headerSize + i * dirEntrySize;

    // ICONDIRENTRY
    icoBuffer[entryOffset + 0] = png.size >= 256 ? 0 : png.size; // Width
    icoBuffer[entryOffset + 1] = png.size >= 256 ? 0 : png.size; // Height
    icoBuffer[entryOffset + 2] = 0; // Colors (0 = >=8bpp)
    icoBuffer[entryOffset + 3] = 0; // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, buf.length, true); // Size of image data
    view.setUint32(entryOffset + 12, currentOffset, true); // Offset of image data

    // Write PNG data
    icoBuffer.set(buf, currentOffset);
    currentOffset += buf.length;
  }

  return new Blob([icoBuffer], { type: "image/x-icon" });
}

export async function generateFavicons(options: FaviconOptions): Promise<FaviconPackageResult> {
  const { file, siteName = "My Website", backgroundColor = "#ffffff" } = options;
  const { img } = await getImageDimensions(file);

  const SIZES = [16, 32, 48, 180, 192, 512];
  const renderedPngs: { size: number; blob: Blob; previewUrl: string }[] = [];

  for (const size of SIZES) {
    const blob = await renderSquarePng(img, size);
    const previewUrl = URL.createObjectURL(blob);
    renderedPngs.push({ size, blob, previewUrl });
  }

  const png16 = renderedPngs.find((p) => p.size === 16)!.blob;
  const png32 = renderedPngs.find((p) => p.size === 32)!.blob;
  const png48 = renderedPngs.find((p) => p.size === 48)!.blob;
  const png180 = renderedPngs.find((p) => p.size === 180)!.blob;
  const png192 = renderedPngs.find((p) => p.size === 192)!.blob;
  const png512 = renderedPngs.find((p) => p.size === 512)!.blob;

  // Gera favicon.ico clássico contendo 16, 32 e 48
  const icoBlob = await createIcoFile([
    { size: 16, blob: png16 },
    { size: 32, blob: png32 },
    { size: 48, blob: png48 },
  ]);

  const icoItem: FaviconItem = {
    name: "favicon.ico",
    size: 32,
    blob: icoBlob,
    previewUrl: URL.createObjectURL(icoBlob),
  };

  const items: FaviconItem[] = [
    icoItem,
    { name: "favicon-16x16.png", size: 16, blob: png16, previewUrl: renderedPngs[0].previewUrl },
    { name: "favicon-32x32.png", size: 32, blob: png32, previewUrl: renderedPngs[1].previewUrl },
    { name: "favicon-48x48.png", size: 48, blob: png48, previewUrl: renderedPngs[2].previewUrl },
    { name: "apple-touch-icon.png", size: 180, blob: png180, previewUrl: renderedPngs[3].previewUrl },
    { name: "android-chrome-192x192.png", size: 192, blob: png192, previewUrl: renderedPngs[4].previewUrl },
    { name: "android-chrome-512x512.png", size: 512, blob: png512, previewUrl: renderedPngs[5].previewUrl },
  ];

  // Gera manifest.json
  const manifestContent = JSON.stringify(
    {
      name: siteName,
      short_name: siteName,
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: backgroundColor,
      background_color: backgroundColor,
      display: "standalone",
    },
    null,
    2,
  );

  // Compacta tudo com JSZip
  const zip = new JSZip();
  zip.file("favicon.ico", icoBlob);
  zip.file("favicon-16x16.png", png16);
  zip.file("favicon-32x32.png", png32);
  zip.file("favicon-48x48.png", png48);
  zip.file("apple-touch-icon.png", png180);
  zip.file("android-chrome-192x192.png", png192);
  zip.file("android-chrome-512x512.png", png512);
  zip.file("site.webmanifest", manifestContent);

  const htmlSnippet = `<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  zip.file("favicon-instructions.html", `<!-- Cole as tags abaixo no <head> do seu site -->\n${htmlSnippet}\n`);

  const zipBlob = await zip.generateAsync({ type: "blob" });

  return {
    zipBlob,
    zipSize: zipBlob.size,
    items,
    htmlSnippet,
  };
}

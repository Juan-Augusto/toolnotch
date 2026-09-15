type PdfDocument = Awaited<
  ReturnType<(typeof import("pdfjs-dist"))["getDocument"]>["promise"]
>;

// Cache for active PDF document in memory to avoid re-reading arrayBuffer
let cachedDocument: {
  file: File;
  pdf: PdfDocument;
} | null = null;

export async function getOrLoadPdfDocument(file: File) {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  if (cachedDocument && cachedDocument.file === file) {
    return cachedDocument.pdf;
  }

  const bytes = await file.arrayBuffer();
  try {
    const pdf = await getDocument({ data: bytes }).promise;
    cachedDocument = { file, pdf };
    return pdf;
  } catch {
    throw new Error("Could not load PDF. It may be password-protected or corrupted.");
  }
}

export async function renderPdfPage(
  file: File,
  pageNum: number,
  scale = 2
): Promise<string> {
  const pdf = await getOrLoadPdfDocument(file);
  if (pageNum < 1 || pageNum > pdf.numPages) {
    throw new Error(`Invalid page number ${pageNum}. Document has ${pdf.numPages} pages.`);
  }

  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;

  await page.render({ canvasContext: ctx, canvas, viewport }).promise;
  return canvas.toDataURL("image/jpeg", 0.95);
}

export async function pdfToImages(
  file: File,
  scale = 2,
  onProgress?: (current: number, total: number) => void
): Promise<{ name: string; dataUrl: string }[]> {
  const pdf = await getOrLoadPdfDocument(file);

  const results: { name: string; dataUrl: string }[] = [];
  const baseName = file.name.replace(/\.pdf$/i, "");
  const total = pdf.numPages;

  for (let pageNum = 1; pageNum <= total; pageNum++) {
    onProgress?.(pageNum, total);
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, canvas, viewport }).promise;

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    results.push({ name: `${baseName}_page_${pageNum}.jpg`, dataUrl });
  }

  return results;
}


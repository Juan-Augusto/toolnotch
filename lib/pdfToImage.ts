export async function pdfToImages(
  file: File,
  scale = 2
): Promise<{ name: string; dataUrl: string }[]> {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  let pdf: Awaited<ReturnType<typeof getDocument>["promise"]>;
  try {
    pdf = await getDocument({ data: bytes }).promise;
  } catch {
    throw new Error("Could not load PDF. It may be password-protected or corrupted.");
  }

  const results: { name: string; dataUrl: string }[] = [];
  const baseName = file.name.replace(/\.pdf$/i, "");

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
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

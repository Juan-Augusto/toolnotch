export interface ExtractedPdfText {
  fullText: string;
  pageTexts: string[];
  totalPages: number;
  wordCount: number;
  charCount: number;
}

export async function extractTextFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedPdfText> {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  let pdf: Awaited<ReturnType<typeof getDocument>["promise"]>;
  try {
    pdf = await getDocument({ data: bytes }).promise;
  } catch {
    throw new Error("Could not load PDF. It may be password-protected or corrupted.");
  }

  const total = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= total; pageNum++) {
    onProgress?.(pageNum, total);
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    let lastY: number | null = null;
    let pageString = "";

    for (const item of textContent.items) {
      if ("str" in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageString += "\n";
        } else if (pageString.length > 0 && !pageString.endsWith(" ") && !pageString.endsWith("\n")) {
          pageString += " ";
        }
        pageString += item.str;
        lastY = item.transform[5];
      }
    }
    pageTexts.push(pageString.trim());
  }

  const fullText = pageTexts
    .map((text, idx) => `--- Page ${idx + 1} ---\n${text}`)
    .join("\n\n");

  const cleanWords = fullText
    .replace(/--- Page \d+ ---/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = cleanWords.length;
  const charCount = fullText.length;

  return {
    fullText,
    pageTexts,
    totalPages: total,
    wordCount,
    charCount,
  };
}

import { PDFDocument } from "pdf-lib";
import { PageRange } from "./pdfTypes";

export async function splitPDF(
  file: File,
  ranges: PageRange[]
): Promise<{ name: string; bytes: Uint8Array }[]> {
  const bytes = await file.arrayBuffer();
  let src: PDFDocument;
  try {
    src = await PDFDocument.load(bytes);
  } catch {
    throw new Error("Could not load PDF. It may be password-protected or corrupted.");
  }

  const totalPages = src.getPageCount();
  const results: { name: string; bytes: Uint8Array }[] = [];

  for (let i = 0; i < ranges.length; i++) {
    const { start, end } = ranges[i];
    if (start < 1 || end > totalPages || start > end) {
      throw new Error(`Invalid page range ${start}-${end}. PDF has ${totalPages} pages.`);
    }

    const doc = await PDFDocument.create();
    const indices = Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k);
    const pages = await doc.copyPages(src, indices);
    pages.forEach((page) => doc.addPage(page));

    const name =
      ranges.length === 1
        ? `${file.name.replace(/\.pdf$/i, "")}_pages_${start}-${end}.pdf`
        : `part_${i + 1}_pages_${start}-${end}.pdf`;

    results.push({ name, bytes: await doc.save() });
  }

  return results;
}

import { PDFDocument } from "pdf-lib";

export function parsePageRanges(input: string, totalPages: number): Set<number> {
  const result = new Set<number>();
  const parts = input.split(/[,;\s]+/).map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          result.add(i - 1);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        result.add(page - 1);
      }
    }
  }

  return result;
}

export async function deletePdfPages(
  file: File,
  pagesToRemove: Set<number>
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes);
  const totalPages = srcDoc.getPageCount();
  const keepIndices: number[] = [];

  for (let i = 0; i < totalPages; i++) {
    if (!pagesToRemove.has(i)) {
      keepIndices.push(i);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error("Cannot delete all pages from the PDF.");
  }

  const outDoc = await PDFDocument.create();
  const copiedPages = await outDoc.copyPages(srcDoc, keepIndices);
  copiedPages.forEach((page) => outDoc.addPage(page));

  return await outDoc.save();
}

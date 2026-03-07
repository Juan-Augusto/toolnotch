import { PDFDocument } from "pdf-lib";
import { PDFJob } from "./pdfTypes";

export async function mergePDFs(jobs: PDFJob[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (const job of jobs) {
    const bytes = await job.file.arrayBuffer();
    let src: PDFDocument;
    try {
      src = await PDFDocument.load(bytes);
    } catch {
      throw new Error(`"${job.name}" could not be loaded. It may be password-protected or corrupted.`);
    }
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save();
}

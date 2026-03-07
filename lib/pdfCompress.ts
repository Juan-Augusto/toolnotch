import { PDFDocument } from "pdf-lib";

export async function compressPDF(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { updateMetadata: false });
  } catch {
    throw new Error("Could not load PDF. It may be password-protected or corrupted.");
  }

  // Re-save with object stream compression (reduces size for many PDFs)
  return doc.save({ useObjectStreams: true, addDefaultPage: false });
}

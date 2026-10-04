import { PDFDocument, degrees } from "pdf-lib";

export interface PageConfig {
  originalIndex: number;
  rotation: number;
}

export async function organizePdf(
  file: File,
  pages: PageConfig[]
): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes);
  const outDoc = await PDFDocument.create();

  const originalIndices = pages.map((p) => p.originalIndex);
  const copiedPages = await outDoc.copyPages(srcDoc, originalIndices);

  copiedPages.forEach((page, index) => {
    const rotation = pages[index].rotation;
    if (rotation !== 0) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotation) % 360));
    }
    outDoc.addPage(page);
  });

  return await outDoc.save();
}

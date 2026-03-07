import { PDFDocument } from "pdf-lib";

export async function imagesToPDF(files: File[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const mime = file.type;

    let image;
    if (mime === "image/jpeg" || mime === "image/jpg") {
      image = await doc.embedJpg(bytes);
    } else if (mime === "image/png") {
      image = await doc.embedPng(bytes);
    } else {
      throw new Error(`Unsupported image type: ${mime}. Use JPEG or PNG.`);
    }

    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  return doc.save();
}

import { PDFDocument } from "pdf-lib";

export type PdfFilenameValidationErrorKey = "invalidFilename";

export interface PdfFilenameValidationResult {
  valid: boolean;
  errorKey: PdfFilenameValidationErrorKey | null;
}

export function validatePdfFilename(input: string): PdfFilenameValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: true, errorKey: null };
  }

  // Check forbidden filename/path characters across OS: \ / : * ? " < > | and control chars
  // eslint-disable-next-line no-control-regex
  const illegalCharsRegex = /[\\/:*?"<>|\x00-\x1F]/;
  if (illegalCharsRegex.test(trimmed)) {
    return { valid: false, errorKey: "invalidFilename" };
  }

  // Cannot be just dots or end with a dot
  if (trimmed === "." || trimmed === ".." || trimmed.endsWith(".")) {
    return { valid: false, errorKey: "invalidFilename" };
  }

  // If there's an extension or dot
  if (trimmed.includes(".")) {
    if (/\.pdf$/i.test(trimmed)) {
      const baseName = trimmed.slice(0, -4).trim();
      if (!baseName || baseName === "." || baseName === "..") {
        return { valid: false, errorKey: "invalidFilename" };
      }
      return { valid: true, errorKey: null };
    }
    // Contains a non-PDF extension (e.g. .jpg, .png, .txt)
    return { valid: false, errorKey: "invalidFilename" };
  }

  return { valid: true, errorKey: null };
}

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


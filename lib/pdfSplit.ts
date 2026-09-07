import { PDFDocument } from "pdf-lib";
import { PageRange } from "./pdfTypes";

export type RangeValidationErrorKey =
  | "invalidFormat"
  | "zeroPage"
  | "startGreaterThanEnd"
  | "pageOutOfBounds";

export type RangeValidationResult =
  | { valid: true; ranges: PageRange[]; errorKey: null; errorParams?: never }
  | {
      valid: false;
      ranges: null;
      errorKey: RangeValidationErrorKey;
      errorParams?: Record<string, string | number>;
    };

export function validateAndParsePageRanges(
  input: string,
  totalPages?: number | null
): RangeValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: true, ranges: [], errorKey: null };
  }

  if (trimmed.startsWith(",") || trimmed.endsWith(",")) {
    return { valid: false, ranges: null, errorKey: "invalidFormat" };
  }

  const rawSegments = trimmed.split(",");
  const ranges: PageRange[] = [];

  for (const rawSeg of rawSegments) {
    const seg = rawSeg.trim();
    if (!seg) {
      return { valid: false, ranges: null, errorKey: "invalidFormat" };
    }

    if (/^\d+$/.test(seg)) {
      const num = parseInt(seg, 10);
      if (num < 1) {
        return { valid: false, ranges: null, errorKey: "zeroPage" };
      }
      if (totalPages != null && totalPages > 0 && num > totalPages) {
        return {
          valid: false,
          ranges: null,
          errorKey: "pageOutOfBounds",
          errorParams: { total: totalPages },
        };
      }
      ranges.push({ start: num, end: num });
      continue;
    }

    const match = seg.match(/^(\d+)\s*-\s*(\d+)$/);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);

      if (start < 1 || end < 1) {
        return { valid: false, ranges: null, errorKey: "zeroPage" };
      }
      if (start > end) {
        return { valid: false, ranges: null, errorKey: "startGreaterThanEnd" };
      }
      if (totalPages != null && totalPages > 0 && (start > totalPages || end > totalPages)) {
        return {
          valid: false,
          ranges: null,
          errorKey: "pageOutOfBounds",
          errorParams: { total: totalPages },
        };
      }

      ranges.push({ start, end });
      continue;
    }

    return { valid: false, ranges: null, errorKey: "invalidFormat" };
  }

  return { valid: true, ranges, errorKey: null };
}

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

  const effectiveRanges: PageRange[] =
    ranges.length === 0
      ? Array.from({ length: totalPages }, (_, k) => ({ start: k + 1, end: k + 1 }))
      : ranges;

  for (let i = 0; i < effectiveRanges.length; i++) {
    const { start, end } = effectiveRanges[i];
    if (start < 1 || end > totalPages || start > end) {
      throw new Error(`Invalid page range ${start}-${end}. PDF has ${totalPages} pages.`);
    }

    const doc = await PDFDocument.create();
    const indices = Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k);
    const pages = await doc.copyPages(src, indices);
    pages.forEach((page) => doc.addPage(page));

    const name =
      effectiveRanges.length === 1
        ? `${file.name.replace(/\.pdf$/i, "")}_pages_${start}-${end}.pdf`
        : `part_${i + 1}_pages_${start}-${end}.pdf`;

    results.push({ name, bytes: await doc.save() });
  }

  return results;
}

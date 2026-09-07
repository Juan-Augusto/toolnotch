import { validatePdfFilename } from "@/lib/imageToPdf";

describe("validatePdfFilename", () => {
  test("allows empty or whitespace-only filename (optional field)", () => {
    expect(validatePdfFilename("")).toEqual({ valid: true, errorKey: null });
    expect(validatePdfFilename("   ")).toEqual({ valid: true, errorKey: null });
  });

  test("allows valid filenames without extension", () => {
    expect(validatePdfFilename("document")).toEqual({ valid: true, errorKey: null });
    expect(validatePdfFilename("my_photos-2026")).toEqual({ valid: true, errorKey: null });
    expect(validatePdfFilename("invoice 123")).toEqual({ valid: true, errorKey: null });
  });

  test("allows valid filenames with .pdf extension (case-insensitive)", () => {
    expect(validatePdfFilename("document.pdf")).toEqual({ valid: true, errorKey: null });
    expect(validatePdfFilename("document.PDF")).toEqual({ valid: true, errorKey: null });
    expect(validatePdfFilename("my.report.pdf")).toEqual({ valid: true, errorKey: null });
    expect(validatePdfFilename("photo-1.2.3.Pdf")).toEqual({ valid: true, errorKey: null });
  });

  test("rejects invalid extensions (e.g. non-pdf formats)", () => {
    const invalidFormats = [
      "image.jpg",
      "image.jpeg",
      "image.png",
      "document.txt",
      "archive.zip",
      "doc.docx",
      "data.csv",
      "test.1",
    ];

    for (const input of invalidFormats) {
      const result = validatePdfFilename(input);
      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe("invalidFilename");
    }
  });

  test("rejects forbidden filename characters", () => {
    const forbidden = [
      "doc/test",
      "doc\\test",
      "doc:test",
      "doc*test",
      "doc?test",
      'doc"test',
      "doc<test>",
      "doc|test",
    ];

    for (const input of forbidden) {
      const result = validatePdfFilename(input);
      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe("invalidFilename");
    }
  });

  test("rejects trailing dot, lone dot, or missing base name before .pdf", () => {
    const malformed = [
      ".",
      "..",
      "doc.",
      "my_file.",
      ".pdf",
      " .pdf",
      "..pdf",
    ];

    for (const input of malformed) {
      const result = validatePdfFilename(input);
      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe("invalidFilename");
    }
  });
});

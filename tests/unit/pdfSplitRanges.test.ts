import { validateAndParsePageRanges, splitPDF } from "@/lib/pdfSplit";
import { PDFDocument } from "pdf-lib";

describe("validateAndParsePageRanges", () => {
  test("allows empty or blank input and returns empty ranges array", () => {
    expect(validateAndParsePageRanges("")).toEqual({
      valid: true,
      ranges: [],
      errorKey: null,
    });
    expect(validateAndParsePageRanges("   ")).toEqual({
      valid: true,
      ranges: [],
      errorKey: null,
    });
  });

  test("parses single page numbers", () => {
    expect(validateAndParsePageRanges("5")).toEqual({
      valid: true,
      ranges: [{ start: 5, end: 5 }],
      errorKey: null,
    });
    expect(validateAndParsePageRanges(" 1 ")).toEqual({
      valid: true,
      ranges: [{ start: 1, end: 1 }],
      errorKey: null,
    });
  });

  test("parses ranges with hyphens and varying whitespace", () => {
    expect(validateAndParsePageRanges("1-3")).toEqual({
      valid: true,
      ranges: [{ start: 1, end: 3 }],
      errorKey: null,
    });
    expect(validateAndParsePageRanges("  2  -  5  ")).toEqual({
      valid: true,
      ranges: [{ start: 2, end: 5 }],
      errorKey: null,
    });
  });

  test("parses multiple comma-separated ranges and single pages", () => {
    expect(validateAndParsePageRanges("1-3, 5, 7 - 10")).toEqual({
      valid: true,
      ranges: [
        { start: 1, end: 3 },
        { start: 5, end: 5 },
        { start: 7, end: 10 },
      ],
      errorKey: null,
    });
  });

  test("rejects malformed format strings", () => {
    const invalidInputs = [
      "abc",
      "1-3-5",
      "1,",
      ",1",
      "1,,3",
      "1, ,3",
      "-3",
      "3-",
      "-",
      "1-a",
      "1.5",
      "1..3",
    ];

    for (const input of invalidInputs) {
      const result = validateAndParsePageRanges(input);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errorKey).toBe("invalidFormat");
      }
    }
  });

  test("rejects 0 or negative page numbers", () => {
    const zeroInputs = ["0", "0-3", "1-0"];
    for (const input of zeroInputs) {
      const result = validateAndParsePageRanges(input);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errorKey).toBe("zeroPage");
      }
    }
  });

  test("rejects ranges where start is greater than end", () => {
    const result = validateAndParsePageRanges("5-2");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errorKey).toBe("startGreaterThanEnd");
    }
  });

  test("validates against totalPages when provided", () => {
    const totalPages = 5;

    // Within bounds
    expect(validateAndParsePageRanges("1-5", totalPages)).toEqual({
      valid: true,
      ranges: [{ start: 1, end: 5 }],
      errorKey: null,
    });
    expect(validateAndParsePageRanges("5", totalPages)).toEqual({
      valid: true,
      ranges: [{ start: 5, end: 5 }],
      errorKey: null,
    });

    // Out of bounds single number
    const outResult1 = validateAndParsePageRanges("6", totalPages);
    expect(outResult1.valid).toBe(false);
    if (!outResult1.valid) {
      expect(outResult1.errorKey).toBe("pageOutOfBounds");
      expect(outResult1.errorParams).toEqual({ total: 5 });
    }

    // Out of bounds range end
    const outResult2 = validateAndParsePageRanges("1-10", totalPages);
    expect(outResult2.valid).toBe(false);
    if (!outResult2.valid) {
      expect(outResult2.errorKey).toBe("pageOutOfBounds");
      expect(outResult2.errorParams).toEqual({ total: 5 });
    }

    // Out of bounds range start
    const outResult3 = validateAndParsePageRanges("7-10", totalPages);
    expect(outResult3.valid).toBe(false);
    if (!outResult3.valid) {
      expect(outResult3.errorKey).toBe("pageOutOfBounds");
      expect(outResult3.errorParams).toEqual({ total: 5 });
    }
  });
});

describe("splitPDF", () => {
  async function createTestPDF(numPages: number): Promise<File> {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < numPages; i++) {
      pdfDoc.addPage([200, 200]);
    }
    const pdfBytes = await pdfDoc.save();
    const file = new File([pdfBytes], "document.pdf", {
      type: "application/pdf",
    });
    file.arrayBuffer = async () => pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
    return file;
  }

  test("splits every page individually when ranges is empty", async () => {
    const testFile = await createTestPDF(3);
    const results = await splitPDF(testFile, []);

    expect(results).toHaveLength(3);
    expect(results[0].name).toBe("part_1_pages_1-1.pdf");
    expect(results[1].name).toBe("part_2_pages_2-2.pdf");
    expect(results[2].name).toBe("part_3_pages_3-3.pdf");
  });

  test("extracts specified custom range", async () => {
    const testFile = await createTestPDF(4);
    const results = await splitPDF(testFile, [{ start: 2, end: 3 }]);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("document_pages_2-3.pdf");
  });

  test("throws error if range is out of bounds", async () => {
    const testFile = await createTestPDF(3);
    await expect(splitPDF(testFile, [{ start: 1, end: 5 }])).rejects.toThrow(
      "Invalid page range 1-5. PDF has 3 pages."
    );
  });
});

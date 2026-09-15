import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JpgToPdfTool from "@/app/[locale]/tools/pdf/jpg-to-pdf/JpgToPdfTool";
import { saveAs } from "file-saver";

jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, string | number>) => {
      let text = `${namespace}.${key}`;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    };
  },
}));

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

jest.mock("@/lib/imageToPdf", () => {
  const actual = jest.requireActual("@/lib/imageToPdf");
  return {
    ...actual,
    imagesToPDF: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
  };
});

describe("JpgToPdfTool Integration", () => {
  const defaultProps = {
    title: "JPG to PDF",
    description: "Convert images to PDF",
    faqs: [],
    locale: "pt",
  };

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-preview");
    global.URL.revokeObjectURL = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dropzone, badges, and convert button initially disabled", () => {
    render(<JpgToPdfTool {...defaultProps} />);

    expect(screen.getByText("Sem upload para servidores")).toBeInTheDocument();
    expect(screen.getByText("Suporta JPG, PNG & JPEG")).toBeInTheDocument();
    expect(screen.getByText("Ilimitado & Gratuito")).toBeInTheDocument();

    expect(screen.getByText("pdf.jpgToPdf.dropZone.label")).toBeInTheDocument();
    expect(screen.getByText("pdf.jpgToPdf.dropZone.hint")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /pdf\.jpgToPdf\.button\.convert/i });
    expect(button).toBeDisabled();
    expect(screen.queryByPlaceholderText("pdf.jpgToPdf.filename.placeholder")).not.toBeInTheDocument();
  });

  test("shows file list and custom filename input when images are uploaded", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image"], "photo1.jpg", { type: "image/jpeg" });
    const file2 = new File(["fake-image2"], "photo2.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    expect(screen.getByText("photo1.jpg")).toBeInTheDocument();
    expect(screen.getByText("photo2.png")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("pdf.jpgToPdf.filename.placeholder")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /pdf\.jpgToPdf\.button\.convert/i });
    expect(button).not.toBeDisabled();
  });

  test("does not duplicate images when adding another image sequentially", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image1"], "photo1.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file1] } });

    expect(screen.getAllByText("photo1.jpg")).toHaveLength(1);

    // Select second file sequentially
    const file2 = new File(["fake-image2"], "photo2.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file2] } });

    expect(screen.getAllByText("photo1.jpg")).toHaveLength(1);
    expect(screen.getAllByText("photo2.png")).toHaveLength(1);
  });

  test("removes an image when remove button is clicked", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image"], "photo1.jpg", { type: "image/jpeg" });
    const file2 = new File(["fake-image2"], "photo2.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });
    expect(screen.getByText("photo1.jpg")).toBeInTheDocument();
    expect(screen.getByText("photo2.png")).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button", { name: "Remover imagem" });
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText("photo1.jpg")).not.toBeInTheDocument();
    expect(screen.getByText("photo2.png")).toBeInTheDocument();
  });

  test("converts with default filename and downloads upon clicking download button", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file1] } });

    const button = screen.getByRole("button", { name: /pdf\.jpgToPdf\.button\.convert/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("PDF Criado com Sucesso!")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Baixar PDF" })).toBeInTheDocument();
    });

    expect(saveAs).not.toHaveBeenCalled();

    const downloadBtn = screen.getByRole("button", { name: "Baixar PDF" });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledTimes(1);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "images.pdf");
  });

  test("converts with custom filename and appends .pdf extension if missing", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file1] } });

    const filenameInput = screen.getByPlaceholderText("pdf.jpgToPdf.filename.placeholder");
    fireEvent.change(filenameInput, { target: { value: "my-custom-doc" } });

    const button = screen.getByRole("button", { name: /pdf\.jpgToPdf\.button\.convert/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("PDF Criado com Sucesso!")).toBeInTheDocument();
    });

    const downloadBtn = screen.getByRole("button", { name: "Baixar PDF" });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "my-custom-doc.pdf");
  });

  test("converts with custom filename without double .pdf if already provided", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file1] } });

    const filenameInput = screen.getByPlaceholderText("pdf.jpgToPdf.filename.placeholder");
    fireEvent.change(filenameInput, { target: { value: "report.pdf" } });

    const button = screen.getByRole("button", { name: /pdf\.jpgToPdf\.button\.convert/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("PDF Criado com Sucesso!")).toBeInTheDocument();
    });

    const downloadBtn = screen.getByRole("button", { name: "Baixar PDF" });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "report.pdf");
  });

  test("resets tool when reset button is clicked", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file1] } });

    const button = screen.getByRole("button", { name: /pdf\.jpgToPdf\.button\.convert/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("PDF Criado com Sucesso!")).toBeInTheDocument();
    });

    const resetBtn = screen.getByRole("button", { name: "Converter outras imagens" });
    fireEvent.click(resetBtn);

    expect(screen.queryByText("PDF Criado com Sucesso!")).not.toBeInTheDocument();
    expect(screen.getByText("pdf.jpgToPdf.dropZone.label")).toBeInTheDocument();
  });

  test("displays error and disables convert button when filename has invalid format", async () => {
    const { container } = render(<JpgToPdfTool {...defaultProps} />);

    const fileInput = container.querySelector("#imgpdf-file-input") as HTMLInputElement;
    const file1 = new File(["fake-image"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file1] } });

    const filenameInput = screen.getByPlaceholderText("pdf.jpgToPdf.filename.placeholder");
    const button = screen.getByRole("button", { name: /pdf\.jpgToPdf\.button\.convert/i });

    expect(button).not.toBeDisabled();

    // Type invalid format (e.g. .jpg extension)
    fireEvent.change(filenameInput, { target: { value: "my-document.jpg" } });

    expect(screen.getByText("pdf.jpgToPdf.errors.invalidFilename")).toBeInTheDocument();
    expect(filenameInput).toHaveAttribute("aria-invalid", "true");
    expect(button).toBeDisabled();

    // Type invalid character (e.g. slash)
    fireEvent.change(filenameInput, { target: { value: "invalid/name" } });
    expect(screen.getByText("pdf.jpgToPdf.errors.invalidFilename")).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Fix to valid format
    fireEvent.change(filenameInput, { target: { value: "valid-name.pdf" } });
    expect(screen.queryByText("pdf.jpgToPdf.errors.invalidFilename")).not.toBeInTheDocument();
    expect(filenameInput).toHaveAttribute("aria-invalid", "false");
    expect(button).not.toBeDisabled();
  });
});

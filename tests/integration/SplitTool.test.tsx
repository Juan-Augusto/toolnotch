import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SplitTool from "@/app/[locale]/tools/pdf/split-pdf/SplitTool";
import { splitPDF } from "@/lib/pdfSplit";
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

jest.mock("@/lib/pdfSplit", () => {
  const actual = jest.requireActual("@/lib/pdfSplit");
  return {
    ...actual,
    splitPDF: jest.fn(),
  };
});

jest.mock("pdf-lib", () => ({
  PDFDocument: {
    load: jest.fn().mockResolvedValue({
      getPageCount: () => 5,
    }),
  },
}));

describe("SplitTool Integration", () => {
  const defaultProps = {
    title: "Split PDF",
    description: "Split PDF description",
    faqs: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with breadcrumb, heading, badges, and disabled split button initially", () => {
    render(<SplitTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Split PDF" })).toBeInTheDocument();
    expect(screen.getByText("Sem upload para servidores")).toBeInTheDocument();
    expect(screen.getByText("Extração precisa de páginas")).toBeInTheDocument();
    expect(screen.getByText("Ilimitado & Gratuito")).toBeInTheDocument();

    const splitBtn = screen.getByRole("button", { name: /pdf\.split\.button\.split/i });
    expect(splitBtn).toBeDisabled();
    expect(screen.queryByText(/pdf\.split\.errors/i)).not.toBeInTheDocument();
  });

  test("shows validation error when invalid range is typed", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "abc" } });

    expect(screen.getByText("pdf.split.errors.invalidFormat")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");

    const splitBtn = screen.getByRole("button", { name: /pdf\.split\.button\.split/i });
    expect(splitBtn).toBeDisabled();
  });

  test("shows error when start page is greater than end page", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "5-2" } });

    expect(screen.getByText("pdf.split.errors.startGreaterThanEnd")).toBeInTheDocument();
  });

  test("shows error when page is 0", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "0" } });

    expect(screen.getByText("pdf.split.errors.zeroPage")).toBeInTheDocument();
  });

  test("clears error and remains valid when user clears input or provides valid range", () => {
    render(<SplitTool {...defaultProps} />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");
    fireEvent.change(input, { target: { value: "invalid" } });
    expect(screen.getByText("pdf.split.errors.invalidFormat")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "1-3, 5" } });
    expect(screen.queryByText("pdf.split.errors.invalidFormat")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "false");

    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByText(/pdf\.split\.errors/i)).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  test("renders formatting examples guide", () => {
    render(<SplitTool {...defaultProps} />);

    expect(screen.getByText("pdf.split.examples.title")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.empty.label")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.empty.desc")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.single.desc")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.range.desc")).toBeInTheDocument();
    expect(screen.getByText("pdf.split.examples.combined.desc")).toBeInTheDocument();
  });

  test("displays live extraction summary for single page, range, and combined ranges", () => {
    render(<SplitTool {...defaultProps} locale="pt" />);

    const input = screen.getByPlaceholderText("pdf.split.pageRanges.placeholder");

    fireEvent.change(input, { target: { value: "5" } });
    expect(screen.getByText("Você vai extrair a página 5.")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "5, 2-4" } });
    expect(
      screen.getByText("Você vai extrair a página 5 e o intervalo 2 a 4.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "1-3, 5, 8-10" } });
    expect(
      screen.getByText(
        "Você vai extrair o intervalo 1 a 3, a página 5 e o intervalo 8 a 10."
      )
    ).toBeInTheDocument();
  });

  test("does not download automatically upon split, but downloads when user clicks download button", async () => {
    (splitPDF as jest.Mock).mockResolvedValue([
      { name: "sample_page_1.pdf", bytes: new Uint8Array(100) },
    ]);

    const { container } = render(<SplitTool {...defaultProps} locale="pt" />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(500)], "sample.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(500));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    await waitFor(() => {
      expect(screen.getByText("PDF:")).toBeInTheDocument();
    });

    const splitBtn = screen.getByRole("button", { name: /pdf\.split\.button\.split/i });
    expect(splitBtn).not.toBeDisabled();

    fireEvent.click(splitBtn);

    await waitFor(() => {
      expect(screen.getByText("PDF Dividido com Sucesso!")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Baixar PDF" })).toBeInTheDocument();
    });

    expect(saveAs).not.toHaveBeenCalled();

    const downloadBtn = screen.getByRole("button", { name: "Baixar PDF" });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledTimes(1);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "sample_page_1.pdf");
  });

  test("renders individual file cards when split yields multiple files and allows downloading single parts", async () => {
    (splitPDF as jest.Mock).mockResolvedValue([
      { name: "part_1_pages_1-2.pdf", bytes: new Uint8Array(100) },
      { name: "part_2_pages_3-5.pdf", bytes: new Uint8Array(150) },
    ]);

    const { container } = render(<SplitTool {...defaultProps} locale="pt" />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(500)], "multi.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(500));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    await waitFor(() => {
      expect(screen.getByText("PDF:")).toBeInTheDocument();
    });

    const splitBtn = screen.getByRole("button", { name: /pdf\.split\.button\.split/i });
    fireEvent.click(splitBtn);

    await waitFor(() => {
      expect(screen.getByText("Arquivos Extraídos Separados")).toBeInTheDocument();
      expect(screen.getByText("part_1_pages_1-2.pdf")).toBeInTheDocument();
      expect(screen.getByText("part_2_pages_3-5.pdf")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Baixar Arquivos (ZIP)" })).toBeInTheDocument();
    });

    const individualDownloadBtns = screen.getAllByRole("button", { name: "Baixar PDF" });
    expect(individualDownloadBtns).toHaveLength(2);

    fireEvent.click(individualDownloadBtns[0]);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "part_1_pages_1-2.pdf");

    const zipBtn = screen.getByRole("button", { name: "Baixar Arquivos (ZIP)" });
    fireEvent.click(zipBtn);
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "multi_split.zip");
  });
});

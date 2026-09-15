import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PdfToTextTool from "@/app/[locale]/tools/pdf/pdf-to-text/PdfToTextTool";
import { extractTextFromPdf } from "@/lib/pdfToText";
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

jest.mock("@/lib/pdfToText", () => ({
  extractTextFromPdf: jest.fn(),
}));

describe("PdfToTextTool Integration", () => {
  const defaultProps = {
    title: "PDF para Texto",
    description: "Converta documentos PDF em texto puro legível",
    faqs: [
      {
        question: "Como funciona a extração?",
        answer: "Lê a camada de texto nativa do PDF.",
      },
    ],
    richContent: {
      whatIs: "Conversão de texto de arquivos PDF.",
      howToUse: ["Selecione o arquivo", "Aguarde a extração", "Copie ou baixe o texto"],
      whyItMatters: "Permite reaproveitar texto facilmente.",
      proTip: "Use o modo por página para trechos pontuais.",
    },
    locale: "pt",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial breadcrumbs, badges, and dropzone", () => {
    render(<PdfToTextTool {...defaultProps} />);

    expect(screen.getByRole("heading", { level: 1, name: /PDF para Texto/i })).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToText.badges.noUpload")).toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToText.dropZone.label")).toBeInTheDocument();
  });

  test("extracts text from PDF and displays results with stats", async () => {
    (extractTextFromPdf as jest.Mock).mockResolvedValueOnce({
      fullText: "Hello world from PDF.\nThis is a second line.",
      pageTexts: ["Hello world from PDF.\nThis is a second line."],
      totalPages: 1,
      wordCount: 8,
      charCount: 44,
    });

    const { container } = render(<PdfToTextTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "artigo.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    expect(await screen.findByText("artigo.pdf")).toBeInTheDocument();

    const extractBtn = screen.getByText("pdf.pdfToText.button.extract");
    fireEvent.click(extractBtn);

    await waitFor(() => {
      expect(extractTextFromPdf).toHaveBeenCalledWith(sampleFile, expect.any(Function));
    });

    expect(await screen.findByText(/Hello world from PDF/i)).toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToText.stats.pages")).toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToText.stats.words")).toBeInTheDocument();
  });

  test("downloads txt file from results", async () => {
    (extractTextFromPdf as jest.Mock).mockResolvedValueOnce({
      fullText: "Sample extracted content",
      pageTexts: ["Sample extracted content"],
      totalPages: 1,
      wordCount: 3,
      charCount: 24,
    });

    const { container } = render(<PdfToTextTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "documento.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const extractBtn = await screen.findByText("pdf.pdfToText.button.extract");
    fireEvent.click(extractBtn);

    expect(await screen.findByText("Sample extracted content")).toBeInTheDocument();

    const downloadBtns = screen.getAllByText("pdf.pdfToText.button.downloadTxt");
    fireEvent.click(downloadBtns[0]);

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "documento_texto.txt");
  });

  test("switches between full text and by-page tabs using AppTabs", async () => {
    (extractTextFromPdf as jest.Mock).mockResolvedValueOnce({
      fullText: "--- Page 1 ---\nPage one text\n\n--- Page 2 ---\nPage two text",
      pageTexts: ["Page one text", "Page two text"],
      totalPages: 2,
      wordCount: 6,
      charCount: 60,
    });

    const { container } = render(<PdfToTextTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "documento.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const extractBtn = await screen.findByText("pdf.pdfToText.button.extract");
    fireEvent.click(extractBtn);

    const fullTab = await screen.findByRole("tab", { name: /pdf\.pdfToText\.tabs\.full/i });
    const byPageTab = screen.getByRole("tab", { name: /pdf\.pdfToText\.tabs\.byPage/i });

    expect(fullTab).toHaveAttribute("aria-selected", "true");
    expect(byPageTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(byPageTab);

    expect(byPageTab).toHaveAttribute("aria-selected", "true");
    expect(fullTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("Pág. 1")).toBeInTheDocument();
    expect(screen.getByText("Pág. 2")).toBeInTheDocument();
    expect(screen.getByText("Page one text")).toBeInTheDocument();
  });

  test("resets tool state when clicking converter outro PDF", async () => {
    (extractTextFromPdf as jest.Mock).mockResolvedValueOnce({
      fullText: "Sample text to reset",
      pageTexts: ["Sample text to reset"],
      totalPages: 1,
      wordCount: 4,
      charCount: 20,
    });

    const { container } = render(<PdfToTextTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "artigo.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const extractBtn = await screen.findByText("pdf.pdfToText.button.extract");
    fireEvent.click(extractBtn);

    expect(await screen.findByText("Sample text to reset")).toBeInTheDocument();

    const resetBtn = screen.getByRole("button", { name: "pdf.pdfToText.button.reset" });
    fireEvent.click(resetBtn);

    expect(screen.queryByText("Sample text to reset")).not.toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToText.dropZone.label")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PdfToJpgTool from "@/app/[locale]/tools/pdf/pdf-to-jpg/PdfToJpgTool";
import { pdfToImages } from "@/lib/pdfToImage";
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

jest.mock("@/lib/pdfToImage", () => ({
  pdfToImages: jest.fn(),
}));

jest.mock("pdf-lib", () => ({
  PDFDocument: {
    load: jest.fn().mockResolvedValue({
      getPageCount: () => 2,
    }),
  },
}));

describe("PdfToJpgTool Integration", () => {
  const defaultProps = {
    title: "PDF para JPG",
    description: "Converta cada página em imagem",
    faqs: [
      {
        question: "Qual o formato de imagem gerado?",
        answer: "As páginas são convertidas em JPEG.",
      },
    ],
    richContent: {
      whatIs: "Conversão de páginas PDF em imagens.",
      howToUse: ["Selecione o arquivo", "Converta para JPG", "Baixe as imagens"],
      whyItMatters: "Permite compartilhar páginas facilmente.",
      proTip: "Tudo roda no navegador.",
    },
    locale: "pt",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders breadcrumb, heading, badges, dropzone, and disabled convert button initially", () => {
    render(<PdfToJpgTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "PDF para JPG" })
    ).toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToJpg.badges.noUpload")).toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToJpg.badges.quality")).toBeInTheDocument();
    expect(screen.getByText("pdf.pdfToJpg.badges.free")).toBeInTheDocument();

    const convertBtn = screen.getByRole("button", {
      name: /pdf\.pdfToJpg\.button\.convert/i,
    });
    expect(convertBtn).toBeDisabled();
  });

  test("displays detected page count when a PDF file is selected", async () => {
    const { container } = render(<PdfToJpgTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "document.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    expect(await screen.findByText("PDF:")).toBeInTheDocument();
    expect(screen.getByText(/2 pdf\.pdfToJpg\.pageCountPlural/i)).toBeInTheDocument();

    const convertBtn = screen.getByRole("button", {
      name: /pdf\.pdfToJpg\.button\.convert/i,
    });
    expect(convertBtn).not.toBeDisabled();
    expect(screen.getByText("pdf.pdfToJpg.button.clearFile")).toBeInTheDocument();
  });

  test("converts multi-page PDF, renders result screen, and downloads ZIP package", async () => {
    (pdfToImages as jest.Mock).mockResolvedValue([
      { name: "doc_page_1.jpg", dataUrl: "data:image/jpeg;base64,dGVzdDE=" },
      { name: "doc_page_2.jpg", dataUrl: "data:image/jpeg;base64,dGVzdDI=" },
    ]);

    const { container } = render(<PdfToJpgTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "doc.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const convertBtn = screen.getByRole("button", {
      name: /pdf\.pdfToJpg\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(pdfToImages).toHaveBeenCalledWith(sampleFile, 2, expect.any(Function));
      expect(screen.getByText("pdf.pdfToJpg.result.title")).toBeInTheDocument();
      expect(screen.getByText("pdf.pdfToJpg.result.pagesConverted")).toBeInTheDocument();
      expect(screen.getByText("pdf.pdfToJpg.result.format")).toBeInTheDocument();
      expect(screen.getByText("pdf.pdfToJpg.result.package")).toBeInTheDocument();
      expect(screen.getByText("doc_page_1.jpg")).toBeInTheDocument();
      expect(screen.getByText("doc_page_2.jpg")).toBeInTheDocument();
    });

    const downloadZipBtn = screen.getByRole("button", {
      name: /pdf\.pdfToJpg\.button\.downloadZip/i,
    });
    fireEvent.click(downloadZipBtn);

    await waitFor(() => {
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "doc_images.zip");
    });
  });

  test("allows downloading an individual page from its preview card", async () => {
    (pdfToImages as jest.Mock).mockResolvedValue([
      { name: "doc_page_1.jpg", dataUrl: "data:image/jpeg;base64,dGVzdDE=" },
      { name: "doc_page_2.jpg", dataUrl: "data:image/jpeg;base64,dGVzdDI=" },
    ]);

    const { container } = render(<PdfToJpgTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "doc.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const convertBtn = screen.getByRole("button", {
      name: /pdf\.pdfToJpg\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText("doc_page_1.jpg")).toBeInTheDocument();
    });

    const downloadPageButtons = screen.getAllByRole("button", {
      name: "pdf.pdfToJpg.button.downloadPage",
    });
    fireEvent.click(downloadPageButtons[0]);

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "doc_page_1.jpg");
  });

  test("handles single-page PDF conversion and downloads single JPG", async () => {
    (pdfToImages as jest.Mock).mockResolvedValue([
      { name: "single_page_1.jpg", dataUrl: "data:image/jpeg;base64,dGVzdDE=" },
    ]);

    const { container } = render(<PdfToJpgTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "single.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const convertBtn = screen.getByRole("button", {
      name: /pdf\.pdfToJpg\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText("pdf.pdfToJpg.button.downloadOne")).toBeInTheDocument();
    });

    const downloadOneBtn = screen.getByRole("button", {
      name: "pdf.pdfToJpg.button.downloadOne",
    });
    fireEvent.click(downloadOneBtn);

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "single_page_1.jpg");
  });

  test("allows resetting and converting another file", async () => {
    (pdfToImages as jest.Mock).mockResolvedValue([
      { name: "doc_page_1.jpg", dataUrl: "data:image/jpeg;base64,dGVzdDE=" },
    ]);

    const { container } = render(<PdfToJpgTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "doc.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const convertBtn = screen.getByRole("button", {
      name: /pdf\.pdfToJpg\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText("pdf.pdfToJpg.button.reset")).toBeInTheDocument();
    });

    const resetBtn = screen.getByRole("button", {
      name: "pdf.pdfToJpg.button.reset",
    });
    fireEvent.click(resetBtn);

    expect(
      screen.getByRole("button", { name: /pdf\.pdfToJpg\.button\.convert/i })
    ).toBeDisabled();
    expect(screen.queryByText("pdf.pdfToJpg.result.title")).not.toBeInTheDocument();
  });

  test("renders rich content and FAQ accordion correctly", () => {
    render(<PdfToJpgTool {...defaultProps} />);

    expect(screen.getByText("O que é Conversão de PDF para JPG?")).toBeInTheDocument();
    expect(screen.getByText("Conversão de páginas PDF em imagens.")).toBeInTheDocument();
    expect(screen.getByText("Como Usar")).toBeInTheDocument();
    expect(screen.getByText("Selecione o arquivo")).toBeInTheDocument();
    expect(screen.getByText("Por que Isso Importa")).toBeInTheDocument();
    expect(screen.getByText("Permite compartilhar páginas facilmente.")).toBeInTheDocument();
    expect(screen.getByText("Dica Pro")).toBeInTheDocument();
    expect(screen.getByText("Tudo roda no navegador.")).toBeInTheDocument();
    expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
    expect(screen.getByText("Qual o formato de imagem gerado?")).toBeInTheDocument();
  });
});

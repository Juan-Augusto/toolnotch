import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExtractPdfImagesTool from "@/app/[locale]/tools/pdf/extract-pdf-images/ExtractPdfImagesTool";
import { extractImagesFromPdf } from "@/lib/pdfExtractImages";
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

jest.mock("@/lib/pdfExtractImages", () => ({
  extractImagesFromPdf: jest.fn(),
}));

describe("ExtractPdfImagesTool Integration", () => {
  const defaultProps = {
    title: "Extrair Imagens do PDF",
    description: "Isole todas as imagens contidas no seu PDF",
    faqs: [
      {
        question: "Qual a qualidade das imagens?",
        answer: "A resolução original nativa.",
      },
    ],
    richContent: {
      whatIs: "Extração de imagens embutidas em PDFs.",
      howToUse: ["Selecione o arquivo", "Aguarde a varredura", "Baixe as imagens"],
      whyItMatters: "Evita perdas de qualidade com capturas de tela.",
      proTip: "Baixe todas de uma vez em ZIP.",
    },
    locale: "pt",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial breadcrumbs, badges, and dropzone", () => {
    render(<ExtractPdfImagesTool {...defaultProps} />);

    expect(screen.getByRole("heading", { level: 1, name: /Extrair Imagens do PDF/i })).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(screen.getByText("pdf.extractImages.badges.noUpload")).toBeInTheDocument();
    expect(screen.getByText("pdf.extractImages.dropZone.label")).toBeInTheDocument();
  });

  test("extracts images and renders gallery with download buttons", async () => {
    const fakeBlob1 = new Blob(["fake png 1"], { type: "image/png" });
    const fakeBlob2 = new Blob(["fake png 2"], { type: "image/png" });

    (extractImagesFromPdf as jest.Mock).mockResolvedValueOnce([
      {
        id: "1_1",
        name: "doc_p1_img1.png",
        dataUrl: "data:image/png;base64,img1",
        blob: fakeBlob1,
        width: 800,
        height: 600,
        size: 1024,
        page: 1,
        format: "png",
      },
      {
        id: "2_1",
        name: "doc_p2_img1.png",
        dataUrl: "data:image/png;base64,img2",
        blob: fakeBlob2,
        width: 1200,
        height: 900,
        size: 2048,
        page: 2,
        format: "png",
      },
    ]);

    const { container } = render(<ExtractPdfImagesTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "relatorio.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    expect(await screen.findByText("relatorio.pdf")).toBeInTheDocument();

    const extractBtn = screen.getByText("pdf.extractImages.button.extract");
    fireEvent.click(extractBtn);

    await waitFor(() => {
      expect(extractImagesFromPdf).toHaveBeenCalledWith(sampleFile, expect.any(Function));
    });

    expect(await screen.findByText("pdf.extractImages.result.title")).toBeInTheDocument();
    expect(screen.getByText("800 × 600 px")).toBeInTheDocument();
    expect(screen.getByText("1200 × 900 px")).toBeInTheDocument();

    const downloadSingleBtns = screen.getAllByText("pdf.extractImages.button.downloadImage");
    expect(downloadSingleBtns.length).toBe(2);
    fireEvent.click(downloadSingleBtns[0]);

    expect(saveAs).toHaveBeenCalledWith(fakeBlob1, "doc_p1_img1.png");
  });

  test("handles empty state when no images are found", async () => {
    (extractImagesFromPdf as jest.Mock).mockResolvedValueOnce([]);

    const { container } = render(<ExtractPdfImagesTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "texto_puro.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const extractBtn = await screen.findByText("pdf.extractImages.button.extract");
    fireEvent.click(extractBtn);

    expect(await screen.findByText("pdf.extractImages.empty.title")).toBeInTheDocument();
  });
});

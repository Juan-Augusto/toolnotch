import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CompressTool from "@/app/[locale]/tools/pdf/compress-pdf/CompressTool";
import { compressPDF } from "@/lib/pdfCompress";
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

jest.mock("@/lib/pdfCompress", () => ({
  compressPDF: jest.fn(),
}));

describe("CompressTool Integration", () => {
  const defaultProps = {
    title: "Comprimir PDF Online",
    description: "Reduza o tamanho do arquivo PDF",
    faqs: [
      {
        question: "Como funciona a compressão?",
        answer: "Otimiza a estrutura interna do PDF.",
      },
    ],
    richContent: {
      whatIs: "A compressão reduz o tamanho.",
      howToUse: ["Selecione o arquivo", "Clique em comprimir"],
      whyItMatters: "Economiza espaço.",
      proTip: "Tudo roda no navegador.",
    },
    locale: "pt",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders breadcrumb, title, dropzone, and disabled compress button", () => {
    render(<CompressTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Comprimir PDF Online" })).toBeInTheDocument();

    const compressButton = screen.getByRole("button", {
      name: /pdf\.compress\.button\.compress/i,
    });
    expect(compressButton).toBeDisabled();
    expect(screen.getByText("pdf.compress.dropZone.label")).toBeInTheDocument();
  });

  test("enables compress button when a PDF file is dropped/selected", async () => {
    const { container } = render(<CompressTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File(["sample pdf content"], "document.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    expect(screen.getByText("document.pdf")).toBeInTheDocument();
    const compressButton = screen.getByRole("button", {
      name: /pdf\.compress\.button\.compress/i,
    });
    expect(compressButton).not.toBeDisabled();
  });

  test("compresses file and shows reduction stats and download button", async () => {
    (compressPDF as jest.Mock).mockResolvedValue(new Uint8Array(50));

    const { container } = render(<CompressTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "sample.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const compressButton = screen.getByRole("button", {
      name: /pdf\.compress\.button\.compress/i,
    });
    fireEvent.click(compressButton);

    await waitFor(() => {
      expect(compressPDF).toHaveBeenCalledWith(sampleFile);
      expect(screen.getByText("pdf.compress.result.originalSize")).toBeInTheDocument();
      expect(screen.getByText("pdf.compress.result.compressedSize")).toBeInTheDocument();
      expect(screen.getByText("pdf.compress.result.reduction")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /pdf\.compress\.button\.download/i }),
      ).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole("button", {
      name: /pdf\.compress\.button\.download/i,
    });
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      "sample_compressed.pdf",
    );
  });

  test("allows resetting and compressing another file", async () => {
    (compressPDF as jest.Mock).mockResolvedValue(new Uint8Array(50));

    const { container } = render(<CompressTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "sample.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    const compressButton = screen.getByRole("button", {
      name: /pdf\.compress\.button\.compress/i,
    });
    fireEvent.click(compressButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Comprimir outro arquivo" }),
      ).toBeInTheDocument();
    });

    const resetButton = screen.getByRole("button", {
      name: "Comprimir outro arquivo",
    });
    fireEvent.click(resetButton);

    expect(
      screen.getByRole("button", { name: /pdf\.compress\.button\.compress/i }),
    ).toBeDisabled();
    expect(screen.queryByText("pdf.compress.result.originalSize")).not.toBeInTheDocument();
  });

  test("renders rich content and FAQ accordion correctly", () => {
    render(<CompressTool {...defaultProps} />);

    expect(screen.getByText("O que é Compressão de PDF?")).toBeInTheDocument();
    expect(screen.getByText("A compressão reduz o tamanho.")).toBeInTheDocument();
    expect(screen.getByText("Como Usar")).toBeInTheDocument();
    expect(screen.getByText("Selecione o arquivo")).toBeInTheDocument();
    expect(screen.getByText("Por que Isso Importa")).toBeInTheDocument();
    expect(screen.getByText("Economiza espaço.")).toBeInTheDocument();
    expect(screen.getByText("Dica Pro")).toBeInTheDocument();
    expect(screen.getByText("Tudo roda no navegador.")).toBeInTheDocument();
    expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
    expect(screen.getByText("Como funciona a compressão?")).toBeInTheDocument();
  });
});

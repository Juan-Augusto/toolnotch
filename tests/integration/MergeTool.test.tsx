import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MergeTool from "@/app/[locale]/tools/pdf/merge-pdf/MergeTool";
import { mergePDFs } from "@/lib/pdfMerge";
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

jest.mock("@/lib/pdfMerge", () => ({
  mergePDFs: jest.fn(),
}));

jest.mock("pdf-lib", () => ({
  PDFDocument: {
    load: jest.fn().mockResolvedValue({
      getPageCount: () => 3,
    }),
  },
}));

describe("MergeTool Integration", () => {
  const defaultProps = {
    title: "Mesclar Arquivos PDF Grátis",
    description: "Combine vários PDFs em um só.",
    faqs: [
      {
        question: "Como mesclo arquivos PDF?",
        answer: "Envie seus arquivos PDF e clique em Mesclar PDFs.",
      },
    ],
    richContent: {
      whatIs: "Mesclar PDF combina vários arquivos.",
      howToUse: ["Envie os arquivos", "Arraste para ordenar", "Clique em mesclar"],
      whyItMatters: "Facilita o envio de documentos.",
      proTip: "Tudo roda no navegador.",
    },
    locale: "pt",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders breadcrumb, heading, badges, dropzone, and disabled merge button initially", () => {
    render(<MergeTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Mesclar Arquivos PDF Grátis" })
    ).toBeInTheDocument();
    expect(screen.getByText("pdf.merge.badges.noUpload")).toBeInTheDocument();
    expect(screen.getByText("pdf.merge.badges.quality")).toBeInTheDocument();
    expect(screen.getByText("pdf.merge.badges.free")).toBeInTheDocument();

    const mergeButton = screen.getByRole("button", {
      name: /pdf\.merge\.button\.merge/i,
    });
    expect(mergeButton).toBeDisabled();
  });

  test("displays files and page counts when multiple PDFs are added", async () => {
    const { container } = render(<MergeTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file1 = new File([new ArrayBuffer(100)], "document1.pdf", {
      type: "application/pdf",
    });
    const file2 = new File([new ArrayBuffer(200)], "document2.pdf", {
      type: "application/pdf",
    });
    file1.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));
    file2.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(200));

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    expect(await screen.findByText("document1.pdf")).toBeInTheDocument();
    expect(await screen.findByText("document2.pdf")).toBeInTheDocument();

    const mergeButton = screen.getByRole("button", {
      name: /pdf\.merge\.button\.merge/i,
    });
    expect(mergeButton).not.toBeDisabled();
    expect(screen.getByText("pdf.merge.button.clearAll")).toBeInTheDocument();
  });

  test("validates custom filename and disables merge on invalid input", async () => {
    const { container } = render(<MergeTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file1 = new File([new ArrayBuffer(100)], "doc1.pdf", {
      type: "application/pdf",
    });
    const file2 = new File([new ArrayBuffer(100)], "doc2.pdf", {
      type: "application/pdf",
    });
    file1.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));
    file2.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    const filenameInput = await screen.findByPlaceholderText("pdf.merge.filename.placeholder");
    fireEvent.change(filenameInput, { target: { value: "invalid:name.pdf" } });

    expect(screen.getByText("pdf.merge.errors.invalidFilename")).toBeInTheDocument();

    const mergeButton = screen.getByRole("button", {
      name: /pdf\.merge\.button\.merge/i,
    });
    expect(mergeButton).toBeDisabled();

    fireEvent.change(filenameInput, { target: { value: "custom-merged.pdf" } });
    expect(screen.queryByText("pdf.merge.errors.invalidFilename")).not.toBeInTheDocument();
    expect(mergeButton).not.toBeDisabled();
  });

  test("merges files, displays results, and downloads with custom filename", async () => {
    (mergePDFs as jest.Mock).mockResolvedValue(new Uint8Array(400));

    const { container } = render(<MergeTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file1 = new File([new ArrayBuffer(100)], "doc1.pdf", {
      type: "application/pdf",
    });
    const file2 = new File([new ArrayBuffer(100)], "doc2.pdf", {
      type: "application/pdf",
    });
    file1.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));
    file2.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    const filenameInput = await screen.findByPlaceholderText("pdf.merge.filename.placeholder");
    fireEvent.change(filenameInput, { target: { value: "my-final-doc.pdf" } });

    const mergeButton = screen.getByRole("button", {
      name: /pdf\.merge\.button\.merge/i,
    });
    fireEvent.click(mergeButton);

    await waitFor(() => {
      expect(mergePDFs).toHaveBeenCalled();
      expect(screen.getByText("pdf.merge.result.title")).toBeInTheDocument();
      expect(screen.getByText("pdf.merge.result.filesMerged")).toBeInTheDocument();
      expect(screen.getByText("pdf.merge.result.totalPages")).toBeInTheDocument();
      expect(screen.getByText("pdf.merge.result.finalSize")).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole("button", {
      name: /pdf\.merge\.button\.download/i,
    });
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      "my-final-doc.pdf"
    );
  });

  test("allows resetting and merging new files", async () => {
    (mergePDFs as jest.Mock).mockResolvedValue(new Uint8Array(400));

    const { container } = render(<MergeTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file1 = new File([new ArrayBuffer(100)], "doc1.pdf", {
      type: "application/pdf",
    });
    const file2 = new File([new ArrayBuffer(100)], "doc2.pdf", {
      type: "application/pdf",
    });
    file1.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));
    file2.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    const mergeButton = await screen.findByRole("button", {
      name: /pdf\.merge\.button\.merge/i,
    });
    fireEvent.click(mergeButton);

    await waitFor(() => {
      expect(screen.getByText("pdf.merge.button.reset")).toBeInTheDocument();
    });

    const resetButton = screen.getByRole("button", {
      name: "pdf.merge.button.reset",
    });
    fireEvent.click(resetButton);

    expect(
      screen.getByRole("button", { name: /pdf\.merge\.button\.merge/i })
    ).toBeDisabled();
    expect(screen.queryByText("pdf.merge.result.title")).not.toBeInTheDocument();
  });

  test("renders rich content and FAQ accordion correctly", () => {
    render(<MergeTool {...defaultProps} />);

    expect(screen.getByText("O que é Mesclagem de PDF?")).toBeInTheDocument();
    expect(screen.getByText("Mesclar PDF combina vários arquivos.")).toBeInTheDocument();
    expect(screen.getByText("Como Usar")).toBeInTheDocument();
    expect(screen.getByText("Envie os arquivos")).toBeInTheDocument();
    expect(screen.getByText("Por que Isso Importa")).toBeInTheDocument();
    expect(screen.getByText("Facilita o envio de documentos.")).toBeInTheDocument();
    expect(screen.getByText("Dica Pro")).toBeInTheDocument();
    expect(screen.getByText("Tudo roda no navegador.")).toBeInTheDocument();
    expect(screen.getByText("Perguntas Frequentes")).toBeInTheDocument();
    expect(screen.getByText("Como mesclo arquivos PDF?")).toBeInTheDocument();
  });

  test("does not duplicate previous files when adding files one by one sequentially", async () => {
    const { container } = render(<MergeTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file1 = new File([new ArrayBuffer(100)], "first-document.pdf", {
      type: "application/pdf",
    });
    const file2 = new File([new ArrayBuffer(200)], "second-document.pdf", {
      type: "application/pdf",
    });
    file1.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));
    file2.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(200));

    // Add first file
    fireEvent.change(fileInput, { target: { files: [file1] } });
    expect(await screen.findByText("first-document.pdf")).toBeInTheDocument();
    expect(screen.getAllByText(/document\.pdf/).length).toBe(1);

    // Add second file sequentially
    fireEvent.change(fileInput, { target: { files: [file2] } });
    expect(await screen.findByText("second-document.pdf")).toBeInTheDocument();

    // Verify there are exactly 2 items, and first-document is NOT duplicated
    expect(screen.getAllByText("first-document.pdf").length).toBe(1);
    expect(screen.getAllByText("second-document.pdf").length).toBe(1);
    expect(screen.getAllByText(/document\.pdf/).length).toBe(2);
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeletePdfPagesTool from "@/app/[locale]/tools/pdf/delete-pdf-pages/DeletePdfPagesTool";
import { pdfToImages } from "@/lib/pdfToImage";
import { deletePdfPages } from "@/lib/pdfDeletePages";
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

jest.mock("@/lib/pdfDeletePages", () => {
  const actual = jest.requireActual("@/lib/pdfDeletePages");
  return {
    ...actual,
    deletePdfPages: jest.fn(),
  };
});

describe("DeletePdfPagesTool Integration", () => {
  const defaultProps = {
    title: "Remover Páginas do PDF",
    description: "Selecione as páginas que deseja remover",
    faqs: [
      {
        question: "Como seleciono as páginas?",
        answer: "Clique no card ou digite o intervalo.",
      },
    ],
    richContent: {
      whatIs: "Remoção de páginas de documentos PDF.",
      howToUse: ["Selecione o arquivo", "Marque as páginas", "Baixe o PDF"],
      whyItMatters: "Permite eliminar folhas indesejadas.",
      proTip: "Digite intervalos como 2-4.",
    },
    locale: "pt",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial breadcrumbs, badges, and dropzone", () => {
    render(<DeletePdfPagesTool {...defaultProps} />);

    expect(screen.getByRole("heading", { level: 1, name: /Remover Páginas do PDF/i })).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(screen.getByText("pdf.deletePages.badges.noUpload")).toBeInTheDocument();
    expect(screen.getByText("pdf.deletePages.dropZone.label")).toBeInTheDocument();
  });

  test("loads thumbnails on PDF selection and allows selecting pages via click", async () => {
    (pdfToImages as jest.Mock).mockResolvedValueOnce([
      { name: "p1.jpg", dataUrl: "data:image/jpeg;base64,img1" },
      { name: "p2.jpg", dataUrl: "data:image/jpeg;base64,img2" },
      { name: "p3.jpg", dataUrl: "data:image/jpeg;base64,img3" },
    ]);

    const { container } = render(<DeletePdfPagesTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "sample.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    await waitFor(() => {
      expect(pdfToImages).toHaveBeenCalledWith(sampleFile, 0.75, expect.any(Function));
    });

    expect(await screen.findByText("sample.pdf")).toBeInTheDocument();
    expect(screen.getAllByText("OK").length).toBe(3);

    const firstCard = screen.getAllByRole("button").find((btn) => btn.textContent?.includes("OK"));
    expect(firstCard).toBeDefined();
    if (firstCard) {
      fireEvent.click(firstCard);
    }

    expect(await screen.findByText("pdf.deletePages.card.marked")).toBeInTheDocument();
  });

  test("deletes selected page and downloads clean PDF", async () => {
    (pdfToImages as jest.Mock).mockResolvedValueOnce([
      { name: "p1.jpg", dataUrl: "data:image/jpeg;base64,img1" },
      { name: "p2.jpg", dataUrl: "data:image/jpeg;base64,img2" },
    ]);

    const fakeBytes = new Uint8Array([5, 6, 7, 8]);
    (deletePdfPages as jest.Mock).mockResolvedValueOnce(fakeBytes);

    const { container } = render(<DeletePdfPagesTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "documento.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    expect(await screen.findByText("documento.pdf")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText("OK").length).toBe(2);
    });

    const rangeInput = container.querySelector("#delete-pages-range-input") as HTMLInputElement;
    expect(rangeInput).toBeInTheDocument();
    fireEvent.change(rangeInput, { target: { value: "1" } });

    const deleteBtn = screen.getByText("pdf.deletePages.button.delete");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deletePdfPages).toHaveBeenCalledWith(sampleFile, new Set([0]));
    });

    expect(await screen.findByText("pdf.deletePages.result.title")).toBeInTheDocument();

    fireEvent.click(screen.getByText("pdf.deletePages.result.download"));

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "documento_limpo.pdf");
  });
});

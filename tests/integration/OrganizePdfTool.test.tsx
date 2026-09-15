import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrganizePdfTool from "@/app/[locale]/tools/pdf/organize-pdf/OrganizePdfTool";
import { pdfToImages } from "@/lib/pdfToImage";
import { organizePdf } from "@/lib/pdfOrganize";
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

jest.mock("@/lib/pdfOrganize", () => ({
  organizePdf: jest.fn(),
}));

describe("OrganizePdfTool Integration", () => {
  const defaultProps = {
    title: "Organizar Páginas do PDF",
    description: "Reordene visualmente as páginas do seu documento",
    faqs: [
      {
        question: "Como funciona a reordenação?",
        answer: "Arraste e solte os cards.",
      },
    ],
    richContent: {
      whatIs: "Reorganização de páginas de documentos PDF.",
      howToUse: ["Selecione o arquivo", "Ordene as páginas", "Baixe o PDF"],
      whyItMatters: "Permite corrigir a ordem das páginas.",
      proTip: "Gire páginas quando necessário.",
    },
    locale: "pt",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial breadcrumbs, badges, and dropzone", () => {
    render(<OrganizePdfTool {...defaultProps} />);

    expect(screen.getByRole("heading", { level: 1, name: /Organizar Páginas do PDF/i })).toBeInTheDocument();
    expect(screen.getByText("Ferramentas PDF")).toBeInTheDocument();
    expect(screen.getByText("pdf.organize.badges.noUpload")).toBeInTheDocument();
    expect(screen.getByText("pdf.organize.dropZone.label")).toBeInTheDocument();
  });

  test("loads thumbnails on PDF selection and renders sortable page cards", async () => {
    (pdfToImages as jest.Mock).mockResolvedValueOnce([
      { name: "p1.jpg", dataUrl: "data:image/jpeg;base64,img1" },
      { name: "p2.jpg", dataUrl: "data:image/jpeg;base64,img2" },
      { name: "p3.jpg", dataUrl: "data:image/jpeg;base64,img3" },
    ]);

    const { container } = render(<OrganizePdfTool {...defaultProps} />);

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
    expect(screen.getAllByText("pdf.organize.card.pageLabel").length).toBe(3);
  });

  test("executes organize and downloads new PDF", async () => {
    (pdfToImages as jest.Mock).mockResolvedValueOnce([
      { name: "p1.jpg", dataUrl: "data:image/jpeg;base64,img1" },
      { name: "p2.jpg", dataUrl: "data:image/jpeg;base64,img2" },
    ]);

    const fakeBytes = new Uint8Array([1, 2, 3, 4]);
    (organizePdf as jest.Mock).mockResolvedValueOnce(fakeBytes);

    const { container } = render(<OrganizePdfTool {...defaultProps} />);

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const sampleFile = new File([new ArrayBuffer(100)], "relatorio.pdf", {
      type: "application/pdf",
    });
    sampleFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(100));

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    expect(await screen.findByText("relatorio.pdf")).toBeInTheDocument();

    const saveBtn = await screen.findByText("pdf.organize.button.save");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(organizePdf).toHaveBeenCalledWith(sampleFile, [
        { originalIndex: 0, rotation: 0 },
        { originalIndex: 1, rotation: 0 },
      ]);
    });

    expect(await screen.findByText("pdf.organize.result.title")).toBeInTheDocument();

    fireEvent.click(screen.getByText("pdf.organize.result.download"));

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "relatorio_organizado.pdf");
  });
});

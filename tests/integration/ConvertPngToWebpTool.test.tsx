import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConvertPngToWebpTool from "@/app/[locale]/tools/image/convert-png-to-webp/ConvertPngToWebpTool";
import { compressImage } from "@/lib/imageConversion";
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

jest.mock("@/lib/imageConversion", () => ({
  compressImage: jest.fn(),
}));

describe("ConvertPngToWebpTool Integration", () => {
  const defaultProps = {
    title: "Converter PNG para WebP",
    description: "Converta imagens PNG para WebP instantaneamente",
    faqs: [
      {
        question: "Por que converter PNG para WebP?",
        answer: "WebP é 25-35% menor que PNG.",
      },
    ],
    richContent: {
      whatIs: "WebP é um formato moderno do Google.",
      howToUse: ["Selecione o arquivo PNG", "Clique em converter"],
      whyItMatters: "Melhora a velocidade do site.",
      proTip: "Transparência é mantida.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-preview-url");
    global.URL.revokeObjectURL = jest.fn();

    // Mock do construtor de Image para simular carregamento em ambiente jsdom
    class MockImage {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      width = 1200;
      height = 800;
      set src(_url: string) {
        setTimeout(() => this.onload(), 0);
      }
    }
    // @ts-expect-error Mock Image for jsdom
    global.Image = MockImage;
  });

  afterAll(() => {
    global.Image = originalImage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders breadcrumbs, title, badges, dropzone, and disabled convert button initially", () => {
    render(<ConvertPngToWebpTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Converter PNG para WebP",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.convertPngToWebp.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.convertPngToWebp.badges.free")).toBeInTheDocument();
    expect(screen.getByText("image.convertPngToWebp.badges.format")).toBeInTheDocument();
    expect(screen.getByText("image.convertPngToWebp.badges.transparency")).toBeInTheDocument();

    const convertButton = screen.getByRole("button", {
      name: /image\.convertPngToWebp\.button\.convert/i,
    });
    expect(convertButton).toBeDisabled();
  });

  test("enables convert button when a PNG file is selected", async () => {
    render(<ConvertPngToWebpTool {...defaultProps} />);

    const file = new File(["dummy-png-content"], "test-image.png", {
      type: "image/png",
    });

    const fileInput = document.querySelector("input[type='file']");
    expect(fileInput).toBeInTheDocument();

    fireEvent.change(fileInput!, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText("test-image.png")).toBeInTheDocument();
    });

    // Painel de configurações (slider de qualidade e título) fica visível
    expect(
      screen.getByText("image.convertPngToWebp.settings.title"),
    ).toBeInTheDocument();

    const convertButton = screen.getByRole("button", {
      name: /image\.convertPngToWebp\.button\.convert/i,
    });
    expect(convertButton).not.toBeDisabled();
  });

  test("converts PNG to WebP and displays stats, preview, and triggers download", async () => {
    const mockBlob = new Blob(["fake-webp-data"], { type: "image/webp" });
    (compressImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalSize: 1000000,
      compressedSize: 250000,
      savings: 75,
    });

    render(<ConvertPngToWebpTool {...defaultProps} />);

    const file = new File(["a".repeat(1000000)], "photo.png", {
      type: "image/png",
    });

    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    const convertButton = screen.getByRole("button", {
      name: /image\.convertPngToWebp\.button\.convert/i,
    });
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(compressImage).toHaveBeenCalledWith({
        file,
        format: "webp",
        quality: 85,
        maxWidth: undefined,
      });
    });

    // Visualiza métricas de resultado
    await waitFor(() => {
      expect(
        screen.getByText("image.convertPngToWebp.result.title"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("image.convertPngToWebp.result.originalSize"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("image.convertPngToWebp.result.convertedSize"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("image.convertPngToWebp.result.reduction"),
      ).toBeInTheDocument();
    });

    // Clica no botão de download
    const downloadButton = screen.getByRole("button", {
      name: /image\.convertPngToWebp\.button\.download/i,
    });
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalledWith(mockBlob, "photo.webp");
  });

  test("allows resetting and converting another image", async () => {
    const mockBlob = new Blob(["fake-webp-data"], { type: "image/webp" });
    (compressImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalSize: 500000,
      compressedSize: 150000,
      savings: 70,
    });

    render(<ConvertPngToWebpTool {...defaultProps} />);

    const file = new File(["dummy"], "banner.png", { type: "image/png" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    fireEvent.click(
      screen.getByRole("button", {
        name: /image\.convertPngToWebp\.button\.convert/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Converter outra imagem")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Converter outra imagem"));

    await waitFor(() => {
      const convertButton = screen.getByRole("button", {
        name: /image\.convertPngToWebp\.button\.convert/i,
      });
      expect(convertButton).toBeDisabled();
    });
  });

  test("renders rich content and FAQ accordion correctly", () => {
    render(<ConvertPngToWebpTool {...defaultProps} />);

    expect(screen.getByText("Como Usar")).toBeInTheDocument();
    expect(screen.getByText("Selecione o arquivo PNG")).toBeInTheDocument();
    expect(screen.getByText("WebP é um formato moderno do Google.")).toBeInTheDocument();
    expect(screen.getByText("Melhora a velocidade do site.")).toBeInTheDocument();
    expect(screen.getByText("Transparência é mantida.")).toBeInTheDocument();
    expect(screen.getByText("Por que converter PNG para WebP?")).toBeInTheDocument();
  });
});

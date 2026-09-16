import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FaviconGeneratorTool from "@/app/[locale]/tools/image/favicon-generator/FaviconGeneratorTool";
import { generateFavicons } from "@/lib/faviconGenerator";
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

jest.mock("@/lib/faviconGenerator", () => ({
  generateFavicons: jest.fn(),
}));

describe("FaviconGeneratorTool Integration", () => {
  const defaultProps = {
    title: "Gerador de Favicon Online",
    description: "Crie o pacote completo de ícones para web e navegadores",
    faqs: [
      {
        question: "Quais tamanhos estão inclusos?",
        answer: "16x16, 32x32, 48x48, 180x180, 192x192, 512x512 e .ico.",
      },
    ],
    richContent: {
      whatIs: "Favicons são pequenos ícones gráficos de sites.",
      howToUse: ["Envie o logotipo", "Configure o nome", "Baixe o ZIP"],
      whyItMatters: "Profissionalismo e autoridade.",
      proTip: "Use imagens quadradas minimalistas.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-favicon-url");
    global.URL.revokeObjectURL = jest.fn();

    class MockImage {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      naturalWidth = 512;
      naturalHeight = 512;
      width = 512;
      height = 512;
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

  test("renders breadcrumbs, title, badges, and dropzone", () => {
    render(<FaviconGeneratorTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Gerador de Favicon Online",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.faviconGenerator.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.faviconGenerator.badges.package")).toBeInTheDocument();
    expect(screen.getByText("image.faviconGenerator.badges.free")).toBeInTheDocument();
  });

  test("loads image, generates favicon package, and allows downloading ZIP", async () => {
    const mockZipBlob = new Blob(["mock-zip-content"], { type: "application/zip" });
    const mockItems = [
      { name: "favicon.ico", size: 32, blob: new Blob(), previewUrl: "blob:ico" },
      { name: "favicon-16x16.png", size: 16, blob: new Blob(), previewUrl: "blob:16" },
      { name: "favicon-32x32.png", size: 32, blob: new Blob(), previewUrl: "blob:32" },
    ];

    (generateFavicons as jest.Mock).mockResolvedValueOnce({
      zipBlob: mockZipBlob,
      zipSize: 15420,
      items: mockItems,
      htmlSnippet: '<link rel="icon" href="/favicon.ico">',
    });

    render(<FaviconGeneratorTool {...defaultProps} />);

    const fakeFile = new File(["dummy-logo"], "brand-logo.png", {
      type: "image/png",
    });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getAllByText("brand-logo.png").length).toBeGreaterThan(0);
      expect(screen.getByText("image.faviconGenerator.settings.title")).toBeInTheDocument();
    });

    // Enter site name
    const siteNameInput = screen.getByPlaceholderText("image.faviconGenerator.settings.siteNamePlaceholder");
    fireEvent.change(siteNameInput, { target: { value: "Cool App" } });

    // Click generate button
    const generateBtn = screen.getByRole("button", {
      name: /image\.faviconGenerator\.button\.generate/i,
    });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(generateFavicons).toHaveBeenCalledTimes(1);
    });

    expect(generateFavicons).toHaveBeenCalledWith(
      expect.objectContaining({
        file: fakeFile,
        siteName: "Cool App",
      }),
    );

    // Verify result screen
    await waitFor(() => {
      expect(screen.getByText("image.faviconGenerator.result.title")).toBeInTheDocument();
      expect(screen.getByText("favicon.ico")).toBeInTheDocument();
      expect(screen.getByText("favicon-16x16.png")).toBeInTheDocument();
    });

    // Click download button
    const downloadBtn = screen.getByRole("button", {
      name: /image\.faviconGenerator\.button\.downloadZip/i,
    });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledWith(mockZipBlob, "favicon-package.zip");
  });

  test("allows resetting and creating another favicon", async () => {
    (generateFavicons as jest.Mock).mockResolvedValueOnce({
      zipBlob: new Blob(),
      zipSize: 5000,
      items: [],
      htmlSnippet: '<link rel="icon" href="/favicon.ico">',
    });

    render(<FaviconGeneratorTool {...defaultProps} />);

    const fakeFile = new File(["dummy-logo"], "logo.png", {
      type: "image/png",
    });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getAllByText("logo.png").length).toBeGreaterThan(0);
    });

    const generateBtn = screen.getByRole("button", {
      name: /image\.faviconGenerator\.button\.generate/i,
    });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText("Criar outro favicon")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Criar outro favicon"));

    await waitFor(() => {
      expect(screen.getByText("image.faviconGenerator.dropZone.label")).toBeInTheDocument();
    });
  });
});

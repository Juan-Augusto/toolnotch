import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConvertWebpToPngTool from "@/app/[locale]/tools/image/convert-webp-to-png/ConvertWebpToPngTool";
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

jest.mock("@/lib/imageConversion", () => {
  const actual = jest.requireActual("@/lib/imageConversion");
  return {
    ...actual,
    compressImage: jest.fn(),
  };
});

describe("ConvertWebpToPngTool Integration", () => {
  const defaultProps = {
    title: "Converter WebP para PNG",
    description: "Transforme imagens WebP em PNG lossless com suporte a transparência",
    faqs: [
      {
        question: "Por que converter WebP para PNG?",
        answer: "Compatibilidade universal com qualquer editor ou impressora.",
      },
    ],
    richContent: {
      whatIs: "A conversão transforma WebP em PNG.",
      howToUse: ["Envie o arquivo", "Defina opções", "Baixe o PNG"],
      whyItMatters: "Maior compatibilidade de software.",
      proTip: "Ideal para softwares antigos.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-png-url");
    global.URL.revokeObjectURL = jest.fn();

    class MockImage {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      naturalWidth = 800;
      naturalHeight = 600;
      width = 800;
      height = 600;
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
    render(<ConvertWebpToPngTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Converter WebP para PNG",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.convertWebpToPng.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.convertWebpToPng.badges.format")).toBeInTheDocument();
    expect(screen.getByText("image.convertWebpToPng.badges.transparency")).toBeInTheDocument();
  });

  test("loads WebP file, converts to PNG, and allows download", async () => {
    const mockBlob = new Blob(["png-data"], { type: "image/png" });
    (compressImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalSize: 45000,
      compressedSize: 85000,
      savings: -88,
    });

    render(<ConvertWebpToPngTool {...defaultProps} />);

    const file = new File(["dummy-webp"], "photo.webp", { type: "image/webp" });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getAllByText("photo.webp").length).toBeGreaterThan(0);
      expect(screen.getByText("image.convertWebpToPng.settings.title")).toBeInTheDocument();
    });

    const convertBtn = screen.getByRole("button", {
      name: /image\.convertWebpToPng\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(compressImage).toHaveBeenCalledTimes(1);
    });

    expect(compressImage).toHaveBeenCalledWith({
      file,
      format: "png",
      quality: 100,
      maxWidth: undefined,
    });

    await waitFor(() => {
      expect(screen.getByText("image.convertWebpToPng.result.title")).toBeInTheDocument();
      expect(screen.getByText("photo.png")).toBeInTheDocument();
    });

    const downloadBtn = screen.getByRole("button", {
      name: /image\.convertWebpToPng\.button\.download/i,
    });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledWith(mockBlob, "photo.png");
  });

  test("rejects invalid non-webp file type", async () => {
    render(<ConvertWebpToPngTool {...defaultProps} />);

    const invalidFile = new File(["dummy-pdf"], "document.pdf", {
      type: "application/pdf",
    });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("image.convertWebpToPng.errors.invalidType");
    });
  });
});

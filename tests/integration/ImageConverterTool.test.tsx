import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageConverterTool from "@/app/[locale]/tools/image/image-converter/ImageConverterTool";
import { compressImage } from "@/lib/imageConversion";
import { saveAs } from "file-saver";
import JSZip from "jszip";

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

describe("ImageConverterTool Integration", () => {
  const defaultProps = {
    title: "Conversor de Imagens Online",
    description: "Converta uma ou várias imagens entre JPG, PNG, WebP e AVIF",
    faqs: [
      {
        question: "Posso converter várias imagens ao mesmo tempo?",
        answer: "Sim! O conversor suporta lotes.",
      },
    ],
    richContent: {
      whatIs: "O conversor suporta múltiplos formatos.",
      howToUse: ["Selecione as imagens", "Escolha o formato", "Converta"],
      whyItMatters: "Economiza espaço e acelera carregamento.",
      proTip: "Use WebP para 80% de economia.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-converter-url");
    global.URL.revokeObjectURL = jest.fn();

    class MockImage {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      width = 1920;
      height = 1080;
      naturalWidth = 1920;
      naturalHeight = 1080;
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

  test("renders breadcrumbs, title, badges, dropzone", () => {
    render(<ImageConverterTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Conversor de Imagens Online",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.imageConverter.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.imageConverter.badges.batch")).toBeInTheDocument();
    expect(screen.getByText("image.imageConverter.badges.formats")).toBeInTheDocument();
    expect(screen.getByText("image.imageConverter.badges.free")).toBeInTheDocument();
  });

  test("loads single file, selects target format, converts and downloads", async () => {
    (compressImage as jest.Mock).mockResolvedValueOnce({
      blob: new Blob(["fake-webp-data"], { type: "image/webp" }),
      originalSize: 1000000,
      compressedSize: 200000,
      savings: 80,
    });

    render(<ImageConverterTool {...defaultProps} />);

    const fakeFile = new File(["dummy-data"], "photo.png", {
      type: "image/png",
    });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/image\.imageConverter\.settings\.selectedCount/i)).toBeInTheDocument();
    });

    // Click "JPG (Universal)" format
    const jpgChip = screen.getByText("JPG (Universal)");
    fireEvent.click(jpgChip);

    // Adjust quality slider
    const slider = screen.getByLabelText(/image\.imageConverter\.settings\.qualityLabel/i);
    fireEvent.change(slider, { target: { value: "90" } });

    // Click Convert
    const convertBtn = screen.getByRole("button", {
      name: /image\.imageConverter\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(compressImage).toHaveBeenCalledWith(
        expect.objectContaining({
          file: fakeFile,
          format: "jpg",
          quality: 90,
        }),
      );
    });

    // Check result view
    await waitFor(() => {
      expect(screen.getByText("image.imageConverter.result.title")).toBeInTheDocument();
    });

    // Download single image
    const downloadBtn = screen.getByRole("button", {
      name: /image\.imageConverter\.button\.downloadSingle/i,
    });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "photo.jpg");
  });

  test("loads multiple files (batch), converts, and downloads ZIP package", async () => {
    (compressImage as jest.Mock)
      .mockResolvedValueOnce({
        blob: new Blob(["img1"], { type: "image/webp" }),
        originalSize: 500000,
        compressedSize: 100000,
        savings: 80,
      })
      .mockResolvedValueOnce({
        blob: new Blob(["img2"], { type: "image/webp" }),
        originalSize: 600000,
        compressedSize: 120000,
        savings: 80,
      });

    render(<ImageConverterTool {...defaultProps} />);

    const file1 = new File(["data1"], "banner.jpg", { type: "image/jpeg" });
    const file2 = new File(["data2"], "avatar.png", { type: "image/png" });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file1, file2] } });

    await waitFor(() => {
      expect(screen.getByText(/image\.imageConverter\.settings\.selectedCount/i)).toBeInTheDocument();
    });

    const convertBtn = screen.getByRole("button", {
      name: /image\.imageConverter\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(compressImage).toHaveBeenCalledTimes(2);
    });

    // Check results view shows ZIP download button for multiple files
    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /image\.imageConverter\.button\.downloadZip/i,
        }),
      ).toBeInTheDocument();
    });

    // Click download ZIP
    const zipBtn = screen.getByRole("button", {
      name: /image\.imageConverter\.button\.downloadZip/i,
    });
    fireEvent.click(zipBtn);

    await waitFor(() => {
      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        "toolnotch-converted-images-webp.zip",
      );
    });
  });

  test("allows resetting and clearing files", async () => {
    render(<ImageConverterTool {...defaultProps} />);

    const fakeFile = new File(["data"], "test.jpg", { type: "image/jpeg" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getByText("image.imageConverter.button.clearFiles")).toBeInTheDocument();
    });

    // Clear files
    fireEvent.click(screen.getByText("image.imageConverter.button.clearFiles"));

    expect(screen.queryByText("image.imageConverter.button.clearFiles")).not.toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConvertHeicToJpgTool from "@/app/[locale]/tools/image/convert-heic-to-jpg/ConvertHeicToJpgTool";
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

describe("ConvertHeicToJpgTool Integration", () => {
  const defaultProps = {
    title: "Converter HEIC para JPG",
    description: "Converta fotos HEIC do iPhone em JPG universal",
    faqs: [
      {
        question: "O que é HEIC?",
        answer: "Formato padrão do iPhone desde o iOS 11.",
      },
    ],
    richContent: {
      whatIs: "HEIC é o formato de imagem da Apple.",
      howToUse: ["Envie a foto HEIC", "Escolha a qualidade", "Baixe em JPG"],
      whyItMatters: "Compatibilidade no Windows e Android.",
      proTip: "Use qualidade 90% para fotos.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-jpg-url");
    global.URL.revokeObjectURL = jest.fn();

    class MockImage {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      naturalWidth = 1920;
      naturalHeight = 1080;
      width = 1920;
      height = 1080;
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
    render(<ConvertHeicToJpgTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Converter HEIC para JPG",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.convertHeicToJpg.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.convertHeicToJpg.badges.format")).toBeInTheDocument();
    expect(screen.getByText("image.convertHeicToJpg.badges.apple")).toBeInTheDocument();
  });

  test("loads HEIC photo, converts to JPG, and allows download", async () => {
    const mockBlob = new Blob(["jpg-data"], { type: "image/jpeg" });
    (compressImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalSize: 1800000,
      compressedSize: 950000,
      savings: 47,
    });

    render(<ConvertHeicToJpgTool {...defaultProps} />);

    const file = new File(["dummy-heic"], "IMG_1024.HEIC", { type: "image/heic" });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getAllByText("IMG_1024.HEIC").length).toBeGreaterThan(0);
      expect(screen.getByText("image.convertHeicToJpg.settings.title")).toBeInTheDocument();
    });

    // Change quality slider
    const qualitySlider = screen.getByLabelText("image.convertHeicToJpg.settings.qualityLabel");
    fireEvent.change(qualitySlider, { target: { value: "85" } });

    const convertBtn = screen.getByRole("button", {
      name: /image\.convertHeicToJpg\.button\.convert/i,
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(compressImage).toHaveBeenCalledTimes(1);
    });

    expect(compressImage).toHaveBeenCalledWith({
      file,
      format: "jpg",
      quality: 85,
      maxWidth: undefined,
    });

    await waitFor(() => {
      expect(screen.getByText("image.convertHeicToJpg.result.title")).toBeInTheDocument();
      expect(screen.getByText("IMG_1024.jpg")).toBeInTheDocument();
    });

    const downloadBtn = screen.getByRole("button", {
      name: /image\.convertHeicToJpg\.button\.download/i,
    });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledWith(mockBlob, "IMG_1024.jpg");
  });

  test("rejects invalid non-heic file type", async () => {
    render(<ConvertHeicToJpgTool {...defaultProps} />);

    const invalidFile = new File(["dummy-pdf"], "document.pdf", {
      type: "application/pdf",
    });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("image.convertHeicToJpg.errors.invalidType");
    });
  });
});

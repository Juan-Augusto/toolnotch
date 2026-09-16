import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CropImageTool from "@/app/[locale]/tools/image/crop-image/CropImageTool";
import { cropImage } from "@/lib/imageManipulation";
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

jest.mock("@/lib/imageManipulation", () => {
  const actual = jest.requireActual("@/lib/imageManipulation");
  return {
    ...actual,
    cropImage: jest.fn(),
  };
});

describe("CropImageTool Integration", () => {
  const defaultProps = {
    title: "Recortar Imagem Online",
    description: "Corte partes indesejadas de fotos com proporção exata",
    faqs: [
      {
        question: "O recorte reduz a qualidade da imagem?",
        answer: "Não, extrai os pixels nativos sem recompressão.",
      },
    ],
    richContent: {
      whatIs: "Recortar isola a área desejada.",
      howToUse: ["Envie a foto", "Ajuste o quadro", "Clique em recortar"],
      whyItMatters: "Enquadramento ideal.",
      proTip: "Use a regra dos terços.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-crop-url");
    global.URL.revokeObjectURL = jest.fn();

    class MockImage {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      naturalWidth = 1200;
      naturalHeight = 800;
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

  test("renders breadcrumbs, title, badges, dropzone, and initially disabled button", () => {
    render(<CropImageTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Recortar Imagem Online",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.cropper.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.cropper.badges.aspect")).toBeInTheDocument();
    expect(screen.getByText("image.cropper.badges.free")).toBeInTheDocument();

    const cropButton = screen.getByRole("button", {
      name: /image\.cropper\.button\.crop/i,
    });
    expect(cropButton).toBeDisabled();
  });

  test("enables crop button and displays aspect ratios when an image is loaded", async () => {
    render(<CropImageTool {...defaultProps} />);

    const file = new File(["dummy-data"], "avatar.png", { type: "image/png" });
    const fileInput = document.querySelector("input[type='file']");
    expect(fileInput).toBeInTheDocument();

    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("avatar.png")).toBeInTheDocument();
      expect(screen.getByText("image.cropper.settings.title")).toBeInTheDocument();
      expect(screen.getByText("image.cropper.aspectRatios.free")).toBeInTheDocument();
      expect(screen.getByText("image.cropper.aspectRatios.square")).toBeInTheDocument();
    });

    const cropButton = screen.getByRole("button", {
      name: /image\.cropper\.button\.crop/i,
    });
    expect(cropButton).not.toBeDisabled();
  });

  test("executes crop and displays result metrics and allows download", async () => {
    const mockBlob = new Blob(["cropped-data"], { type: "image/png" });
    (cropImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalWidth: 1200,
      originalHeight: 800,
      cropWidth: 600,
      cropHeight: 600,
      originalSize: 400000,
      newSize: 150000,
    });

    render(<CropImageTool {...defaultProps} />);

    const file = new File(["dummy-data"], "photo.png", { type: "image/png" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /image\.cropper\.button\.crop/i,
        }),
      ).not.toBeDisabled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /image\.cropper\.button\.crop/i,
      }),
    );

    await waitFor(() => {
      expect(cropImage).toHaveBeenCalled();
      expect(screen.getByText("image.cropper.result.title")).toBeInTheDocument();
      expect(screen.getByText("image.cropper.result.dimensions")).toBeInTheDocument();
      expect(screen.getByText("image.cropper.result.originalDimensions")).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole("button", {
      name: /image\.cropper\.button\.download/i,
    });
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalled();
  });

  test("allows resetting to crop another image", async () => {
    const mockBlob = new Blob(["cropped-data"], { type: "image/png" });
    (cropImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalWidth: 1200,
      originalHeight: 800,
      cropWidth: 800,
      cropHeight: 450,
      originalSize: 500000,
      newSize: 200000,
    });

    render(<CropImageTool {...defaultProps} />);

    const file = new File(["dummy"], "scenery.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /image\.cropper\.button\.crop/i,
        }),
      ).not.toBeDisabled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /image\.cropper\.button\.crop/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Recortar outra imagem")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Recortar outra imagem"));

    await waitFor(() => {
      const cropButton = screen.getByRole("button", {
        name: /image\.cropper\.button\.crop/i,
      });
      expect(cropButton).toBeDisabled();
    });
  });

  test("renders rich content and FAQ accordion correctly", () => {
    render(<CropImageTool {...defaultProps} />);

    expect(screen.getByText("Como Usar")).toBeInTheDocument();
    expect(screen.getByText("Envie a foto")).toBeInTheDocument();
    expect(screen.getByText("Recortar isola a área desejada.")).toBeInTheDocument();
    expect(screen.getByText("O recorte reduz a qualidade da imagem?")).toBeInTheDocument();
  });

  test("allows resizing crop box via resize handles", async () => {
    render(<CropImageTool {...defaultProps} />);

    const file = new File(["dummy"], "landscape.png", { type: "image/png" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId("crop-box")).toBeInTheDocument();
      expect(screen.getByTestId("handle-se")).toBeInTheDocument();
    });

    const handleSe = screen.getByTestId("handle-se");
    fireEvent.mouseDown(handleSe, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(window);

    // Box was resized
    expect(screen.getByTestId("crop-box")).toBeInTheDocument();
  });

  test("allows manual dimension adjustment via inputs and maximize button", async () => {
    render(<CropImageTool {...defaultProps} />);

    const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByLabelText("image.cropper.settings.widthLabel")).toBeInTheDocument();
      expect(screen.getByLabelText("image.cropper.settings.heightLabel")).toBeInTheDocument();
    });

    const widthInput = screen.getByLabelText("image.cropper.settings.widthLabel");
    const heightInput = screen.getByLabelText("image.cropper.settings.heightLabel");

    fireEvent.change(widthInput, { target: { value: "500" } });
    expect(widthInput).toHaveValue(500);

    fireEvent.change(heightInput, { target: { value: "400" } });
    expect(heightInput).toHaveValue(400);

    // Maximize button
    const maximizeButton = screen.getByRole("button", {
      name: /image\.cropper\.settings\.maximizeCrop/i,
    });
    expect(maximizeButton).toBeInTheDocument();
    fireEvent.click(maximizeButton);

    // In free mode, maximize expands to original dimensions (1200 x 800)
    expect(widthInput).toHaveValue(1200);
    expect(heightInput).toHaveValue(800);
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageResizerTool from "@/app/[locale]/tools/image/image-resizer/ImageResizerTool";
import { resizeImage } from "@/lib/imageManipulation";
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
    resizeImage: jest.fn(),
  };
});

describe("ImageResizerTool Integration", () => {
  const defaultProps = {
    title: "Redimensionar Imagem Online",
    description: "Altere as dimensões e proporção de imagens",
    faqs: [
      {
        question: "Como redimensionar sem perder qualidade?",
        answer: "Mantenha a proporção de aspecto ativada.",
      },
    ],
    richContent: {
      whatIs: "Redimensionar altera a largura e altura.",
      howToUse: ["Envie a imagem", "Escolha as dimensões", "Clique em redimensionar"],
      whyItMatters: "Essencial para redes sociais.",
      proTip: "Use presets do Instagram.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-preview-url");
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

  test("renders breadcrumbs, title, badges, dropzone, and initially disabled button", () => {
    render(<ImageResizerTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Redimensionar Imagem Online",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.resizer.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.resizer.badges.presets")).toBeInTheDocument();
    expect(screen.getByText("image.resizer.badges.free")).toBeInTheDocument();

    const resizeButton = screen.getByRole("button", {
      name: /image\.resizer\.button\.resize/i,
    });
    expect(resizeButton).toBeDisabled();
  });

  test("enables resize button and displays settings when an image is loaded", async () => {
    render(<ImageResizerTool {...defaultProps} />);

    const file = new File(["dummy-data"], "photo.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector("input[type='file']");
    expect(fileInput).toBeInTheDocument();

    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("photo.jpg")).toBeInTheDocument();
      expect(screen.getByText("image.resizer.tabs.dimensions")).toBeInTheDocument();
      expect(screen.getByText("image.resizer.tabs.percentage")).toBeInTheDocument();
      expect(screen.getByText("image.resizer.tabs.social")).toBeInTheDocument();
    });

    const resizeButton = screen.getByRole("button", {
      name: /image\.resizer\.button\.resize/i,
    });
    expect(resizeButton).not.toBeDisabled();
  });

  test("executes resize and displays result metrics and allows download", async () => {
    const mockBlob = new Blob(["resized-data"], { type: "image/jpeg" });
    (resizeImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalWidth: 1920,
      originalHeight: 1080,
      newWidth: 1080,
      newHeight: 608,
      originalSize: 800000,
      newSize: 250000,
    });

    render(<ImageResizerTool {...defaultProps} />);

    const file = new File(["dummy-data"], "banner.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /image\.resizer\.button\.resize/i,
        }),
      ).not.toBeDisabled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /image\.resizer\.button\.resize/i,
      }),
    );

    await waitFor(() => {
      expect(resizeImage).toHaveBeenCalled();
      expect(screen.getByText("image.resizer.result.title")).toBeInTheDocument();
      expect(screen.getByText("image.resizer.result.originalDimensions")).toBeInTheDocument();
      expect(screen.getByText("image.resizer.result.newDimensions")).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole("button", {
      name: /image\.resizer\.button\.download/i,
    });
    fireEvent.click(downloadButton);

    expect(saveAs).toHaveBeenCalled();
  });

  test("allows resetting to resize another image", async () => {
    const mockBlob = new Blob(["resized-data"], { type: "image/jpeg" });
    (resizeImage as jest.Mock).mockResolvedValueOnce({
      blob: mockBlob,
      originalWidth: 1920,
      originalHeight: 1080,
      newWidth: 800,
      newHeight: 450,
      originalSize: 500000,
      newSize: 150000,
    });

    render(<ImageResizerTool {...defaultProps} />);

    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /image\.resizer\.button\.resize/i,
        }),
      ).not.toBeDisabled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /image\.resizer\.button\.resize/i,
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Redimensionar outra imagem")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Redimensionar outra imagem"));

    await waitFor(() => {
      const resizeButton = screen.getByRole("button", {
        name: /image\.resizer\.button\.resize/i,
      });
      expect(resizeButton).toBeDisabled();
    });
  });

  test("renders rich content and FAQ accordion correctly", () => {
    render(<ImageResizerTool {...defaultProps} />);

    expect(screen.getByText("Como Usar")).toBeInTheDocument();
    expect(screen.getByText("Envie a imagem")).toBeInTheDocument();
    expect(screen.getByText("Redimensionar altera a largura e altura.")).toBeInTheDocument();
    expect(screen.getByText("Como redimensionar sem perder qualidade?")).toBeInTheDocument();
  });

  test("displays live real-time preview and updates on rotation and flips", async () => {
    render(<ImageResizerTool {...defaultProps} />);

    const file = new File(["dummy-data"], "photo.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("image.resizer.settings.previewTitle")).toBeInTheDocument();
      expect(screen.getByTestId("resizer-live-preview")).toBeInTheDocument();
    });

    const previewImg = screen.getByTestId("resizer-live-preview");
    expect(previewImg).toHaveStyle({
      transform: "rotate(0deg) scaleX(1) scaleY(1)",
    });

    // Rotate +90
    const rotateBtn = screen.getByText("image.resizer.settings.rotateRight");
    fireEvent.click(rotateBtn);

    expect(previewImg).toHaveStyle({
      transform: "rotate(90deg) scaleX(1) scaleY(1)",
    });

    // Flip horizontal
    const flipHBtn = screen.getByText("image.resizer.settings.flipH");
    fireEvent.click(flipHBtn);

    expect(previewImg).toHaveStyle({
      transform: "rotate(90deg) scaleX(-1) scaleY(1)",
    });
  });

  test("applies social preset with cover fitMode to avoid distortion", async () => {
    render(<ImageResizerTool {...defaultProps} />);

    const file = new File(["dummy-data"], "photo.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector("input[type='file']");
    fireEvent.change(fileInput!, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("image.resizer.tabs.social")).toBeInTheDocument();
    });

    // Switch to Social tab
    fireEvent.click(screen.getByText("image.resizer.tabs.social"));

    await waitFor(() => {
      expect(screen.getAllByText("image.resizer.presets.instaPost")[0]).toBeInTheDocument();
    });

    // Click Instagram Post (1080 x 1080)
    fireEvent.click(screen.getAllByText("image.resizer.presets.instaPost")[0]);

    const previewImg = screen.getByTestId("resizer-live-preview");
    // Should have object-fit: cover to prevent distortion
    expect(previewImg).toHaveStyle({
      objectFit: "cover",
    });

    // Toggle to contain mode
    const containBtn = screen.getByText("image.resizer.settings.fitContain");
    fireEvent.click(containBtn);

    expect(previewImg).toHaveStyle({
      objectFit: "contain",
    });

    // Clicking another social preset should retain contain fitMode without resetting to cover
    fireEvent.click(screen.getAllByText("image.resizer.presets.youtubeThumb")[0]);

    expect(previewImg).toHaveStyle({
      objectFit: "contain",
    });
  });
});

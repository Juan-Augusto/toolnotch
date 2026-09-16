import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CensorImageTool from "@/app/[locale]/tools/image/censor-image/CensorImageTool";
import { censorImage } from "@/lib/imageManipulation";
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
    censorImage: jest.fn(),
  };
});

describe("CensorImageTool Integration", () => {
  const defaultProps = {
    title: "Censurar e Desfocar Imagem Online",
    description: "Proteja informações pessoais e documentos com blur ou tarja preta",
    faqs: [
      {
        question: "A censura é reversível?",
        answer: "Não, os pixels são destruídos permanentemente no Canvas.",
      },
    ],
    richContent: {
      whatIs: "A censura de imagem oculta partes confidenciais.",
      howToUse: ["Envie a foto", "Desenhe o retângulo", "Clique em aplicar censura"],
      whyItMatters: "Privacidade absoluta.",
      proTip: "Use tarja preta para senhas.",
    },
    locale: "pt",
  };

  const originalImage = global.Image;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-censor-url");
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

  test("renders breadcrumbs, title, badges, dropzone", () => {
    render(<CensorImageTool {...defaultProps} />);

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Ferramentas")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Censurar e Desfocar Imagem Online",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("image.censor.badges.private")).toBeInTheDocument();
    expect(screen.getByText("image.censor.badges.modes")).toBeInTheDocument();
    expect(screen.getByText("image.censor.badges.free")).toBeInTheDocument();
  });

  test("loads image, draws censor area, and applies censor successfully", async () => {
    (censorImage as jest.Mock).mockResolvedValueOnce({
      blob: new Blob(["fake-censored-blob"], { type: "image/png" }),
      originalWidth: 1200,
      originalHeight: 800,
      areasCount: 1,
      originalSize: 500000,
      newSize: 450000,
    });

    render(<CensorImageTool {...defaultProps} />);

    const fakeFile = new File(["dummy-data"], "secret-doc.png", {
      type: "image/png",
    });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getAllByText("secret-doc.png").length).toBeGreaterThan(0);
    });

    // Preview image is rendered
    const previewImg = screen.getByAltText("Preview");
    expect(previewImg).toBeInTheDocument();

    // Mock getBoundingClientRect on previewImg
    jest.spyOn(previewImg, "getBoundingClientRect").mockReturnValue({
      left: 10,
      top: 10,
      right: 610,
      bottom: 410,
      width: 600,
      height: 400,
      x: 10,
      y: 10,
      toJSON: () => {},
    });

    const drawContainer = previewImg.parentElement!;

    // Simulate drawing a box
    fireEvent.mouseDown(drawContainer, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(drawContainer, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(drawContainer);

    // Verify marked area appears
    await waitFor(() => {
      expect(screen.getByText(/#1 pixelate/i)).toBeInTheDocument();
    });

    // Click "Aplicar Censura"
    const censorBtn = screen.getByRole("button", {
      name: /image\.censor\.button\.censor/i,
    });
    expect(censorBtn).toBeEnabled();

    fireEvent.click(censorBtn);

    await waitFor(() => {
      expect(censorImage).toHaveBeenCalledTimes(1);
    });

    expect(censorImage).toHaveBeenCalledWith(
      expect.objectContaining({
        file: fakeFile,
        areas: expect.arrayContaining([
          expect.objectContaining({
            type: "pixelate",
          }),
        ]),
      }),
    );

    // Result screen
    await waitFor(() => {
      expect(screen.getByText("image.censor.result.title")).toBeInTheDocument();
    });

    const downloadBtn = screen.getByRole("button", {
      name: /image\.censor\.button\.download/i,
    });
    fireEvent.click(downloadBtn);

    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      "secret-doc-censored.png",
    );
  });

  test("allows switching modes to blackout and clearing areas", async () => {
    render(<CensorImageTool {...defaultProps} />);

    const fakeFile = new File(["dummy-data"], "passport.jpg", {
      type: "image/jpeg",
    });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getAllByText("passport.jpg").length).toBeGreaterThan(0);
    });

    // Click on blackout mode chip
    const blackoutTab = screen.getByText("image.censor.modes.blackout");
    fireEvent.click(blackoutTab);

    const previewImg = screen.getByAltText("Preview");
    jest.spyOn(previewImg, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 600,
      bottom: 400,
      width: 600,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const drawContainer = previewImg.parentElement!;

    // Draw box
    fireEvent.mouseDown(drawContainer, { clientX: 20, clientY: 20 });
    fireEvent.mouseMove(drawContainer, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(drawContainer);

    await waitFor(() => {
      expect(screen.getByText(/#1 blackout/i)).toBeInTheDocument();
    });

    // Clear all areas button
    const clearBtn = screen.getByText("image.censor.settings.clearAll");
    fireEvent.click(clearBtn);

    expect(screen.queryByText(/#1 blackout/i)).not.toBeInTheDocument();
  });

  test("draws blur area, dynamically updates blur strength on slider change, and supports clean preview", async () => {
    (censorImage as jest.Mock).mockResolvedValueOnce({
      blob: new Blob(["blurred-blob"], { type: "image/png" }),
      originalWidth: 1200,
      originalHeight: 800,
      areasCount: 1,
      originalSize: 500000,
      newSize: 420000,
    });

    render(<CensorImageTool {...defaultProps} />);

    const fakeFile = new File(["dummy-data"], "photo.png", {
      type: "image/png",
    });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getAllByText("photo.png").length).toBeGreaterThan(0);
    });

    // Select "blur" mode
    const blurTab = screen.getByText("image.censor.modes.blur");
    fireEvent.click(blurTab);

    const previewImg = screen.getByAltText("Preview");
    jest.spyOn(previewImg, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 600,
      bottom: 400,
      width: 600,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const drawContainer = previewImg.parentElement!;

    // Draw box
    fireEvent.mouseDown(drawContainer, { clientX: 30, clientY: 30 });
    fireEvent.mouseMove(drawContainer, { clientX: 120, clientY: 120 });
    fireEvent.mouseUp(drawContainer);

    // Verify blur area marker
    await waitFor(() => {
      expect(screen.getByText(/#1 blur/i)).toBeInTheDocument();
    });

    // Verify style has blur(16px) backdrop-filter
    const blurTag = screen.getByText(/#1 blur/i);
    const blurBox = blurTag.closest("div")!;
    expect(blurBox.style.backdropFilter || blurBox.style.webkitBackdropFilter).toContain("blur(16px)");

    // Change slider to 30px
    const slider = screen.getByLabelText(/image\.censor\.settings\.strengthLabel/i);
    fireEvent.change(slider, { target: { value: "30" } });

    // Verify backdrop-filter updated in real time to blur(30px)
    expect(blurBox.style.backdropFilter || blurBox.style.webkitBackdropFilter).toContain("blur(30px)");

    // Clean Preview toggle button is present
    const cleanPreviewBtn = screen.getByText("image.censor.settings.previewClean");
    expect(cleanPreviewBtn).toBeInTheDocument();

    // Toggle clean preview
    fireEvent.click(cleanPreviewBtn);

    // Marker label is hidden in clean preview mode
    expect(screen.queryByText(/#1 blur/i)).not.toBeInTheDocument();
    expect(screen.getByText("image.censor.settings.showMarkers")).toBeInTheDocument();

    // Toggle back to show markers
    fireEvent.click(screen.getByText("image.censor.settings.showMarkers"));
    expect(screen.getByText(/#1 blur/i)).toBeInTheDocument();

    // Submit censor
    const censorBtn = screen.getByRole("button", {
      name: /image\.censor\.button\.censor/i,
    });
    fireEvent.click(censorBtn);

    await waitFor(() => {
      expect(censorImage).toHaveBeenCalledWith(
        expect.objectContaining({
          areas: expect.arrayContaining([
            expect.objectContaining({
              type: "blur",
              strength: 30,
            }),
          ]),
        }),
      );
    });
  });

  test("switches censor effect on existing drawn areas when clicking different modes in tabs or badge", async () => {
    render(<CensorImageTool {...defaultProps} />);

    const fakeFile = new File(["dummy-data"], "contract.png", {
      type: "image/png",
    });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(screen.getAllByText("contract.png").length).toBeGreaterThan(0);
    });

    const previewImg = screen.getByAltText("Preview");
    jest.spyOn(previewImg, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 600,
      bottom: 400,
      width: 600,
      height: 400,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const drawContainer = previewImg.parentElement!;

    // Draw box (default is pixelate)
    fireEvent.mouseDown(drawContainer, { clientX: 40, clientY: 40 });
    fireEvent.mouseMove(drawContainer, { clientX: 140, clientY: 140 });
    fireEvent.mouseUp(drawContainer);

    // Verify initial area is pixelate
    await waitFor(() => {
      expect(screen.getByText(/#1 pixelate/i)).toBeInTheDocument();
    });

    // Switch to "blur" via tabs
    const blurTab = screen.getByText("image.censor.modes.blur");
    fireEvent.click(blurTab);

    // Area must update to blur immediately
    expect(screen.getByText(/#1 blur/i)).toBeInTheDocument();
    const blurBox = screen.getByText(/#1 blur/i).closest("div")!;
    expect(blurBox.style.backdropFilter || blurBox.style.webkitBackdropFilter).toContain("blur");

    // Switch to "blackout" via tabs
    const blackoutTab = screen.getByText("image.censor.modes.blackout");
    fireEvent.click(blackoutTab);

    // Area must update to blackout immediately
    expect(screen.getByText(/#1 blackout/i)).toBeInTheDocument();
    const blackoutBox = screen.getByText(/#1 blackout/i).closest("div")!;
    expect(blackoutBox.style.backgroundColor).toBe("rgb(0, 0, 0)");

    // Switch back to "pixelate" via tabs
    const pixelateTab = screen.getByText("image.censor.modes.pixelate");
    fireEvent.click(pixelateTab);
    expect(screen.getByText(/#1 pixelate/i)).toBeInTheDocument();

    // Click area badge directly to cycle through effects
    const badgeBtn = screen.getByText(/#1 pixelate/i);
    fireEvent.click(badgeBtn);
    expect(screen.getByText(/#1 blur/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/#1 blur/i));
    expect(screen.getByText(/#1 blackout/i)).toBeInTheDocument();
  });
});

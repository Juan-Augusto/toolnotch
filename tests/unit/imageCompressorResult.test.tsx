import React from "react";
import { render, screen } from "@testing-library/react";
import ImageCompressorResult, {
  formatBytes,
} from "@/app/[locale]/tools/image/image-compressor/components/ImageCompressorResult";

describe("formatBytes helper", () => {
  it("formats bytes, KB, and MB correctly", () => {
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(65.6 * 1024)).toBe("65.6 KB");
    expect(formatBytes(1024 * 1024 * 2.5)).toBe("2.50 MB");
  });
});

describe("ImageCompressorResult Component", () => {
  const dummyFile = new File(["test data"], "sample.jpg", {
    type: "image/jpeg",
  });
  const dummyBlob = new Blob(["compressed data"], { type: "image/jpeg" });

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  it("renders success state when compression achieves savings", () => {
    render(
      <ImageCompressorResult
        originalFile={dummyFile}
        resultBlob={dummyBlob}
        originalSize={100000}
        compressedSize={70000}
        savings={30}
        format="jpg"
        onDownload={jest.fn()}
        onReset={jest.fn()}
        locale="pt"
      />
    );

    expect(screen.getByText("Imagem comprimida com sucesso!")).toBeInTheDocument();
    expect(screen.getByText("-30% Redução")).toBeInTheDocument();
    expect(screen.getByText("-30%")).toBeInTheDocument();
  });

  it("renders warning state when compressed size is larger than original", () => {
    render(
      <ImageCompressorResult
        originalFile={dummyFile}
        resultBlob={dummyBlob}
        originalSize={67174} // 65.6 KB
        compressedSize={79360} // 77.5 KB
        savings={-18}
        format="jpg"
        onDownload={jest.fn()}
        onReset={jest.fn()}
        locale="pt"
      />
    );

    expect(screen.queryByText("Imagem comprimida com sucesso!")).not.toBeInTheDocument();
    expect(screen.getByText("Aviso: O arquivo aumentou de tamanho")).toBeInTheDocument();
    expect(screen.getByText("+18% Aumento")).toBeInTheDocument();
    expect(screen.getByText("+18%")).toBeInTheDocument();
    expect(screen.getByText(/Por que o tamanho aumentou\?/i)).toBeInTheDocument();
  });

  it("renders unchanged state when compressed size equals original size", () => {
    render(
      <ImageCompressorResult
        originalFile={dummyFile}
        resultBlob={dummyBlob}
        originalSize={50000}
        compressedSize={50000}
        savings={0}
        format="jpg"
        onDownload={jest.fn()}
        onReset={jest.fn()}
        locale="pt"
      />
    );

    expect(screen.queryByText("Imagem comprimida com sucesso!")).not.toBeInTheDocument();
    expect(screen.getByText("Arquivo já otimizado")).toBeInTheDocument();
    expect(screen.getByText("0% Variação")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});

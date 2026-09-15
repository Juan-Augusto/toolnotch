import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PagePreviewModal from "@/app/[locale]/tools/pdf/organize-pdf/components/PagePreviewModal";
import SortablePageCard from "@/app/[locale]/tools/pdf/organize-pdf/components/SortablePageCard";

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock("@/lib/pdfToImage", () => ({
  renderPdfPage: jest.fn().mockResolvedValue("data:image/jpeg;base64,mockHighRes"),
  pdfToImages: jest.fn(),
}));

describe("Organize PDF Page Zoom & Preview", () => {
  const mockTranslations: Record<string, string> = {
    "card.pageLabel": "Pág. {number}",
    "card.originalLabel": "Orig. {number}",
    "card.rotateHint": "Girar 90°",
    "card.deleteHint": "Remover da ordem",
    "card.previewHint": "Ampliar e visualizar página",
    "previewModal.title": "Visualizar Página",
    "previewModal.pageIndicator": "Página {current} de {total}",
    "previewModal.originalLabel": "Original: Pág. {number}",
    "previewModal.zoomIn": "Aumentar zoom",
    "previewModal.zoomOut": "Diminuir zoom",
    "previewModal.resetZoom": "Ajustar à tela",
    "previewModal.rotate": "Girar 90°",
    "previewModal.remove": "Remover página",
    "previewModal.prevPage": "Página anterior",
    "previewModal.nextPage": "Próxima página",
    "previewModal.close": "Fechar visualização",
    "previewModal.shortcuts": "Atalhos: ← / → navegar • R girar • Esc fechar",
  };

  const t = (key: string, values?: Record<string, string | number>) => {
    let text = mockTranslations[key] || key;
    if (values) {
      for (const [k, v] of Object.entries(values)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  };

  describe("SortablePageCard", () => {
    it("calls onPreview when the zoom overlay or zoom button is clicked", () => {
      const handlePreview = jest.fn();
      const handleRotate = jest.fn();
      const handleRemove = jest.fn();

      render(
        <SortablePageCard
          id="page-0"
          originalIndex={0}
          currentIndex={0}
          rotation={0}
          previewUrl="data:image/jpeg;base64,thumb0"
          onRotate={handleRotate}
          onRemove={handleRemove}
          onPreview={handlePreview}
          pageLabel="Pág. 1"
          origLabel="Orig. 1"
          rotateHint="Girar 90°"
          deleteHint="Remover"
          previewHint="Ampliar e visualizar página"
        />
      );

      expect(screen.getByText("Pág. 1")).toBeInTheDocument();
      expect(screen.getByText("Orig. 1")).toBeInTheDocument();

      // Find preview buttons by title / aria-label
      const previewButtons = screen.getAllByRole("button", {
        name: "Ampliar e visualizar página",
      });
      expect(previewButtons.length).toBe(1);

      fireEvent.click(previewButtons[0]);
      expect(handlePreview).toHaveBeenCalledWith("page-0");
    });
  });

  describe("PagePreviewModal", () => {
    const mockPage = {
      id: "page-1",
      originalIndex: 1,
      rotation: 90,
      previewUrl: "data:image/jpeg;base64,thumb1",
    };

    it("renders page details and handles zoom controls", async () => {
      const handleClose = jest.fn();
      const handlePrev = jest.fn();
      const handleNext = jest.fn();
      const handleRotate = jest.fn();
      const handleRemove = jest.fn();

      render(
        <PagePreviewModal
          file={new File([""], "test.pdf", { type: "application/pdf" })}
          page={mockPage}
          currentIndex={1}
          totalPages={3}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={true}
          hasNext={true}
          onRotate={handleRotate}
          onRemove={handleRemove}
          t={t}
        />
      );

      // Verify page number indicators
      expect(screen.getByText("Página 2 de 3")).toBeInTheDocument();
      expect(screen.getByText("(Original: Pág. 2)")).toBeInTheDocument();

      await waitFor(() => {
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "data:image/jpeg;base64,mockHighRes");
      });

      // Zoom controls
      const zoomInBtn = screen.getByTitle("Aumentar zoom");
      const zoomOutBtn = screen.getByTitle("Diminuir zoom");
      expect(screen.getByText("100%")).toBeInTheDocument();

      fireEvent.click(zoomInBtn);
      expect(screen.getByText("125%")).toBeInTheDocument();

      fireEvent.click(zoomOutBtn);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("handles rotate and remove actions", () => {
      const handleClose = jest.fn();
      const handleRotate = jest.fn();
      const handleRemove = jest.fn();

      render(
        <PagePreviewModal
          file={null}
          page={mockPage}
          currentIndex={1}
          totalPages={3}
          onClose={handleClose}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          hasPrev={true}
          hasNext={true}
          onRotate={handleRotate}
          onRemove={handleRemove}
          t={t}
        />
      );

      const rotateBtn = screen.getByTitle("Girar 90°");
      fireEvent.click(rotateBtn);
      expect(handleRotate).toHaveBeenCalledWith("page-1");

      const removeBtn = screen.getByTitle("Remover página");
      fireEvent.click(removeBtn);
      expect(handleRemove).toHaveBeenCalledWith("page-1");
    });

    it("handles keyboard shortcuts (Escape, ArrowRight, ArrowLeft, R)", () => {
      const handleClose = jest.fn();
      const handlePrev = jest.fn();
      const handleNext = jest.fn();
      const handleRotate = jest.fn();

      render(
        <PagePreviewModal
          file={null}
          page={mockPage}
          currentIndex={1}
          totalPages={3}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={true}
          hasNext={true}
          onRotate={handleRotate}
          onRemove={jest.fn()}
          t={t}
        />
      );

      fireEvent.keyDown(window, { key: "ArrowRight" });
      expect(handleNext).toHaveBeenCalled();

      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(handlePrev).toHaveBeenCalled();

      fireEvent.keyDown(window, { key: "r" });
      expect(handleRotate).toHaveBeenCalledWith("page-1");

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});

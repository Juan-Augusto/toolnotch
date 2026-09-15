import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PageDeleteCard from "@/app/[locale]/tools/pdf/delete-pdf-pages/components/PageDeleteCard";
import DeletePagePreviewModal from "@/app/[locale]/tools/pdf/delete-pdf-pages/components/DeletePagePreviewModal";

jest.mock("@/lib/pdfToImage", () => ({
  renderPdfPage: jest.fn().mockResolvedValue("data:image/jpeg;base64,mockHighRes"),
  pdfToImages: jest.fn(),
}));

describe("Delete PDF Pages Zoom & Preview", () => {
  const mockTranslations: Record<string, string> = {
    "card.pageLabel": "Pág. {number}",
    "card.marked": "Remover",
    "card.keep": "Manter página",
    "card.previewHint": "Ampliar e visualizar página",
    "card.previewAction": "Visualizar",
    "previewModal.title": "Visualizar Página",
    "previewModal.pageIndicator": "Página {current} de {total}",
    "previewModal.zoomIn": "Aumentar zoom",
    "previewModal.zoomOut": "Diminuir zoom",
    "previewModal.resetZoom": "Ajustar à tela",
    "previewModal.markForDeletion": "Marcar para remoção",
    "previewModal.keepPage": "Manter página",
    "previewModal.markedBadge": "Marcada para remoção",
    "previewModal.keepBadge": "Página mantida",
    "previewModal.prevPage": "Página anterior",
    "previewModal.nextPage": "Próxima página",
    "previewModal.close": "Fechar visualização",
    "previewModal.shortcuts": "Atalhos: ← / → navegar • Espaço alternar remoção • Esc fechar",
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

  describe("PageDeleteCard", () => {
    it("calls onPreview when the top zoom button next to the page label is clicked", () => {
      const handleToggle = jest.fn();
      const handlePreview = jest.fn();

      render(
        <PageDeleteCard
          pageNumber={1}
          markedForDeletion={false}
          previewUrl="data:image/jpeg;base64,thumb1"
          onToggle={handleToggle}
          onPreview={handlePreview}
          pageLabel="Pág. 1"
          markedLabel="Remover"
          previewHint="Ampliar e visualizar página"
        />
      );

      expect(screen.getByText("Pág. 1")).toBeInTheDocument();

      const previewButtons = screen.getAllByRole("button", {
        name: "Ampliar e visualizar página",
      });
      expect(previewButtons.length).toBe(1);

      fireEvent.click(previewButtons[0]);
      expect(handlePreview).toHaveBeenCalledWith(1);

      // Clicking card or page title triggers toggle
      fireEvent.click(screen.getByText("Pág. 1"));
      expect(handleToggle).toHaveBeenCalledWith(1);
    });
  });

  describe("DeletePagePreviewModal", () => {
    const mockPage = {
      id: "del-page-0",
      pageNumber: 1,
      previewUrl: "data:image/jpeg;base64,thumb1",
    };

    it("renders page details and handles zoom controls", async () => {
      const handleClose = jest.fn();
      const handlePrev = jest.fn();
      const handleNext = jest.fn();
      const handleToggle = jest.fn();

      render(
        <DeletePagePreviewModal
          file={new File([""], "doc.pdf", { type: "application/pdf" })}
          page={mockPage}
          currentIndex={0}
          totalPages={5}
          markedForDeletion={false}
          onToggleDeletion={handleToggle}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={false}
          hasNext={true}
          t={t}
        />
      );

      expect(screen.getByText("Página 1 de 5")).toBeInTheDocument();
      expect(screen.getByText("Página mantida")).toBeInTheDocument();

      await waitFor(() => {
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "data:image/jpeg;base64,mockHighRes");
      });

      // Zoom in and out
      const zoomInBtn = screen.getByTitle("Aumentar zoom");
      const zoomOutBtn = screen.getByTitle("Diminuir zoom");
      expect(screen.getByText("100%")).toBeInTheDocument();

      fireEvent.click(zoomInBtn);
      expect(screen.getByText("125%")).toBeInTheDocument();

      fireEvent.click(zoomOutBtn);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("handles deletion toggle and keyboard shortcuts", () => {
      const handleClose = jest.fn();
      const handlePrev = jest.fn();
      const handleNext = jest.fn();
      const handleToggle = jest.fn();

      render(
        <DeletePagePreviewModal
          file={null}
          page={mockPage}
          currentIndex={0}
          totalPages={5}
          markedForDeletion={true}
          onToggleDeletion={handleToggle}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={true}
          hasNext={true}
          t={t}
        />
      );

      // Since markedForDeletion is true, button says "Manter página"
      const toggleBtn = screen.getByTitle("Manter página");
      fireEvent.click(toggleBtn);
      expect(handleToggle).toHaveBeenCalledWith(1);

      // Keyboard shortcuts
      fireEvent.keyDown(window, { key: " " });
      expect(handleToggle).toHaveBeenCalledWith(1);

      fireEvent.keyDown(window, { key: "ArrowRight" });
      expect(handleNext).toHaveBeenCalled();

      fireEvent.keyDown(window, { key: "ArrowLeft" });
      expect(handlePrev).toHaveBeenCalled();

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});

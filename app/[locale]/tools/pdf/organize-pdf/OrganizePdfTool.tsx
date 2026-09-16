"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import {
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ShieldCheck, Sparkles, Layers } from "lucide-react";
import { AppCard, AppDropfile } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import { pdfToImages } from "@/lib/pdfToImage";
import { organizePdf, PageConfig } from "@/lib/pdfOrganize";
import PdfToolHeader from "../components/PdfToolHeader";
import PdfProgressBar from "../components/PdfProgressBar";
import OrganizeToolbar from "./components/OrganizeToolbar";
import OrganizeGrid, { PageItem } from "./components/OrganizeGrid";
import OrganizeFooter from "./components/OrganizeFooter";
import PagePreviewModal from "./components/PagePreviewModal";
import OrganizeContent, { RichContent } from "./components/OrganizeContent";
import OrganizeResult from "./components/OrganizeResult";

interface OrganizePdfToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale: string;
}

export default function OrganizePdfTool({
  title,
  description,
  faqs,
  richContent,
  locale,
}: OrganizePdfToolProps) {
  const t = useTranslations("pdf.organize");
  const [, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [initialPages, setInitialPages] = useState<PageItem[]>([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resultPdfBytes, setResultPdfBytes] = useState<Uint8Array | null>(null);
  const [previewPageId, setPreviewPageId] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<"md" | "lg">("md");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleFileChange = async (selected: File | File[] | null) => {
    const single = Array.isArray(selected) ? selected[0] : selected;
    if (!single) {
      handleReset();
      return;
    }

    setFile(single);
    setError(null);
    setDone(false);
    setResultPdfBytes(null);
    setLoadingThumbnails(true);
    setProgress(null);

    try {
      const rendered = await pdfToImages(single, 0.75, (cur, tot) => {
        setProgress({ current: cur, total: tot });
      });

      const pageItems: PageItem[] = rendered.map((img, idx) => ({
        id: `page-${idx}`,
        originalIndex: idx,
        rotation: 0,
        previewUrl: img.dataUrl,
      }));

      setPages(pageItems);
      setInitialPages(pageItems);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoadingThumbnails(false);
      setProgress(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRotatePage = (id: string) => {
    setPages((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, rotation: (item.rotation + 90) % 360 }
          : item,
      ),
    );
  };

  const handleRemovePage = (id: string) => {
    setPages((prev) => {
      const removedIndex = prev.findIndex((item) => item.id === id);
      const nextPages = prev.filter((item) => item.id !== id);
      if (previewPageId === id) {
        if (nextPages.length === 0) {
          setPreviewPageId(null);
        } else if (removedIndex >= nextPages.length) {
          setPreviewPageId(nextPages[nextPages.length - 1].id);
        } else {
          setPreviewPageId(nextPages[removedIndex].id);
        }
      }
      return nextPages;
    });
  };

  const previewIndex = pages.findIndex((p) => p.id === previewPageId);
  const previewPage = previewIndex !== -1 ? pages[previewIndex] : null;

  const handleOpenPreview = (id: string) => {
    setPreviewPageId(id);
  };

  const handleClosePreview = () => {
    setPreviewPageId(null);
  };

  const handlePrevPreview = () => {
    if (previewIndex > 0) {
      setPreviewPageId(pages[previewIndex - 1].id);
    }
  };

  const handleNextPreview = () => {
    if (previewIndex < pages.length - 1) {
      setPreviewPageId(pages[previewIndex + 1].id);
    }
  };

  const handleRotateAll = () => {
    setPages((prev) =>
      prev.map((item) => ({ ...item, rotation: (item.rotation + 90) % 360 })),
    );
  };

  const handleResetOrder = () => {
    setPages(initialPages.map((p) => ({ ...p, rotation: 0 })));
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) {
      setError(t("errors.noPages"));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const configs: PageConfig[] = pages.map((p) => ({
        originalIndex: p.originalIndex,
        rotation: p.rotation,
      }));

      const bytes = await organizePdf(file, configs);
      setResultPdfBytes(bytes);
      setDone(true);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!resultPdfBytes || !file) return;
    const blob = new Blob([resultPdfBytes as unknown as BlobPart], {
      type: "application/pdf",
    });
    const safeName = file.name.replace(/\.pdf$/i, "") + "_organizado.pdf";
    saveAs(blob, safeName);
  };

  const handleReset = () => {
    startTransition(() => {
      setFile(null);
      setPages([]);
      setInitialPages([]);
      setError(null);
      setDone(false);
      setResultPdfBytes(null);
      setProgress(null);
      setPreviewPageId(null);
    });
  };

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background py-3 sm:py-6 md:py-8">
      <div className="w-full">
        <PdfToolHeader
          title={title}
          description={description}
          locale={locale}
          badges={[
            {
              text: t("badges.noUpload"),
              bg: "bg-primary",
              textColor: "text-background",
              icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text: t("badges.reorder"),
              bg: "bg-secondary",
              textColor: "text-background",
              icon: <Layers className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text: t("badges.free"),
              bg: "bg-foreground",
              textColor: "text-background",
              icon: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
            },
          ]}
        />

        <AppCard
          border
          cornerAccents={true}
          className="p-1.5 sm:p-4 md:p-6 lg:p-8 bg-tertiary mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto"
        >
          <div className="space-y-3 sm:space-y-5">
            {!done ? (
              <>
                {!file ? (
                  <AppDropfile
                    id="organize-pdf-dropfile"
                    accept=".pdf,application/pdf"
                    multiple={false}
                    title={t("dropZone.label")}
                    description={t("dropZone.hint")}
                    value={file}
                    onFileChange={handleFileChange}
                    showSelectedFiles={false}
                    disabled={loadingThumbnails}
                    error={error || undefined}
                  />
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <OrganizeToolbar
                      fileName={file.name}
                      summaryText={t("actions.summary", {
                        selected: pages.length,
                        total: initialPages.length,
                      })}
                      gridSize={gridSize}
                      onGridSizeChange={setGridSize}
                      onRotateAll={handleRotateAll}
                      onResetOrder={handleResetOrder}
                      canRotate={pages.length > 0}
                      disabled={saving || loadingThumbnails}
                      t={t}
                    />

                    {loadingThumbnails && (
                      <PdfProgressBar
                        label={t("processing.rendering")}
                        current={progress?.current}
                        total={progress?.total}
                      />
                    )}

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-[2px] text-xs">
                        {error}
                      </div>
                    )}

                    <OrganizeGrid
                      pages={pages}
                      sensors={sensors}
                      gridSize={gridSize}
                      onDragEnd={handleDragEnd}
                      onRotatePage={handleRotatePage}
                      onRemovePage={handleRemovePage}
                      onPreview={handleOpenPreview}
                      t={t}
                    />

                    <OrganizeFooter
                      onSave={handleSave}
                      onReset={handleReset}
                      saving={saving}
                      disabled={loadingThumbnails || pages.length === 0}
                      saveLabel={t("button.save")}
                      savingLabel={t("button.saving")}
                      clearLabel={t("button.clearFile")}
                    />
                  </div>
                )}
              </>
            ) : (
              <OrganizeResult
                fileName={file ? file.name : "documento.pdf"}
                pageCount={pages.length}
                onDownload={handleDownload}
                onReset={handleReset}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <OrganizeContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>

      {previewPage && (
        <PagePreviewModal
          key={previewPage.id}
          file={file}
          page={previewPage}
          currentIndex={previewIndex}
          totalPages={pages.length}
          onRotate={handleRotatePage}
          onRemove={handleRemovePage}
          onClose={handleClosePreview}
          onPrev={handlePrevPreview}
          onNext={handleNextPreview}
          hasPrev={previewIndex > 0}
          hasNext={previewIndex < pages.length - 1}
          t={t}
        />
      )}
    </main>
  );
}

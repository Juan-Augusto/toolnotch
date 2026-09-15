"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import { ShieldCheck, Sparkles, Scissors } from "lucide-react";
import { AppCard, AppDropfile, AppInput } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import { pdfToImages } from "@/lib/pdfToImage";
import { deletePdfPages, parsePageRanges } from "@/lib/pdfDeletePages";
import PdfToolHeader from "../components/PdfToolHeader";
import PdfProgressBar from "../components/PdfProgressBar";
import DeletePagesToolbar from "./components/DeletePagesToolbar";
import DeletePagesGrid, { PageItem } from "./components/DeletePagesGrid";
import DeletePagesFooter from "./components/DeletePagesFooter";
import DeletePagePreviewModal from "./components/DeletePagePreviewModal";
import DeletePagesContent, {
  RichContent,
} from "./components/DeletePagesContent";
import DeletePagesResult from "./components/DeletePagesResult";

interface DeletePdfPagesToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale: string;
}

function formatPageRanges(set: Set<number>): string {
  const sorted = Array.from(set)
    .sort((a, b) => a - b)
    .map((x) => x + 1);
  if (sorted.length === 0) return "";
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = start;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === prev + 1) {
      prev = sorted[i];
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = sorted[i];
      prev = start;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(", ");
}

export default function DeletePdfPagesTool({
  title,
  description,
  faqs,
  richContent,
  locale,
}: DeletePdfPagesToolProps) {
  const t = useTranslations("pdf.deletePages");
  const [, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [markedIndices, setMarkedIndices] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [loadingThumbnails, setLoadingThumbnails] = useState(false);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resultPdfBytes, setResultPdfBytes] = useState<Uint8Array | null>(null);
  const [previewPageNumber, setPreviewPageNumber] = useState<number | null>(
    null,
  );
  const [gridSize, setGridSize] = useState<"md" | "lg">("md");

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
    setMarkedIndices(new Set());
    setRangeInput("");
    setLoadingThumbnails(true);
    setProgress(null);

    try {
      const rendered = await pdfToImages(single, 0.75, (cur, tot) => {
        setProgress({ current: cur, total: tot });
      });

      const pageItems: PageItem[] = rendered.map((img, idx) => ({
        id: `del-page-${idx}`,
        pageNumber: idx + 1,
        previewUrl: img.dataUrl,
      }));

      setPages(pageItems);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoadingThumbnails(false);
      setProgress(null);
    }
  };

  const togglePage = (pageNumber: number) => {
    const zeroIndex = pageNumber - 1;
    setMarkedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(zeroIndex)) {
        next.delete(zeroIndex);
      } else {
        next.add(zeroIndex);
      }
      setRangeInput(formatPageRanges(next));
      return next;
    });
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRangeInput(val);
    const parsed = parsePageRanges(val, pages.length);
    setMarkedIndices(parsed);
  };

  const handleSelectAll = () => {
    const all = new Set<number>();
    for (let i = 0; i < pages.length; i++) all.add(i);
    setMarkedIndices(all);
    setRangeInput(formatPageRanges(all));
  };

  const handleClearSelection = () => {
    setMarkedIndices(new Set());
    setRangeInput("");
  };

  const handleInvertSelection = () => {
    const inverted = new Set<number>();
    for (let i = 0; i < pages.length; i++) {
      if (!markedIndices.has(i)) inverted.add(i);
    }
    setMarkedIndices(inverted);
    setRangeInput(formatPageRanges(inverted));
  };

  const previewIndex = pages.findIndex(
    (p) => p.pageNumber === previewPageNumber,
  );
  const previewPage = previewIndex !== -1 ? pages[previewIndex] : null;

  const handleOpenPreview = (pageNum: number) => {
    setPreviewPageNumber(pageNum);
  };

  const handleClosePreview = () => {
    setPreviewPageNumber(null);
  };

  const handlePrevPreview = () => {
    if (previewIndex > 0) {
      setPreviewPageNumber(pages[previewIndex - 1].pageNumber);
    }
  };

  const handleNextPreview = () => {
    if (previewIndex < pages.length - 1) {
      setPreviewPageNumber(pages[previewIndex + 1].pageNumber);
    }
  };

  const handleDelete = async () => {
    if (!file || pages.length === 0) return;

    if (markedIndices.size === 0) {
      return;
    }

    if (markedIndices.size >= pages.length) {
      setError(t("errors.cannotDeleteAll"));
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const bytes = await deletePdfPages(file, markedIndices);
      setResultPdfBytes(bytes);
      setDone(true);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!resultPdfBytes || !file) return;
    const blob = new Blob([resultPdfBytes as unknown as BlobPart], {
      type: "application/pdf",
    });
    const safeName = file.name.replace(/\.pdf$/i, "") + "_limpo.pdf";
    saveAs(blob, safeName);
  };

  const handleReset = () => {
    startTransition(() => {
      setFile(null);
      setPages([]);
      setMarkedIndices(new Set());
      setRangeInput("");
      setError(null);
      setDone(false);
      setResultPdfBytes(null);
      setProgress(null);
      setPreviewPageNumber(null);
    });
  };

  const remainingCount = Math.max(0, pages.length - markedIndices.size);

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
              text: t("badges.visual"),
              bg: "bg-secondary",
              textColor: "text-background",
              icon: <Scissors className="w-3.5 h-3.5 shrink-0" />,
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
                    id="delete-pdf-pages-dropfile"
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
                    <div className="p-2 sm:p-3.5 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3.5">
                      <DeletePagesToolbar
                        fileName={file.name}
                        summaryText={t("actions.summary", {
                          toDelete: markedIndices.size,
                          remaining: remainingCount,
                        })}
                        gridSize={gridSize}
                        onGridSizeChange={setGridSize}
                        onSelectAll={handleSelectAll}
                        onClearSelection={handleClearSelection}
                        onInvertSelection={handleInvertSelection}
                        canClear={markedIndices.size > 0}
                        disabled={deleting || loadingThumbnails}
                        t={t}
                      />

                      <div>
                        <AppInput
                          id="delete-pages-range-input"
                          label={t("input.label")}
                          placeholder={t("input.placeholder")}
                          helperText={t("input.hint")}
                          value={rangeInput}
                          onChange={handleRangeInputChange}
                          disabled={deleting || loadingThumbnails}
                        />
                      </div>
                    </div>

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

                    <DeletePagesGrid
                      pages={pages}
                      markedIndices={markedIndices}
                      gridSize={gridSize}
                      onToggle={togglePage}
                      onPreview={handleOpenPreview}
                      t={t}
                    />

                    <DeletePagesFooter
                      onDelete={handleDelete}
                      onReset={handleReset}
                      deleting={deleting}
                      disabled={
                        loadingThumbnails ||
                        markedIndices.size === 0 ||
                        markedIndices.size >= pages.length
                      }
                      deleteLabel={t("button.delete")}
                      deletingLabel={t("button.deleting")}
                      clearLabel={t("button.clearFile")}
                    />
                  </div>
                )}
              </>
            ) : (
              <DeletePagesResult
                fileName={file ? file.name : "documento.pdf"}
                pagesRemovedCount={markedIndices.size}
                pagesRemainingCount={remainingCount}
                onDownload={handleDownload}
                onReset={handleReset}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <DeletePagesContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>

      {previewPage && (
        <DeletePagePreviewModal
          key={previewPage.id}
          file={file}
          page={previewPage}
          currentIndex={previewIndex}
          totalPages={pages.length}
          markedForDeletion={markedIndices.has(previewIndex)}
          onToggleDeletion={togglePage}
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

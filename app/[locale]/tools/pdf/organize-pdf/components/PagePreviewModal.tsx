"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Trash2,
  Loader2,
} from "lucide-react";
import { renderPdfPage } from "@/lib/pdfToImage";

interface PagePreviewItem {
  id: string;
  originalIndex: number;
  rotation: number;
  previewUrl: string;
}

interface PagePreviewModalProps {
  file: File | null;
  page: PagePreviewItem | null;
  currentIndex: number;
  totalPages: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

// Cache for high-res renders across page previews
const highResCache = new Map<string, string>();

export default function PagePreviewModal({
  file,
  page,
  currentIndex,
  totalPages,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onRotate,
  onRemove,
  t,
}: PagePreviewModalProps) {
  const cacheKey = file && page ? `${file.name}-${page.originalIndex}` : "";

  const [zoom, setZoom] = useState<number>(100);
  const [highResUrl, setHighResUrl] = useState<string | null>(
    () => (cacheKey ? highResCache.get(cacheKey) || null : null)
  );
  const [loadingHighRes, setLoadingHighRes] = useState<boolean>(
    () => Boolean(file && page && !highResCache.has(cacheKey))
  );

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // Fetch high-res version of the current page if not in cache
  useEffect(() => {
    if (!page || !file) return;

    const key = `${file.name}-${page.originalIndex}`;
    if (highResCache.has(key)) return;

    let isMounted = true;

    renderPdfPage(file, page.originalIndex + 1, 2)
      .then((url) => {
        if (isMounted) {
          highResCache.set(key, url);
          setHighResUrl(url);
          setLoadingHighRes(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadingHighRes(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [page, file]);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (hasPrev) onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (hasNext) onNext();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        if (page) onRotate(page.id);
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setZoom((prev) => Math.min(prev + 25, 300));
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setZoom((prev) => Math.max(prev - 25, 50));
      } else if (e.key === "0") {
        e.preventDefault();
        setZoom(100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext, onClose, onRotate, page]);

  if (!page) return null;

  const currentDisplayUrl = highResUrl || page.previewUrl;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("previewModal.title")}
      className="fixed inset-0 z-50 flex flex-col bg-background/90 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-150"
    >
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-2.5 sm:px-4 py-2 sm:py-3 bg-tertiary border-b border-border text-foreground shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
              {t("previewModal.pageIndicator", {
                current: currentIndex + 1,
                total: totalPages,
              })}
            </span>
            <span className="text-[11px] text-label">
              ({t("previewModal.originalLabel", { number: page.originalIndex + 1 })})
            </span>
          </div>

          {loadingHighRes && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-label">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>HD</span>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="p-1.5 text-label hover:text-foreground hover:bg-background rounded transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title={t("previewModal.zoomOut")}
            aria-label={t("previewModal.zoomOut")}
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 py-1 text-xs font-mono font-medium text-foreground bg-background border border-border hover:border-foreground/30 rounded transition-colors cursor-pointer min-w-[52px] text-center"
            title={t("previewModal.resetZoom")}
            aria-label={t("previewModal.resetZoom")}
          >
            {zoom}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 300}
            className="p-1.5 text-label hover:text-foreground hover:bg-background rounded transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title={t("previewModal.zoomIn")}
            aria-label={t("previewModal.zoomIn")}
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 text-label hover:text-foreground hover:bg-background rounded transition-colors cursor-pointer hidden sm:inline-flex"
            title={t("previewModal.resetZoom")}
            aria-label={t("previewModal.resetZoom")}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-label hover:text-foreground hover:bg-background rounded transition-colors cursor-pointer"
            title={t("previewModal.close")}
            aria-label={t("previewModal.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Preview Area */}
      <div className="relative flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center select-none bg-background/50">
        {/* Previous Page Floating Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={`absolute left-1.5 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-tertiary/90 hover:bg-tertiary border border-border shadow-md flex items-center justify-center transition-all ${
            hasPrev
              ? "text-foreground hover:scale-105 cursor-pointer"
              : "opacity-30 text-label cursor-not-allowed pointer-events-none"
          }`}
          title={t("previewModal.prevPage")}
          aria-label={t("previewModal.prevPage")}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Page Floating Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={`absolute right-1.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-tertiary/90 hover:bg-tertiary border border-border shadow-md flex items-center justify-center transition-all ${
            hasNext
              ? "text-foreground hover:scale-105 cursor-pointer"
              : "opacity-30 text-label cursor-not-allowed pointer-events-none"
          }`}
          title={t("previewModal.nextPage")}
          aria-label={t("previewModal.nextPage")}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Zoomable Image Container */}
        <div
          className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center",
          }}
        >
          <div className="relative shadow-2xl rounded-[2px] overflow-hidden bg-white border border-border">
            <img
              src={currentDisplayUrl}
              alt={t("card.pageLabel", { number: currentIndex + 1 })}
              className="max-h-[calc(100vh-180px)] max-w-[calc(100vw-80px)] sm:max-w-[calc(100vw-140px)] object-contain transition-transform duration-200"
              style={{
                transform: `rotate(${page.rotation}deg)`,
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Action Bar */}
      <footer className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-tertiary border-t border-border shrink-0 text-foreground">
        <div className="flex items-center gap-2">
          {/* Rotate Page Button */}
          <button
            type="button"
            onClick={() => onRotate(page.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background hover:bg-tertiary text-foreground border border-border hover:border-foreground/40 rounded-[2px] transition-colors cursor-pointer"
            title={t("previewModal.rotate")}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t("previewModal.rotate")}</span>
          </button>

          {/* Remove Page Button */}
          <button
            type="button"
            onClick={() => onRemove(page.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 rounded-[2px] transition-colors cursor-pointer"
            title={t("previewModal.remove")}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t("previewModal.remove")}</span>
          </button>
        </div>

        {/* Shortcuts Hint */}
        <div className="hidden md:block text-[11px] text-label">
          <span>{t("previewModal.shortcuts")}</span>
        </div>

        {/* Close Button */}
        <div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-foreground bg-background hover:bg-tertiary border border-border rounded-[2px] transition-colors cursor-pointer"
          >
            {t("previewModal.close")}
          </button>
        </div>
      </footer>
    </div>
  );
}

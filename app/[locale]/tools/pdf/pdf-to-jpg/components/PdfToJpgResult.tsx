"use client";

import { Download } from "lucide-react";
import { AppButton } from "@/components/ui";
import PdfToJpgPreviewCard from "./PdfToJpgPreviewCard";

interface PdfToJpgResultProps {
  images: { name: string; dataUrl: string }[];
  fileName: string;
  onDownloadAll: () => void;
  onDownloadSingle: (index: number) => void;
  onReset: () => void;
  resetLabel: string;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function PdfToJpgResult({
  images,
  fileName,
  onDownloadAll,
  onDownloadSingle,
  onReset,
  resetLabel,
  locale,
  t,
}: PdfToJpgResultProps) {
  const isSingle = images.length === 1;
  const countLabel = isSingle
    ? t("pageCountSingular")
    : t("pageCountPlural");

  return (
    <div className="space-y-6 animate-fade-in" aria-live="polite">
      <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-bold text-sm shrink-0">
            ✓
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold uppercase text-foreground">
              {t("result.title")}
            </p>
            <p className="text-xs text-label mt-1">
              {t("result.description")}
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center font-bold px-3 py-1 rounded-[2px] text-xs uppercase tracking-wider shrink-0 bg-primary text-background">
          {images.length} {countLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.pagesConverted")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-foreground">
              {images.length}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Resolução 2x otimizada"
              : locale === "es"
                ? "Resolución 2x optimizada"
                : "2x optimized resolution"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.format")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-secondary">
              JPEG
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Qualidade máxima 92%"
              : locale === "es"
                ? "Calidad máxima 92%"
                : "Maximum quality 92%"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.package")}
          </span>
          <div className="my-2">
            <span className="text-base font-bold text-primary truncate block" title={fileName}>
              {isSingle ? t("result.singleJpg") : t("result.zipArchive")}
            </span>
          </div>
          <span className="text-xs text-label truncate" title={fileName}>
            {fileName}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              {locale === "pt"
                ? "Páginas do Documento"
                : locale === "es"
                  ? "Páginas del Documento"
                  : "Document Pages"}
            </span>
            <span className="px-2 py-0.5 text-xs font-bold bg-primary text-background rounded-[2px]">
              {images.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-1">
          {images.map((img, idx) => (
            <PdfToJpgPreviewCard
              key={img.name}
              name={img.name}
              dataUrl={img.dataUrl}
              pageNumber={idx + 1}
              pageLabel={t("result.pageBadge", { number: idx + 1 })}
              downloadLabel={t("button.downloadPage")}
              onDownload={() => onDownloadSingle(idx)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <AppButton
          onClick={onDownloadAll}
          color="primary"
          icon={<Download className="w-4 h-4" />}
        >
          {isSingle
            ? t("button.downloadOne")
            : t("button.downloadZip", { count: images.length })}
        </AppButton>
        <AppButton onClick={onReset} color="tertiary">
          {resetLabel}
        </AppButton>
      </div>
    </div>
  );
}

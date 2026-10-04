"use client";

import { Download } from "lucide-react";
import { AppButton } from "@/components/ui";

interface MergeResultProps {
  fileName: string;
  sizeBytes: number;
  filesCount: number;
  totalPages: number;
  onDownload: () => void;
  onReset: () => void;
  resetLabel: string;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MergeResult({
  fileName,
  sizeBytes,
  filesCount,
  totalPages,
  onDownload,
  onReset,
  resetLabel,
  locale,
  t,
}: MergeResultProps) {
  const filesLabel =
    filesCount === 1
      ? locale === "en"
        ? "file"
        : "arquivo"
      : locale === "en"
        ? "files"
        : "arquivos";

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
          {filesCount} {filesLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.filesMerged")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-foreground">
              {filesCount}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Arquivos na ordem definida"
              : locale === "es"
                ? "Archivos en orden definido"
                : "Files in specified order"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.totalPages")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-secondary">
              {totalPages}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Páginas combinadas"
              : locale === "es"
                ? "Páginas combinadas"
                : "Combined pages"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.finalSize")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-primary">
              {formatBytes(sizeBytes)}
            </span>
          </div>
          <span className="text-xs text-label truncate" title={fileName}>
            {fileName}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <AppButton
          onClick={onDownload}
          color="primary"
          icon={<Download className="w-4 h-4" />}
        >
          {t("button.download")}
        </AppButton>
        <AppButton onClick={onReset} color="tertiary">
          {resetLabel}
        </AppButton>
      </div>
    </div>
  );
}

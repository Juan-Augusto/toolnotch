"use client";

import React from "react";
import { Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { AppButton } from "@/components/ui";

interface ConvertHeicToJpgResultProps {
  originalSize: number;
  convertedSize: number;
  width?: number;
  height?: number;
  fileName: string;
  previewUrl: string;
  onDownload: () => void;
  onReset: () => void;
  resetLabel: string;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ConvertHeicToJpgResult({
  originalSize,
  convertedSize,
  width,
  height,
  fileName,
  previewUrl,
  onDownload,
  onReset,
  resetLabel,
  locale,
  t,
}: ConvertHeicToJpgResultProps) {
  const outFileName = fileName.replace(/\.(heic|heif)$/i, "") + ".jpg";

  return (
    <div className="space-y-6 animate-fade-in" aria-live="polite">
      {/* Banner de Sucesso */}
      <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-bold text-sm shrink-0">
            ✓
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold uppercase text-foreground">
              {t("result.title")}
            </p>
            <p className="text-xs text-label mt-0.5">
              {t("result.subtitle")}
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center font-bold px-3 py-1 rounded-[2px] text-xs uppercase tracking-wider shrink-0 bg-primary text-background flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 shrink-0" />
          {t("result.formatTag")}
        </span>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.originalSize")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-foreground">
              {formatBytes(originalSize)}
            </span>
          </div>
          <span className="text-xs text-label">Apple HEIC</span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.convertedSize")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-secondary">
              {formatBytes(convertedSize)}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "JPG Universal"
              : locale === "es"
                ? "JPG Universal"
                : "Universal JPG"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {locale === "pt" ? "Resolução" : locale === "es" ? "Resolución" : "Resolution"}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-primary">
              {width && height ? `${width} × ${height}` : "100%"}
            </span>
            {width && <span className="text-xs text-label ml-1">px</span>}
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Qualidade fotográfica"
              : locale === "es"
                ? "Calidad fotográfica"
                : "Photographic quality"}
          </span>
        </div>
      </div>

      {/* Pré-visualização do JPG Convertido */}
      <div className="p-4 bg-background border border-border rounded-[2px] space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs text-label border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
              {outFileName}
            </span>
          </div>
          {width && height && (
            <span className="text-xs bg-tertiary px-2 py-0.5 rounded-[2px] border border-border">
              {t("result.dimensions", { width, height })}
            </span>
          )}
        </div>

        <div className="relative w-full max-h-72 sm:max-h-96 min-h-[160px] flex items-center justify-center bg-tertiary/50 border border-border/60 rounded-[2px] overflow-hidden p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={outFileName}
            className="max-h-64 sm:max-h-80 max-w-full object-contain relative z-10 rounded-[2px]"
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
        <AppButton
          onClick={onDownload}
          color="primary"
          withArrow
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2 shrink-0" />
          {t("button.download")}
        </AppButton>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0 font-mono"
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}

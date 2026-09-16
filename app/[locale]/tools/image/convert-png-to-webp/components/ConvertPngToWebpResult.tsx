"use client";

import React from "react";
import Image from "next/image";
import { Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { AppButton } from "@/components/ui";

interface ConvertPngToWebpResultProps {
  originalSize: number;
  convertedSize: number;
  savings: number;
  width?: number;
  height?: number;
  fileName: string;
  previewUrl: string;
  originalPreviewUrl?: string;
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

export default function ConvertPngToWebpResult({
  originalSize,
  convertedSize,
  savings,
  width,
  height,
  fileName,
  previewUrl,
  originalPreviewUrl,
  onDownload,
  onReset,
  resetLabel,
  locale,
  t,
}: ConvertPngToWebpResultProps) {
  const bytesSaved = Math.max(0, originalSize - convertedSize);
  const outFileName = fileName.replace(/\.png$/i, "") + ".webp";

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
              {savings > 0
                ? locale === "pt"
                  ? `Sua imagem ficou ${savings}% menor com total preservação de transparência.`
                  : locale === "es"
                    ? `Tu imagen es un ${savings}% más ligera con total transparencia conservada.`
                    : `Your image is ${savings}% smaller with full alpha transparency preserved.`
                : t("result.subtitle")}
            </p>
          </div>
        </div>

        <span
          className={`self-start sm:self-center font-bold px-3 py-1 rounded-[2px] text-xs uppercase tracking-wider shrink-0 ${
            savings > 0 ? "bg-primary text-background" : "bg-card text-label"
          }`}
        >
          {savings > 0 ? t("result.smaller", { savings }) : t("result.noReduction")}
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
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Formato original PNG"
              : locale === "es"
                ? "Formato original PNG"
                : "Original PNG file"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.reduction")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-secondary">
              {savings > 0 ? `-${savings}%` : "0%"}
            </span>
          </div>
          <span className="text-xs text-label">
            {savings > 0
              ? `${formatBytes(bytesSaved)} ${t("result.saved")}`
              : locale === "pt"
                ? "Tamanho mantido"
                : locale === "es"
                  ? "Tamaño conservado"
                  : "Size preserved"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.convertedSize")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-primary">
              {formatBytes(convertedSize)}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Novo formato WebP otimizado"
              : locale === "es"
                ? "Nuevo formato WebP optimizado"
                : "Optimized WebP file"}
          </span>
        </div>
      </div>

      {/* Pré-visualização da Imagem */}
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
              {width} × {height} px
            </span>
          )}
        </div>

        <div className="relative w-full max-h-72 sm:max-h-96 min-h-[160px] flex items-center justify-center bg-tertiary/50 border border-border/60 rounded-[2px] overflow-hidden p-2">
          {/* Fundo xadrez sutil para indicar transparência */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
            }}
          />
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
          {t("button.download")} ({outFileName})
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

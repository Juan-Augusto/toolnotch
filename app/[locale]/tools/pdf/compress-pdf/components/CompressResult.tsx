"use client";

import { Download } from "lucide-react";
import { AppButton } from "@/components/ui";

interface CompressResultProps {
  originalSize: number;
  compressedSize: number;
  savings: number;
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

export default function CompressResult({
  originalSize,
  compressedSize,
  savings,
  onDownload,
  onReset,
  resetLabel,
  locale,
  t,
}: CompressResultProps) {
  const bytesSaved = Math.max(0, originalSize - compressedSize);
  const ratio = Math.max(
    8,
    Math.min(100, Math.round((compressedSize / originalSize) * 100)),
  );

  return (
    <div className="space-y-6 animate-fade-in" aria-live="polite">
      <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-bold text-sm shrink-0">
            ✓
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold uppercase text-foreground">
              {locale === "pt"
                ? "PDF Comprimido com Sucesso!"
                : locale === "es"
                  ? "¡PDF Comprimido con Éxito!"
                  : "PDF Successfully Compressed!"}
            </p>
            <p className="text-xs text-label mt-1">
              {savings > 0
                ? locale === "pt"
                  ? `Seu documento ficou ${savings}% menor sem perder a estrutura interna.`
                  : locale === "es"
                    ? `Tu documento es ${savings}% más pequeño sin perder la estructura interna.`
                    : `Your document is ${savings}% smaller without losing internal structure.`
                : locale === "pt"
                  ? "Este arquivo já estava no tamanho ideal e totalmente otimizado."
                  : locale === "es"
                    ? "Este archivo ya estaba en el tamaño ideal y optimizado."
                    : "This file was already fully optimized."}
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
              ? "100% do tamanho inicial"
              : locale === "es"
                ? "100% del tamaño inicial"
                : "100% initial baseline"}
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
              ? `${formatBytes(bytesSaved)} ${
                  locale === "pt"
                    ? "economizados"
                    : locale === "es"
                      ? "ahorrados"
                      : "saved"
                }`
              : locale === "pt"
                ? "Tamanho preservado"
                : locale === "es"
                  ? "Tamaño conservado"
                  : "Size preserved"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.compressedSize")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-primary">
              {formatBytes(compressedSize)}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Novo tamanho otimizado"
              : locale === "es"
                ? "Nuevo tamaño optimizado"
                : "New optimized size"}
          </span>
        </div>
      </div>

      <div className="p-4 bg-background border border-border rounded-[2px] space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-label">
            {locale === "pt"
              ? "Comparativo Visual de Tamanho"
              : locale === "es"
                ? "Comparación Visual de Tamaño"
                : "Visual Size Comparison"}
          </span>
          <span className="text-foreground font-semibold">
            {formatBytes(compressedSize)} / {formatBytes(originalSize)}
          </span>
        </div>
        <div className="w-full bg-tertiary h-3 rounded-[2px] overflow-hidden flex border border-border/50">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${ratio}%` }}
          />
          <div className="bg-secondary/20 h-full flex-1" />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-label/80">
          <span>0 MB</span>
          <span className="text-secondary font-semibold">
            {savings > 0
              ? `${savings}% ${
                  locale === "pt"
                    ? "de economia"
                    : locale === "es"
                      ? "de ahorro"
                      : "space saved"
                }`
              : ""}
          </span>
          <span>{formatBytes(originalSize)}</span>
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

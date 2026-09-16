"use client";

import React, { useState } from "react";
import { Download, Check, Copy, Package, FileCode } from "lucide-react";
import { AppButton } from "@/components/ui";
import type { FaviconItem } from "@/lib/faviconGenerator";

interface FaviconGeneratorResultProps {
  items: FaviconItem[];
  zipBlob: Blob;
  zipSize: number;
  htmlSnippet: string;
  onDownloadZip: () => void;
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

export default function FaviconGeneratorResult({
  items,
  zipSize,
  htmlSnippet,
  onDownloadZip,
  onReset,
  resetLabel,
  locale,
  t,
}: FaviconGeneratorResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback se navigator.clipboard falhar
      const textarea = document.createElement("textarea");
      textarea.value = htmlSnippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

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
          <Package className="w-3 h-3 shrink-0" />
          ZIP {formatBytes(zipSize)}
        </span>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.totalFiles")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-primary">8</span>
            <span className="text-xs text-label ml-1">
              {locale === "pt" ? "arquivos" : locale === "es" ? "archivos" : "files"}
            </span>
          </div>
          <span className="text-xs text-label">
            {t("result.icoIncluded")}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.sizesGenerated")}
          </span>
          <div className="my-2">
            <span className="text-sm font-bold text-foreground">
              16, 32, 48, 180, 192, 512
            </span>
            <span className="text-xs text-label ml-1">px</span>
          </div>
          <span className="text-xs text-label">
            Web, iOS, Android & PWA
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {t("result.zipSize")}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-secondary">
              {formatBytes(zipSize)}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt" ? "Compactado (.zip)" : locale === "es" ? "Comprimido (.zip)" : "Compressed (.zip)"}
          </span>
        </div>
      </div>

      {/* Galeria de Ícones Gerados */}
      <div className="p-4 bg-background border border-border rounded-[2px] space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs text-label border-b border-border pb-2.5">
          <span className="font-bold uppercase tracking-wider text-foreground">
            {locale === "pt"
              ? "Pré-visualização"
              : locale === "es"
                ? "Vista Previa"
                : "Preview"}
          </span>
          <span className="text-xs text-primary font-semibold">
            {items.length} {locale === "pt" ? "ativos" : locale === "es" ? "activos" : "assets"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-between p-3 bg-tertiary border border-border rounded-[2px] text-center gap-2"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-background/50 border border-border/40 rounded-[2px] overflow-hidden p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground truncate max-w-[80px]">
                  {item.name}
                </p>
                <p className="text-[9px] text-label">
                  {item.size}×{item.size} px
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snippet de Código HTML para Inserir no <head> */}
      <div className="p-4 bg-background border border-border rounded-[2px] space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-primary" />
            {t("settings.htmlSnippetTitle")}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-[2px] bg-tertiary hover:bg-primary/20 hover:text-primary transition-colors border border-border cursor-pointer text-foreground"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>{t("settings.copiedHtml")}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t("settings.copyHtml")}</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3 bg-tertiary border border-border rounded-[2px] text-[11px] text-label overflow-x-auto select-all leading-relaxed">
          <code>{htmlSnippet}</code>
        </pre>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
        <AppButton
          onClick={onDownloadZip}
          color="primary"
          withArrow
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2 shrink-0" />
          {t("button.downloadZip")}
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

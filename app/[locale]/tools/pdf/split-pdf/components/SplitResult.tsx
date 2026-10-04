"use client";

import { Download } from "lucide-react";
import { AppButton } from "@/components/ui";
import SplitFileCard from "./SplitFileCard";

export interface SplitResultItem {
  name: string;
  bytes: Uint8Array;
  sizeBytes: number;
}

interface SplitResultProps {
  originalFileName: string;
  totalPages: number | null;
  resultsCount: number;
  isZip: boolean;
  items?: SplitResultItem[];
  onDownload: () => void;
  onDownloadItem?: (item: SplitResultItem) => void;
  onReset: () => void;
  resetLabel: string;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function SplitResult({
  originalFileName,
  totalPages,
  resultsCount,
  isZip,
  items,
  onDownload,
  onDownloadItem,
  onReset,
  resetLabel,
  locale,
  t,
}: SplitResultProps) {
  return (
    <div className="space-y-6 animate-fade-in" aria-live="polite">
      <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-bold text-sm shrink-0">
            ✓
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold uppercase text-foreground">
              {locale === "pt"
                ? "PDF Dividido com Sucesso!"
                : locale === "es"
                  ? "¡PDF Dividido con Éxito!"
                  : "PDF Successfully Split!"}
            </p>
            <p className="text-xs text-label mt-1">
              {locale === "pt"
                ? `Seus arquivos foram extraídos e estão prontos para download (${resultsCount} ${
                    resultsCount === 1
                      ? "arquivo"
                      : "arquivos em formato ZIP"
                  }).`
                : locale === "es"
                  ? `Tus archivos fueron extraídos y están listos para descargar (${resultsCount} ${
                    resultsCount === 1
                      ? "archivo"
                      : "archivos en formato ZIP"
                  }).`
                  : `Your files were extracted and are ready for download (${resultsCount} ${
                    resultsCount === 1
                      ? "file"
                      : "files in ZIP format"
                  }).`}
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center font-bold px-3 py-1 rounded-[2px] text-xs uppercase tracking-wider shrink-0 bg-primary text-background">
          {resultsCount}{" "}
          {resultsCount === 1
            ? locale === "pt"
              ? "arquivo"
              : locale === "es"
                ? "archivo"
                : "file"
            : locale === "pt"
              ? "arquivos"
              : locale === "es"
                ? "archivos"
                : "files"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {locale === "pt"
              ? "Documento Original"
              : locale === "es"
                ? "Documento Original"
                : "Original Document"}
          </span>
          <div className="my-2">
            <span
              className="text-base font-bold text-foreground truncate block"
              title={originalFileName}
            >
              {originalFileName}
            </span>
          </div>
          <span className="text-xs text-label">
            {totalPages
              ? `${totalPages} ${
                  totalPages === 1
                    ? t("pageCountSingular")
                    : t("pageCountPlural")
                }`
              : "PDF"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {locale === "pt"
              ? "Arquivos Extraídos"
              : locale === "es"
                ? "Archivos Extraídos"
                : "Extracted Files"}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-secondary">
              {resultsCount}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Extração local no navegador"
              : locale === "es"
                ? "Extracción local en navegador"
                : "Local browser extraction"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {locale === "pt"
              ? "Formato de Saída"
              : locale === "es"
                ? "Formato de Salida"
                : "Output Format"}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-primary">
              {isZip ? "ZIP" : "PDF"}
            </span>
          </div>
          <span className="text-xs text-label">
            {isZip
              ? locale === "pt"
                ? "Pacote compactado com todas as saídas"
                : locale === "es"
                  ? "Paquete comprimido con salidas"
                  : "Compressed multi-file bundle"
              : locale === "pt"
                ? "Arquivo PDF único extraído"
                : locale === "es"
                  ? "Archivo PDF único extraído"
                  : "Single extracted PDF document"}
          </span>
        </div>
      </div>

      {items && items.length > 1 && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                {locale === "pt"
                  ? "Arquivos Extraídos Separados"
                  : locale === "es"
                    ? "Archivos Extraídos Separados"
                    : "Individual Extracted Files"}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-primary text-background rounded-[2px]">
                {items.length}
              </span>
            </div>
            <span className="text-xs text-label">
              {locale === "pt"
                ? "Baixe cada arquivo individualmente ou o pacote completo"
                : locale === "es"
                  ? "Descarga cada archivo individualmente o el paquete completo"
                  : "Download each file individually or the full bundle"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <SplitFileCard
                key={item.name}
                name={item.name}
                sizeBytes={item.sizeBytes}
                partIndex={idx}
                onDownload={() => onDownloadItem?.(item)}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <AppButton
          onClick={onDownload}
          color="primary"
          icon={<Download className="w-4 h-4" />}
        >
          {isZip
            ? locale === "pt"
              ? "Baixar Arquivos (ZIP)"
              : locale === "es"
                ? "Descargar Archivos (ZIP)"
                : "Download Files (ZIP)"
            : locale === "pt"
              ? "Baixar PDF"
              : locale === "es"
                ? "Descargar PDF"
                : "Download PDF"}
        </AppButton>
        <AppButton onClick={onReset} color="tertiary">
          {resetLabel}
        </AppButton>
      </div>
    </div>
  );
}

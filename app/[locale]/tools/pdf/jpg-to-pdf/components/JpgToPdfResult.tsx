"use client";

import { Download } from "lucide-react";
import { AppButton } from "@/components/ui";
import { formatBytes } from "@/lib/imageConversion";

interface JpgToPdfResultProps {
  fileName: string;
  sizeBytes: number;
  imageCount: number;
  onDownload: () => void;
  onReset: () => void;
  resetLabel: string;
  locale: string;
}

export default function JpgToPdfResult({
  fileName,
  sizeBytes,
  imageCount,
  onDownload,
  onReset,
  resetLabel,
  locale,
}: JpgToPdfResultProps) {
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
                ? "PDF Criado com Sucesso!"
                : locale === "es"
                  ? "¡PDF Creado con Éxito!"
                  : "PDF Successfully Created!"}
            </p>
            <p className="text-xs text-label mt-1">
              {locale === "pt"
                ? `Suas imagens foram convertidas em um único documento PDF (${imageCount} ${
                    imageCount === 1 ? "página gerada" : "páginas geradas"
                  }).`
                : locale === "es"
                  ? `Tus imágenes fueron convertidas en un único documento PDF (${imageCount} ${
                      imageCount === 1 ? "página generada" : "páginas generadas"
                    }).`
                  : `Your images were converted into a single PDF document (${imageCount} ${
                      imageCount === 1 ? "page generated" : "pages generated"
                    }).`}
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center font-bold px-3 py-1 rounded-[2px] text-xs uppercase tracking-wider shrink-0 bg-primary text-background">
          {imageCount}{" "}
          {imageCount === 1
            ? locale === "pt"
              ? "página"
              : locale === "es"
                ? "página"
                : "page"
            : locale === "pt"
              ? "páginas"
              : locale === "es"
                ? "páginas"
                : "pages"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {locale === "pt"
              ? "Total de Páginas"
              : locale === "es"
                ? "Total de Páginas"
                : "Total Pages"}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-foreground">
              {imageCount}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Sequência original preservada"
              : locale === "es"
                ? "Secuencia original preservada"
                : "Original sequence preserved"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {locale === "pt"
              ? "Tamanho do Arquivo"
              : locale === "es"
                ? "Tamaño del Archivo"
                : "File Size"}
          </span>
          <div className="my-2">
            <span className="text-xl font-bold text-secondary">
              {formatBytes(sizeBytes)}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Documento PDF otimizado"
              : locale === "es"
                ? "Documento PDF optimizado"
                : "Optimized PDF document"}
          </span>
        </div>

        <div className="p-4 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-xs text-label uppercase tracking-wider">
            {locale === "pt"
              ? "Arquivo de Saída"
              : locale === "es"
                ? "Archivo de Salida"
                : "Output File"}
          </span>
          <div className="my-2">
            <span
              className="text-base font-bold text-primary truncate block"
              title={fileName}
            >
              {fileName}
            </span>
          </div>
          <span className="text-xs text-label">
            {locale === "pt"
              ? "Pronto para download"
              : locale === "es"
                ? "Listo para descargar"
                : "Ready for download"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <AppButton
          onClick={onDownload}
          color="primary"
          icon={<Download className="w-4 h-4" />}
        >
          {locale === "pt"
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

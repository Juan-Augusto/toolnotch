"use client";

import React from "react";
import { Download, Archive, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { AppCard, AppButton } from "@/components/ui";
import { formatBytes } from "@/lib/imageConversion";

export interface ConvertedItem {
  id: string;
  originalFile: File;
  blob: Blob;
  originalSize: number;
  convertedSize: number;
  savings: number;
  width: number;
  height: number;
  previewUrl: string;
  targetFormat: string;
}

interface ImageConverterResultProps {
  items: ConvertedItem[];
  targetFormat: string;
  onDownloadSingle: (item: ConvertedItem) => void;
  onDownloadZip: () => void;
  onReset: () => void;
  resetLabel: string;
  locale: string;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function ImageConverterResult({
  items,
  targetFormat,
  onDownloadSingle,
  onDownloadZip,
  onReset,
  resetLabel,
  locale,
  t,
}: ImageConverterResultProps) {
  const isMultiple = items.length > 1;

  const totalOriginal = items.reduce((acc, i) => acc + i.originalSize, 0);
  const totalConverted = items.reduce((acc, i) => acc + i.convertedSize, 0);
  const totalSavings =
    totalOriginal > 0
      ? Math.round(((totalOriginal - totalConverted) / totalOriginal) * 100)
      : 0;

  return (
    <div className="space-y-6 font-mono">
      {/* Cabeçalho de Sucesso */}
      <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-[2px]">
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {t("result.title")}
          </h2>
          <p className="text-xs text-label">
            {t("result.subtitle", {
              count: items.length,
              format: targetFormat.toUpperCase(),
            })}
          </p>
        </div>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-background border border-border rounded-[2px]">
          <span className="text-[11px] text-label uppercase block mb-1">
            {t("result.totalOriginal")}
          </span>
          <span className="text-base font-bold text-foreground">
            {formatBytes(totalOriginal)}
          </span>
        </div>

        <div className="p-3 bg-background border border-border rounded-[2px]">
          <span className="text-[11px] text-label uppercase block mb-1">
            {t("result.totalConverted")}
          </span>
          <span className="text-base font-bold text-primary">
            {formatBytes(totalConverted)}
          </span>
        </div>

        <div className="p-3 bg-background border border-border rounded-[2px]">
          <span className="text-[11px] text-label uppercase block mb-1">
            {t("result.totalSavings")}
          </span>
          <span
            className={`text-base font-bold ${
              totalSavings >= 0 ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {totalSavings >= 0 ? `-${totalSavings}%` : `+${Math.abs(totalSavings)}%`}
          </span>
        </div>
      </div>

      {/* Ação Principal de Download */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {isMultiple ? (
          <AppButton
            onClick={onDownloadZip}
            color="primary"
            className="w-full sm:w-auto"
          >
            <Archive className="w-4 h-4 mr-2" />
            {t("button.downloadZip")}
          </AppButton>
        ) : (
          items[0] && (
            <AppButton
              onClick={() => onDownloadSingle(items[0])}
              color="primary"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("button.downloadSingle")}
            </AppButton>
          )
        )}

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer py-2 sm:py-0"
        >
          {resetLabel}
        </button>
      </div>

      {/* Lista de Arquivos Convertidos */}
      <div className="p-4 bg-background border border-border rounded-[2px] space-y-3">
        <div className="flex items-center justify-between text-xs text-label border-b border-border pb-2.5">
          <span className="font-bold uppercase tracking-wider text-foreground">
            {t("result.fileListTitle")} ({items.length})
          </span>
          <span className="text-xs text-primary font-semibold uppercase">
            {targetFormat.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {items.map((item) => {
            const baseName = item.originalFile.name.replace(/\.[^/.]+$/, "");
            const newName = `${baseName}.${item.targetFormat}`;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-tertiary border border-border rounded-[2px] gap-3 text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 bg-background/50 border border-border rounded-[2px] overflow-hidden flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={newName}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="truncate">
                    <p className="font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
                      {newName}
                    </p>
                    <p className="text-[11px] text-label">
                      {item.width > 0 && item.height > 0 && (
                        <span>{item.width} × {item.height} px • </span>
                      )}
                      <span>{formatBytes(item.convertedSize)}</span>
                      {item.savings !== 0 && (
                        <span
                          className={`ml-1.5 font-semibold ${
                            item.savings > 0 ? "text-emerald-500" : "text-amber-500"
                          }`}
                        >
                          ({item.savings > 0 ? `-${item.savings}%` : `+${Math.abs(item.savings)}%`})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => onDownloadSingle(item)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-[2px] bg-background border border-border hover:border-primary hover:text-primary transition-colors text-foreground font-semibold cursor-pointer"
                    title={t("result.downloadFile")}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t("result.downloadFile")}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

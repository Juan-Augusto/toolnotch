"use client";

import React from "react";
import { CheckCircle2, RefreshCw, Archive, AlertCircle } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import type { ExtractedPdfImage } from "@/lib/pdfExtractImages";
import ExtractedImageCard from "./ExtractedImageCard";

interface ExtractImagesResultProps {
  images: ExtractedPdfImage[];
  fileName: string;
  onDownloadAllZip: () => void;
  onDownloadSingle: (image: ExtractedPdfImage) => void;
  onReset: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function ExtractImagesResult({
  images,
  fileName,
  onDownloadAllZip,
  onDownloadSingle,
  onReset,
  t,
}: ExtractImagesResultProps) {
  if (images.length === 0) {
    return (
      <div className="p-6 md:p-8 bg-background border border-border rounded-[2px] space-y-5 text-center">
        <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold uppercase text-foreground">
            {t("empty.title")}
          </h3>
          <p className="text-xs sm:text-sm text-label max-w-md mx-auto">
            {t("empty.description")}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors inline-flex items-center gap-1.5 cursor-pointer uppercase font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t("button.reset")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-5 bg-background border border-border rounded-[2px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase text-foreground">
              {t("result.title")}
            </h3>
            <p className="text-xs text-label">
              <span className="font-medium text-foreground/80">{fileName}</span> &bull; {t("stats.found", { count: images.length })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <AppButton onClick={onDownloadAllZip} color="primary" withArrow>
            <Archive className="w-4 h-4 mr-1.5" />
            {t("button.downloadZip", { count: images.length })}
          </AppButton>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer uppercase font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t("button.reset")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[540px] overflow-y-auto p-1">
        {images.map((img) => (
          <ExtractedImageCard
            key={img.id}
            image={img}
            onDownloadSingle={onDownloadSingle}
            downloadLabel={t("button.downloadImage")}
          />
        ))}
      </div>
    </div>
  );
}

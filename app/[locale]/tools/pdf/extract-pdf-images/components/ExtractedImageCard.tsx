"use client";

import React from "react";
import { Download } from "lucide-react";
import type { ExtractedPdfImage } from "@/lib/pdfExtractImages";
import { formatBytes } from "@/lib/imageConversion";

interface ExtractedImageCardProps {
  image: ExtractedPdfImage;
  onDownloadSingle: (image: ExtractedPdfImage) => void;
  downloadLabel: string;
}

export default function ExtractedImageCard({
  image,
  onDownloadSingle,
  downloadLabel,
}: ExtractedImageCardProps) {
  return (
    <div className="bg-background border border-border rounded-[2px] p-2 sm:p-3 flex flex-col items-center justify-between hover:border-foreground/30 hover:shadow-xs transition-all">
      <div className="w-full flex items-center justify-between pb-1.5 sm:pb-2 border-b border-border/60 mb-1.5 sm:mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
          Pág. {image.page}
        </span>
        <span className="text-[10px] text-label/70 font-medium">
          {image.width} × {image.height} px
        </span>
      </div>

      <div className="w-full aspect-square max-h-44 bg-tertiary rounded-[2px] border border-border/80 flex items-center justify-center overflow-hidden p-1.5">
        <img
          src={image.dataUrl}
          alt={image.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full flex items-center justify-between mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-border/60">
        <div className="overflow-hidden mr-2">
          <span className="text-[10px] text-label truncate block font-medium">
            {formatBytes(image.size)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDownloadSingle(image)}
          className="px-2.5 py-1 text-[11px] font-semibold bg-tertiary hover:bg-tertiary/80 text-foreground border border-border rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer uppercase shrink-0"
          title={downloadLabel}
          aria-label={downloadLabel}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloadLabel}</span>
        </button>
      </div>
    </div>
  );
}

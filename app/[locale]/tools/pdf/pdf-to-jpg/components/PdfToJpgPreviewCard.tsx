"use client";

import { Download } from "lucide-react";
import { AppButton } from "@/components/ui";

interface PdfToJpgPreviewCardProps {
  name: string;
  dataUrl: string;
  pageNumber: number;
  onDownload: () => void;
  pageLabel: string;
  downloadLabel: string;
}

export default function PdfToJpgPreviewCard({
  name,
  dataUrl,
  onDownload,
  pageLabel,
  downloadLabel,
}: PdfToJpgPreviewCardProps) {
  return (
    <div className="border border-border bg-background rounded-[2px] overflow-hidden flex flex-col justify-between hover:border-foreground/30 transition-colors">
      <div className="relative aspect-[3/4] bg-tertiary flex items-center justify-center overflow-hidden p-2.5">
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-foreground text-background text-[11px] font-semibold rounded-[2px] uppercase tracking-wider z-10">
          {pageLabel}
        </span>
        <img
          src={dataUrl}
          alt={name}
          className="max-h-full max-w-full object-contain rounded-[1px] shadow-xs"
        />
      </div>

      <div className="p-2 sm:p-3 border-t border-border space-y-2 sm:space-y-2.5">
        <p className="text-xs font-medium text-foreground truncate" title={name}>
          {name}
        </p>
        <AppButton
          onClick={onDownload}
          color="tertiary"
          small
          className="w-full justify-center"
          icon={<Download className="w-3.5 h-3.5" />}
        >
          {downloadLabel}
        </AppButton>
      </div>
    </div>
  );
}

"use client";

import { Download, FileText } from "lucide-react";
import { AppButton } from "@/components/ui";

interface SplitFileCardProps {
  name: string;
  sizeBytes: number;
  partIndex: number;
  onDownload: () => void;
  locale: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SplitFileCard({
  name,
  sizeBytes,
  partIndex,
  onDownload,
  locale,
}: SplitFileCardProps) {
  const partLabel =
    locale === "en"
      ? `Part ${partIndex + 1}`
      : `Parte ${partIndex + 1}`;

  const downloadLabel =
    locale === "pt"
      ? "Baixar PDF"
      : locale === "es"
        ? "Descargar PDF"
        : "Download PDF";

  return (
    <div className="border border-border bg-background rounded-[2px] p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-foreground/30 transition-colors gap-2.5 sm:gap-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 bg-foreground text-background text-[11px] font-semibold rounded-[2px] uppercase tracking-wider">
            {partLabel}
          </span>
          <span className="text-xs text-label font-medium">
            {formatBytes(sizeBytes)}
          </span>
        </div>

        <div className="flex items-center gap-2.5 pt-1 min-w-0">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span
            className="text-xs sm:text-sm font-semibold text-foreground truncate"
            title={name}
          >
            {name}
          </span>
        </div>
      </div>

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
  );
}

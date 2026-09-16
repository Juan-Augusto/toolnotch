"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface PdfProgressBarProps {
  label: string;
  current?: number;
  total?: number;
  percent?: number;
  className?: string;
}

export default function PdfProgressBar({
  label,
  current,
  total,
  percent: propPercent,
  className = "",
}: PdfProgressBarProps) {
  const calculatedPercent =
    propPercent !== undefined
      ? propPercent
      : total && total > 0 && current !== undefined
        ? Math.round((current / total) * 100)
        : 0;

  const displayPercent = Math.min(100, Math.max(0, calculatedPercent));

  return (
    <div
      role="progressbar"
      aria-valuenow={displayPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 font-semibold text-foreground min-w-0">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <span className="text-xs text-label font-mono font-medium shrink-0">
          {total && total > 0 && current !== undefined
            ? `${current} / ${total} (${displayPercent}%)`
            : `${displayPercent}%`}
        </span>
      </div>
      <div className="w-full bg-tertiary h-2 rounded-[2px] overflow-hidden border border-border">
        <div
          className="bg-primary h-full transition-all duration-200"
          style={{ width: `${Math.max(displayPercent, 5)}%` }}
        />
      </div>
    </div>
  );
}

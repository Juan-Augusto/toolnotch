"use client";

import React from "react";
import { Trash2, Check, ZoomIn } from "lucide-react";

interface PageDeleteCardProps {
  pageNumber: number;
  markedForDeletion: boolean;
  previewUrl?: string;
  onToggle: (pageNumber: number) => void;
  onPreview: (pageNumber: number) => void;
  pageLabel: string;
  markedLabel: string;
  previewHint: string;
}

export default function PageDeleteCard({
  pageNumber,
  markedForDeletion,
  previewUrl,
  onToggle,
  onPreview,
  pageLabel,
  markedLabel,
  previewHint,
}: PageDeleteCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle(pageNumber)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(pageNumber);
        }
      }}
      aria-pressed={markedForDeletion}
      className={`group relative bg-background border rounded-[2px] p-1.5 sm:p-2.5 md:p-3 flex flex-col items-center select-none text-left transition-all cursor-pointer ${
        markedForDeletion
          ? "border-red-500 bg-red-500/5 ring-1 ring-red-500/40"
          : "border-border hover:border-foreground/40 hover:shadow-xs"
      }`}
    >
      <div className="w-full flex items-center justify-between gap-1 pb-1.5 sm:pb-2 border-b border-border/60 mb-1.5 sm:mb-2">
        <div className="flex items-center gap-1 min-w-0">
          <span
            className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider shrink truncate ${
              markedForDeletion
                ? "text-red-600 line-through"
                : "text-foreground"
            }`}
          >
            {pageLabel}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(pageNumber);
            }}
            className="p-0.5 sm:p-1 text-label hover:text-foreground hover:bg-tertiary rounded transition-colors cursor-pointer shrink-0"
            title={previewHint}
            aria-label={previewHint}
          >
            <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        <span
          className={`text-[9px] sm:text-[10px] font-semibold px-1 sm:px-1.5 py-0.5 rounded-[2px] flex items-center gap-0.5 sm:gap-1 shrink-0 whitespace-nowrap transition-colors ${
            markedForDeletion
              ? "bg-red-500 text-white"
              : "bg-tertiary text-label"
          }`}
        >
          {markedForDeletion ? (
            <>
              <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span>{markedLabel}</span>
            </>
          ) : (
            <>
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary shrink-0" />
              <span>OK</span>
            </>
          )}
        </span>
      </div>

      <div className="w-full aspect-3/4 max-h-48 bg-tertiary rounded-[2px] border border-border/80 flex items-center justify-center overflow-hidden relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={pageLabel}
            className={`w-full h-full object-contain transition-opacity duration-200 ${
              markedForDeletion ? "opacity-35 grayscale" : "opacity-100"
            }`}
          />
        ) : (
          <div className="text-xs text-label/50 animate-pulse">...</div>
        )}

        {markedForDeletion && (
          <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md">
              <Trash2 className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  CheckCircle2,
  Download,
  RefreshCw,
  FileText,
  Trash2,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";

interface DeletePagesResultProps {
  fileName: string;
  pagesRemovedCount: number;
  pagesRemainingCount: number;
  onDownload: () => void;
  onReset: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function DeletePagesResult({
  fileName,
  pagesRemovedCount,
  pagesRemainingCount,
  onDownload,
  onReset,
  t,
}: DeletePagesResultProps) {
  const safeName = fileName.replace(/\.pdf$/i, "") + "_limpo.pdf";

  return (
    <div className="p-6 md:p-8 bg-background border border-border rounded-[2px] space-y-6 text-center animate-fadeIn">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold uppercase text-foreground">
          {t("result.title")}
        </h3>
        <p className="text-xs sm:text-sm text-label max-w-md mx-auto">
          {t("result.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl mx-auto text-left">
        <div className="p-4 bg-tertiary border border-border rounded-[2px] flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-[2px] bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="overflow-hidden min-w-0">
            <span className="text-[11px] text-label block uppercase font-medium">
              {t("result.finalFile")}
            </span>
            <span
              className="text-xs sm:text-sm font-semibold text-foreground truncate block"
              title={safeName}
            >
              {safeName}
            </span>
          </div>
        </div>

        <div className="p-4 bg-tertiary border border-border rounded-[2px] flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-[2px] bg-red-500/15 text-red-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-label block uppercase font-medium">
              {t("result.pagesRemoved")}
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {pagesRemovedCount}
            </span>
          </div>
        </div>

        <div className="p-4 bg-tertiary border border-border rounded-[2px] flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-[2px] bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-label block uppercase font-medium">
              {t("result.pagesRemaining")}
            </span>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {pagesRemainingCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <AppButton onClick={onDownload} color="primary" withArrow>
          <Download className="w-4 h-4 mr-1.5" />
          {t("result.download")}
        </AppButton>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2.5 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer uppercase font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t("button.reset")}
        </button>
      </div>
    </div>
  );
}

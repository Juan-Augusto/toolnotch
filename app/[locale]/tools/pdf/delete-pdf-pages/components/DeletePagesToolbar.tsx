"use client";

import React from "react";

export interface DeletePagesToolbarProps {
  fileName: string;
  summaryText: string;
  gridSize: "md" | "lg";
  onGridSizeChange: (size: "md" | "lg") => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onInvertSelection: () => void;
  canClear: boolean;
  disabled: boolean;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function DeletePagesToolbar({
  fileName,
  summaryText,
  gridSize,
  onGridSizeChange,
  onSelectAll,
  onClearSelection,
  onInvertSelection,
  canClear,
  disabled,
  t,
}: DeletePagesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-xs min-w-0 max-w-full">
        <span
          className="font-bold text-foreground block sm:inline mr-2 truncate max-w-[200px] sm:max-w-xs md:max-w-sm align-bottom"
          title={fileName}
        >
          {fileName}
        </span>
        <span className="text-label">{summaryText}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Grid thumbnail size toggle */}
        <div
          role="group"
          aria-label={t("actions.gridSize")}
          className="flex items-center border border-border rounded-[2px] p-0.5 bg-tertiary"
        >
          <button
            type="button"
            onClick={() => onGridSizeChange("md")}
            disabled={disabled}
            title={`${t("actions.gridSize")}: ${t("actions.gridSizeMd")}`}
            aria-label={`${t("actions.gridSize")}: ${t("actions.gridSizeMd")}`}
            className={`px-2 py-1 text-[11px] font-semibold rounded-[2px] transition-colors cursor-pointer disabled:cursor-not-allowed ${
              gridSize === "md"
                ? "bg-foreground text-background"
                : "text-label hover:text-foreground"
            }`}
          >
            {t("actions.gridSizeMd")}
          </button>
          <button
            type="button"
            onClick={() => onGridSizeChange("lg")}
            disabled={disabled}
            title={`${t("actions.gridSize")}: ${t("actions.gridSizeLg")}`}
            aria-label={`${t("actions.gridSize")}: ${t("actions.gridSizeLg")}`}
            className={`px-2 py-1 text-[11px] font-semibold rounded-[2px] transition-colors cursor-pointer disabled:cursor-not-allowed ${
              gridSize === "lg"
                ? "bg-foreground text-background"
                : "text-label hover:text-foreground"
            }`}
          >
            {t("actions.gridSizeLg")}
          </button>
        </div>

        <button
          type="button"
          onClick={onSelectAll}
          disabled={disabled}
          className="px-2.5 py-1.5 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors cursor-pointer disabled:cursor-not-allowed font-medium"
        >
          {t("actions.selectAll")}
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          disabled={disabled || !canClear}
          className="px-2.5 py-1.5 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          {t("actions.clearSelection")}
        </button>

        <button
          type="button"
          onClick={onInvertSelection}
          disabled={disabled}
          className="px-2.5 py-1.5 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors cursor-pointer disabled:cursor-not-allowed font-medium"
        >
          {t("actions.invertSelection")}
        </button>
      </div>
    </div>
  );
}

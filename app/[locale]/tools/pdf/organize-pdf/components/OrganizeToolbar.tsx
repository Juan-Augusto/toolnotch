"use client";

import React from "react";
import { RotateCw, RefreshCw } from "lucide-react";

export interface OrganizeToolbarProps {
  fileName: string;
  summaryText: string;
  gridSize: "md" | "lg";
  onGridSizeChange: (size: "md" | "lg") => void;
  onRotateAll: () => void;
  onResetOrder: () => void;
  canRotate: boolean;
  disabled: boolean;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function OrganizeToolbar({
  fileName,
  summaryText,
  gridSize,
  onGridSizeChange,
  onRotateAll,
  onResetOrder,
  canRotate,
  disabled,
  t,
}: OrganizeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-background border border-border rounded-[2px]">
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
          onClick={onRotateAll}
          disabled={disabled || !canRotate}
          className="px-2.5 py-1.5 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed font-medium"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{t("actions.rotateAll")}</span>
        </button>

        <button
          type="button"
          onClick={onResetOrder}
          disabled={disabled}
          className="px-2.5 py-1.5 text-xs text-label hover:text-foreground border border-border hover:border-foreground/30 rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t("actions.resetOrder")}</span>
        </button>
      </div>
    </div>
  );
}

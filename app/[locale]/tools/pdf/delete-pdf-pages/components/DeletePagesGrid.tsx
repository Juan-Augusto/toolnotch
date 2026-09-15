"use client";

import React from "react";
import PageDeleteCard from "./PageDeleteCard";

export interface PageItem {
  id: string;
  pageNumber: number;
  previewUrl: string;
}

export interface DeletePagesGridProps {
  pages: PageItem[];
  markedIndices: Set<number>;
  gridSize: "md" | "lg";
  onToggle: (index: number) => void;
  onPreview: (pageNumber: number) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function DeletePagesGrid({
  pages,
  markedIndices,
  gridSize,
  onToggle,
  onPreview,
  t,
}: DeletePagesGridProps) {
  if (pages.length === 0) return null;

  return (
    <div
      className={
        gridSize === "lg"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 max-h-[600px] overflow-y-auto p-0.5 sm:p-1"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-h-[520px] overflow-y-auto p-0.5 sm:p-1"
      }
    >
      {pages.map((item, idx) => (
        <PageDeleteCard
          key={item.id}
          pageNumber={item.pageNumber}
          markedForDeletion={markedIndices.has(idx)}
          previewUrl={item.previewUrl}
          onToggle={onToggle}
          onPreview={onPreview}
          pageLabel={t("card.pageLabel", { number: item.pageNumber })}
          markedLabel={t("card.marked")}
          previewHint={t("card.previewHint")}
        />
      ))}
    </div>
  );
}

"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortablePageCard from "./SortablePageCard";

export interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number;
  previewUrl: string;
}

export interface OrganizeGridProps {
  pages: PageItem[];
  sensors: SensorDescriptor<SensorOptions>[];
  gridSize: "md" | "lg";
  onDragEnd: (event: DragEndEvent) => void;
  onRotatePage: (id: string) => void;
  onRemovePage: (id: string) => void;
  onPreview: (id: string) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function OrganizeGrid({
  pages,
  sensors,
  gridSize,
  onDragEnd,
  onRotatePage,
  onRemovePage,
  onPreview,
  t,
}: OrganizeGridProps) {
  if (pages.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={pages.map((p) => p.id)}
        strategy={rectSortingStrategy}
      >
        <div
          className={
            gridSize === "lg"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 max-h-[600px] overflow-y-auto overflow-x-hidden p-0.5 sm:p-1"
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-h-[520px] overflow-y-auto overflow-x-hidden p-0.5 sm:p-1"
          }
        >
          {pages.map((item, idx) => (
            <SortablePageCard
              key={item.id}
              id={item.id}
              originalIndex={item.originalIndex}
              currentIndex={idx}
              rotation={item.rotation}
              previewUrl={item.previewUrl}
              onRotate={onRotatePage}
              onRemove={onRemovePage}
              onPreview={onPreview}
              pageLabel={t("card.pageLabel", { number: idx + 1 })}
              origLabel={t("card.originalLabel", {
                number: item.originalIndex + 1,
              })}
              rotateHint={t("card.rotateHint")}
              deleteHint={t("card.deleteHint")}
              previewHint={t("card.previewHint")}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

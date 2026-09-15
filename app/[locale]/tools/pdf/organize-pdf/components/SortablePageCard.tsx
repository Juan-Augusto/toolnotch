"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, RotateCw, Trash2, ZoomIn } from "lucide-react";

interface SortablePageCardProps {
  id: string;
  originalIndex: number;
  currentIndex: number;
  rotation: number;
  previewUrl?: string;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onPreview: (id: string) => void;
  pageLabel: string;
  origLabel: string;
  rotateHint: string;
  deleteHint: string;
  previewHint: string;
}

export default function SortablePageCard({
  id,
  rotation,
  previewUrl,
  onRotate,
  onRemove,
  onPreview,
  pageLabel,
  origLabel,
  rotateHint,
  deleteHint,
  previewHint,
}: SortablePageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-background border rounded-[2px] p-1.5 sm:p-2.5 md:p-3 flex flex-col items-center select-none transition-shadow ${
        isDragging
          ? "border-primary shadow-lg ring-1 ring-primary"
          : "border-border hover:border-foreground/30 hover:shadow-xs"
      }`}
    >
      <div className="w-full flex items-center justify-between pb-1.5 sm:pb-2 border-b border-border/60 mb-1.5 sm:mb-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-0.5 sm:p-1 text-label/70 hover:text-foreground rounded transition-colors touch-none"
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
            {pageLabel}
          </span>

          <button
            type="button"
            onClick={() => onPreview(id)}
            className="p-0.5 sm:p-1 text-label hover:text-foreground hover:bg-tertiary rounded transition-colors cursor-pointer"
            title={previewHint}
            aria-label={previewHint}
          >
            <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        <span className="text-[9px] sm:text-[10px] text-label/60">
          {origLabel}
        </span>
      </div>

      <div className="w-full aspect-3/4 max-h-48 bg-tertiary rounded-[2px] border border-border/80 flex items-center justify-center overflow-hidden relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={pageLabel}
            className="w-full h-full object-contain transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        ) : (
          <div className="text-xs text-label/50 animate-pulse">...</div>
        )}
      </div>

      <div className="w-full flex items-center justify-between mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-border/60">
        <button
          type="button"
          onClick={() => onRotate(id)}
          className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-label hover:text-primary hover:bg-tertiary rounded transition-colors cursor-pointer"
          title={rotateHint}
          aria-label={rotateHint}
        >
          <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>+90°</span>
        </button>

        <button
          type="button"
          onClick={() => onRemove(id)}
          className="p-0.5 sm:p-1 text-label/70 hover:text-red-600 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
          title={deleteHint}
          aria-label={deleteHint}
        >
          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}

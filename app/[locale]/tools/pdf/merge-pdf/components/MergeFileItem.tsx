"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, FileText } from "lucide-react";

export interface MergeFileItemProps {
  id: string;
  name: string;
  size: number;
  pageCount?: number | null;
  index: number;
  onRemove: (id: string) => void;
  locale?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MergeFileItem({
  id,
  name,
  size,
  pageCount,
  index,
  onRemove,
  locale = "pt",
}: MergeFileItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null
    ),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  const pageLabel =
    pageCount !== null && pageCount !== undefined
      ? `${pageCount} ${
          pageCount === 1
            ? locale === "en"
              ? "page"
              : "página"
            : locale === "en"
              ? "pages"
              : "páginas"
        }`
      : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 bg-background border rounded-[2px] transition-colors select-none ${
        isDragging
          ? "border-secondary shadow-md ring-1 ring-secondary/30"
          : "border-border hover:border-foreground/20"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-label hover:text-foreground cursor-grab active:cursor-grabbing p-1 -m-1 rounded-[2px] transition-colors shrink-0 touch-none"
          aria-label="Reordenar arquivo"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <span className="w-5 h-5 rounded-[2px] bg-tertiary border border-border text-[11px] font-semibold text-label flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        <FileText className="w-4 h-4 text-primary shrink-0" />

        <span
          className="text-xs sm:text-sm font-medium text-foreground truncate"
          title={name}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-label">
          {pageLabel && (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-[2px] bg-tertiary border border-border text-[11px] font-medium">
              {pageLabel}
            </span>
          )}
          <span className="whitespace-nowrap">{formatBytes(size)}</span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(id)}
          className="text-label hover:text-red-500 p-1 -m-1 rounded-[2px] transition-colors cursor-pointer"
          aria-label="Remover arquivo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { formatBytes } from "@/lib/imageConversion";

interface SortableImageItemProps {
  id: string;
  name: string;
  size: number;
  preview: string;
  index: number;
  onRemove: (id: string) => void;
  locale?: string;
}

export default function SortableImageItem({
  id,
  name,
  size,
  preview,
  index,
  onRemove,
  locale = "pt",
}: SortableImageItemProps) {
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
    zIndex: isDragging ? 10 : 1,
  };

  const pageLabel =
    locale === "pt"
      ? `Pág. ${index + 1}`
      : locale === "es"
        ? `Pág. ${index + 1}`
        : `Page ${index + 1}`;

  const dragLabel =
    locale === "pt"
      ? "Arraste para reordenar"
      : locale === "es"
        ? "Arrastra para reordenar"
        : "Drag to reorder";

  const removeLabel =
    locale === "pt"
      ? "Remover imagem"
      : locale === "es"
        ? "Eliminar imagen"
        : "Remove image";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-background border border-border rounded-[2px] font-mono ${
        isDragging ? "border-secondary shadow-md ring-1 ring-secondary/40" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-label hover:text-foreground cursor-grab active:cursor-grabbing p-1 transition-colors touch-none"
        aria-label={dragLabel}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <span className="shrink-0 px-2 py-0.5 text-xs font-bold bg-tertiary border border-border text-label rounded-[2px] select-none">
        {pageLabel}
      </span>

      <div className="w-12 h-12 rounded-[2px] overflow-hidden border border-border bg-tertiary shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-foreground truncate" title={name}>
          {name}
        </p>
        <p className="text-[11px] text-label mt-0.5">
          {formatBytes(size)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(id)}
        className="p-1.5 text-label hover:text-red-500 hover:bg-red-500/10 rounded-[2px] transition-colors"
        aria-label={removeLabel}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

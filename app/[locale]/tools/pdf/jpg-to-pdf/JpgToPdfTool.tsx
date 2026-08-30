"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveAs } from "file-saver";
import { GripVertical, X } from "lucide-react";
import { useTranslations } from "next-intl";
import ToolWrapper from "@/components/ToolWrapper";
import Button from "@/components/Button";
import { imagesToPDF, validatePdfFilename } from "@/lib/imageToPdf";
import type { FaqItem } from "@/components/FaqSection";

interface SortableImageItemProps {
  id: string;
  name: string;
  preview: string;
  onRemove: (id: string) => void;
}

function SortableImageItem({ id, name, preview, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl dark:bg-card dark:border-gray-700"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing dark:text-gray-600 dark:hover:text-gray-400"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview} alt={name} className="h-12 w-12 object-cover rounded" />
      <span className="flex-1 text-sm text-gray-700 truncate dark:text-gray-300">{name}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400"
        aria-label="Remove image"
      >
        <X size={16} />
      </button>
    </div>
  );
}

interface ImageEntry {
  id: string;
  file: File;
  name: string;
  preview: string;
}

interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
}

export default function JpgToPdfTool({ title, description, faqs, richContent }: Props) {
  const t = useTranslations("pdf.jpgToPdf");
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const filenameValidation = useMemo(() => {
    return validatePdfFilename(filename);
  }, [filename]);

  const filenameError = useMemo(() => {
    if (filenameValidation.valid) return null;
    return t(`errors.${filenameValidation.errorKey}`);
  }, [filenameValidation, t]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const entries: ImageEntry[] = Array.from(files)
      .filter((f) => f.type === "image/jpeg" || f.type === "image/png")
      .map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        name: f.name,
        preview: URL.createObjectURL(f),
      }));
    setImages((prev) => [...prev, ...entries]);
    setDone(false);
    setError(null);
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) URL.revokeObjectURL(entry.preview);
      return prev.filter((e) => e.id !== id);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError(t("errors.noImages"));
      return;
    }
    if (!filenameValidation.valid) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bytes = await imagesToPDF(images.map((e) => e.file));
      const trimmed = filename.trim();
      const finalName = trimmed
        ? (trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed}.pdf`)
        : "images.pdf";
      saveAs(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), finalName);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.conversionFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper
      title={title}
      description={description}
      breadcrumbLabel={title}
      faqs={faqs}
      adSlot="1234567894"
      richContent={richContent}
    >
      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4 dark:border-blue-700 dark:hover:bg-blue-900/20"
        onClick={() => document.getElementById("imgpdf-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-blue-600 font-medium dark:text-blue-400">{t("dropZone.label")}</p>
        <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">{t("dropZone.hint")}</p>
        <input
          id="imgpdf-file-input"
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 mb-4">
                {images.map((img) => (
                  <SortableImageItem
                    key={img.id}
                    id={img.id}
                    name={img.name}
                    preview={img.preview}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              {t("filename.label")}{" "}
              <span className="text-gray-400 font-normal dark:text-gray-500">
                ({t("filename.hint")})
              </span>
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={t("filename.placeholder")}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-card dark:bg-card text-gray-900 dark:text-gray-100 ${
                filenameError
                  ? "border-red-500 focus:ring-red-400 dark:border-red-500"
                  : "border-gray-300 focus:ring-blue-400 dark:border-gray-600"
              }`}
              aria-invalid={Boolean(filenameError)}
            />
            {filenameError && (
              <p className="text-xs text-red-600 mt-1 dark:text-red-400">{filenameError}</p>
            )}
          </div>
        </>
      )}

      {error && <p className="text-red-600 text-sm mb-3 dark:text-red-400">{error}</p>}
      {done && <p className="text-green-600 text-sm mb-3 dark:text-green-400">{t("success")}</p>}

      <Button
        onClick={handleConvert}
        disabled={loading || images.length === 0 || !filenameValidation.valid}
      >
        {loading ? t("button.converting") : t("button.convert")}
      </Button>
    </ToolWrapper>
  );
}

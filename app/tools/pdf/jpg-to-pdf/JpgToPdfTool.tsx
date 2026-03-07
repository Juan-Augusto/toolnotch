"use client";

import { useState, useCallback } from "react";
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
import ToolWrapper from "@/components/ToolWrapper";
import { imagesToPDF } from "@/lib/imageToPdf";

const faqs = [
  {
    question: "What image formats are supported?",
    answer: "JPEG and PNG images are supported. Each image becomes one page in the PDF.",
  },
  {
    question: "Can I control the page order?",
    answer: "Yes — drag the images to reorder them before converting.",
  },
  {
    question: "Are my files uploaded anywhere?",
    answer: "No. Everything runs in your browser. Your images never leave your device.",
  },
  {
    question: "What size will the PDF pages be?",
    answer:
      "Each page matches the dimensions of the corresponding image, so your images are never scaled or cropped.",
  },
];

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
      className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview} alt={name} className="h-12 w-12 object-cover rounded" />
      <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500"
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

export default function JpgToPdfPage() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

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
    if (images.length === 0) { setError("Add at least one image."); return; }
    setLoading(true);
    setError(null);
    try {
      const bytes = await imagesToPDF(images.map((e) => e.file));
      saveAs(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "images.pdf");
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper
      title="JPG to PDF — Convert Images to PDF"
      description="Turn JPEG or PNG images into a PDF. Drag to reorder. No upload needed."
      breadcrumbLabel="JPG to PDF"
      faqs={faqs}
      adSlot="1234567894"
    >
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4"
        onClick={() => document.getElementById("imgpdf-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
      >
        <p className="text-blue-600 font-medium">Click or drag images here</p>
        <p className="text-gray-400 text-sm mt-1">JPEG or PNG — multiple files supported</p>
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
      )}

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {done && <p className="text-green-600 text-sm mb-3">PDF downloaded!</p>}

      <button
        onClick={handleConvert}
        disabled={loading || images.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? "Converting…" : "Convert to PDF"}
      </button>
    </ToolWrapper>
  );
}

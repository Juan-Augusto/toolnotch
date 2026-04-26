"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
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
import { mergePDFs } from "@/lib/pdfMerge";
import { PDFJob } from "@/lib/pdfTypes";
import type { FaqItem } from "@/components/FaqSection";

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

interface SortableItemProps {
  id: string;
  name: string;
  onRemove: (id: string) => void;
}

function SortableItem({ id, name, onRemove }: SortableItemProps) {
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
      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing dark:text-gray-600 dark:hover:text-gray-400"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>
      <span className="flex-1 text-sm text-gray-700 truncate dark:text-gray-300">{name}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 dark:text-gray-600"
        aria-label="Remove file"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function MergeTool({ title, description, faqs, richContent }: Props) {
  const t = useTranslations("pdf.merge");
  const [jobs, setJobs] = useState<(PDFJob & { id: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newJobs = Array.from(files)
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({ id: `${f.name}-${Date.now()}-${Math.random()}`, file: f, name: f.name }));
    setJobs((prev) => [...prev, ...newJobs]);
    setDone(false);
    setError(null);
  }, []);

  const removeJob = (id: string) => setJobs((prev) => prev.filter((j) => j.id !== id));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setJobs((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleMerge = async () => {
    if (jobs.length < 2) {
      setError(t("errors.tooFewFiles"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bytes = await mergePDFs(jobs);
      saveAs(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "merged.pdf");
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.mergeFailed"));
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
      adSlot="1234567890"
      richContent={richContent}
    >
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4 dark:border-blue-700 dark:hover:bg-blue-900/20"
        onClick={() => document.getElementById("merge-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
      >
        <p className="text-blue-600 font-medium dark:text-blue-400">{t("dropZone.label")}</p>
        <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">{t("dropZone.hint")}</p>
        <input
          id="merge-file-input"
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* File List */}
      {jobs.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-4">
              {jobs.map((job) => (
                <SortableItem key={job.id} id={job.id} name={job.name} onRemove={removeJob} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {error && <p className="text-red-600 text-sm mb-3 dark:text-red-400">{error}</p>}
      {done && <p className="text-green-600 text-sm mb-3 dark:text-green-400">{t("success")}</p>}

      <button
        onClick={handleMerge}
        disabled={loading || jobs.length < 2}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:bg-gray-300 disabled:bg-none text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
      >
        {loading ? t("button.merging") : t("button.merge")}
      </button>
    </ToolWrapper>
  );
}

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
import { mergePDFs } from "@/lib/pdfMerge";
import { PDFJob } from "@/lib/pdfTypes";

const faqs = [
  {
    question: "How do I merge PDF files?",
    answer:
      "Upload your PDF files using the button or drag them in, reorder them as needed by dragging, then click Merge PDFs. Your merged file downloads instantly.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. All merging happens in your browser using JavaScript. Your files never leave your device.",
  },
  {
    question: "Is there a file size or page limit?",
    answer:
      "There is no hard limit, but very large PDFs (hundreds of MB) may be slow depending on your device.",
  },
  {
    question: "Can I merge password-protected PDFs?",
    answer:
      "Password-protected PDFs cannot be merged. Remove the password protection first using your PDF viewer.",
  },
];

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
      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>
      <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500"
        aria-label="Remove file"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function MergePDFPage() {
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
      setError("Add at least 2 PDF files to merge.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bytes = await mergePDFs(jobs);
      saveAs(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "merged.pdf");
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Merge failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper
      title="Merge PDF Files Free"
      description="Combine multiple PDFs into one. Drag to reorder pages. No upload required."
      breadcrumbLabel="Merge PDF"
      faqs={faqs}
      adSlot="1234567890"
    >
      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4"
        onClick={() => document.getElementById("merge-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
      >
        <p className="text-blue-600 font-medium">Click or drag PDF files here</p>
        <p className="text-gray-400 text-sm mt-1">Multiple files supported</p>
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

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {done && <p className="text-green-600 text-sm mb-3">Merged PDF downloaded!</p>}

      <button
        onClick={handleMerge}
        disabled={loading || jobs.length < 2}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? "Merging…" : "Merge PDFs"}
      </button>
    </ToolWrapper>
  );
}

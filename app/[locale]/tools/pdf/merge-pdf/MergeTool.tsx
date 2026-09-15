"use client";

import { useState, useCallback, useMemo, useRef } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import {
  ShieldCheck,
  Layers,
  Sparkles,
  Info,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  AppCard,
  AppButton,
  AppInput,
  AppDropfile,
} from "@/components/ui";
import { mergePDFs } from "@/lib/pdfMerge";
import type { PDFJob } from "@/lib/pdfTypes";
import { validatePdfFilename } from "@/lib/imageToPdf";
import type { FaqItem } from "@/components/AppFaqSection";
import PdfToolHeader from "../components/PdfToolHeader";
import MergeFileItem from "./components/MergeFileItem";
import MergeResult from "./components/MergeResult";
import MergeContent, { type RichContent } from "./components/MergeContent";
import { restrictToVerticalAxis } from "@/lib/dndModifiers";

interface MergeFileEntry {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
}

interface MergeOutput {
  bytes: Uint8Array;
  fileName: string;
  sizeBytes: number;
  filesCount: number;
  totalPages: number;
}

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function MergeTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("pdf.merge");
  const [files, setFiles] = useState<MergeFileEntry[]>([]);
  const filesRef = useRef<MergeFileEntry[]>(files);
  filesRef.current = files;

  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MergeOutput | null>(null);

  const resetLabel = t("button.reset");

  const filenameValidation = useMemo(() => {
    return validatePdfFilename(filename);
  }, [filename]);

  const filenameError = useMemo(() => {
    if (filenameValidation.valid) return null;
    return t("errors.invalidFilename");
  }, [filenameValidation, t]);

  const totalPages = useMemo(() => {
    return files.reduce((acc, f) => acc + (f.pageCount ?? 0), 0);
  }, [files]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addFiles = useCallback(async (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const fileList = Array.from(incoming);
    const valid = fileList.filter(
      (f) =>
        f.type === "application/pdf" ||
        f.name.toLowerCase().endsWith(".pdf")
    );

    if (valid.length === 0) return;

    const existingKeys = new Set(
      filesRef.current.map(
        (item) => `${item.name}-${item.size}-${item.file.lastModified ?? ""}`
      )
    );

    const trulyNewFiles = valid.filter(
      (f) => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified ?? ""}`)
    );

    if (trulyNewFiles.length === 0) return;

    const newEntries: MergeFileEntry[] = trulyNewFiles.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      name: f.name,
      size: f.size,
      pageCount: null,
    }));

    setFiles((prev) => [...prev, ...newEntries]);
    setError(null);
    setResult(null);

    for (const entry of newEntries) {
      try {
        const buffer = await entry.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        const count = doc.getPageCount();
        setFiles((prev) =>
          prev.map((item) =>
            item.id === entry.id ? { ...item, pageCount: count } : item
          )
        );
      } catch {
        setFiles((prev) =>
          prev.map((item) =>
            item.id === entry.id ? { ...item, pageCount: null } : item
          )
        );
      }
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setError(null);
  }, []);

  const handleClearAll = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setFilename("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError(t("errors.tooFewFiles"));
      return;
    }

    if (!filenameValidation.valid) {
      setError(filenameError);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const actualJobs: PDFJob[] = files.map((f) => ({
        file: f.file,
        name: f.name,
      }));
      const mergedBytes = await mergePDFs(actualJobs);

      const cleanBase = filename.trim().replace(/\.pdf$/i, "");
      const outputName = cleanBase ? `${cleanBase}.pdf` : "documento_mesclado.pdf";

      setResult({
        bytes: mergedBytes,
        fileName: outputName,
        sizeBytes: mergedBytes.byteLength,
        filesCount: files.length,
        totalPages,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.mergeFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    saveAs(
      new Blob([result.bytes as unknown as BlobPart], {
        type: "application/pdf",
      }),
      result.fileName
    );
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setFilename("");
  };

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background py-3 sm:py-6 md:py-8">
      <div className="w-full">
        <PdfToolHeader
          title={title}
          description={description}
          locale={locale}
          badges={[
            {
              text: t("badges.noUpload"),
              bg: "bg-primary",
              textColor: "text-background",
              icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text: t("badges.quality"),
              bg: "bg-secondary",
              textColor: "text-background",
              icon: <Layers className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text: t("badges.free"),
              bg: "bg-foreground",
              textColor: "text-background",
              icon: <Sparkles className="w-3.5 h-3.5 shrink-0" />,
            },
          ]}
        />

        <AppCard
          border
          cornerAccents={true}
          className="p-1.5 sm:p-4 md:p-6 lg:p-8 bg-tertiary mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto shadow-xs"
        >
          <div className="space-y-3 sm:space-y-5">
            {!result ? (
              <>
                <AppDropfile
                  id="merge-dropfile"
                  accept=".pdf,application/pdf"
                  multiple={true}
                  value={files.map((f) => f.file)}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  onFilesChange={addFiles}
                  showSelectedFiles={false}
                  disabled={loading}
                  error={error || undefined}
                />

                {files.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                          {locale === "pt"
                            ? "Arquivos Selecionados"
                            : locale === "es"
                              ? "Archivos Seleccionados"
                              : "Selected Files"}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold bg-primary text-background rounded-[2px]">
                          {files.length}
                        </span>
                        {totalPages > 0 && (
                          <span className="text-xs text-label">
                            ({totalPages}{" "}
                            {totalPages === 1
                              ? locale === "en"
                                ? "page"
                                : "página"
                              : locale === "en"
                                ? "pages"
                                : "páginas"}
                            )
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-label">
                        <Info className="w-3.5 h-3.5 shrink-0 text-primary" />
                        <span>
                          {locale === "pt"
                            ? "Arraste para definir a ordem final"
                            : locale === "es"
                              ? "Arrastra para definir el orden final"
                              : "Drag items to set merge order"}
                        </span>
                      </div>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      modifiers={[restrictToVerticalAxis]}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={files.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto overflow-x-hidden p-1">
                          {files.map((entry, index) => (
                            <MergeFileItem
                              key={entry.id}
                              id={entry.id}
                              name={entry.name}
                              size={entry.size}
                              pageCount={entry.pageCount}
                              index={index}
                              onRemove={removeFile}
                              locale={locale}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    <div className="pt-2">
                      <AppInput
                        id="merge-filename-input"
                        label={
                          <span>
                            {t("filename.label")}{" "}
                            <span className="text-label lowercase font-normal">
                              ({t("filename.hint")})
                            </span>
                          </span>
                        }
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder={t("filename.placeholder")}
                        error={filenameError || undefined}
                        aria-invalid={Boolean(filenameError)}
                      />
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 font-semibold text-foreground min-w-0">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                        <span className="truncate">{t("processing.status")}</span>
                      </div>
                      <span className="text-xs text-label font-medium shrink-0">
                        {t("processing.local")}
                      </span>
                    </div>
                    <div className="w-full bg-tertiary h-2 rounded-[2px] overflow-hidden border border-border">
                      <div className="bg-primary h-full w-full animate-pulse" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                  <AppButton
                    onClick={handleMerge}
                    disabled={loading || files.length < 2 || Boolean(filenameError)}
                    color="primary"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {loading ? t("button.merging") : t("button.merge")}
                  </AppButton>

                  {files.length > 0 && !loading && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer flex items-center gap-1.5 self-center sm:self-auto py-2 sm:py-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t("button.clearAll")}</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <MergeResult
                fileName={result.fileName}
                sizeBytes={result.sizeBytes}
                filesCount={result.filesCount}
                totalPages={result.totalPages}
                onDownload={handleDownload}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <MergeContent richContent={richContent} faqs={faqs} locale={locale} />
      </div>
    </main>
  );
}

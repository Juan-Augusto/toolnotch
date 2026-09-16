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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { saveAs } from "file-saver";
import { ShieldCheck, Images, Sparkles, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AppCard,
  AppButton,
  AppInput,
  AppDropfile,
} from "@/components/ui";
import { imagesToPDF, validatePdfFilename } from "@/lib/imageToPdf";
import type { FaqItem } from "@/components/AppFaqSection";
import PdfToolHeader from "../components/PdfToolHeader";
import SortableImageItem from "./components/SortableImageItem";
import JpgToPdfResult from "./components/JpgToPdfResult";
import JpgToPdfContent, { type RichContent } from "./components/JpgToPdfContent";
import { restrictToVerticalAxis } from "@/lib/dndModifiers";

interface ImageEntry {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
}

interface PdfOutput {
  blob: Blob;
  fileName: string;
  sizeBytes: number;
  imageCount: number;
}

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function JpgToPdfTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("pdf.jpgToPdf");
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pdfOutput, setPdfOutput] = useState<PdfOutput | null>(null);

  const resetLabel =
    locale === "pt"
      ? "Converter outras imagens"
      : locale === "es"
        ? "Convertir otras imágenes"
        : "Convert more images";

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

  const addFiles = useCallback((files: FileList | File[] | null) => {
    if (!files) return;
    const fileList = Array.from(files);
    const valid = fileList.filter((f) => {
      const isImg = f.type.startsWith("image/");
      const hasExt = /\.(jpe?g|png)$/i.test(f.name);
      return isImg || hasExt;
    });

    if (valid.length === 0) return;

    setImages((prev) => {
      const existingMap = new Map(prev.map((item) => [`${item.name}-${item.size}`, item]));
      return valid.map((f) => {
        const key = `${f.name}-${f.size}`;
        const existing = existingMap.get(key);
        if (existing) return existing;
        return {
          id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          name: f.name,
          size: f.size,
          preview: URL.createObjectURL(f),
        };
      });
    });
    setError(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

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
      setError(filenameError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const files = images.map((img) => img.file);
      const bytes = await imagesToPDF(files);

      const trimmed = filename.trim();
      const finalName = trimmed
        ? trimmed.toLowerCase().endsWith(".pdf")
          ? trimmed
          : `${trimmed}.pdf`
        : "images.pdf";
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });

      setPdfOutput({
        blob,
        fileName: finalName,
        sizeBytes: blob.size,
        imageCount: images.length,
      });
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.conversionFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfOutput) return;
    saveAs(pdfOutput.blob, pdfOutput.fileName);
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setFilename("");
    setError(null);
    setDone(false);
    setPdfOutput(null);
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
              text:
                locale === "pt"
                  ? "Sem upload para servidores"
                  : locale === "es"
                    ? "Sin subida a servidores"
                    : "Zero server upload",
              bg: "bg-primary",
              textColor: "text-background",
              icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text:
                locale === "pt"
                  ? "Suporta JPG, PNG & JPEG"
                  : locale === "es"
                    ? "Soporta JPG, PNG y JPEG"
                    : "Supports JPG, PNG & JPEG",
              bg: "bg-secondary",
              textColor: "text-background",
              icon: <Images className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text:
                locale === "pt"
                  ? "Ilimitado & Gratuito"
                  : locale === "es"
                    ? "Ilimitado y Gratis"
                    : "Unlimited & Free",
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
            {!done || !pdfOutput ? (
              <>
                <AppDropfile
                  id="imgpdf-file-input"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple={true}
                  value={images.map((img) => img.file)}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  onFilesChange={addFiles}
                  showSelectedFiles={false}
                  disabled={loading}
                  error={error || undefined}
                />

                {images.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                          {locale === "pt"
                            ? "Imagens Selecionadas"
                            : locale === "es"
                              ? "Imágenes Seleccionadas"
                              : "Selected Images"}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold bg-primary text-background rounded-[2px]">
                          {images.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-label">
                        <Info className="w-3.5 h-3.5 shrink-0 text-primary" />
                        <span>
                          {locale === "pt"
                            ? "Arraste para reorganizar a ordem das páginas"
                            : locale === "es"
                              ? "Arrastra para reorganizar el orden de las páginas"
                              : "Drag items to reorder pages"}
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
                        items={images.map((img) => img.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto overflow-x-hidden p-1">
                          {images.map((img, index) => (
                            <SortableImageItem
                              key={img.id}
                              id={img.id}
                              name={img.name}
                              size={img.size}
                              preview={img.preview}
                              index={index}
                              onRemove={removeImage}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    <div className="pt-2">
                      <AppInput
                        id="jpg-to-pdf-filename"
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

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-[2px] text-xs text-red-500">
                    {error}
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <AppButton
                    onClick={handleConvert}
                    disabled={
                      loading ||
                      images.length === 0 ||
                      !filenameValidation.valid
                    }
                    color="primary"
                    className="w-full sm:w-auto"
                  >
                    {loading
                      ? t("button.converting")
                      : t("button.convert")}
                  </AppButton>
                </div>
              </>
            ) : (
              <JpgToPdfResult
                fileName={pdfOutput.fileName}
                sizeBytes={pdfOutput.sizeBytes}
                imageCount={pdfOutput.imageCount}
                onDownload={handleDownload}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
              />
            )}
          </div>
        </AppCard>

        <JpgToPdfContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

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
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppDropfile from "@/components/AppDropfile";
import { AppCard, AppButton, AppBadge, AppInput } from "@/components/ui";
import { imagesToPDF, validatePdfFilename } from "@/lib/imageToPdf";
import type { FaqItem } from "@/components/AppFaqSection";
import SortableImageItem from "./components/SortableImageItem";
import JpgToPdfResult from "./components/JpgToPdfResult";
import JpgToPdfContent, { type RichContent } from "./components/JpgToPdfContent";

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

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const pdfToolsLabel =
    locale === "pt"
      ? "Ferramentas PDF"
      : locale === "es"
        ? "Herramientas PDF"
        : "PDF Tools";
  const prefix = locale === "en" ? "" : `/${locale}`;

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
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (f) =>
        f.type === "image/jpeg" ||
        f.type === "image/png" ||
        f.type === "image/jpg" ||
        f.name.toLowerCase().endsWith(".jpg") ||
        f.name.toLowerCase().endsWith(".jpeg") ||
        f.name.toLowerCase().endsWith(".png")
    );

    setImages((prev) => {
      const uniqueNewFiles = validFiles.filter(
        (f) =>
          !prev.some(
            (entry) =>
              entry.file.name === f.name &&
              entry.file.size === f.size &&
              entry.file.lastModified === f.lastModified
          )
      );

      if (uniqueNewFiles.length === 0) return prev;

      const newEntries: ImageEntry[] = uniqueNewFiles.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        name: f.name,
        size: f.size,
        preview: URL.createObjectURL(f),
      }));

      return [...prev, ...newEntries];
    });

    setDone(false);
    setPdfOutput(null);
    setError(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) URL.revokeObjectURL(entry.preview);
      const remaining = prev.filter((e) => e.id !== id);
      if (remaining.length === 0) {
        setDone(false);
        setPdfOutput(null);
      }
      return remaining;
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
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const bytes = await imagesToPDF(images.map((e) => e.file));
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
    <main className="container min-h-[calc(100vh-180px)] bg-background py-8">
      <div className="w-full">
        <div className="w-full pb-4">
          <AppBreadcrumb
            items={[
              { label: homeLabel, href: prefix || "/" },
              { label: pdfToolsLabel, href: `${prefix}/tools/pdf` },
              { label: title, current: true },
            ]}
          />
        </div>

        <header className="mb-10 pt-2 pb-8 border-b border-border/80 relative">
          <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground">
            {title}
          </h1>
          <p className="leading-relaxed text-label mt-3 max-w-3xl font-mono text-xs sm:text-sm">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5">
            <AppBadge
              bg="bg-primary"
              text="text-background"
              icon={<ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
            >
              {locale === "pt"
                ? "Sem upload para servidores"
                : locale === "es"
                  ? "Sin subida a servidores"
                  : "Zero server upload"}
            </AppBadge>
            <AppBadge
              bg="bg-secondary"
              text="text-background"
              icon={<Images className="w-3.5 h-3.5 shrink-0" />}
            >
              {locale === "pt"
                ? "Suporta JPG, PNG & JPEG"
                : locale === "es"
                  ? "Soporta JPG, PNG y JPEG"
                  : "Supports JPG, PNG & JPEG"}
            </AppBadge>
            <AppBadge
              bg="bg-foreground"
              text="text-background"
              icon={<Sparkles className="w-3.5 h-3.5 shrink-0" />}
            >
              {locale === "pt"
                ? "Ilimitado & Gratuito"
                : locale === "es"
                  ? "Ilimitado y Gratis"
                  : "Unlimited & Free"}
            </AppBadge>
          </div>
        </header>

        <AppCard
          border
          cornerAccents={true}
          className="p-6 md:p-8 bg-tertiary mb-10 max-w-4xl mx-auto shadow-xs"
        >
          <div className="space-y-6">
            {!done || !pdfOutput ? (
              <>
                <AppDropfile
                  id="imgpdf-file-input"
                  accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                  multiple={true}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={images.map((img) => img.file)}
                  onFilesChange={addFiles}
                  showSelectedFiles={false}
                  disabled={loading}
                  error={error || undefined}
                />

                {images.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                          {locale === "pt"
                            ? "Imagens Selecionadas"
                            : locale === "es"
                              ? "Imágenes Seleccionadas"
                              : "Selected Images"}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-mono font-bold bg-primary text-background rounded-[2px]">
                          {images.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-label font-mono text-sm">
                        <Info className="w-4 h-4 shrink-0 text-secondary" />
                        <span>
                          {locale === "pt"
                            ? "Arraste as imagens para definir a sequência das páginas"
                            : locale === "es"
                              ? "Arrastra las imágenes para definir el orden de las páginas"
                              : "Drag images to set the page order"}
                        </span>
                      </div>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={images.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {images.map((img, index) => (
                            <SortableImageItem
                              key={img.id}
                              id={img.id}
                              name={img.name}
                              size={img.size}
                              preview={img.preview}
                              index={index}
                              onRemove={removeImage}
                              locale={locale}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    <div className="pt-2">
                      <AppInput
                        id="custom-pdf-filename"
                        variant="background"
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
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-[2px] font-mono text-xs text-red-500">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <AppButton
                    onClick={handleConvert}
                    disabled={
                      loading ||
                      images.length === 0 ||
                      !filenameValidation.valid
                    }
                    color="primary"
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

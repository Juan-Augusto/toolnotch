"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import {
  ShieldCheck,
  FileImage,
  Sparkles,
} from "lucide-react";
import {
  AppCard,
  AppButton,
  AppDropfile,
} from "@/components/ui";
import { pdfToImages } from "@/lib/pdfToImage";
import type { FaqItem } from "@/components/AppFaqSection";
import PdfToolHeader from "../components/PdfToolHeader";
import PdfProgressBar from "../components/PdfProgressBar";
import PdfToJpgResult from "./components/PdfToJpgResult";
import PdfToJpgContent, { type RichContent } from "./components/PdfToJpgContent";

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function PdfToJpgTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("pdf.pdfToJpg");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{ name: string; dataUrl: string }[]>([]);
  const [done, setDone] = useState(false);

  const resetLabel = t("button.reset");

  const handleFile = async (f: File | null) => {
    if (!f) {
      setFile(null);
      setPageCount(null);
      setError(null);
      setDone(false);
      setImages([]);
      setProgress(null);
      return;
    }

    if (
      f.type !== "application/pdf" &&
      !f.name.toLowerCase().endsWith(".pdf")
    ) {
      return;
    }

    setFile(f);
    setDone(false);
    setError(null);
    setImages([]);
    setProgress(null);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPageCount(doc.getPageCount());
    } catch {
      setPageCount(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(pageCount ? { current: 0, total: pageCount } : null);

    try {
      const rendered = await pdfToImages(file, 2, (current, total) => {
        setProgress({ current, total });
      });

      setImages(rendered);
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.conversionFailed"));
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const handleDownloadAll = async () => {
    if (images.length === 0 || !file) return;

    if (images.length === 1) {
      handleDownloadSingle(images[0]);
      return;
    }

    const zip = new JSZip();
    for (const img of images) {
      const base64Data = img.dataUrl.split(",")[1];
      zip.file(img.name, base64Data, { base64: true });
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipName = `${file.name.replace(/\.pdf$/i, "")}_images.zip`;
    saveAs(zipBlob, zipName);
  };

  const handleDownloadSingle = (target: number | { name: string; dataUrl: string }) => {
    const img = typeof target === "number" ? images[target] : target;
    if (!img) return;
    try {
      const parts = img.dataUrl.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const bstr = atob(parts[1] || "");
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      saveAs(blob, img.name);
    } catch {
      // Fallback in case atob fails
      const link = document.createElement("a");
      link.href = img.dataUrl;
      link.download = img.name;
      link.click();
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(null);
    setError(null);
    setDone(false);
    setImages([]);
    setProgress(null);
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
              icon: <FileImage className="w-3.5 h-3.5 shrink-0" />,
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
            {!done ? (
              <>
                <AppDropfile
                  id="pdf-to-jpg-dropfile"
                  accept=".pdf,application/pdf"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={handleFile}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {pageCount !== null && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-background border border-border rounded-[2px] text-xs text-label">
                    <span className="text-secondary font-bold uppercase">
                      PDF:
                    </span>
                    <span className="text-foreground font-semibold">
                      {pageCount}{" "}
                      {pageCount === 1
                        ? t("pageCountSingular")
                        : t("pageCountPlural")}
                    </span>
                    <span className="text-label/60 ml-auto text-[11px]">
                      {locale === "pt"
                        ? "Detectado localmente"
                        : locale === "es"
                          ? "Detectado localmente"
                          : "Detected locally"}
                    </span>
                  </div>
                )}

                {loading && (
                  <PdfProgressBar
                    label={t("processing.status")}
                    current={progress?.current}
                    total={progress?.total}
                  />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                  <AppButton
                    onClick={handleConvert}
                    disabled={loading || !file}
                    color="primary"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {loading ? t("button.converting") : t("button.convert")}
                  </AppButton>

                  {file && !loading && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0"
                    >
                      {t("button.clearFile")}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <PdfToJpgResult
                images={images}
                fileName={file ? file.name : "document.pdf"}
                onDownloadAll={handleDownloadAll}
                onDownloadSingle={handleDownloadSingle}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <PdfToJpgContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

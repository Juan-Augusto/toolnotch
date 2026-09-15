"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import { ShieldCheck, Zap, Sparkles, Loader2 } from "lucide-react";
import { AppCard, AppButton, AppDropfile } from "@/components/ui";
import { compressPDF } from "@/lib/pdfCompress";
import type { FaqItem } from "@/components/AppFaqSection";
import PdfToolHeader from "../components/PdfToolHeader";
import CompressResult from "./components/CompressResult";
import CompressContent, { type RichContent } from "./components/CompressContent";

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function CompressTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("pdf.compress");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);

  const resetLabel =
    locale === "pt"
      ? "Comprimir outro arquivo"
      : locale === "es"
        ? "Comprimir otro archivo"
        : "Compress another file";

  const handleCompress = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await compressPDF(file);
      setCompressedBytes(bytes);
      setResult({ originalSize: file.size, compressedSize: bytes.byteLength });
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : t("errors.compressionFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBytes || !file) return;
    saveAs(
      new Blob([new Uint8Array(compressedBytes)], {
        type: "application/pdf",
      }),
      file.name.replace(/\.pdf$/i, "_compressed.pdf"),
    );
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setCompressedBytes(null);
  };

  const savings =
    result && result.originalSize > 0
      ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
      : 0;

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
                  ? "Preserva textos e imagens"
                  : locale === "es"
                    ? "Preserva textos e imágenes"
                    : "Preserves text & graphics",
              bg: "bg-secondary",
              textColor: "text-background",
              icon: <Zap className="w-3.5 h-3.5 shrink-0" />,
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
            {!result ? (
              <>
                <AppDropfile
                  accept=".pdf,application/pdf"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={(f) => {
                    setFile(f);
                    setResult(null);
                    setError(null);
                    setCompressedBytes(null);
                  }}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {loading && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 font-semibold text-foreground min-w-0">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                        <span className="truncate">
                          {locale === "pt"
                            ? "Otimizando estrutura do PDF..."
                            : locale === "es"
                              ? "Optimizando estructura del PDF..."
                              : "Optimizing PDF structure..."}
                        </span>
                      </div>
                      <span className="text-xs text-label font-medium shrink-0">
                        {locale === "pt"
                          ? "Processando no navegador"
                          : locale === "es"
                            ? "Procesando en tu navegador"
                            : "Processing locally"}
                      </span>
                    </div>
                    <div className="w-full bg-tertiary h-2 rounded-[2px] overflow-hidden border border-border">
                      <div className="bg-primary h-full w-full animate-pulse" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                  <AppButton
                    onClick={handleCompress}
                    disabled={loading || !file}
                    color="primary"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {loading ? t("button.compressing") : t("button.compress")}
                  </AppButton>
                  {file && !loading && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0"
                    >
                      {locale === "pt"
                        ? "Limpar arquivo"
                        : locale === "es"
                          ? "Limpiar archivo"
                          : "Clear file"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <CompressResult
                originalSize={result.originalSize}
                compressedSize={result.compressedSize}
                savings={savings}
                onDownload={handleDownload}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <CompressContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

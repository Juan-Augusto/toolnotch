"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import { ShieldCheck, Zap, Sparkles } from "lucide-react";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppDropfile from "@/components/AppDropfile";
import { AppCard, AppButton, AppBadge } from "@/components/ui";
import { compressPDF } from "@/lib/pdfCompress";
import type { FaqItem } from "@/components/AppFaqSection";
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
              icon={<Zap className="w-3.5 h-3.5 shrink-0" />}
            >
              {locale === "pt"
                ? "Preserva textos e imagens"
                : locale === "es"
                  ? "Preserva textos e imágenes"
                  : "Preserves text & graphics"}
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
                  <div className="p-4 bg-background border border-secondary/30 rounded-[2px] space-y-2.5 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary font-semibold uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                        {locale === "pt"
                          ? "Otimizando estrutura do PDF..."
                          : locale === "es"
                            ? "Optimizando estructura del PDF..."
                            : "Optimizing PDF structure..."}
                      </span>
                      <span className="text-label text-[11px] animate-pulse">
                        {locale === "pt"
                          ? "Processando no navegador"
                          : locale === "es"
                            ? "Procesando en tu navegador"
                            : "Processing locally"}
                      </span>
                    </div>
                    <div className="w-full bg-tertiary h-1.5 rounded-full overflow-hidden border border-border/40">
                      <div className="bg-gradient-to-r from-secondary to-primary h-full w-full animate-[neon-pulse_1.5s_ease-in-out_infinite]" />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <AppButton
                    onClick={handleCompress}
                    disabled={loading || !file}
                    color="primary"
                    withArrow
                  >
                    {loading ? t("button.compressing") : t("button.compress")}
                  </AppButton>
                  {file && !loading && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="font-mono text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer"
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

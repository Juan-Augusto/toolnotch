"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import {
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
  Loader2,
} from "lucide-react";
import { AppCard, AppButton, AppInput, AppDropfile } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import { compressImage } from "@/lib/imageConversion";
import ImageToolHeader from "../components/ImageToolHeader";
import ConvertWebpToPngResult from "./components/ConvertWebpToPngResult";
import ConvertWebpToPngContent, {
  type RichContent,
} from "./components/ConvertWebpToPngContent";

interface ConvertedResultData {
  blob: Blob;
  originalSize: number;
  convertedSize: number;
  width?: number;
  height?: number;
  previewUrl: string;
}

interface ConvertWebpToPngToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function ConvertWebpToPngTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: ConvertWebpToPngToolProps) {
  const t = useTranslations("image.convertWebpToPng");

  const [file, setFile] = useState<File | null>(null);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertedResultData | null>(null);

  const resetLabel =
    locale === "pt"
      ? "Converter outra imagem"
      : locale === "es"
        ? "Convertir otra imagen"
        : "Convert another image";

  useEffect(() => {
    return () => {
      if (result?.previewUrl) {
        URL.revokeObjectURL(result.previewUrl);
      }
    };
  }, [result]);

  const handleFileChange = useCallback(
    (selected: File | File[] | null) => {
      const single = Array.isArray(selected) ? selected[0] : selected;
      if (single) {
        const isWebp =
          single.type === "image/webp" || /\.webp$/i.test(single.name);
        if (!isWebp) {
          setError(t("errors.invalidType"));
          setFile(null);
          return;
        }
      }

      setFile(single);
      setError(null);
      if (result?.previewUrl) {
        URL.revokeObjectURL(result.previewUrl);
      }
      setResult(null);
    },
    [result, t],
  );

  const handleConvert = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await compressImage({
        file,
        format: "png",
        quality: 100, // PNG is lossless
        maxWidth: maxWidth && maxWidth > 0 ? maxWidth : undefined,
      });

      const url = URL.createObjectURL(res.blob);

      // Lê dimensões da imagem convertida
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      setResult({
        blob: res.blob,
        originalSize: res.originalSize,
        convertedSize: res.compressedSize,
        width: img.naturalWidth || img.width || undefined,
        height: img.naturalHeight || img.height || undefined,
        previewUrl: url,
      });
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.webp$/i, "");
    saveAs(result.blob, `${baseName}.png`);
  };

  const handleReset = () => {
    setFile(null);
    if (result?.previewUrl) {
      URL.revokeObjectURL(result.previewUrl);
    }
    setResult(null);
    setError(null);
    setMaxWidth(undefined);
  };

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <div className="w-full">
        <ImageToolHeader
          title={title}
          description={description}
          locale={locale}
          badges={[
            {
              text: t("badges.private"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />,
            },
            {
              text: t("badges.format"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Zap className="w-3.5 h-3.5 text-secondary shrink-0" />,
            },
            {
              text: t("badges.transparency"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />,
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
                  id="convert-webp-to-png-dropfile"
                  accept=".webp,image/webp"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={handleFileChange}
                  onReject={() => setError(t("errors.invalidType"))}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {file && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-4 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border text-xs">
                      <div className="flex items-center gap-2 uppercase font-bold text-foreground">
                        <Sliders className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{t("settings.title")}</span>
                      </div>
                      <span className="text-xs text-primary font-bold bg-tertiary px-2 py-0.5 rounded-[2px] border border-border self-start sm:self-auto">
                        WebP → PNG
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>{t("settings.preserveTransparency")}</span>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <label
                          htmlFor="max-width-input"
                          className="block text-xs font-semibold text-foreground mb-1"
                        >
                          {t("settings.maxWidthLabel")}
                        </label>
                        <AppInput
                          id="max-width-input"
                          type="number"
                          placeholder={t("settings.maxWidthPlaceholder")}
                          value={maxWidth || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setMaxWidth(isNaN(val) || val <= 0 ? undefined : val);
                          }}
                          className="max-w-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                      <AppButton
                        onClick={handleConvert}
                        disabled={loading}
                        color="primary"
                        withArrow
                        className="w-full sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                            {t("button.converting")}
                          </>
                        ) : (
                          t("button.convert")
                        )}
                      </AppButton>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0 font-mono"
                      >
                        {t("button.clearFile")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              file && (
                <ConvertWebpToPngResult
                  originalSize={result.originalSize}
                  convertedSize={result.convertedSize}
                  width={result.width}
                  height={result.height}
                  fileName={file.name}
                  previewUrl={result.previewUrl}
                  onDownload={handleDownload}
                  onReset={handleReset}
                  resetLabel={resetLabel}
                  locale={locale}
                  t={t}
                />
              )
            )}

            {error && (
              <div
                role="alert"
                className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-[2px] font-mono mt-4"
              >
                {error}
              </div>
            )}
          </div>
        </AppCard>

        <ConvertWebpToPngContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

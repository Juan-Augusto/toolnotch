"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Sliders,
  RefreshCw,
  Loader2,
  Trash2,
  FileImage,
} from "lucide-react";
import {
  AppCard,
  AppButton,
  AppDropfile,
  AppTabsChips,
  AppInput,
} from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import { compressImage } from "@/lib/imageConversion";
import type { SupportedFormat } from "@/lib/imageTypes";
import ImageToolHeader from "../components/ImageToolHeader";
import ImageConverterResult, {
  type ConvertedItem,
} from "./components/ImageConverterResult";
import ImageConverterContent, {
  type RichContent,
} from "./components/ImageConverterContent";

interface ImageConverterToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function ImageConverterTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: ImageConverterToolProps) {
  const t = useTranslations("image.imageConverter");

  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>("webp");
  const [quality, setQuality] = useState<number>(85);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [convertedItems, setConvertedItems] = useState<ConvertedItem[] | null>(null);

  const resetLabel =
    locale === "pt"
      ? "Converter mais imagens"
      : locale === "es"
        ? "Convertir más imágenes"
        : "Convert more images";

  // Limpeza de Object URLs ao desmontar ou redefinir
  useEffect(() => {
    return () => {
      if (convertedItems) {
        convertedItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      }
    };
  }, [convertedItems]);

  const handleFilesChange = useCallback((selected: File[] | File | null) => {
    if (!selected) {
      setFiles([]);
      setError(null);
      setConvertedItems(null);
      return;
    }

    const list = Array.isArray(selected) ? selected : [selected];
    if (list.length === 0) {
      setFiles([]);
      return;
    }

    setFiles(list);
    setError(null);
    setConvertedItems(null);
  }, []);

  const handleConvert = async () => {
    if (files.length === 0) {
      setError(t("errors.noFile"));
      return;
    }

    setLoading(true);
    setProgress({ current: 0, total: files.length });
    setError(null);

    const results: ConvertedItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i + 1, total: files.length });

        const res = await compressImage({
          file,
          format: targetFormat,
          quality: targetFormat === "png" ? 100 : quality,
          maxWidth: maxWidth && maxWidth > 0 ? maxWidth : undefined,
        });

        const previewUrl = URL.createObjectURL(res.blob);

        let w = 0;
        let h = 0;
        try {
          const img = new Image();
          img.src = previewUrl;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
          w = img.naturalWidth || img.width || 0;
          h = img.naturalHeight || img.height || 0;
        } catch {
          // fallback silencioso para dimensões
        }

        results.push({
          id: `${file.name}-${i}-${Math.random().toString(36).slice(2, 7)}`,
          originalFile: file,
          blob: res.blob,
          originalSize: res.originalSize,
          convertedSize: res.compressedSize,
          savings: res.savings,
          width: w,
          height: h,
          previewUrl,
          targetFormat,
        });
      }

      setConvertedItems(results);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const handleDownloadSingle = (item: ConvertedItem) => {
    const baseName = item.originalFile.name.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}.${item.targetFormat}`;
    saveAs(item.blob, fileName);
  };

  const handleDownloadZip = async () => {
    if (!convertedItems || convertedItems.length === 0) return;

    try {
      const zip = new JSZip();
      convertedItems.forEach((item) => {
        const baseName = item.originalFile.name.replace(/\.[^/.]+$/, "");
        const fileName = `${baseName}.${item.targetFormat}`;
        zip.file(fileName, item.blob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `toolnotch-converted-images-${targetFormat}.zip`);
    } catch {
      setError(t("errors.failed"));
    }
  };

  const handleReset = () => {
    if (convertedItems) {
      convertedItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    }
    setFiles([]);
    setConvertedItems(null);
    setError(null);
    setProgress(null);
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
              text: t("badges.batch"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Layers className="w-3.5 h-3.5 text-secondary shrink-0" />,
            },
            {
              text: t("badges.formats"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Sliders className="w-3.5 h-3.5 text-primary shrink-0" />,
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
          <div className="space-y-4 sm:space-y-6">
            {!convertedItems ? (
              <>
                <AppDropfile
                  id="image-converter-dropfile"
                  accept=".png,.jpg,.jpeg,.webp,.avif,.gif,.bmp,.svg,image/*"
                  multiple={true}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={files}
                  onFilesChange={handleFilesChange}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {files.length > 0 && (
                  <div className="p-4 bg-background border border-border rounded-[2px] space-y-5 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border text-xs">
                      <div className="flex items-center gap-2 uppercase font-bold text-foreground">
                        <FileImage className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>
                          {t("settings.selectedCount", { count: files.length })}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 font-semibold uppercase tracking-wider cursor-pointer self-start sm:self-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t("button.clearFiles")}
                      </button>
                    </div>

                    {/* Controles de Conversão */}
                    <div className="space-y-4">
                      {/* Seletor de Formato de Saída */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t("settings.targetFormatLabel")}
                        </label>
                        <AppTabsChips
                          items={[
                            { id: "webp", label: "WebP (Recomendado)" },
                            { id: "jpg", label: "JPG (Universal)" },
                            { id: "png", label: "PNG (Sem Perdas)" },
                            { id: "avif", label: "AVIF (Alta Compressão)" },
                          ]}
                          value={targetFormat}
                          onChange={(id) => setTargetFormat(id as SupportedFormat)}
                        />
                      </div>

                      {/* Controle de Qualidade (exceto PNG) */}
                      {targetFormat !== "png" && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs">
                            <label htmlFor="quality-slider" className="font-semibold text-foreground">
                              {t("settings.qualityLabel")}
                            </label>
                            <span className="text-primary font-bold">{quality}%</span>
                          </div>
                          <input
                            id="quality-slider"
                            type="range"
                            min={10}
                            max={100}
                            step={5}
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            aria-label={t("settings.qualityLabel")}
                            className="w-full accent-primary cursor-pointer"
                          />
                          <p className="text-[11px] text-label">{t("settings.qualityHint")}</p>
                        </div>
                      )}

                      {/* Largura Máxima Opcional */}
                      <div className="space-y-1.5 pt-1">
                        <label htmlFor="max-width-input" className="text-xs font-semibold text-foreground">
                          {t("settings.maxWidthLabel")}
                        </label>
                        <AppInput
                          id="max-width-input"
                          type="number"
                          min={50}
                          max={8000}
                          placeholder={t("settings.maxWidthPlaceholder")}
                          value={maxWidth || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setMaxWidth(isNaN(val) || val <= 0 ? undefined : val);
                          }}
                        />
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <AppButton
                        onClick={handleConvert}
                        disabled={loading || files.length === 0}
                        color="primary"
                        withArrow
                        className="w-full sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                            {progress
                              ? `${t("button.converting")} (${progress.current}/${progress.total})`
                              : t("button.converting")}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 shrink-0" />
                            {t("button.convert")}
                          </>
                        )}
                      </AppButton>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <ImageConverterResult
                items={convertedItems}
                targetFormat={targetFormat}
                onDownloadSingle={handleDownloadSingle}
                onDownloadZip={handleDownloadZip}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
                t={t}
              />
            )}
          </div>
        </AppCard>

        {/* Conteúdo Rico e SEO */}
        <ImageConverterContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

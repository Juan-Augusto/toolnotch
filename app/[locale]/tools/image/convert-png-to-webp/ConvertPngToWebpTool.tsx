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
import ConvertPngToWebpResult from "./components/ConvertPngToWebpResult";
import ConvertPngToWebpContent, {
  type RichContent,
} from "./components/ConvertPngToWebpContent";

interface ConvertedResultData {
  blob: Blob;
  originalSize: number;
  convertedSize: number;
  savings: number;
  width: number;
  height: number;
  previewUrl: string;
}

interface ConvertPngToWebpToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function ConvertPngToWebpTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: ConvertPngToWebpToolProps) {
  const t = useTranslations("image.convertPngToWebp");

  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(85);
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

  // Limpeza de Object URLs para evitar vazamento de memória
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
        const isPng =
          single.type === "image/png" || /\.png$/i.test(single.name);
        if (!isPng) {
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
      // Obter dimensões originais da imagem para cálculo
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = objectUrl;
      });

      let finalWidth = img.width;
      let finalHeight = img.height;
      if (maxWidth && finalWidth > maxWidth) {
        finalHeight = Math.round((finalHeight * maxWidth) / finalWidth);
        finalWidth = maxWidth;
      }
      URL.revokeObjectURL(objectUrl);

      // Conversão real para WebP usando Canvas API
      const conversion = await compressImage({
        file,
        format: "webp",
        quality,
        maxWidth,
      });

      const previewUrl = URL.createObjectURL(conversion.blob);

      setResult({
        blob: conversion.blob,
        originalSize: conversion.originalSize,
        convertedSize: conversion.compressedSize,
        savings: conversion.savings,
        width: finalWidth,
        height: finalHeight,
        previewUrl,
      });
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const outName = file.name.replace(/\.png$/i, "") + ".webp";
    saveAs(result.blob, outName);
  };

  const handleReset = () => {
    if (result?.previewUrl) {
      URL.revokeObjectURL(result.previewUrl);
    }
    setFile(null);
    setResult(null);
    setError(null);
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
              text: t("badges.transparency"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: (
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
              ),
            },
            {
              text: t("badges.format"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Zap className="w-3.5 h-3.5 text-primary shrink-0" />,
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
                  id="png-to-webp-dropfile"
                  accept=".png,image/png"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={handleFileChange}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {/* Opções de Configuração da Conversão */}
                {file && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-4 font-mono">
                    <div className="flex items-center gap-2 pb-2 border-b border-border text-xs uppercase font-bold text-foreground">
                      <Sliders className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{t("settings.title")}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Slider de Qualidade */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label
                            htmlFor="quality-slider"
                            className="font-semibold text-foreground"
                          >
                            {t("settings.qualityLabel")}
                          </label>
                          <span className="bg-tertiary px-2 py-0.5 rounded-[2px] border border-border font-bold text-primary">
                            {quality}%
                          </span>
                        </div>
                        <input
                          id="quality-slider"
                          type="range"
                          min={10}
                          max={100}
                          step={1}
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          disabled={loading}
                          aria-label={t("settings.qualityLabel")}
                          className="w-full accent-primary h-1.5 bg-tertiary rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-label">
                          <span>{t("settings.smaller")} (10%)</span>
                          <span>{t("settings.better")} (100%)</span>
                        </div>
                        <p className="text-[11px] text-label leading-tight">
                          {t("settings.qualityHint")}
                        </p>
                      </div>

                      {/* Redimensionamento Opcional (Max Width) */}
                      <div className="space-y-2">
                        <label
                          htmlFor="max-width-input"
                          className="block text-xs font-semibold text-foreground"
                        >
                          {t("settings.maxWidthLabel")}
                        </label>
                        <AppInput
                          id="max-width-input"
                          type="number"
                          min={100}
                          max={8000}
                          step={10}
                          placeholder={t("settings.maxWidthPlaceholder")}
                          value={maxWidth !== undefined ? String(maxWidth) : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMaxWidth(val ? Number(val) : undefined);
                          }}
                          disabled={loading}
                          className="w-full"
                        />
                        <p className="text-[11px] text-label flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-secondary shrink-0" />
                          <span>{t("settings.preserveTransparency")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Barra de Progresso Durante Conversão */}
                {loading && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3 font-mono">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 font-semibold text-foreground min-w-0">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                        <span className="truncate">
                          {locale === "pt"
                            ? "Convertendo PNG para WebP..."
                            : locale === "es"
                              ? "Convirtiendo PNG a WebP..."
                              : "Converting PNG to WebP..."}
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

                {/* Botões de Ação */}
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
                      className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0 font-mono"
                    >
                      {t("button.clearFile")}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <ConvertPngToWebpResult
                originalSize={result.originalSize}
                convertedSize={result.convertedSize}
                savings={result.savings}
                width={result.width}
                height={result.height}
                fileName={file ? file.name : "imagem.png"}
                previewUrl={result.previewUrl}
                onDownload={handleDownload}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <ConvertPngToWebpContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

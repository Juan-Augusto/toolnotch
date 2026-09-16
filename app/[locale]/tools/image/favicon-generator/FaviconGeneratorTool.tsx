"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Sliders,
  Package,
  Loader2,
} from "lucide-react";
import { AppCard, AppButton, AppDropfile, AppInput } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import {
  generateFavicons,
  type FaviconPackageResult,
} from "@/lib/faviconGenerator";
import { getImageDimensions } from "@/lib/imageManipulation";
import ImageToolHeader from "../components/ImageToolHeader";
import FaviconGeneratorResult from "./components/FaviconGeneratorResult";
import FaviconGeneratorContent, {
  type RichContent,
} from "./components/FaviconGeneratorContent";

interface FaviconGeneratorToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function FaviconGeneratorTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: FaviconGeneratorToolProps) {
  const t = useTranslations("image.faviconGenerator");

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  // Configurações
  const [siteName, setSiteName] = useState<string>("My Site");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FaviconPackageResult | null>(null);

  const resetLabel =
    locale === "pt"
      ? "Criar outro favicon"
      : locale === "es"
        ? "Crear otro favicon"
        : "Generate another favicon";

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (result) {
        result.items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      }
    };
  }, [imageSrc, result]);

  const handleFileChange = useCallback(
    async (selected: File | File[] | null) => {
      const single = Array.isArray(selected) ? selected[0] : selected;
      if (!single) {
        setFile(null);
        setError(null);
        setResult(null);
        return;
      }

      try {
        const { width: w, height: h } = await getImageDimensions(single);
        if (imageSrc) URL.revokeObjectURL(imageSrc);
        const url = URL.createObjectURL(single);

        setFile(single);
        setImageSrc(url);
        setOrigWidth(w);
        setOrigHeight(h);
        setError(null);
        setResult(null);
      } catch {
        setError(t("errors.invalidType"));
        setFile(null);
      }
    },
    [imageSrc, t],
  );

  const handleGenerate = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await generateFavicons({
        file,
        siteName: siteName.trim() || "My Site",
        backgroundColor: backgroundColor.trim() || "#ffffff",
      });

      setResult(res);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = () => {
    if (!result) return;
    saveAs(result.zipBlob, "favicon-package.zip");
  };

  const handleReset = () => {
    setFile(null);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setOrigWidth(0);
    setOrigHeight(0);
    if (result) {
      result.items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    }
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
              text: t("badges.package"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Package className="w-3.5 h-3.5 text-secondary shrink-0" />,
            },
            {
              text: t("badges.ready"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Layers className="w-3.5 h-3.5 text-primary shrink-0" />,
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
                  id="favicon-generator-dropfile"
                  accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={handleFileChange}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {file && imageSrc && origWidth > 0 && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-4 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border text-xs">
                      <div className="flex items-center gap-2 uppercase font-bold text-foreground">
                        <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                      </div>
                      <span className="text-xs text-primary font-bold bg-tertiary px-2 py-0.5 rounded-[2px] border border-border self-start sm:self-auto">
                        {origWidth} × {origHeight} px
                      </span>
                    </div>

                    {/* Preview do Logotipo */}
                    <div className="flex items-center gap-4 p-3 bg-tertiary border border-border rounded-[2px]">
                      <div className="w-16 h-16 rounded-[2px] border border-border bg-background/60 p-1 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageSrc}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-foreground">{file.name}</p>
                        <p className="text-label">
                          {origWidth === origHeight
                            ? locale === "pt"
                              ? "Proporção 1:1 perfeita detectada."
                              : locale === "es"
                                ? "Proporción 1:1 perfecta detectada."
                                : "Perfect 1:1 square ratio detected."
                            : locale === "pt"
                              ? "A imagem será ajustada e centralizada no formato quadrado."
                              : locale === "es"
                                ? "La imagen se ajustará y centrará en formato cuadrado."
                                : "Image will be fitted and centered into square icons."}
                        </p>
                      </div>
                    </div>

                    {/* Configurações do Pacote */}
                    <div className="p-4 bg-tertiary border border-border rounded-[2px] space-y-4 font-mono">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-primary" />
                        {t("settings.title")}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label
                            htmlFor="site-name-input"
                            className="text-xs font-semibold text-foreground"
                          >
                            {t("settings.siteName")}
                          </label>
                          <AppInput
                            id="site-name-input"
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder={t("settings.siteNamePlaceholder")}
                          />
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="bg-color-input"
                            className="text-xs font-semibold text-foreground"
                          >
                            {t("settings.backgroundColor")}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              aria-label={t("settings.backgroundColor")}
                              className="w-9 h-9 p-0.5 rounded-[2px] bg-background border border-border cursor-pointer shrink-0"
                            />
                            <AppInput
                              id="bg-color-input"
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/80 space-y-1 text-xs text-label">
                        <p className="flex items-center gap-2">
                          <span className="text-primary font-bold">✓</span> {t("settings.includeIco")}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-primary font-bold">✓</span> {t("settings.includeManifest")}
                        </p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                      <AppButton
                        onClick={handleGenerate}
                        disabled={loading}
                        color="primary"
                        withArrow
                        className="w-full sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                            {t("button.generating")}
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 mr-2 shrink-0" />
                            {t("button.generate")}
                          </>
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
              <FaviconGeneratorResult
                items={result.items}
                zipBlob={result.zipBlob}
                zipSize={result.zipSize}
                htmlSnippet={result.htmlSnippet}
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
        <FaviconGeneratorContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

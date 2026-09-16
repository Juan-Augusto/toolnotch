"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import {
  ShieldCheck,
  Sparkles,
  Maximize,
  Sliders,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Lock,
  Unlock,
  Loader2,
  Eye,
} from "lucide-react";
import {
  AppCard,
  AppButton,
  AppInput,
  AppDropfile,
  AppTabsChips,
} from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import {
  resizeImage,
  getImageDimensions,
  type ResizeResult,
  type FitMode,
} from "@/lib/imageManipulation";
import type { SupportedFormat } from "@/lib/imageTypes";
import ImageToolHeader from "../components/ImageToolHeader";
import ImageResizerResult from "./components/ImageResizerResult";
import ImageResizerContent, {
  type RichContent,
} from "./components/ImageResizerContent";

interface ImageResizerToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

type ResizeTab = "dimensions" | "percentage" | "social";

export default function ImageResizerTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: ImageResizerToolProps) {
  const t = useTranslations("image.resizer");

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  // Modo ativo (dimensões, percentual ou social)
  const [activeTab, setActiveTab] = useState<ResizeTab>("dimensions");

  // Dimensões alvo
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [percentage, setPercentage] = useState<number>(100);
  const [fitMode, setFitMode] = useState<FitMode>("cover");

  // Rotação e espelhamento
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Formato e qualidade de saída
  const [outputFormat, setOutputFormat] = useState<SupportedFormat | "original">("original");
  const [quality, setQuality] = useState<number>(90);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResizeResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({
    w: 400,
    h: 320,
  });

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: cw, height: ch } = entry.contentRect;
        if (cw > 0 && ch > 0) {
          setContainerSize({ w: cw, h: ch });
        }
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const resetLabel =
    locale === "pt"
      ? "Redimensionar outra imagem"
      : locale === "es"
        ? "Redimensionar otra imagen"
        : "Resize another image";

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [imageSrc, previewUrl]);

  const handleFileChange = useCallback(async (selected: File | File[] | null) => {
    const single = Array.isArray(selected) ? selected[0] : selected;
    if (!single) {
      setFile(null);
      setImageSrc(null);
      setError(null);
      setResult(null);
      return;
    }

    try {
      const { width: w, height: h } = await getImageDimensions(single);
      const url = URL.createObjectURL(single);
      setFile(single);
      setImageSrc(url);
      setOrigWidth(w);
      setOrigHeight(h);
      setWidth(w);
      setHeight(h);
      setPercentage(100);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setLockAspect(true);
      setFitMode("cover");
      setError(null);
      setResult(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch {
      setError(t("errors.invalidType"));
      setFile(null);
      setImageSrc(null);
    }
  }, [previewUrl, t]);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && origWidth > 0) {
      setHeight(Math.round((val * origHeight) / origWidth));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && origHeight > 0) {
      setWidth(Math.round((val * origWidth) / origHeight));
    }
  };

  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    if (origWidth > 0 && origHeight > 0) {
      setWidth(Math.round((origWidth * pct) / 100));
      setHeight(Math.round((origHeight * pct) / 100));
    }
  };

  const handleApplyPreset = (w: number, h: number) => {
    setLockAspect(false);
    setWidth(w);
    setHeight(h);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlipH = () => {
    setFlipH((prev) => !prev);
  };

  const handleFlipV = () => {
    setFlipV((prev) => !prev);
  };

  const handleResize = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }
    if (width <= 0 || height <= 0) {
      setError(t("errors.invalidDimensions"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await resizeImage({
        file,
        targetWidth: width,
        targetHeight: height,
        format: outputFormat,
        quality,
        rotation,
        flipH,
        flipV,
        fitMode,
      });

      const url = URL.createObjectURL(res.blob);
      setPreviewUrl(url);
      setResult(res);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    let ext = ".jpg";
    if (outputFormat === "original") {
      const match = file.name.match(/\.[a-zA-Z0-9]+$/);
      ext = match ? match[0] : ".png";
    } else {
      ext = `.${outputFormat}`;
    }

    const baseName = file.name.replace(/\.[a-zA-Z0-9]+$/, "");
    saveAs(result.blob, `${baseName}-resized${ext}`);
  };

  const handleReset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setImageSrc(null);
    setResult(null);
    setPreviewUrl(null);
    setError(null);
  };

  const socialPresets = [
    { label: t("presets.instaPost"), w: 1080, h: 1080 },
    { label: t("presets.instaStory"), w: 1080, h: 1920 },
    { label: t("presets.youtubeThumb"), w: 1280, h: 720 },
    { label: t("presets.twitterPost"), w: 1200, h: 675 },
    { label: t("presets.linkedinBanner"), w: 1584, h: 396 },
    { label: t("presets.facebookPost"), w: 1200, h: 630 },
  ];

  const activeSocialPreset = socialPresets.find(
    (p) => p.w === width && p.h === height,
  );

  const isRotated90or270 = rotation === 90 || rotation === 270;
  const effectiveTargetWidth = isRotated90or270 ? height : width;
  const effectiveTargetHeight = isRotated90or270 ? width : height;

  const containerRatio =
    containerSize.w > 0 && containerSize.h > 0
      ? containerSize.w / containerSize.h
      : 400 / 320;
  const frameRatio =
    effectiveTargetWidth > 0 && effectiveTargetHeight > 0
      ? effectiveTargetWidth / effectiveTargetHeight
      : 1;
  const isTaller = frameRatio < containerRatio;

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
              text: t("badges.presets"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Maximize className="w-3.5 h-3.5 text-secondary shrink-0" />,
            },
            {
              text: t("badges.quality"),
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
          className="p-2.5 sm:p-5 md:p-6 lg:p-7 bg-tertiary mb-6 sm:mb-8 md:mb-10 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto shadow-xs"
        >
          <div className="space-y-3 sm:space-y-5">
            {!result ? (
              <>
                <AppDropfile
                  id="image-resizer-dropfile"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={handleFileChange}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {file && origWidth > 0 && imageSrc && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-start font-mono">
                    {/* Painel de Controles */}
                    <div className="lg:col-span-7 p-4 sm:p-5 bg-background border border-border rounded-[2px] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border text-xs">
                        <div className="flex items-center gap-2 uppercase font-bold text-foreground min-w-0">
                          <Sliders className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{t("settings.title")}</span>
                        </div>
                        <span className="text-xs text-label bg-tertiary px-2 py-0.5 rounded-[2px] border border-border shrink-0 self-start sm:self-auto">
                          {t("settings.originalDimensions", {
                            width: origWidth,
                            height: origHeight,
                          })}
                        </span>
                      </div>

                      {/* Abas de Modo de Redimensionamento */}
                      <AppTabsChips
                        items={[
                          { id: "dimensions", label: t("tabs.dimensions") },
                          { id: "percentage", label: t("tabs.percentage") },
                          { id: "social", label: t("tabs.social") },
                        ]}
                        value={activeTab}
                        onChange={(id) => {
                          const tab = id as ResizeTab;
                          setActiveTab(tab);
                          if (
                            tab === "social" &&
                            !socialPresets.some((p) => p.w === width && p.h === height)
                          ) {
                            handleApplyPreset(socialPresets[0].w, socialPresets[0].h);
                          }
                        }}
                      />

                      {/* Modo 1: Dimensões em Pixels */}
                      {activeTab === "dimensions" && (
                        <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1">
                              <label
                                htmlFor="width-input"
                                className="text-xs font-semibold text-foreground"
                              >
                                {t("settings.width")}
                              </label>
                              <AppInput
                                id="width-input"
                                type="number"
                                min={1}
                                max={10000}
                                value={width ? String(width) : ""}
                                onChange={(e) =>
                                  handleWidthChange(Math.max(1, Number(e.target.value) || 0))
                                }
                                disabled={loading}
                              />
                            </div>

                            <div className="space-y-1">
                              <label
                                htmlFor="height-input"
                                className="text-xs font-semibold text-foreground"
                              >
                                {t("settings.height")}
                              </label>
                              <AppInput
                                id="height-input"
                                type="number"
                                min={1}
                                max={10000}
                                value={height ? String(height) : ""}
                                onChange={(e) =>
                                  handleHeightChange(Math.max(1, Number(e.target.value) || 0))
                                }
                                disabled={loading}
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setLockAspect((prev) => !prev)}
                            className="flex items-center gap-2 text-xs text-label hover:text-foreground cursor-pointer pt-1 select-none"
                          >
                            {lockAspect ? (
                              <Lock className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5 text-label" />
                            )}
                            <span className={lockAspect ? "font-semibold text-foreground" : ""}>
                              {t("settings.lockAspect")}
                            </span>
                          </button>

                          {!lockAspect && (
                            <div className="space-y-1.5 pt-2 border-t border-border">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-foreground">
                                  {t("settings.fitModeLabel")}
                                </span>
                                <span className="text-[10px] text-primary font-bold">
                                  {fitMode === "cover"
                                    ? t("settings.fitCover")
                                    : fitMode === "contain"
                                      ? t("settings.fitContain")
                                      : t("settings.fitStretch")}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setFitMode("cover")}
                                  className={`py-2 px-2 text-[11px] leading-tight border rounded-[2px] font-mono transition-colors text-center cursor-pointer flex items-center justify-center min-h-[36px] ${
                                    fitMode === "cover"
                                      ? "border-primary bg-primary/10 text-foreground font-bold"
                                      : "border-border bg-tertiary text-label hover:border-primary/50"
                                  }`}
                                >
                                  {t("settings.fitCover")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFitMode("contain")}
                                  className={`py-2 px-2 text-[11px] leading-tight border rounded-[2px] font-mono transition-colors text-center cursor-pointer flex items-center justify-center min-h-[36px] ${
                                    fitMode === "contain"
                                      ? "border-primary bg-primary/10 text-foreground font-bold"
                                      : "border-border bg-tertiary text-label hover:border-primary/50"
                                  }`}
                                >
                                  {t("settings.fitContain")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFitMode("stretch")}
                                  className={`py-2 px-2 text-[11px] leading-tight border rounded-[2px] font-mono transition-colors text-center cursor-pointer flex items-center justify-center min-h-[36px] ${
                                    fitMode === "stretch"
                                      ? "border-primary bg-primary/10 text-foreground font-bold"
                                      : "border-border bg-tertiary text-label hover:border-primary/50"
                                  }`}
                                >
                                  {t("settings.fitStretch")}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Modo 2: Escala por Porcentagem */}
                      {activeTab === "percentage" && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between text-xs">
                            <label
                              htmlFor="percentage-slider"
                              className="font-semibold text-foreground cursor-pointer"
                            >
                              {t("settings.percentLabel")}
                            </label>
                            <span className="bg-tertiary px-2 py-0.5 rounded-[2px] border border-border font-bold text-primary">
                              {percentage}% ({width} × {height} px)
                            </span>
                          </div>
                          <input
                            id="percentage-slider"
                            type="range"
                            min={10}
                            max={200}
                            step={5}
                            value={percentage}
                            onChange={(e) => handlePercentageChange(Number(e.target.value))}
                            disabled={loading}
                            aria-label={t("settings.percentLabel")}
                            className="w-full accent-primary h-1.5 bg-tertiary rounded-lg cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-label font-mono">
                            <span>{t("settings.percentMin")}</span>
                            <span>{t("settings.percentOriginal")}</span>
                            <span>{t("settings.percentDouble")}</span>
                          </div>
                        </div>
                      )}

                      {/* Modo 3: Modelos de Redes Sociais */}
                      {activeTab === "social" && (
                        <div className="space-y-3 pt-2">
                          <span className="text-xs font-semibold text-foreground block">
                            {t("settings.socialPresetLabel")}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {socialPresets.map((preset, idx) => {
                              const isSelected = width === preset.w && height === preset.h;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleApplyPreset(preset.w, preset.h)}
                                  className={`p-3 text-left border rounded-[2px] text-xs transition-all flex flex-col justify-between cursor-pointer ${
                                    isSelected
                                      ? "border-primary bg-primary/10 text-foreground font-semibold shadow-xs ring-1 ring-primary/40"
                                      : "border-border bg-tertiary text-label hover:border-primary/50 hover:text-foreground"
                                  }`}
                                >
                                  <span className="font-medium">{preset.label}</span>
                                  <span className="text-[10px] text-primary font-bold mt-1.5 font-mono">
                                    {preset.w} × {preset.h} px
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Seletor de Enquadramento */}
                          <div className="space-y-1.5 pt-2 border-t border-border">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-foreground">
                                {t("settings.fitModeLabel")}
                              </span>
                              <span className="text-[10px] text-primary font-bold">
                                {fitMode === "cover"
                                  ? t("settings.fitCover")
                                  : fitMode === "contain"
                                    ? t("settings.fitContain")
                                    : t("settings.fitStretch")}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => setFitMode("cover")}
                                className={`py-2 px-2 text-[11px] leading-tight border rounded-[2px] font-mono transition-colors text-center cursor-pointer flex items-center justify-center min-h-[36px] ${
                                  fitMode === "cover"
                                    ? "border-primary bg-primary/10 text-foreground font-bold"
                                    : "border-border bg-tertiary text-label hover:border-primary/50"
                                }`}
                              >
                                {t("settings.fitCover")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setFitMode("contain")}
                                className={`py-2 px-2 text-[11px] leading-tight border rounded-[2px] font-mono transition-colors text-center cursor-pointer flex items-center justify-center min-h-[36px] ${
                                  fitMode === "contain"
                                    ? "border-primary bg-primary/10 text-foreground font-bold"
                                    : "border-border bg-tertiary text-label hover:border-primary/50"
                                }`}
                              >
                                {t("settings.fitContain")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setFitMode("stretch")}
                                className={`py-2 px-2 text-[11px] leading-tight border rounded-[2px] font-mono transition-colors text-center cursor-pointer flex items-center justify-center min-h-[36px] ${
                                  fitMode === "stretch"
                                    ? "border-primary bg-primary/10 text-foreground font-bold"
                                    : "border-border bg-tertiary text-label hover:border-primary/50"
                                }`}
                              >
                                {t("settings.fitStretch")}
                              </button>
                            </div>
                            <p className="text-[10px] text-label/80 leading-normal">
                              {t("settings.fitHint")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Ajustes de Orientação (Girar & Espelhar) */}
                      <div className="pt-3 border-t border-border space-y-2">
                        <span className="text-xs font-semibold text-foreground block">
                          {t("settings.transformLabel")}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleRotateLeft}
                            className="px-2.5 py-1.5 bg-tertiary hover:bg-card border border-border rounded-[2px] text-xs flex items-center gap-1.5 cursor-pointer text-label hover:text-foreground transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-primary" />
                            <span>{t("settings.rotateLeft")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRotateRight}
                            className="px-2.5 py-1.5 bg-tertiary hover:bg-card border border-border rounded-[2px] text-xs flex items-center gap-1.5 cursor-pointer text-label hover:text-foreground transition-colors"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-primary" />
                            <span>{t("settings.rotateRight")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleFlipH}
                            className={`px-2.5 py-1.5 border rounded-[2px] text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                              flipH
                                ? "bg-primary text-background border-primary font-bold"
                                : "bg-tertiary hover:bg-card border-border text-label hover:text-foreground"
                            }`}
                          >
                            <FlipHorizontal className="w-3.5 h-3.5" />
                            <span>{t("settings.flipH")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleFlipV}
                            className={`px-2.5 py-1.5 border rounded-[2px] text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                              flipV
                                ? "bg-primary text-background border-primary font-bold"
                                : "bg-tertiary hover:bg-card border-border text-label hover:text-foreground"
                            }`}
                          >
                            <FlipVertical className="w-3.5 h-3.5" />
                            <span>{t("settings.flipV")}</span>
                          </button>
                        </div>
                      </div>

                      {/* Formato de Saída */}
                      <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-foreground block">
                            {t("settings.outputFormat")}
                          </label>
                          <select
                            value={outputFormat}
                            onChange={(e) =>
                              setOutputFormat(e.target.value as SupportedFormat | "original")
                            }
                            disabled={loading}
                            className="w-full p-2 bg-tertiary border border-border rounded-[2px] text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                          >
                            <option value="original">{t("settings.formatOriginal")}</option>
                            <option value="webp">WebP (Mais leve e moderno)</option>
                            <option value="jpg">JPG (Padrão para fotos)</option>
                            <option value="png">PNG (Transparência sem perdas)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <label
                              htmlFor="quality-slider"
                              className="font-semibold text-foreground cursor-pointer"
                            >
                              {t("settings.qualityLabel")}
                            </label>
                            <span className="font-bold text-primary">{quality}%</span>
                          </div>
                          <input
                            id="quality-slider"
                            type="range"
                            min={20}
                            max={100}
                            step={5}
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            disabled={loading}
                            aria-label={t("settings.qualityLabel")}
                            className="w-full accent-primary h-1.5 bg-tertiary rounded-lg cursor-pointer mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Painel de Pré-visualização (Direita no Desktop) */}
                    <div className="lg:col-span-5 p-4 sm:p-5 bg-background border border-border rounded-[2px] space-y-3.5 lg:sticky lg:top-4">
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border text-xs">
                        <div className="flex items-center gap-2 uppercase font-bold text-foreground min-w-0">
                          <Eye className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{t("settings.previewTitle")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {activeSocialPreset && (
                            <span className="text-[10px] bg-primary/15 text-primary font-bold px-1.5 py-0.5 rounded-[2px] border border-primary/30 max-w-[130px] truncate">
                              {activeSocialPreset.label.split("(")[0].trim()}
                            </span>
                          )}
                          <span className="text-xs text-primary font-bold bg-tertiary px-2 py-0.5 rounded-[2px] border border-border">
                            {effectiveTargetWidth} × {effectiveTargetHeight} px
                          </span>
                        </div>
                      </div>

                      {/* Viewport de Pré-visualização com Fundo Xadrez */}
                      <div
                        ref={containerRef}
                        className="relative w-full h-[260px] sm:h-[300px] lg:h-[360px] xl:h-[400px] bg-tertiary/60 border border-border rounded-[2px] overflow-hidden flex items-center justify-center p-3 select-none"
                      >
                        {/* Fundo sutil para evidenciar transparência */}
                        <div
                          className="absolute inset-0 opacity-15 pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
                            backgroundSize: "12px 12px",
                          }}
                        />

                        {/* Moldura do Modelo / Canvas */}
                        <div className="w-full h-full flex items-center justify-center relative p-1">
                          <div
                            style={{
                              aspectRatio:
                                effectiveTargetWidth > 0 && effectiveTargetHeight > 0
                                  ? `${effectiveTargetWidth} / ${effectiveTargetHeight}`
                                  : undefined,
                              maxWidth: "100%",
                              maxHeight: "100%",
                              width: isTaller ? "auto" : "100%",
                              height: isTaller ? "100%" : "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              position: "relative",
                            }}
                            className={`shadow-md rounded-[3px] border-2 transition-all duration-300 relative ${
                              activeSocialPreset
                                ? "border-primary/60 ring-2 ring-primary/20 bg-card"
                                : "border-border/80 bg-card/80"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageSrc}
                              alt="Preview"
                              data-testid="resizer-live-preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: fitMode === "stretch" ? "fill" : fitMode,
                                transform: `rotate(${rotation}deg) scaleX(${
                                  flipH ? -1 : 1
                                }) scaleY(${flipV ? -1 : 1})`,
                                transition:
                                  "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                              }}
                              className="select-none pointer-events-none block"
                            />
                          </div>
                        </div>

                        {/* Badges de Transformações Ativas e Modelo */}
                        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 pointer-events-none z-10">
                          {activeSocialPreset && (
                            <span className="text-[10px] bg-primary text-background font-bold px-1.5 py-0.5 rounded-[2px] shadow-xs">
                              {activeSocialPreset.label.split("(")[0].trim()}
                            </span>
                          )}
                          {rotation !== 0 && (
                            <span className="text-[10px] bg-background/90 text-primary font-bold px-1.5 py-0.5 rounded-[2px] border border-border shadow-xs">
                              {rotation}°
                            </span>
                          )}
                          {flipH && (
                            <span className="text-[10px] bg-background/90 text-foreground font-bold px-1.5 py-0.5 rounded-[2px] border border-border shadow-xs">
                              Flip H
                            </span>
                          )}
                          {flipV && (
                            <span className="text-[10px] bg-background/90 text-foreground font-bold px-1.5 py-0.5 rounded-[2px] border border-border shadow-xs">
                              Flip V
                            </span>
                          )}
                        </div>

                        {/* Badges de Escala e Aspect Ratio */}
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none z-10">
                          {origWidth > 0 && (
                            <span className="text-[10px] bg-background/90 text-foreground px-1.5 py-0.5 rounded-[2px] border border-border font-bold shadow-xs">
                              {t("settings.scaleBadge", {
                                pct: Math.round((width / origWidth) * 100),
                              })}
                            </span>
                          )}
                          {width > 0 && height > 0 && (
                            <span className="text-[9px] bg-tertiary/90 text-label px-1 py-0.5 rounded-[2px] border border-border/80">
                              {t("settings.aspectRatioBadge", {
                                ratio: (width / height).toFixed(2) + ":1",
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Resumo da Exportação */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-label pt-1 border-t border-border">
                        <div>
                          <span className="text-foreground font-semibold">
                            {locale === "pt"
                              ? "Formato:"
                              : locale === "es"
                                ? "Formato:"
                                : "Format:"}{" "}
                          </span>
                          <span className="uppercase text-primary font-bold">
                            {outputFormat === "original"
                              ? file?.name.split(".").pop() || "ORIGINAL"
                              : outputFormat}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-foreground font-semibold">
                            {locale === "pt"
                              ? "Qualidade:"
                              : locale === "es"
                                ? "Calidad:"
                                : "Quality:"}{" "}
                          </span>
                          <span className="font-bold text-foreground">{quality}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3 font-mono">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 font-semibold text-foreground min-w-0">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                        <span className="truncate">
                          {locale === "pt"
                            ? "Redimensionando imagem..."
                            : locale === "es"
                              ? "Redimensionando imagen..."
                              : "Resizing image..."}
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
                    onClick={handleResize}
                    disabled={loading || !file}
                    color="primary"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {loading ? t("button.resizing") : t("button.resize")}
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
              <ImageResizerResult
                originalWidth={result.originalWidth}
                originalHeight={result.originalHeight}
                newWidth={result.newWidth}
                newHeight={result.newHeight}
                originalSize={result.originalSize}
                newSize={result.newSize}
                fileName={file ? file.name : "imagem-redimensionada.png"}
                previewUrl={previewUrl!}
                onDownload={handleDownload}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <ImageResizerContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import {
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Sliders,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { AppCard, AppButton, AppDropfile, AppTabsChips } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import {
  censorImage,
  getImageDimensions,
  type CensorArea,
  type CensorType,
  type CensorResult,
} from "@/lib/imageManipulation";
import type { SupportedFormat } from "@/lib/imageTypes";
import ImageToolHeader from "../components/ImageToolHeader";
import CensorImageResult from "./components/CensorImageResult";
import CensorImageContent, {
  type RichContent,
} from "./components/CensorImageContent";

interface CensorImageToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

function PixelateOverlay({
  imageElement,
  area,
  scaleX,
  scaleY,
}: {
  imageElement: HTMLImageElement | null;
  area: CensorArea;
  scaleX: number;
  scaleY: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageElement) return;

    try {
      const w = Math.max(1, Math.round(area.width * scaleX));
      const h = Math.max(1, Math.round(area.height * scaleY));
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext ? canvas.getContext("2d") : null;
      if (!ctx) return;

      const blockSize = Math.max(4, Math.round((area.strength || 16) * scaleX));
      const tempW = Math.max(1, Math.floor(w / blockSize));
      const tempH = Math.max(1, Math.floor(h / blockSize));

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = tempW;
      tempCanvas.height = tempH;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        tempCtx.drawImage(
          imageElement,
          area.x,
          area.y,
          area.width,
          area.height,
          0,
          0,
          tempW,
          tempH,
        );
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, tempW, tempH, 0, 0, w, h);
      }
    } catch {
      // Safe fallback
    }
  }, [imageElement, area, scaleX, scaleY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function CensorImageTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: CensorImageToolProps) {
  const t = useTranslations("image.censor");

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  // Efeito e opções
  const [censorMode, setCensorMode] = useState<CensorType>("pixelate");
  const [strength, setStrength] = useState<number>(16);
  const [outputFormat, setOutputFormat] = useState<SupportedFormat | "original">("original");

  // Áreas marcadas (em pixels reais da imagem original)
  const [areas, setAreas] = useState<CensorArea[]>([]);

  // Caixa sendo desenhada no momento (em pixels do contêiner visual)
  const [drawingBox, setDrawingBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [cleanPreview, setCleanPreview] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CensorResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const isDrawingRef = useRef<boolean>(false);

  const resetLabel =
    locale === "pt"
      ? "Censurar outra imagem"
      : locale === "es"
        ? "Censurar otra imagen"
        : "Censor another image";

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [imageSrc, previewUrl]);

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
        setAreas([]);
        setDrawingBox(null);
        setCleanPreview(false);
        setError(null);
        setResult(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      } catch {
        setError(t("errors.invalidType"));
        setFile(null);
      }
    },
    [imageSrc, previewUrl, t],
  );

  // Manipuladores de desenho da caixa de censura
  const getCoordinates = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current) return null;
    const rect = imageRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    return { x, y, width: rect.width, height: rect.height };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    if (cleanPreview) {
      setCleanPreview(false);
    }

    isDrawingRef.current = true;
    setDrawingBox({
      startX: coords.x,
      startY: coords.y,
      currentX: coords.x,
      currentY: coords.y,
    });
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawingRef.current || !drawingBox) return;
    const coords = getCoordinates(e);
    if (!coords) return;

    setDrawingBox((prev) => (prev ? { ...prev, currentX: coords.x, currentY: coords.y } : null));
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current || !drawingBox || !imageRef.current) {
      isDrawingRef.current = false;
      setDrawingBox(null);
      return;
    }

    isDrawingRef.current = false;

    const rect = imageRef.current.getBoundingClientRect();
    const dispW = rect.width;
    const dispH = rect.height;

    if (dispW <= 0 || dispH <= 0 || origWidth <= 0 || origHeight <= 0) {
      setDrawingBox(null);
      return;
    }

    const scaleX = origWidth / dispW;
    const scaleY = origHeight / dispH;

    const left = Math.min(drawingBox.startX, drawingBox.currentX);
    const top = Math.min(drawingBox.startY, drawingBox.currentY);
    const w = Math.abs(drawingBox.currentX - drawingBox.startX);
    const h = Math.abs(drawingBox.currentY - drawingBox.startY);

    // Ignora cliques simples ou caixas minúsculas (< 8px)
    if (w > 8 && h > 8) {
      const newArea: CensorArea = {
        id: Math.random().toString(36).slice(2, 9),
        x: Math.round(left * scaleX),
        y: Math.round(top * scaleY),
        width: Math.round(w * scaleX),
        height: Math.round(h * scaleY),
        type: censorMode,
        strength,
      };
      setAreas((prev) => [...prev, newArea]);
      setError(null);
    }

    setDrawingBox(null);
  };

  const removeArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const clearAllAreas = () => {
    setAreas([]);
    setCleanPreview(false);
  };

  const handleModeChange = (newMode: CensorType) => {
    setCensorMode(newMode);
    setAreas((prev) =>
      prev.map((a) => ({
        ...a,
        type: newMode,
        strength: a.strength || strength,
      })),
    );
  };

  const cycleAreaType = (id: string) => {
    const modes: CensorType[] = ["pixelate", "blur", "blackout"];
    setAreas((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nextIdx = (modes.indexOf(a.type) + 1) % modes.length;
        return { ...a, type: modes[nextIdx], strength: a.strength || strength };
      }),
    );
  };

  const handleStrengthChange = (val: number) => {
    setStrength(val);
    setAreas((prev) =>
      prev.map((a) => ({ ...a, strength: val })),
    );
  };

  const handleCensor = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }

    if (areas.length === 0) {
      setError(t("errors.noAreas"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await censorImage({
        file,
        areas,
        format: outputFormat,
        quality: 92,
      });

      setResult(res);
      const url = URL.createObjectURL(res.blob);
      setPreviewUrl(url);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    let ext = "png";
    if (outputFormat === "original") {
      const origExt = file.name.split(".").pop()?.toLowerCase();
      ext = origExt || "png";
    } else {
      ext = outputFormat;
    }

    const fileName = `${baseName}-censored.${ext}`;
    saveAs(result.blob, fileName);
  };

  const handleReset = () => {
    setFile(null);
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setOrigWidth(0);
    setOrigHeight(0);
    setAreas([]);
    setDrawingBox(null);
    setCleanPreview(false);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
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
              text: t("badges.modes"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <EyeOff className="w-3.5 h-3.5 text-secondary shrink-0" />,
            },
            {
              text: t("badges.local"),
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
          <div className="space-y-3 sm:space-y-5">
            {!result ? (
              <>
                <AppDropfile
                  id="image-censor-dropfile"
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

                {file && imageSrc && origWidth > 0 && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-4 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border text-xs">
                      <div className="flex items-center gap-2 uppercase font-bold text-foreground">
                        <EyeOff className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {areas.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setCleanPreview(!cleanPreview)}
                            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-[2px] border border-border bg-tertiary hover:bg-border/60 transition-colors text-foreground font-semibold cursor-pointer"
                            title={cleanPreview ? t("settings.showMarkers") : t("settings.previewClean")}
                          >
                            {cleanPreview ? (
                              <>
                                <Eye className="w-3 h-3 text-primary" />
                                <span>{t("settings.showMarkers")}</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-primary" />
                                <span>{t("settings.previewClean")}</span>
                              </>
                            )}
                          </button>
                        )}
                        <span className="text-xs text-primary font-bold bg-tertiary px-2 py-0.5 rounded-[2px] border border-border">
                          {origWidth} × {origHeight} px
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-label bg-tertiary p-2.5 border border-border rounded-[2px]">
                      {t("settings.instructions")}
                    </p>

                    {/* Área Interativa da Foto */}
                    <div className="relative w-full max-h-[500px] min-h-[220px] flex items-center justify-center bg-tertiary/40 border border-border rounded-[2px] overflow-hidden select-none touch-none p-2">
                      <div
                        className="relative inline-block cursor-crosshair"
                        onMouseDown={handlePointerDown}
                        onMouseMove={handlePointerMove}
                        onMouseUp={handlePointerUp}
                        onTouchStart={handlePointerDown}
                        onTouchMove={handlePointerMove}
                        onTouchEnd={handlePointerUp}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          ref={imageRef}
                          src={imageSrc}
                          alt="Preview"
                          className="max-h-[460px] max-w-full object-contain block pointer-events-none rounded-[2px]"
                          draggable={false}
                        />

                        {/* Caixas já desenhadas */}
                        {imageRef.current &&
                          origWidth > 0 &&
                          areas.map((area, idx) => {
                            const rect = imageRef.current!.getBoundingClientRect();
                            const scaleX = rect.width / origWidth;
                            const scaleY = rect.height / origHeight;

                            const boxLeft = area.x * scaleX;
                            const boxTop = area.y * scaleY;
                            const boxW = area.width * scaleX;
                            const boxH = area.height * scaleY;

                            const isBlur = area.type === "blur";
                            const isBlackout = area.type === "blackout";
                            const isPixelate = area.type === "pixelate";

                            return (
                              <div
                                key={area.id}
                                className={`absolute overflow-hidden flex items-start justify-between p-1 group pointer-events-auto transition-all ${
                                  cleanPreview
                                    ? "border border-transparent"
                                    : "border-2 border-primary/90 shadow-sm"
                                }`}
                                style={{
                                  left: `${boxLeft}px`,
                                  top: `${boxTop}px`,
                                  width: `${boxW}px`,
                                  height: `${boxH}px`,
                                  backdropFilter: isBlur
                                    ? `blur(${area.strength || strength}px)`
                                    : undefined,
                                  WebkitBackdropFilter: isBlur
                                    ? `blur(${area.strength || strength}px)`
                                    : undefined,
                                  backgroundColor: isBlackout
                                    ? "#000000"
                                    : isBlur
                                      ? cleanPreview
                                        ? "transparent"
                                        : "rgba(59, 130, 246, 0.12)"
                                      : cleanPreview
                                        ? "transparent"
                                        : "rgba(59, 130, 246, 0.15)",
                                }}
                              >
                                {isPixelate && (
                                  <PixelateOverlay
                                    imageElement={imageRef.current}
                                    area={area}
                                    scaleX={scaleX}
                                    scaleY={scaleY}
                                  />
                                )}

                                {!cleanPreview && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        cycleAreaType(area.id);
                                      }}
                                      className="relative z-10 text-[10px] font-mono font-bold uppercase bg-background text-primary px-1.5 py-0.5 rounded-[2px] border border-primary/30 shadow-sm leading-none hover:bg-primary hover:text-background transition-colors cursor-pointer select-none"
                                      title={t("settings.toggleAreaType")}
                                      aria-label={t("settings.toggleAreaType")}
                                    >
                                      #{idx + 1} {area.type}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeArea(area.id);
                                      }}
                                      className="relative z-10 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                                      title={t("settings.removeArea")}
                                      aria-label={t("settings.removeArea")}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                              </div>
                            );
                          })}

                        {/* Caixa sendo desenhada dinamicamente */}
                        {drawingBox && (
                          <div
                            className={`absolute pointer-events-none ${
                              censorMode === "blackout"
                                ? "bg-black border-2 border-primary"
                                : censorMode === "blur"
                                  ? "border-2 border-dashed border-primary bg-primary/10"
                                  : "border-2 border-dashed border-primary bg-primary/25"
                            }`}
                            style={{
                              left: `${Math.min(drawingBox.startX, drawingBox.currentX)}px`,
                              top: `${Math.min(drawingBox.startY, drawingBox.currentY)}px`,
                              width: `${Math.abs(drawingBox.currentX - drawingBox.startX)}px`,
                              height: `${Math.abs(drawingBox.currentY - drawingBox.startY)}px`,
                              backdropFilter:
                                censorMode === "blur" ? `blur(${strength}px)` : undefined,
                              WebkitBackdropFilter:
                                censorMode === "blur" ? `blur(${strength}px)` : undefined,
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Painel de Controles */}
                    <div className="p-4 bg-tertiary border border-border rounded-[2px] space-y-4 font-mono">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-primary" />
                        {t("settings.title")}
                      </h3>

                      {/* Modo de Censura */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t("settings.modeLabel")}
                        </label>
                        <AppTabsChips
                          items={[
                            { id: "pixelate", label: t("modes.pixelate") },
                            { id: "blur", label: t("modes.blur") },
                            { id: "blackout", label: t("modes.blackout") },
                          ]}
                          value={censorMode}
                          onChange={(id) => handleModeChange(id as CensorType)}
                        />
                      </div>

                      {/* Intensidade (Pixelar ou Desfocar) */}
                      {censorMode !== "blackout" && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs">
                            <label htmlFor="strength-slider" className="font-semibold text-foreground">
                              {t("settings.strengthLabel")}
                            </label>
                            <span className="text-primary font-bold">{strength} px</span>
                          </div>
                          <input
                            id="strength-slider"
                            type="range"
                            min={4}
                            max={40}
                            step={2}
                            value={strength}
                            onChange={(e) => handleStrengthChange(Number(e.target.value))}
                            aria-label={t("settings.strengthLabel")}
                            className="w-full accent-primary cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Lista e Contagem de Áreas */}
                      <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-label">
                          <span className="font-bold text-foreground">
                            {t("settings.areasTitle", { count: areas.length })}
                          </span>
                          {areas.length === 0 && (
                            <span className="block text-[11px] text-label mt-0.5">
                              {t("settings.noAreas")}
                            </span>
                          )}
                        </div>

                        {areas.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllAreas}
                            className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 font-semibold uppercase tracking-wider cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t("settings.clearAll")}
                          </button>
                        )}
                      </div>

                      {/* Formato de Exportação */}
                      <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <label htmlFor="output-format-select" className="font-semibold text-foreground">
                          {t("settings.outputFormat")}
                        </label>
                        <select
                          id="output-format-select"
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value as SupportedFormat | "original")}
                          className="bg-background border border-border rounded-[2px] px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono cursor-pointer"
                        >
                          <option value="original">{t("settings.formatOriginal")}</option>
                          <option value="png">PNG</option>
                          <option value="jpg">JPG</option>
                          <option value="webp">WebP</option>
                        </select>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                      <AppButton
                        onClick={handleCensor}
                        disabled={loading || areas.length === 0}
                        color="primary"
                        withArrow
                        className="w-full sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                            {t("button.censoring")}
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-2 shrink-0" />
                            {t("button.censor")}
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
              file && previewUrl && (
                <CensorImageResult
                  originalWidth={result.originalWidth}
                  originalHeight={result.originalHeight}
                  areasCount={result.areasCount}
                  originalSize={result.originalSize}
                  newSize={result.newSize}
                  fileName={file.name}
                  previewUrl={previewUrl}
                  onDownload={handleDownload}
                  onReset={handleReset}
                  resetLabel={resetLabel}
                  locale={locale}
                  t={t}
                />
              )
            )}
          </div>
        </AppCard>

        {/* Conteúdo Rico e SEO */}
        <CensorImageContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

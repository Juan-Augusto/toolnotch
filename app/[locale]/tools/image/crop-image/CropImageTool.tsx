"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import {
  ShieldCheck,
  Sparkles,
  Crop,
  Sliders,
  RotateCcw,
  RotateCw,
  Loader2,
  Maximize2,
} from "lucide-react";
import { AppCard, AppButton, AppDropfile, AppTabsChips } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import {
  cropImage,
  getImageDimensions,
  type CropResult,
} from "@/lib/imageManipulation";
import type { SupportedFormat } from "@/lib/imageTypes";
import ImageToolHeader from "../components/ImageToolHeader";
import CropImageResult from "./components/CropImageResult";
import CropImageContent, {
  type RichContent,
} from "./components/CropImageContent";

interface CropImageToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

type AspectRatioOption = "free" | "1:1" | "16:9" | "4:3" | "9:16" | "3:2";

type InteractionMode = "move" | "resize";
type ResizeHandle = "nw" | "ne" | "se" | "sw" | "n" | "s" | "e" | "w";

interface DragState {
  mode: InteractionMode;
  handle?: ResizeHandle;
  startPointerX: number;
  startPointerY: number;
  startBox: { x: number; y: number; width: number; height: number };
  scaleX: number;
  scaleY: number;
}

const getNumericRatio = (ratio: AspectRatioOption): number | null => {
  switch (ratio) {
    case "1:1":
      return 1;
    case "16:9":
      return 16 / 9;
    case "4:3":
      return 4 / 3;
    case "9:16":
      return 9 / 16;
    case "3:2":
      return 3 / 2;
    default:
      return null;
  }
};

export default function CropImageTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: CropImageToolProps) {
  const t = useTranslations("image.cropper");

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  // Proporção de aspecto
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>("free");

  // Coordenadas de corte (em pixels da imagem original)
  const [cropBox, setCropBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });

  // Formato e qualidade de saída
  const [outputFormat, setOutputFormat] = useState<SupportedFormat | "original">("original");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CropResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const resetLabel =
    locale === "pt"
      ? "Recortar outra imagem"
      : locale === "es"
        ? "Recortar otra imagen"
        : "Crop another image";

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [imageSrc, previewUrl]);

  // Aplica proporção na caixa de corte inicial
  const calculateInitialBox = useCallback(
    (w: number, h: number, ratio: AspectRatioOption) => {
      if (w <= 0 || h <= 0) return { x: 0, y: 0, width: 0, height: 0 };

      let boxW = Math.round(w * 0.8);
      let boxH = Math.round(h * 0.8);

      if (ratio === "1:1") {
        const side = Math.min(boxW, boxH);
        boxW = side;
        boxH = side;
      } else if (ratio === "16:9") {
        boxH = Math.round((boxW * 9) / 16);
        if (boxH > h) {
          boxH = Math.round(h * 0.8);
          boxW = Math.round((boxH * 16) / 9);
        }
      } else if (ratio === "4:3") {
        boxH = Math.round((boxW * 3) / 4);
        if (boxH > h) {
          boxH = Math.round(h * 0.8);
          boxW = Math.round((boxH * 4) / 3);
        }
      } else if (ratio === "9:16") {
        boxW = Math.round((boxH * 9) / 16);
        if (boxW > w) {
          boxW = Math.round(w * 0.8);
          boxH = Math.round((boxW * 16) / 9);
        }
      } else if (ratio === "3:2") {
        boxH = Math.round((boxW * 2) / 3);
        if (boxH > h) {
          boxH = Math.round(h * 0.8);
          boxW = Math.round((boxH * 3) / 2);
        }
      }

      const boxX = Math.round((w - boxW) / 2);
      const boxY = Math.round((h - boxH) / 2);

      return { x: boxX, y: boxY, width: boxW, height: boxH };
    },
    [],
  );

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
        const url = URL.createObjectURL(single);
        setFile(single);
        setImageSrc(url);
        setOrigWidth(w);
        setOrigHeight(h);
        setCropBox(calculateInitialBox(w, h, aspectRatio));
        setError(null);
        setResult(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      } catch {
        setError(t("errors.invalidType"));
        setFile(null);
      }
    },
    [aspectRatio, calculateInitialBox, previewUrl, t],
  );

  const handleRatioChange = (ratio: AspectRatioOption) => {
    setAspectRatio(ratio);
    if (origWidth > 0 && origHeight > 0) {
      setCropBox(calculateInitialBox(origWidth, origHeight, ratio));
    }
  };

  // Iniciar interação de mover ou redimensionar
  const startInteraction = (
    e: React.PointerEvent | React.MouseEvent,
    mode: InteractionMode,
    handle?: ResizeHandle,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (origWidth === 0 || origHeight === 0) return;

    const rect = imgRef.current ? imgRef.current.getBoundingClientRect() : null;
    const scaleX = rect && rect.width > 0 ? origWidth / rect.width : 1;
    const scaleY = rect && rect.height > 0 ? origHeight / rect.height : 1;

    dragStateRef.current = {
      mode,
      handle,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startBox: { ...cropBox },
      scaleX,
      scaleY,
    };
  };

  // Listener global de movimento e término do ponteiro
  useEffect(() => {
    const onMove = (e: MouseEvent | PointerEvent) => {
      if (!dragStateRef.current || origWidth === 0 || origHeight === 0) return;
      const {
        mode,
        handle,
        startPointerX,
        startPointerY,
        startBox,
        scaleX,
        scaleY,
      } = dragStateRef.current;

      const deltaX = (e.clientX - startPointerX) * scaleX;
      const deltaY = (e.clientY - startPointerY) * scaleY;
      const minSize = 20;

      if (mode === "move") {
        const newX = Math.max(
          0,
          Math.min(origWidth - startBox.width, Math.round(startBox.x + deltaX)),
        );
        const newY = Math.max(
          0,
          Math.min(origHeight - startBox.height, Math.round(startBox.y + deltaY)),
        );
        setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
        return;
      }

      // Modo Redimensionamento
      const ratio = getNumericRatio(aspectRatio);

      if (ratio) {
        // Redimensionamento com Proporção Travada
        if (handle === "se") {
          const targetW = startBox.width + deltaX;
          const maxW = Math.min(origWidth - startBox.x, (origHeight - startBox.y) * ratio);
          const minW = Math.max(minSize, minSize * ratio);
          const finalW = Math.max(minW, Math.min(maxW, targetW));
          const finalH = finalW / ratio;
          setCropBox({
            x: startBox.x,
            y: startBox.y,
            width: Math.round(finalW),
            height: Math.round(finalH),
          });
        } else if (handle === "sw") {
          const anchorX = startBox.x + startBox.width;
          const targetW = startBox.width - deltaX;
          const maxW = Math.min(anchorX, (origHeight - startBox.y) * ratio);
          const minW = Math.max(minSize, minSize * ratio);
          const finalW = Math.max(minW, Math.min(maxW, targetW));
          const finalH = finalW / ratio;
          setCropBox({
            x: Math.round(anchorX - finalW),
            y: startBox.y,
            width: Math.round(finalW),
            height: Math.round(finalH),
          });
        } else if (handle === "ne") {
          const anchorY = startBox.y + startBox.height;
          const targetW = startBox.width + deltaX;
          const maxW = Math.min(origWidth - startBox.x, anchorY * ratio);
          const minW = Math.max(minSize, minSize * ratio);
          const finalW = Math.max(minW, Math.min(maxW, targetW));
          const finalH = finalW / ratio;
          setCropBox({
            x: startBox.x,
            y: Math.round(anchorY - finalH),
            width: Math.round(finalW),
            height: Math.round(finalH),
          });
        } else if (handle === "nw") {
          const anchorX = startBox.x + startBox.width;
          const anchorY = startBox.y + startBox.height;
          const targetW = startBox.width - deltaX;
          const maxW = Math.min(anchorX, anchorY * ratio);
          const minW = Math.max(minSize, minSize * ratio);
          const finalW = Math.max(minW, Math.min(maxW, targetW));
          const finalH = finalW / ratio;
          setCropBox({
            x: Math.round(anchorX - finalW),
            y: Math.round(anchorY - finalH),
            width: Math.round(finalW),
            height: Math.round(finalH),
          });
        }
      } else {
        // Redimensionamento Livre
        let newX = startBox.x;
        let newY = startBox.y;
        let newW = startBox.width;
        let newH = startBox.height;

        if (handle === "se") {
          newW = Math.max(minSize, Math.min(origWidth - startBox.x, Math.round(startBox.width + deltaX)));
          newH = Math.max(minSize, Math.min(origHeight - startBox.y, Math.round(startBox.height + deltaY)));
        } else if (handle === "sw") {
          const clampedDeltaX = Math.max(-startBox.x, Math.min(startBox.width - minSize, Math.round(deltaX)));
          newX = startBox.x + clampedDeltaX;
          newW = startBox.width - clampedDeltaX;
          newH = Math.max(minSize, Math.min(origHeight - startBox.y, Math.round(startBox.height + deltaY)));
        } else if (handle === "ne") {
          newW = Math.max(minSize, Math.min(origWidth - startBox.x, Math.round(startBox.width + deltaX)));
          const clampedDeltaY = Math.max(-startBox.y, Math.min(startBox.height - minSize, Math.round(deltaY)));
          newY = startBox.y + clampedDeltaY;
          newH = startBox.height - clampedDeltaY;
        } else if (handle === "nw") {
          const clampedDeltaX = Math.max(-startBox.x, Math.min(startBox.width - minSize, Math.round(deltaX)));
          const clampedDeltaY = Math.max(-startBox.y, Math.min(startBox.height - minSize, Math.round(deltaY)));
          newX = startBox.x + clampedDeltaX;
          newW = startBox.width - clampedDeltaX;
          newY = startBox.y + clampedDeltaY;
          newH = startBox.height - clampedDeltaY;
        } else if (handle === "e") {
          newW = Math.max(minSize, Math.min(origWidth - startBox.x, Math.round(startBox.width + deltaX)));
        } else if (handle === "w") {
          const clampedDeltaX = Math.max(-startBox.x, Math.min(startBox.width - minSize, Math.round(deltaX)));
          newX = startBox.x + clampedDeltaX;
          newW = startBox.width - clampedDeltaX;
        } else if (handle === "s") {
          newH = Math.max(minSize, Math.min(origHeight - startBox.y, Math.round(startBox.height + deltaY)));
        } else if (handle === "n") {
          const clampedDeltaY = Math.max(-startBox.y, Math.min(startBox.height - minSize, Math.round(deltaY)));
          newY = startBox.y + clampedDeltaY;
          newH = startBox.height - clampedDeltaY;
        }

        setCropBox({
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        });
      }
    };

    const onUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [aspectRatio, origWidth, origHeight]);

  // Maximizar área de corte
  const handleMaximize = () => {
    if (origWidth <= 0 || origHeight <= 0) return;
    const ratio = getNumericRatio(aspectRatio);
    if (!ratio) {
      setCropBox({ x: 0, y: 0, width: origWidth, height: origHeight });
    } else {
      let w = origWidth;
      let h = Math.round(w / ratio);
      if (h > origHeight) {
        h = origHeight;
        w = Math.round(h * ratio);
      }
      const x = Math.round((origWidth - w) / 2);
      const y = Math.round((origHeight - h) / 2);
      setCropBox({ x, y, width: w, height: h });
    }
  };

  // Ajustes manuais de dimensão (px)
  const handleManualWidthChange = (val: number) => {
    if (isNaN(val) || val <= 0 || origWidth <= 0) return;
    const ratio = getNumericRatio(aspectRatio);
    const minSize = 20;
    let newW = Math.max(minSize, Math.min(origWidth, Math.round(val)));
    let newH = cropBox.height;

    if (ratio) {
      newH = Math.round(newW / ratio);
      if (newH > origHeight) {
        newH = origHeight;
        newW = Math.round(newH * ratio);
      }
    } else {
      newH = Math.min(origHeight, cropBox.height);
    }

    let newX = cropBox.x;
    let newY = cropBox.y;
    if (newX + newW > origWidth) {
      newX = Math.max(0, origWidth - newW);
    }
    if (newY + newH > origHeight) {
      newY = Math.max(0, origHeight - newH);
    }

    setCropBox({ x: newX, y: newY, width: newW, height: newH });
  };

  const handleManualHeightChange = (val: number) => {
    if (isNaN(val) || val <= 0 || origHeight <= 0) return;
    const ratio = getNumericRatio(aspectRatio);
    const minSize = 20;
    let newH = Math.max(minSize, Math.min(origHeight, Math.round(val)));
    let newW = cropBox.width;

    if (ratio) {
      newW = Math.round(newH * ratio);
      if (newW > origWidth) {
        newW = origWidth;
        newH = Math.round(newW / ratio);
      }
    } else {
      newW = Math.min(origWidth, cropBox.width);
    }

    let newX = cropBox.x;
    let newY = cropBox.y;
    if (newX + newW > origWidth) {
      newX = Math.max(0, origWidth - newW);
    }
    if (newY + newH > origHeight) {
      newY = Math.max(0, origHeight - newH);
    }

    setCropBox({ x: newX, y: newY, width: newW, height: newH });
  };

  const handleCrop = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await cropImage({
        file,
        cropX: cropBox.x,
        cropY: cropBox.y,
        cropWidth: cropBox.width,
        cropHeight: cropBox.height,
        format: outputFormat,
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
    let ext = ".png";
    if (outputFormat === "original") {
      const match = file.name.match(/\.[a-zA-Z0-9]+$/);
      ext = match ? match[0] : ".png";
    } else {
      ext = `.${outputFormat}`;
    }

    const baseName = file.name.replace(/\.[a-zA-Z0-9]+$/, "");
    saveAs(result.blob, `${baseName}-cropped${ext}`);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setResult(null);
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
              text: t("badges.aspect"),
              bg: "bg-tertiary",
              textColor: "text-foreground",
              icon: <Crop className="w-3.5 h-3.5 text-secondary shrink-0" />,
            },
            {
              text: t("badges.precision"),
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
                  id="image-cropper-dropfile"
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
                        <Crop className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{t("settings.title")}</span>
                      </div>
                      <span className="text-xs text-primary font-bold bg-tertiary px-2 py-0.5 rounded-[2px] border border-border self-start sm:self-auto">
                        {t("settings.cropDimensions", {
                          width: cropBox.width,
                          height: cropBox.height,
                        })}
                      </span>
                    </div>

                    {/* Seleção de Proporção */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-foreground block">
                        {t("settings.aspectLabel")}
                      </span>
                      <AppTabsChips
                        items={[
                          { id: "free", label: t("aspectRatios.free") },
                          { id: "square", label: t("aspectRatios.square") },
                          { id: "story", label: t("aspectRatios.story") },
                          { id: "widescreen", label: t("aspectRatios.widescreen") },
                          { id: "classic", label: t("aspectRatios.classic") },
                          { id: "photo", label: t("aspectRatios.photo") },
                        ]}
                        value={
                          aspectRatio === "free"
                            ? "free"
                            : aspectRatio === "1:1"
                              ? "square"
                              : aspectRatio === "9:16"
                                ? "story"
                                : aspectRatio === "16:9"
                                  ? "widescreen"
                                  : aspectRatio === "4:3"
                                    ? "classic"
                                    : "photo"
                        }
                        onChange={(id) => {
                          const map: Record<string, AspectRatioOption> = {
                            free: "free",
                            square: "1:1",
                            story: "9:16",
                            widescreen: "16:9",
                            classic: "4:3",
                            photo: "3:2",
                          };
                          handleRatioChange(map[id] || "free");
                        }}
                      />
                    </div>

                    {/* Ajuste Manual de Dimensões e Ações Rápidas */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-end pt-1">
                      <div className="space-y-1">
                        <label
                          htmlFor="crop-width-input"
                          className="text-[11px] font-bold text-foreground uppercase tracking-wider block cursor-pointer"
                        >
                          {t("settings.widthLabel")}
                        </label>
                        <input
                          id="crop-width-input"
                          type="number"
                          value={cropBox.width || ""}
                          onChange={(e) =>
                            handleManualWidthChange(parseInt(e.target.value, 10))
                          }
                          min={20}
                          max={origWidth}
                          aria-label={t("settings.widthLabel")}
                          className="w-full px-2.5 py-1.5 bg-tertiary border border-border rounded-[2px] text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="crop-height-input"
                          className="text-[11px] font-bold text-foreground uppercase tracking-wider block cursor-pointer"
                        >
                          {t("settings.heightLabel")}
                        </label>
                        <input
                          id="crop-height-input"
                          type="number"
                          value={cropBox.height || ""}
                          onChange={(e) =>
                            handleManualHeightChange(parseInt(e.target.value, 10))
                          }
                          min={20}
                          max={origHeight}
                          aria-label={t("settings.heightLabel")}
                          className="w-full px-2.5 py-1.5 bg-tertiary border border-border rounded-[2px] text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleMaximize}
                        className="px-3 py-1.5 bg-tertiary hover:bg-card border border-border hover:border-primary/50 text-xs font-mono text-foreground rounded-[2px] transition-colors flex items-center justify-center gap-1.5 h-[34px] cursor-pointer select-none"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{t("settings.maximizeCrop")}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCropBox(calculateInitialBox(origWidth, origHeight, aspectRatio))
                        }
                        className="px-3 py-1.5 bg-tertiary hover:bg-card border border-border hover:border-primary/50 text-xs font-mono text-label hover:text-foreground rounded-[2px] transition-colors flex items-center justify-center gap-1.5 h-[34px] cursor-pointer select-none"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span>{t("settings.resetCrop")}</span>
                      </button>
                    </div>

                    {/* Canvas / Visualizador de Recorte */}
                    <div
                      ref={containerRef}
                      className="relative w-full max-h-[480px] bg-tertiary/60 border border-border rounded-[2px] overflow-hidden flex items-center justify-center p-2 select-none"
                    >
                      <div className="relative inline-block max-w-full max-h-[440px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          ref={imgRef}
                          src={imageSrc}
                          alt="Preview"
                          className="max-h-[440px] max-w-full block object-contain pointer-events-none select-none"
                          draggable={false}
                        />

                        {/* Caixa de Recorte Interativa com Guia de Terços e Alças */}
                        {origWidth > 0 && (
                          <div
                            data-testid="crop-box"
                            onPointerDown={(e) => startInteraction(e, "move")}
                            onMouseDown={(e) => startInteraction(e, "move")}
                            style={{
                              position: "absolute",
                              left: `${(cropBox.x / origWidth) * 100}%`,
                              top: `${(cropBox.y / origHeight) * 100}%`,
                              width: `${(cropBox.width / origWidth) * 100}%`,
                              height: `${(cropBox.height / origHeight) * 100}%`,
                              touchAction: "none",
                            }}
                            className="border-2 border-primary cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] select-none group"
                          >
                            {/* Linhas da grade dos terços */}
                            <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                              <div className="border-r border-b border-white/30" />
                              <div className="border-r border-b border-white/30" />
                              <div className="border-b border-white/30" />
                              <div className="border-r border-b border-white/30" />
                              <div className="border-r border-b border-white/30" />
                              <div className="border-b border-white/30" />
                              <div className="border-r border-white/30" />
                              <div className="border-r border-white/30" />
                              <div />
                            </div>

                            {/* Marcador de dimensão */}
                            <div className="absolute -top-6 left-0 bg-primary text-background text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] pointer-events-none whitespace-nowrap shadow-xs">
                              {cropBox.width} × {cropBox.height} px
                            </div>

                            {/* Alças de Cantos (Resize Handles) */}
                            {/* Top-Left (NW) */}
                            <div
                              data-testid="handle-nw"
                              onPointerDown={(e) => startInteraction(e, "resize", "nw")}
                              onMouseDown={(e) => startInteraction(e, "resize", "nw")}
                              className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-primary border-2 border-background rounded-[1px] shadow-sm cursor-nwse-resize hover:scale-125 transition-transform z-10"
                            />
                            {/* Top-Right (NE) */}
                            <div
                              data-testid="handle-ne"
                              onPointerDown={(e) => startInteraction(e, "resize", "ne")}
                              onMouseDown={(e) => startInteraction(e, "resize", "ne")}
                              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-primary border-2 border-background rounded-[1px] shadow-sm cursor-nesw-resize hover:scale-125 transition-transform z-10"
                            />
                            {/* Bottom-Right (SE) */}
                            <div
                              data-testid="handle-se"
                              onPointerDown={(e) => startInteraction(e, "resize", "se")}
                              onMouseDown={(e) => startInteraction(e, "resize", "se")}
                              className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-primary border-2 border-background rounded-[1px] shadow-sm cursor-nwse-resize hover:scale-125 transition-transform z-10"
                            />
                            {/* Bottom-Left (SW) */}
                            <div
                              data-testid="handle-sw"
                              onPointerDown={(e) => startInteraction(e, "resize", "sw")}
                              onMouseDown={(e) => startInteraction(e, "resize", "sw")}
                              className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-primary border-2 border-background rounded-[1px] shadow-sm cursor-nesw-resize hover:scale-125 transition-transform z-10"
                            />

                            {/* Alças de Bordas (disponíveis no modo Livre) */}
                            {aspectRatio === "free" && (
                              <>
                                {/* Top Edge (N) */}
                                <div
                                  data-testid="handle-n"
                                  onPointerDown={(e) => startInteraction(e, "resize", "n")}
                                  onMouseDown={(e) => startInteraction(e, "resize", "n")}
                                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary border border-background rounded-[1px] shadow-sm cursor-ns-resize hover:scale-110 transition-transform z-10"
                                />
                                {/* Bottom Edge (S) */}
                                <div
                                  data-testid="handle-s"
                                  onPointerDown={(e) => startInteraction(e, "resize", "s")}
                                  onMouseDown={(e) => startInteraction(e, "resize", "s")}
                                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary border border-background rounded-[1px] shadow-sm cursor-ns-resize hover:scale-110 transition-transform z-10"
                                />
                                {/* Left Edge (W) */}
                                <div
                                  data-testid="handle-w"
                                  onPointerDown={(e) => startInteraction(e, "resize", "w")}
                                  onMouseDown={(e) => startInteraction(e, "resize", "w")}
                                  className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-6 bg-primary border border-background rounded-[1px] shadow-sm cursor-ew-resize hover:scale-110 transition-transform z-10"
                                />
                                {/* Right Edge (E) */}
                                <div
                                  data-testid="handle-e"
                                  onPointerDown={(e) => startInteraction(e, "resize", "e")}
                                  onMouseDown={(e) => startInteraction(e, "resize", "e")}
                                  className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-6 bg-primary border border-background rounded-[1px] shadow-sm cursor-ew-resize hover:scale-110 transition-transform z-10"
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Formato de Saída */}
                    <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <label className="font-semibold text-foreground">
                          {t("settings.outputFormat")}:
                        </label>
                        <select
                          value={outputFormat}
                          onChange={(e) =>
                            setOutputFormat(e.target.value as SupportedFormat | "original")
                          }
                          disabled={loading}
                          className="p-1.5 bg-tertiary border border-border rounded-[2px] text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="original">{t("settings.formatOriginal")}</option>
                          <option value="png">PNG</option>
                          <option value="webp">WebP</option>
                          <option value="jpg">JPG</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCropBox(calculateInitialBox(origWidth, origHeight, aspectRatio))
                        }
                        className="text-xs text-label hover:text-foreground underline underline-offset-4 cursor-pointer"
                      >
                        {t("settings.resetCrop")}
                      </button>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3 font-mono">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 font-semibold text-foreground min-w-0">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                        <span className="truncate">{t("button.cropping")}</span>
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
                    onClick={handleCrop}
                    disabled={loading || !file}
                    color="primary"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {loading ? t("button.cropping") : t("button.crop")}
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
              <CropImageResult
                cropWidth={result.cropWidth}
                cropHeight={result.cropHeight}
                originalWidth={result.originalWidth}
                originalHeight={result.originalHeight}
                originalSize={result.originalSize}
                newSize={result.newSize}
                fileName={file ? file.name : "imagem-recortada.png"}
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

        <CropImageContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

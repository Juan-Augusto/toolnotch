"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Download, Image as ImageIcon, Columns, ArrowLeftRight, AlertTriangle, Info } from "lucide-react";
import { AppButton } from "@/components/ui";
import type { SupportedFormat } from "@/lib/imageTypes";

interface ImageCompressorResultProps {
  originalFile: File;
  resultBlob: Blob;
  originalSize: number;
  compressedSize: number;
  savings: number;
  format: SupportedFormat;
  width?: number;
  height?: number;
  adaptedQuality?: number;
  requestedQuality?: number;
  onDownload: () => void;
  onReset: () => void;
  locale: string;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressorResult({
  originalFile,
  resultBlob,
  originalSize,
  compressedSize,
  savings,
  format,
  width,
  height,
  adaptedQuality,
  requestedQuality,
  onDownload,
  onReset,
  locale,
}: ImageCompressorResultProps) {
  const isPt = locale === "pt";
  const isEs = locale === "es";

  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [sliderPct, setSliderPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide">("slider");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const origUrl = URL.createObjectURL(originalFile);
    const compUrl = URL.createObjectURL(resultBlob);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOriginalUrl(origUrl);
    setCompressedUrl(compUrl);

    return () => {
      URL.revokeObjectURL(origUrl);
      URL.revokeObjectURL(compUrl);
    };
  }, [originalFile, resultBlob]);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPct(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateSlider(e.clientX);
  };

  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setSliderPct((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setSliderPct((p) => Math.min(100, p + 5));
  };

  const isIncreased = compressedSize > originalSize;
  const isUnchanged = compressedSize === originalSize;
  const isCompressed = compressedSize < originalSize;
  const sizeDiff = Math.abs(compressedSize - originalSize);
  const percentDiff = Math.abs(savings);

  const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
  const outFileName = `${baseName}.${format}`;

  let titleText = "";
  let subText = "";

  if (isIncreased) {
    titleText = isEs
      ? "Aviso: El archivo aumentó de tamaño"
      : isPt
        ? "Aviso: O arquivo aumentou de tamanho"
        : "Notice: File size increased";
    subText = isEs
      ? `La imagen original ya estaba muy optimizada. Al recodificar en ${format.toUpperCase()} con esta calidad, el archivo resultante creció.`
      : isPt
        ? `A imagem original já estava muito otimizada. Ao recodificar em ${format.toUpperCase()} com esta qualidade, o arquivo resultante ficou maior.`
        : `The original image was already heavily optimized. Re-encoding in ${format.toUpperCase()} at this quality resulted in a larger file.`;
  } else if (isUnchanged) {
    titleText = isEs
      ? "Archivo ya optimizado"
      : isPt
        ? "Arquivo já otimizado"
        : "File already optimized";
    subText = isEs
      ? "El archivo original ya cuenta con la máxima compresión posible. Se conservó el archivo intacto."
      : isPt
        ? "O arquivo original já possui a máxima compressão possível. O original foi preservado intacto."
        : "The original file already has optimal compression. The original was preserved intact.";
  } else {
    titleText = isEs
      ? "¡Imagen comprimida con éxito!"
      : isPt
        ? "Imagem comprimida com sucesso!"
        : "Image successfully compressed!";
    subText =
      adaptedQuality && requestedQuality && adaptedQuality !== requestedQuality
        ? isEs
          ? `Tu archivo es un ${savings}% más ligero. Calidad ajustada automáticamente al ${adaptedQuality}% para garantizar ahorro.`
          : isPt
            ? `Seu arquivo ficou ${savings}% menor. Qualidade ajustada automaticamente para ${adaptedQuality}% para garantir economia.`
            : `Your file is ${savings}% smaller. Quality automatically tuned to ${adaptedQuality}% to guarantee savings.`
        : isEs
          ? `Tu archivo es un ${savings}% más ligero conservando excelente nitidez.`
          : isPt
            ? `Seu arquivo ficou ${savings}% menor preservando excelente nitidez.`
            : `Your file is ${savings}% smaller while preserving crisp visual quality.`;
  }

  const resetLabel = isEs
    ? "Comprimir otra imagen"
    : isPt
      ? "Comprimir outra imagem"
      : "Compress another image";

  return (
    <div className="space-y-6 animate-fade-in font-mono" aria-live="polite">
      {/* 1. Banner de Status */}
      <div
        className={`p-4 sm:p-5 bg-background border rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isIncreased
            ? "border-amber-500/40"
            : "border-border"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${
              isIncreased
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/40"
                : isUnchanged
                  ? "bg-tertiary text-label border border-border"
                  : "bg-primary text-background"
            }`}
          >
            {isIncreased ? (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            ) : isUnchanged ? (
              <Info className="w-5 h-5 text-label" />
            ) : (
              "✓"
            )}
          </div>
          <div>
            <p
              className={`text-base sm:text-lg font-bold uppercase ${
                isIncreased ? "text-amber-500" : "text-foreground"
              }`}
            >
              {titleText}
            </p>
            <p className="text-sm text-label mt-1 font-sans">
              {subText}
            </p>
          </div>
        </div>

        <span
          className={`self-start sm:self-center font-bold px-3.5 py-1.5 rounded-[2px] text-sm uppercase tracking-wider shrink-0 ${
            isIncreased
              ? "bg-amber-500/20 text-amber-500 border border-amber-500/40"
              : isCompressed
                ? "bg-primary text-background"
                : "bg-card text-label border border-border"
          }`}
        >
          {isIncreased
            ? `+${percentDiff}% ${isEs ? "Aumento" : isPt ? "Aumento" : "Increase"}`
            : isCompressed
              ? isEs
                ? `-${savings}% Reducción`
                : isPt
                  ? `-${savings}% Redução`
                  : `-${savings}% Reduced`
              : isEs
                ? "0% Variación"
                : isPt
                  ? "0% Variação"
                  : "0% Change"}
        </span>
      </div>

      {/* Alerta explicativo se o tamanho aumentou */}
      {isIncreased && (
        <div className="p-4 sm:p-5 bg-tertiary border border-amber-500/30 rounded-[2px] space-y-2.5">
          <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-wider text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {isEs
                ? "¿Por qué aumentó el tamaño?"
                : isPt
                  ? "Por que o tamanho aumentou?"
                  : "Why did file size increase?"}
            </span>
          </div>
          <p className="text-sm text-label font-sans leading-relaxed">
            {isEs
              ? "Las imágenes se descomprimen en mapas de píxeles puros en la memoria del navegador. Si tu archivo original ya estaba muy optimizado (por ejemplo con calidad menor o herramientas especializadas como MozJPEG), recodificarlo en este nivel de calidad genera artefactos que aumentan el peso final."
              : isPt
                ? "As imagens são descompactadas em mapas de pixels brutos na memória do navegador. Se o seu arquivo original já estava altamente otimizado (por exemplo, com qualidade menor ou ferramentas como MozJPEG), recodificá-lo neste nível de qualidade cria ruídos que aumentam o peso final."
                : "Images are decoded into raw pixel bitmaps in browser memory. If your original file was already heavily optimized (for instance, with a lower quality or tools like MozJPEG), re-encoding it at this quality level creates noise that inflates the final file size."}
          </p>
          <div className="pt-1 text-sm font-semibold text-foreground font-sans flex items-start gap-2">
            <span className="shrink-0">💡</span>
            <span>
              {isEs
                ? "Sugerencia: Para lograr reducción, baja el control de calidad a 60%–70% o convierte la imagen al formato WebP o AVIF (mucho más eficientes que JPG)."
                : isPt
                  ? "Sugestão: Para obter redução, diminua o controle de qualidade para 60%–70% ou alterne para WebP ou AVIF (muito mais eficientes que JPG)."
                  : "Suggestion: To achieve reduction, lower the quality control to 60%–70% or switch to WebP or AVIF (much more efficient than JPG)."}
            </span>
          </div>
        </div>
      )}

      {/* 2. Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-sm text-label uppercase tracking-wider font-semibold">
            {isEs ? "Tamaño Original" : isPt ? "Tamanho Original" : "Original Size"}
          </span>
          <div className="my-2.5">
            <span className="text-2xl font-bold text-foreground">
              {formatBytes(originalSize)}
            </span>
          </div>
          <span className="text-sm text-label truncate font-sans">
            {originalFile.name}
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-sm text-label uppercase tracking-wider font-semibold">
            {isIncreased
              ? isEs
                ? "Variación"
                : isPt
                  ? "Variação"
                  : "Variation"
              : isEs
                ? "Economía"
                : isPt
                  ? "Economia"
                  : "Savings"}
          </span>
          <div className="my-2.5">
            {isIncreased ? (
              <span className="text-2xl font-bold text-amber-500">
                +{percentDiff}%
              </span>
            ) : isCompressed ? (
              <span className="text-2xl font-bold text-secondary">
                -{savings}%
              </span>
            ) : (
              <span className="text-2xl font-bold text-label">
                0%
              </span>
            )}
          </div>
          <span className="text-sm text-label font-sans">
            {isIncreased
              ? isEs
                ? `+${formatBytes(sizeDiff)} más que el original`
                : isPt
                  ? `+${formatBytes(sizeDiff)} a mais que o original`
                  : `+${formatBytes(sizeDiff)} larger than original`
              : isCompressed
                ? isEs
                  ? `${formatBytes(sizeDiff)} ahorrados`
                  : isPt
                    ? `${formatBytes(sizeDiff)} economizados`
                    : `${formatBytes(sizeDiff)} saved`
                : isEs
                  ? "Tamaño conservado"
                  : isPt
                    ? "Tamanho mantido"
                    : "Size preserved"}
          </span>
        </div>

        <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] flex flex-col justify-between">
          <span className="text-sm text-label uppercase tracking-wider font-semibold">
            {isIncreased
              ? isEs
                ? "Tamaño Final"
                : isPt
                  ? "Tamanho Final"
                  : "Final Size"
              : isEs
                ? "Tamaño Comprimido"
                : isPt
                  ? "Tamanho Comprimido"
                  : "Compressed Size"}
          </span>
          <div className="my-2.5">
            <span
              className={`text-2xl font-bold ${
                isIncreased ? "text-amber-500" : "text-primary"
              }`}
            >
              {formatBytes(compressedSize)}
            </span>
          </div>
          <span className="text-sm text-label uppercase font-sans">
            {format.toUpperCase()} ·{" "}
            {isIncreased
              ? isEs
                ? "Aumentado"
                : isPt
                  ? "Aumentado"
                  : "Increased"
              : isCompressed
                ? isEs
                  ? "Optimizado"
                  : isPt
                    ? "Otimizado"
                    : "Optimized"
                : isEs
                  ? "Conservado"
                  : isPt
                    ? "Preservado"
                    : "Preserved"}
          </span>
        </div>
      </div>

      {/* 3. Área de Pré-visualização com Alternador de Modos */}
      <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-sm text-label">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs text-sm sm:text-base">
              {outFileName}
            </span>
            {width && height && (
              <span className="text-sm bg-tertiary px-2.5 py-0.5 rounded-[2px] border border-border hidden sm:inline-block font-mono">
                {width} × {height} px
              </span>
            )}
          </div>

          {/* Toggle de Visualização: Slider vs Lado a Lado */}
          <div className="flex items-center gap-1.5 bg-tertiary p-1 rounded-[2px] border border-border">
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              className={`px-3 py-1.5 rounded-[2px] text-sm font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === "slider"
                  ? "bg-primary text-background font-bold shadow-sm"
                  : "text-label hover:text-foreground"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isEs ? "Slider" : isPt ? "Slider" : "Slider"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("sideBySide")}
              className={`px-3 py-1.5 rounded-[2px] text-sm font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === "sideBySide"
                  ? "bg-primary text-background font-bold shadow-sm"
                  : "text-label hover:text-foreground"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{isEs ? "Lado a lado" : isPt ? "Lado a lado" : "Side by side"}</span>
            </button>
          </div>
        </div>

        {/* Visualização: Modo Slider */}
        {viewMode === "slider" && originalUrl && compressedUrl && (
          <div className="space-y-2">
            <div
              ref={containerRef}
              className="relative w-full max-h-80 sm:max-h-96 min-h-[220px] rounded-[2px] overflow-hidden select-none cursor-col-resize bg-tertiary/60 border border-border/80 flex items-center justify-center p-2"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* Imagem Comprimida (camada inferior) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={compressedUrl}
                alt={isEs ? "Comprimida" : isPt ? "Comprimida" : "Compressed"}
                className="max-h-72 sm:max-h-88 max-w-full object-contain block select-none pointer-events-none rounded-[2px]"
                draggable={false}
              />

              {/* Imagem Original (camada superior recortada) */}
              <div
                className="absolute inset-0 flex items-center justify-center p-2 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt={isEs ? "Original" : isPt ? "Original" : "Original"}
                  className="max-h-72 sm:max-h-88 max-w-full object-contain block select-none pointer-events-none rounded-[2px]"
                  draggable={false}
                />
              </div>

              {/* Linha Divisória */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none shadow-sm"
                style={{ left: `${sliderPct}%` }}
              />

              {/* Handle do Slider */}
              <div
                role="slider"
                aria-valuenow={Math.round(sliderPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={isEs ? "Comparar imágenes" : isPt ? "Comparar imagens" : "Compare images"}
                tabIndex={0}
                onKeyDown={onKeyDown}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-tertiary rounded-[2px] border-2 border-primary text-foreground flex items-center justify-center cursor-col-resize shadow-md focus:outline-none focus:ring-2 focus:ring-primary z-20"
                style={{ left: `${sliderPct}%` }}
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
              </div>

              {/* Badges Antes / Depois */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-background/95 border border-border text-foreground text-sm font-mono font-bold rounded-[2px] pointer-events-none z-10 shadow-sm">
                {isEs ? "Antes (Original)" : isPt ? "Antes (Original)" : "Before (Original)"}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/95 border border-border text-primary text-sm font-mono font-bold rounded-[2px] pointer-events-none z-10 shadow-sm">
                {isIncreased
                  ? isEs
                    ? "Después (Recodificado)"
                    : isPt
                      ? "Depois (Recodificado)"
                      : "After (Re-encoded)"
                  : isEs
                    ? "Después (Comprimido)"
                    : isPt
                      ? "Depois (Comprimido)"
                      : "After (Compressed)"}
              </div>
            </div>

            <p className="text-sm text-label text-center pt-2 font-sans">
              {isEs
                ? "Arrastra el control para comparar la calidad visual entre el original y el comprimido."
                : isPt
                  ? "Arraste o controle para comparar a qualidade visual entre o original e o comprimido."
                  : "Drag the slider to compare visual quality between original and compressed."}
            </p>
          </div>
        )}

        {/* Visualização: Modo Lado a Lado */}
        {viewMode === "sideBySide" && originalUrl && compressedUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-3.5 bg-tertiary/40 border border-border rounded-[2px] space-y-2.5">
              <div className="flex items-center justify-between text-sm text-label">
                <span className="font-bold text-foreground">
                  {isEs ? "Original" : isPt ? "Original" : "Original"}
                </span>
                <span className="font-mono">{formatBytes(originalSize)}</span>
              </div>
              <div className="w-full max-h-64 min-h-[160px] flex items-center justify-center overflow-hidden rounded-[2px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-60 max-w-full object-contain rounded-[2px]"
                />
              </div>
            </div>

            <div className="p-3.5 bg-tertiary/40 border border-primary/40 rounded-[2px] space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-bold ${isIncreased ? "text-amber-500" : "text-primary"}`}>
                  {isIncreased
                    ? isEs
                      ? "Recodificado"
                      : isPt
                        ? "Recodificado"
                        : "Re-encoded"
                    : isEs
                      ? "Comprimido"
                      : isPt
                        ? "Comprimido"
                        : "Compressed"}
                </span>
                <span className={`font-bold font-mono ${isIncreased ? "text-amber-500" : "text-primary"}`}>{formatBytes(compressedSize)}</span>
              </div>
              <div className="w-full max-h-64 min-h-[160px] flex items-center justify-center overflow-hidden rounded-[2px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={compressedUrl}
                  alt="Compressed"
                  className="max-h-60 max-w-full object-contain rounded-[2px]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Ações de Download e Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
        <AppButton
          onClick={onDownload}
          color="primary"
          withArrow
          className="w-full sm:w-auto font-mono text-base font-bold uppercase py-3.5 px-6"
        >
          <Download className="w-4 h-4 mr-2 shrink-0" />
          {isEs ? "Descargar Imagen" : isPt ? "Baixar Imagem" : "Download Image"} ({outFileName})
        </AppButton>

        <button
          type="button"
          onClick={onReset}
          className="text-sm text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0 font-mono"
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}

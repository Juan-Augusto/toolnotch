"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { saveAs } from "file-saver";
import {
  Loader2,
} from "lucide-react";
import {
  AppCard,
  AppButton,
  AppDropfile,
  AppInput,
} from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import { compressImage } from "@/lib/imageConversion";
import type { SupportedFormat, ConversionResult } from "@/lib/imageTypes";
import ImageToolHeader from "../components/ImageToolHeader";
import ImageCompressorResult from "./components/ImageCompressorResult";
import ImageCompressorContent, {
  type RichContent,
} from "./components/ImageCompressorContent";

interface ImageCompressorClientProps {
  defaultFormat?: SupportedFormat;
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function ImageCompressorClient({
  defaultFormat = "jpg",
  title,
  description,
  faqs,
  richContent,
  locale: propLocale,
}: ImageCompressorClientProps) {
  const t = useTranslations("image.compressor");
  const tShared = useTranslations("image.shared");
  const currentLocale = useLocale();
  const locale = propLocale || currentLocale || "pt";

  const isPt = locale === "pt";
  const isEs = locale === "es";

  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<SupportedFormat>(defaultFormat);
  const [quality, setQuality] = useState<number>(85);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Sincroniza formato inicial caso mude via prop
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormat(defaultFormat);
  }, [defaultFormat]);

  const handleFileChange = useCallback(
    (selected: File[] | File | null) => {
      const single = Array.isArray(selected) ? selected[0] : selected;
      if (single) {
        if (!single.type.startsWith("image/") && !/\.(jpe?g|png|webp|avif|gif|bmp|heic)$/i.test(single.name)) {
          setError(
            isEs
              ? "Por favor, selecciona un archivo de imagen válido."
              : isPt
                ? "Por favor, selecione um arquivo de imagem válido."
                : "Please select a valid image file."
          );
          setFile(null);
          return;
        }
      }

      setFile(single || null);
      setError(null);
      setResult(null);
      setDimensions(null);
    },
    [isEs, isPt]
  );

  const handleCompress = async () => {
    if (!file) {
      setError(
        isEs
          ? "Selecciona una imagen para comprimir."
          : isPt
            ? "Selecione uma imagem para comprimir."
            : "Select an image to compress."
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await compressImage({
        file,
        format,
        quality: format === "png" ? 100 : quality,
        maxWidth: maxWidth && maxWidth > 0 ? maxWidth : undefined,
      });

      // Calcula dimensões reais da imagem resultante
      let w = 0;
      let h = 0;
      try {
        const tempUrl = URL.createObjectURL(res.blob);
        const img = new Image();
        img.src = tempUrl;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
        w = img.naturalWidth || img.width || 0;
        h = img.naturalHeight || img.height || 0;
        URL.revokeObjectURL(tempUrl);
      } catch {
        // Fallback silencioso para dimensões
      }

      setDimensions(w > 0 && h > 0 ? { width: w, height: h } : null);
      setResult(res);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : isEs
            ? "Error al comprimir la imagen. Intenta con otro archivo."
            : isPt
              ? "Falha ao comprimir a imagem. Tente com outro arquivo."
              : "Compression failed. Please try another image."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}.${format}`;
    saveAs(result.blob, fileName);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setDimensions(null);
    setError(null);
  };

  const formatOptions: { value: SupportedFormat; label: string; badge?: string }[] = [
    { value: "webp", label: "WebP", badge: isEs ? "Recomendado" : isPt ? "Recomendado" : "Recommended" },
    { value: "jpg", label: "JPG / JPEG" },
    { value: "png", label: "PNG" },
    { value: "avif", label: "AVIF" },
  ];

  const qualityPresets = [
    { label: "60%", value: 60, desc: isEs ? "Máxima reducción" : isPt ? "Máxima redução" : "Max saving" },
    { label: "75%", value: 75, desc: isEs ? "Equilibrado" : isPt ? "Equilibrado" : "Balanced" },
    { label: "85%", value: 85, desc: isEs ? "Alta calidad" : isPt ? "Alta qualidade" : "High quality" },
    { label: "95%", value: 95, desc: isEs ? "Casi original" : isPt ? "Quase original" : "Near original" },
  ];

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <div className="w-full">
        {/* Header Padronizado */}
        <ImageToolHeader
          title={title}
          description={description}
          locale={locale}
        />

        {/* Card Principal Brutalista */}
        <AppCard
          border
          cornerAccents={true}
          className="p-3 sm:p-5 md:p-6 lg:p-8 bg-tertiary mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto"
        >
          <div className="space-y-5 sm:space-y-6">
            {!result ? (
              <>
                {/* Zona de Drop/Upload */}
                <AppDropfile
                  id="image-compressor-dropfile"
                  accept=".png,.jpg,.jpeg,.webp,.avif,.gif,.bmp,image/*"
                  multiple={false}
                  title={
                    <span className="text-sm sm:text-base font-bold uppercase font-mono">
                      {tShared("dropZone.label")}
                    </span>
                  }
                  description={
                    <span className="text-sm text-label font-mono">
                      {tShared("dropZone.hint")}
                    </span>
                  }
                  value={file ? [file] : []}
                  onFilesChange={handleFileChange}
                  showSelectedFiles={true}
                  disabled={isProcessing}
                  error={error || undefined}
                />

                {/* Painel de Controles */}
                {file && (
                  <div className="space-y-4 pt-1 animate-fade-in font-mono">
                    <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] space-y-5">
                      {/* Formato de Saída */}
                      <div className="space-y-2.5">
                        <label className="text-sm font-bold uppercase text-foreground flex flex-wrap items-center justify-between gap-1">
                          <span>{tShared("format.label")}</span>
                          <span className="text-sm text-label font-sans font-normal">
                            {format === "webp"
                              ? isEs
                                ? "Excelente balance de peso y calidad"
                                : isPt
                                  ? "Excelente equilíbrio de peso e nitidez"
                                  : "Best balance of size and quality"
                              : format === "png"
                                ? isEs
                                  ? "Sin pérdida (preserva transparencia)"
                                  : isPt
                                    ? "Sem perdas (preserva transparência)"
                                    : "Lossless (preserves alpha)"
                                : format === "avif"
                                  ? isEs
                                    ? "Compresión de última generación"
                                    : isPt
                                      ? "Compressão de última geração"
                                      : "Next-gen high compression"
                                  : isEs
                                    ? "Máxima compatibilidad universal"
                                    : isPt
                                      ? "Máxima compatibilidade universal"
                                      : "Universal compatibility"}
                          </span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {formatOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormat(opt.value)}
                              className={`p-3 rounded-[2px] border text-sm font-mono font-bold transition-colors flex flex-col items-center justify-center gap-1.5 ${
                                format === opt.value
                                  ? "bg-primary text-background border-primary shadow-sm"
                                  : "bg-tertiary border-border text-foreground hover:border-primary/60"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {opt.badge && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-[2px] uppercase font-bold tracking-wider ${
                                    format === opt.value
                                      ? "bg-background text-primary"
                                      : "bg-primary/20 text-primary"
                                  }`}
                                >
                                  {opt.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Controle de Qualidade (somente se não for PNG) */}
                      {format !== "png" ? (
                        <div className="space-y-3 pt-3 border-t border-border">
                          <div className="flex flex-wrap items-center justify-between gap-1 text-sm">
                            <span className="font-bold uppercase text-foreground">
                              {tShared("quality.label")}: <span className="text-primary font-mono text-base">{quality}%</span>
                            </span>
                            <span className="text-label text-sm font-sans">
                              {quality < 70
                                ? tShared("quality.smaller")
                                : quality > 85
                                  ? tShared("quality.better")
                                  : isEs
                                    ? "Equilibrado recomendado"
                                    : isPt
                                      ? "Equilibrado recomendado"
                                      : "Recommended balance"}
                            </span>
                          </div>

                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="1"
                            value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full accent-primary cursor-pointer h-2.5 bg-tertiary rounded-[2px]"
                          />

                          {/* Presets Rápidos */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                            {qualityPresets.map((preset) => (
                              <button
                                key={preset.value}
                                type="button"
                                onClick={() => setQuality(preset.value)}
                                className={`px-3 py-2 rounded-[2px] border text-sm font-mono transition-colors text-left ${
                                  quality === preset.value
                                    ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                                    : "border-border bg-tertiary/60 text-foreground hover:text-primary hover:border-primary/50"
                                }`}
                              >
                                <span className="block font-bold text-sm">{preset.label}</span>
                                <span className="text-xs text-muted-foreground block truncate font-sans mt-0.5">
                                  {preset.desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-tertiary/50 border border-border rounded-[2px] text-sm text-foreground/90 font-sans leading-relaxed">
                          ℹ️ {isEs
                            ? "El formato PNG utiliza compresión sin pérdidas. El nivel de calidad no aplica; se conservará el 100% de los píxeles originales."
                            : isPt
                              ? "O formato PNG utiliza compressão sem perdas (lossless). O controle de qualidade não se aplica; 100% dos pixels serão preservados."
                              : "PNG format uses lossless compression. Quality control is bypassed; 100% of pixel fidelity is preserved."}
                        </div>
                      )}

                      {/* Redimensionamento Opcional (Largura Máxima) */}
                      <div className="space-y-2 pt-3 border-t border-border">
                        <label
                          htmlFor="max-width-input"
                          className="text-sm font-bold uppercase text-foreground flex flex-wrap items-center justify-between gap-1"
                        >
                          <span>{tShared("maxWidth.label")}</span>
                          <span className="text-sm text-label font-sans font-normal">
                            {isEs
                              ? "Opcional: reduce resolución proporcionalmente"
                              : isPt
                                ? "Opcional: reduz a resolução proporcionalmente"
                                : "Optional: scale down resolution proportionally"}
                          </span>
                        </label>
                        <AppInput
                          id="max-width-input"
                          type="number"
                          min={50}
                          max={10000}
                          placeholder={tShared("maxWidth.placeholder")}
                          value={maxWidth || ""}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setMaxWidth(isNaN(val) || val <= 0 ? undefined : val);
                          }}
                        />
                      </div>
                    </div>

                    {/* Botão de Disparo */}
                    <AppButton
                      onClick={handleCompress}
                      color="primary-2"
                      withArrow
                      disabled={isProcessing}
                      className="w-full font-mono text-base font-bold uppercase py-3.5"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                          {t("button.compressing")}
                        </>
                      ) : (
                        t("button.compress")
                      )}
                    </AppButton>
                  </div>
                )}
              </>
            ) : (
              /* Resultado Padronizado */
              file && (
                <ImageCompressorResult
                  originalFile={file}
                  resultBlob={result.blob}
                  originalSize={result.originalSize}
                  compressedSize={result.compressedSize}
                  savings={result.savings}
                  format={format}
                  width={dimensions?.width}
                  height={dimensions?.height}
                  adaptedQuality={result.adaptedQuality}
                  requestedQuality={quality}
                  onDownload={handleDownload}
                  onReset={handleReset}
                  locale={locale}
                />
              )
            )}
          </div>
        </AppCard>

        {/* Conteúdo Rico, Dica, FAQs e Ferramentas Relacionadas */}
        <ImageCompressorContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

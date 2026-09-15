"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import {
  ShieldCheck,
  Scissors,
  Sparkles,
  Info,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  AppCard,
  AppButton,
  AppInput,
  AppDropfile,
} from "@/components/ui";
import { splitPDF, validateAndParsePageRanges } from "@/lib/pdfSplit";
import type { PageRange } from "@/lib/pdfTypes";
import type { FaqItem } from "@/components/AppFaqSection";
import PdfToolHeader from "../components/PdfToolHeader";
import SplitResult, { type SplitResultItem } from "./components/SplitResult";
import SplitContent, { type RichContent } from "./components/SplitContent";

function formatExtractionSummary(ranges: PageRange[], locale: string): string {
  if (!ranges || ranges.length === 0) return "";

  const items = ranges.map((r) => {
    if (r.start === r.end) {
      if (locale === "pt") return `a página ${r.start}`;
      if (locale === "es") return `la página ${r.start}`;
      return `page ${r.start}`;
    }
    if (locale === "pt") return `o intervalo ${r.start} a ${r.end}`;
    if (locale === "es") return `el intervalo ${r.start} a ${r.end}`;
    return `the range ${r.start} to ${r.end}`;
  });

  let joined = "";
  const conj = locale === "es" ? " y " : locale === "pt" ? " e " : " and ";

  if (items.length === 1) {
    joined = items[0];
  } else if (items.length === 2) {
    joined = `${items[0]}${conj}${items[1]}`;
  } else {
    joined = `${items.slice(0, -1).join(", ")}${conj}${items[items.length - 1]}`;
  }

  if (locale === "pt") return `Você vai extrair ${joined}.`;
  if (locale === "es") return `Vas a extraer ${joined}.`;
  return `You will extract ${joined}.`;
}

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

interface SplitOutput {
  resultsCount: number;
  isZip: boolean;
  blob: Blob;
  fileName: string;
  items: SplitResultItem[];
}

export default function SplitTool({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("pdf.split");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [splitOutput, setSplitOutput] = useState<SplitOutput | null>(null);

  const resetLabel = t("button.reset");

  const validation = useMemo(() => {
    return validateAndParsePageRanges(rangeInput, pageCount ?? 0);
  }, [rangeInput, pageCount]);

  const rangeError = useMemo(() => {
    if (validation.valid) return null;
    return t(`errors.${validation.errorKey}`);
  }, [validation, t]);

  const extractionSummary = useMemo(() => {
    if (!validation.valid || validation.ranges.length === 0) return null;
    return formatExtractionSummary(validation.ranges, locale);
  }, [validation, locale]);

  const handleFile = async (f: File | null) => {
    if (!f) {
      setFile(null);
      setPageCount(null);
      setError(null);
      setDone(false);
      setSplitOutput(null);
      return;
    }

    if (
      f.type !== "application/pdf" &&
      !f.name.toLowerCase().endsWith(".pdf")
    ) {
      setError(t("errors.invalidFileType"));
      return;
    }

    setFile(f);
    setDone(false);
    setError(null);
    setSplitOutput(null);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPageCount(doc.getPageCount());
    } catch {
      setError(t("errors.pdfCorrupted"));
      setPageCount(null);
    }
  };

  const handleSplit = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }

    if (!validation.valid) {
      setError(rangeError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rangesToExtract: PageRange[] =
        validation.ranges.length > 0
          ? validation.ranges
          : Array.from({ length: pageCount ?? 1 }, (_, i) => ({
              start: i + 1,
              end: i + 1,
            }));

      const results = await splitPDF(file, rangesToExtract);

      const items: SplitResultItem[] = results.map((r) => ({
        name: r.name,
        bytes: r.bytes,
        sizeBytes: r.bytes.byteLength,
      }));

      if (results.length === 1) {
        const blob = new Blob([new Uint8Array(results[0].bytes)], {
          type: "application/pdf",
        });
        const fileName = results[0].name;
        setSplitOutput({
          resultsCount: 1,
          isZip: false,
          blob,
          fileName,
          items,
        });
      } else {
        const zip = new JSZip();
        results.forEach(({ name, bytes }) => zip.file(name, bytes));
        const blob = await zip.generateAsync({ type: "blob" });
        const fileName = `${file.name.replace(/\.pdf$/i, "")}_split.zip`;
        setSplitOutput({
          resultsCount: results.length,
          isZip: true,
          blob,
          fileName,
          items,
        });
      }
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.splitFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!splitOutput) return;
    saveAs(splitOutput.blob, splitOutput.fileName);
  };

  const handleDownloadItem = (item: SplitResultItem) => {
    const blob = new Blob([new Uint8Array(item.bytes)], {
      type: "application/pdf",
    });
    saveAs(blob, item.name);
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(null);
    setRangeInput("");
    setError(null);
    setDone(false);
    setSplitOutput(null);
  };

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background py-3 sm:py-6 md:py-8">
      <div className="w-full">
        <PdfToolHeader
          title={title}
          description={description}
          locale={locale}
          badges={[
            {
              text:
                locale === "pt"
                  ? "Sem upload para servidores"
                  : locale === "es"
                    ? "Sin subida a servidores"
                    : "Zero server upload",
              bg: "bg-primary",
              textColor: "text-background",
              icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text:
                locale === "pt"
                  ? "Extração precisa de páginas"
                  : locale === "es"
                    ? "Extracción precisa de páginas"
                    : "Precise page extraction",
              bg: "bg-secondary",
              textColor: "text-background",
              icon: <Scissors className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text:
                locale === "pt"
                  ? "Ilimitado & Gratuito"
                  : locale === "es"
                    ? "Ilimitado y Gratis"
                    : "Unlimited & Free",
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
            {!done || !splitOutput ? (
              <>
                <AppDropfile
                  accept=".pdf,application/pdf"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={handleFile}
                  showSelectedFiles={true}
                  disabled={loading}
                  error={error || undefined}
                />

                {pageCount !== null && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-background border border-border rounded-[2px] text-xs text-label">
                    <span className="text-secondary font-bold uppercase">
                      PDF:
                    </span>
                    <span className="text-foreground font-semibold">
                      {pageCount}{" "}
                      {pageCount === 1
                        ? t("pageCountSingular")
                        : t("pageCountPlural")}
                    </span>
                    <span className="text-label/60 ml-auto text-[11px]">
                      {locale === "pt"
                        ? "Detectado localmente"
                        : locale === "es"
                          ? "Detectado localmente"
                          : "Detected locally"}
                    </span>
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  <div className="space-y-2">
                    <AppInput
                      id="page-ranges-input"
                      variant="background"
                      labelClassName="flex flex-wrap items-center justify-between gap-1 text-xs font-bold uppercase text-foreground"
                      label={
                        <>
                          <span>{t("pageRanges.label")}</span>
                          <span className="text-label/70 text-[11px] normal-case font-normal">
                            {t("pageRanges.hint")}
                          </span>
                        </>
                      }
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder={t("pageRanges.placeholder")}
                      error={rangeError || undefined}
                      aria-invalid={Boolean(rangeError)}
                      className="text-xs sm:text-sm placeholder:normal-case"
                    />
                    {extractionSummary && (
                      <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-[2px] text-xs flex items-center gap-2.5 text-foreground animate-fade-in mt-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                        <span className="font-medium">{extractionSummary}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-label/70 mt-1">
                      {t("pageRanges.blankHint")}
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] text-xs">
                    <p className="font-bold text-foreground mb-3 flex items-center gap-2 uppercase tracking-wider text-[11px]">
                      <Info className="w-3.5 h-3.5 text-secondary shrink-0" />
                      {t("examples.title")}
                    </p>
                    <ul className="space-y-2">
                      <li className="flex flex-wrap items-center gap-2">
                        <code className="bg-tertiary border border-border px-1.5 py-0.5 rounded-[2px] text-secondary font-bold shrink-0">
                          {t("examples.empty.label")}
                        </code>
                        <span className="text-label">
                          {t("examples.empty.desc")}
                        </span>
                      </li>
                      <li className="flex flex-wrap items-center gap-2">
                        <code className="bg-tertiary border border-border px-1.5 py-0.5 rounded-[2px] text-secondary font-bold shrink-0">
                          5
                        </code>
                        <span className="text-label">
                          {t("examples.single.desc")}
                        </span>
                      </li>
                      <li className="flex flex-wrap items-center gap-2">
                        <code className="bg-tertiary border border-border px-1.5 py-0.5 rounded-[2px] text-secondary font-bold shrink-0">
                          2-5
                        </code>
                        <span className="text-label">
                          {t("examples.range.desc")}
                        </span>
                      </li>
                      <li className="flex flex-wrap items-center gap-2">
                        <code className="bg-tertiary border border-border px-1.5 py-0.5 rounded-[2px] text-secondary font-bold shrink-0">
                          1-3, 5, 8-10
                        </code>
                        <span className="text-label">
                          {t("examples.combined.desc")}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {loading && (
                  <div className="p-3.5 sm:p-4 bg-background border border-border rounded-[2px] space-y-2.5 sm:space-y-3">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 font-semibold text-foreground min-w-0">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                        <span className="truncate">
                          {locale === "pt"
                            ? "Separando páginas do PDF..."
                            : locale === "es"
                              ? "Dividiendo páginas del PDF..."
                              : "Splitting PDF pages..."}
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                  <AppButton
                    onClick={handleSplit}
                    disabled={
                      loading || !file || !validation.valid || Boolean(error)
                    }
                    color="primary"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {loading ? t("button.splitting") : t("button.split")}
                  </AppButton>
                  {file && !loading && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0"
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
              <SplitResult
                originalFileName={file ? file.name : "document.pdf"}
                totalPages={pageCount}
                resultsCount={splitOutput.resultsCount}
                isZip={splitOutput.isZip}
                items={splitOutput.items}
                onDownload={handleDownload}
                onDownloadItem={handleDownloadItem}
                onReset={handleReset}
                resetLabel={resetLabel}
                locale={locale}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <SplitContent richContent={richContent} faqs={faqs} locale={locale} />
      </div>
    </main>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Sparkles,
  FileText,
} from "lucide-react";
import { AppCard, AppButton, AppDropfile } from "@/components/ui";
import type { FaqItem } from "@/components/AppFaqSection";
import { extractTextFromPdf, ExtractedPdfText } from "@/lib/pdfToText";
import PdfToolHeader from "../components/PdfToolHeader";
import PdfProgressBar from "../components/PdfProgressBar";
import PdfToTextContent, { RichContent } from "./components/PdfToTextContent";
import PdfToTextResult from "./components/PdfToTextResult";

interface PdfToTextToolProps {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale: string;
}

export default function PdfToTextTool({
  title,
  description,
  faqs,
  richContent,
  locale,
}: PdfToTextToolProps) {
  const t = useTranslations("pdf.pdfToText");
  const [, startTransition] = useTransition();

  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractedPdfText | null>(null);

  const handleFileChange = (selected: File | File[] | null) => {
    const single = Array.isArray(selected) ? selected[0] : selected;
    setFile(single);
    setError(null);
    setResult(null);
    setProgress(null);
  };

  const handleExtract = async () => {
    if (!file) return;

    setExtracting(true);
    setError(null);
    setProgress(null);

    try {
      const data = await extractTextFromPdf(file, (cur, tot) => {
        setProgress({ current: cur, total: tot });
      });

      if (!data.fullText.trim()) {
        setError(t("errors.noTextFound"));
        return;
      }

      setResult(data);
    } catch {
      setError(t("errors.failed"));
    } finally {
      setExtracting(false);
    }
  };

  const handleReset = () => {
    startTransition(() => {
      setFile(null);
      setExtracting(false);
      setProgress(null);
      setError(null);
      setResult(null);
    });
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
              text: t("badges.noUpload"),
              bg: "bg-primary",
              textColor: "text-background",
              icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
            },
            {
              text: t("badges.accuracy"),
              bg: "bg-secondary",
              textColor: "text-background",
              icon: <FileText className="w-3.5 h-3.5 shrink-0" />,
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
                  id="pdf-to-text-dropfile"
                  accept=".pdf,application/pdf"
                  multiple={false}
                  title={t("dropZone.label")}
                  description={t("dropZone.hint")}
                  value={file}
                  onFileChange={handleFileChange}
                  showSelectedFiles={true}
                  disabled={extracting}
                  error={error || undefined}
                />

                {extracting && (
                  <PdfProgressBar
                    label={t("processing.status")}
                    current={progress?.current}
                    total={progress?.total}
                  />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
                  <AppButton
                    onClick={handleExtract}
                    disabled={extracting || !file}
                    color="primary"
                    withArrow
                    className="w-full sm:w-auto"
                  >
                    {extracting ? t("button.extracting") : t("button.extract")}
                  </AppButton>

                  {file && !extracting && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0"
                    >
                      {t("button.clearFile")}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <PdfToTextResult
                fileName={file ? file.name : "documento.pdf"}
                stats={{
                  pages: result.totalPages,
                  words: result.wordCount,
                  chars: result.charCount,
                }}
                fullText={result.fullText}
                pageTexts={result.pageTexts}
                onReset={handleReset}
                t={t}
              />
            )}
          </div>
        </AppCard>

        <PdfToTextContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

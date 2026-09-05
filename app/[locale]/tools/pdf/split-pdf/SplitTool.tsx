"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { Info } from "lucide-react";
import ToolWrapper from "@/components/ToolWrapper";
import { splitPDF, validateAndParsePageRanges } from "@/lib/pdfSplit";
import type { FaqItem } from "@/components/FaqSection";
import Button from "@/components/Button";

interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
}

export default function SplitTool({ title, description, faqs, richContent }: Props) {
  const t = useTranslations("pdf.split");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const validation = useMemo(() => {
    return validateAndParsePageRanges(rangeInput, pageCount);
  }, [rangeInput, pageCount]);

  const rangeError = useMemo(() => {
    if (validation.valid) return null;
    return t(`errors.${validation.errorKey}`, validation.errorParams ?? {});
  }, [validation, t]);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      return;
    }
    setFile(f);
    setDone(false);
    setError(null);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPageCount(doc.getPageCount());
    } catch {
      setPageCount(null);
      setError(t("errors.invalidFile"));
    }
  };

  const handleSplit = async () => {
    if (!file) {
      setError(t("errors.noFile"));
      return;
    }
    if (!validation.valid) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await splitPDF(file, validation.ranges);

      if (results.length === 1) {
        saveAs(new Blob([new Uint8Array(results[0].bytes)], { type: "application/pdf" }), results[0].name);
      } else {
        const zip = new JSZip();
        results.forEach(({ name, bytes }) => zip.file(name, bytes));
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, `${file.name.replace(/\.pdf$/i, "")}_split.zip`);
      }
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.splitFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper
      title={title}
      description={description}
      breadcrumbLabel={title}
      faqs={faqs}
      richContent={richContent}
    >
      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4 dark:border-blue-700 dark:hover:bg-blue-900/20"
        onClick={() => document.getElementById("split-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        {file ? (
          <div>
            <p className="text-gray-700 font-medium dark:text-gray-200">{file.name}</p>
            {pageCount !== null && (
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                {pageCount} {pageCount === 1 ? t("pageCountSingular") : t("pageCountPlural")}
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-blue-600 font-medium dark:text-blue-400">{t("dropZone.label")}</p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">{t("dropZone.hint")}</p>
          </>
        )}
        <input
          id="split-file-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
          {t("pageRanges.label")} <span className="text-gray-400 font-normal dark:text-gray-500">({t("pageRanges.hint")})</span>
        </label>
        <input
          type="text"
          value={rangeInput}
          onChange={(e) => setRangeInput(e.target.value)}
          placeholder={t("pageRanges.placeholder")}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-card dark:bg-card text-gray-900 dark:text-gray-100 ${
            rangeError
              ? "border-red-500 focus:ring-red-400 dark:border-red-500"
              : "border-gray-300 focus:ring-blue-400 dark:border-gray-600"
          }`}
          aria-invalid={Boolean(rangeError)}
        />
        {rangeError && (
          <p className="text-xs text-red-600 mt-1 dark:text-red-400">{rangeError}</p>
        )}

        <div className="mt-3 p-3 bg-gray-50 dark:bg-card border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-1.5">
            <Info size={14} className="text-blue-500" />
            {t("examples.title")}
          </p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <code className="font-mono bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
                {t("examples.empty.label")}
              </code>
              <span>{t("examples.empty.desc")}</span>
            </li>
            <li className="flex items-center gap-2">
              <code className="font-mono bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
                5
              </code>
              <span>{t("examples.single.desc")}</span>
            </li>
            <li className="flex items-center gap-2">
              <code className="font-mono bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
                2-5
              </code>
              <span>{t("examples.range.desc")}</span>
            </li>
            <li className="flex items-center gap-2">
              <code className="font-mono bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-800 dark:text-gray-200 font-medium whitespace-nowrap">
                1-3, 5, 8-10
              </code>
              <span>{t("examples.combined.desc")}</span>
            </li>
          </ul>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-3 dark:text-red-400">{error}</p>}
      {done && <p className="text-green-600 text-sm mb-3 dark:text-green-400">{t("success")}</p>}

      <Button
        onClick={handleSplit}
        disabled={loading || !file || !validation.valid || Boolean(error)}
      >
        {loading ? t("button.splitting") : t("button.split")}
      </Button>
    </ToolWrapper>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ToolWrapper from "@/components/ToolWrapper";
import { splitPDF } from "@/lib/pdfSplit";
import { PageRange } from "@/lib/pdfTypes";
import type { FaqItem } from "@/components/FaqSection";

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
}

export default function SplitTool({ title, description, faqs }: Props) {
  const t = useTranslations("pdf.split");
  const [file, setFile] = useState<File | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const parseRanges = (input: string): PageRange[] => {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const parts = s.split("-").map((n) => parseInt(n.trim(), 10));
        if (parts.length === 1 && !isNaN(parts[0])) {
          return { start: parts[0], end: parts[0] };
        }
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return { start: parts[0], end: parts[1] };
        }
        throw new Error(`Invalid range: "${s}". Use format like 1-3 or 5.`);
      });
  };

  const handleSplit = async () => {
    if (!file) { setError(t("errors.noFile")); return; }
    setLoading(true);
    setError(null);
    try {
      const ranges = parseRanges(rangeInput || "1-9999");
      const results = await splitPDF(file, ranges);

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
      adSlot="1234567891"
    >
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4"
        onClick={() => document.getElementById("split-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") { setFile(f); setDone(false); setError(null); } }}
      >
        {file ? (
          <p className="text-gray-700 font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-blue-600 font-medium">{t("dropZone.label")}</p>
            <p className="text-gray-400 text-sm mt-1">{t("dropZone.hint")}</p>
          </>
        )}
        <input
          id="split-file-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setDone(false); setError(null); } }}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("pageRanges.label")} <span className="text-gray-400 font-normal">({t("pageRanges.hint")})</span>
        </label>
        <input
          type="text"
          value={rangeInput}
          onChange={(e) => setRangeInput(e.target.value)}
          placeholder={t("pageRanges.placeholder")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <p className="text-xs text-gray-400 mt-1">{t("pageRanges.blankHint")}</p>
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {done && <p className="text-green-600 text-sm mb-3">{t("success")}</p>}

      <button
        onClick={handleSplit}
        disabled={loading || !file}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? t("button.splitting") : t("button.split")}
      </button>
    </ToolWrapper>
  );
}

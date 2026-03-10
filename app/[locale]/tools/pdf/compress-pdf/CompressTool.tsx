"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { saveAs } from "file-saver";
import ToolWrapper from "@/components/ToolWrapper";
import { compressPDF } from "@/lib/pdfCompress";
import type { FaqItem } from "@/components/FaqSection";

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function CompressTool({ title, description, faqs }: Props) {
  const t = useTranslations("pdf.compress");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number } | null>(null);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);

  const handleCompress = async () => {
    if (!file) { setError(t("errors.noFile")); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await compressPDF(file);
      setCompressedBytes(bytes);
      setResult({ originalSize: file.size, compressedSize: bytes.byteLength });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.compressionFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBytes || !file) return;
    saveAs(
      new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" }),
      file.name.replace(/\.pdf$/i, "_compressed.pdf")
    );
  };

  const savings =
    result && result.originalSize > 0
      ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
      : 0;

  return (
    <ToolWrapper
      title={title}
      description={description}
      breadcrumbLabel={title}
      faqs={faqs}
      adSlot="1234567892"
    >
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4"
        onClick={() => document.getElementById("compress-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f?.type === "application/pdf") { setFile(f); setResult(null); setError(null); }
        }}
      >
        {file ? (
          <p className="text-gray-700 font-medium">{file.name} ({formatBytes(file.size)})</p>
        ) : (
          <>
            <p className="text-blue-600 font-medium">{t("dropZone.label")}</p>
            <p className="text-gray-400 text-sm mt-1">{t("dropZone.hint")}</p>
          </>
        )}
        <input
          id="compress-file-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setResult(null); setError(null); } }}
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {result && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">{t("result.originalSize")}</span>
            <span className="font-medium">{formatBytes(result.originalSize)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("result.compressedSize")}</span>
            <span className="font-medium">{formatBytes(result.compressedSize)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
            <span className="text-gray-500">{t("result.reduction")}</span>
            <span className={`font-semibold ${savings > 0 ? "text-green-600" : "text-gray-600"}`}>
              {savings > 0 ? t("result.smaller", { savings }) : t("result.noReduction")}
            </span>
          </div>
        </div>
      )}

      {result ? (
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {t("button.download")}
        </button>
      ) : (
        <button
          onClick={handleCompress}
          disabled={loading || !file}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? t("button.compressing") : t("button.compress")}
        </button>
      )}
    </ToolWrapper>
  );
}

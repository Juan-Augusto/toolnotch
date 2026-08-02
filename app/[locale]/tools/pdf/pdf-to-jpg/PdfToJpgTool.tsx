"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ToolWrapper from "@/components/ToolWrapper";
import Button from "@/components/Button";
import { pdfToImages } from "@/lib/pdfToImage";
import type { FaqItem } from "@/components/FaqSection";

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

export default function PdfToJpgTool({ title, description, faqs, richContent }: Props) {
  const t = useTranslations("pdf.pdfToJpg");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ name: string; dataUrl: string }[]>([]);

  const handleConvert = async () => {
    if (!file) { setError(t("errors.noFile")); return; }
    setLoading(true);
    setError(null);
    setPreviews([]);
    setProgress(t("progress.loading"));
    try {
      const images = await pdfToImages(file);
      setProgress(t("progress.converted", { count: images.length }));
      setPreviews(images);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t("errors.conversionFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (previews.length === 0) return;
    if (previews.length === 1) {
      const link = document.createElement("a");
      link.href = previews[0].dataUrl;
      link.download = previews[0].name;
      link.click();
      return;
    }
    const zip = new JSZip();
    for (const { name, dataUrl } of previews) {
      const base64 = dataUrl.split(",")[1];
      zip.file(name, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${file!.name.replace(/\.pdf$/i, "")}_images.zip`);
  };

  return (
    <ToolWrapper
      title={title}
      description={description}
      breadcrumbLabel={title}
      faqs={faqs}
      adSlot="1234567893"
      richContent={richContent}
    >
      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4"
        onClick={() => document.getElementById("pdfimg-file-input")?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f?.type === "application/pdf") { setFile(f); setPreviews([]); setError(null); setProgress(null); }
        }}
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
          id="pdfimg-file-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreviews([]); setError(null); setProgress(null); } }}
        />
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {progress && !error && (
        <p className="text-gray-500 text-sm mb-3">{progress}</p>
      )}

      {previews.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
          {previews.map(({ name, dataUrl }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={name} src={dataUrl} alt={name} className="rounded border border-gray-200 w-full object-contain" />
          ))}
        </div>
      )}

      {previews.length > 0 ? (
        <Button onClick={handleDownloadAll}>
          {previews.length === 1
            ? t("button.downloadOne")
            : t("button.downloadAll", { count: previews.length })}
        </Button>
      ) : (
        <Button onClick={handleConvert} disabled={loading || !file}>
          {loading ? t("button.converting") : t("button.convert")}
        </Button>
      )}
    </ToolWrapper>
  );
}

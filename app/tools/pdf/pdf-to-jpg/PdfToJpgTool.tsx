"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ToolWrapper from "@/components/ToolWrapper";
import { pdfToImages } from "@/lib/pdfToImage";

const faqs = [
  {
    question: "What image format are the pages converted to?",
    answer: "Pages are converted to high-quality JPEG images at 2x resolution.",
  },
  {
    question: "Are my files uploaded anywhere?",
    answer: "No. Conversion runs entirely in your browser using PDF.js. Your files never leave your device.",
  },
  {
    question: "Can I convert only specific pages?",
    answer:
      "Currently all pages are converted. You can then keep only the images you need from the downloaded ZIP.",
  },
  {
    question: "How do I open the ZIP file?",
    answer:
      "On Windows, right-click the ZIP and choose Extract All. On Mac, double-click it. Each page is a separate JPEG.",
  },
];

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ name: string; dataUrl: string }[]>([]);

  const handleConvert = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    setLoading(true);
    setError(null);
    setPreviews([]);
    setProgress("Loading PDF…");
    try {
      const images = await pdfToImages(file);
      setProgress(`Converted ${images.length} page${images.length !== 1 ? "s" : ""}`);
      setPreviews(images);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
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
      title="PDF to JPG — Convert PDF Pages to Images"
      description="Convert each PDF page to a high-quality JPEG image. No upload needed."
      breadcrumbLabel="PDF to JPG"
      faqs={faqs}
      adSlot="1234567893"
    >
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors mb-4"
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
            <p className="text-blue-600 font-medium">Click or drag a PDF here</p>
            <p className="text-gray-400 text-sm mt-1">Single PDF file</p>
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
        <button
          onClick={handleDownloadAll}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Download {previews.length === 1 ? "Image" : `All ${previews.length} Images`}
        </button>
      ) : (
        <button
          onClick={handleConvert}
          disabled={loading || !file}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Converting…" : "Convert to JPG"}
        </button>
      )}
    </ToolWrapper>
  );
}

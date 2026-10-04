"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  FileText,
  AlignLeft,
  Hash,
} from "lucide-react";
import { saveAs } from "file-saver";
import AppButton from "@/components/ui/AppButton";
import AppTabs from "@/components/ui/AppTabs";

interface PdfToTextResultProps {
  fileName: string;
  stats: {
    pages: number;
    words: number;
    chars: number;
  };
  fullText: string;
  pageTexts: string[];
  onReset: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function PdfToTextResult({
  fileName,
  stats,
  fullText,
  pageTexts,
  onReset,
  t,
}: PdfToTextResultProps) {
  const [activeTab, setActiveTab] = useState<"full" | "byPage">("full");
  const [selectedPage, setSelectedPage] = useState(0);
  const [copied, setCopied] = useState(false);

  const displayedText =
    activeTab === "full" ? fullText : pageTexts[selectedPage] || "";

  const handleCopy = async () => {
    if (!displayedText) return;
    try {
      await navigator.clipboard.writeText(displayedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = displayedText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([displayedText], {
      type: "text/plain;charset=utf-8",
    });
    const base = fileName.replace(/\.pdf$/i, "");
    const suffix =
      activeTab === "byPage" ? `_pag_${selectedPage + 1}` : "_texto";
    saveAs(blob, `${base}${suffix}.txt`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-background border border-border rounded-[2px] flex items-center gap-3">
          <div className="w-8 h-8 rounded-[2px] bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-label block uppercase font-medium">
              {t("stats.pages")}
            </span>
            <span className="text-sm font-bold text-foreground">
              {stats.pages}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-background border border-border rounded-[2px] flex items-center gap-3">
          <div className="w-8 h-8 rounded-[2px] bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-label block uppercase font-medium">
              {t("stats.words")}
            </span>
            <span className="text-sm font-bold text-foreground">
              {stats.words.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-background border border-border rounded-[2px] flex items-center gap-3">
          <div className="w-8 h-8 rounded-[2px] bg-foreground/10 text-foreground flex items-center justify-center shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-label block uppercase font-medium">
              {t("stats.chars")}
            </span>
            <span className="text-sm font-bold text-foreground">
              {stats.chars.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-background border border-border rounded-[2px] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
          <div className="flex items-center">
            <AppTabs
              tabs={[
                { id: "full", label: t("tabs.full") },
                { id: "byPage", label: t("tabs.byPage") },
              ]}
              value={activeTab}
              onChange={(id) => setActiveTab(id as "full" | "byPage")}
              color="primary"
              size="sm"
              renderContent={false}
              withRail={false}
              className="w-auto"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-tertiary hover:bg-tertiary/80 text-foreground border border-border rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-secondary" />
                  <span>{t("button.copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t("button.copy")}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-tertiary hover:bg-tertiary/80 text-foreground border border-border rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("button.downloadTxt")}</span>
            </button>
          </div>
        </div>

        {activeTab === "byPage" && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {pageTexts.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPage(idx)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-[2px] shrink-0 transition-colors cursor-pointer ${
                  selectedPage === idx
                    ? "bg-foreground text-background"
                    : "bg-tertiary text-label hover:text-foreground"
                }`}
              >
                Pág. {idx + 1}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <div
            tabIndex={0}
            role="region"
            aria-label="Text Preview"
            className="w-full max-h-[380px] overflow-y-auto p-4 bg-tertiary border border-border/80 rounded-[2px] text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed select-text outline-none focus:border-primary"
          >
            {displayedText || (
              <span className="text-label/50 italic">
                {t("errors.noTextFound")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <AppButton onClick={handleDownloadTxt} color="primary" withArrow>
          <Download className="w-4 h-4 mr-1.5" />
          {t("button.downloadTxt")}
        </AppButton>

        <AppButton onClick={onReset} color="tertiary">
          {t("button.reset")}
        </AppButton>
      </div>
    </div>
  );
}

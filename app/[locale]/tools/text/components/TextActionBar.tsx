"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check, Trash2, FileText } from "lucide-react";
import { AppButton } from "@/components/ui";

export interface TextActionBarProps {
  text: string;
  onSample: () => void;
  onClear: () => void;
  sampleLabel?: string;
  clearLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  extraLeft?: React.ReactNode;
  extraRight?: React.ReactNode;
}

export default function TextActionBar({
  text,
  onSample,
  onClear,
  sampleLabel,
  clearLabel,
  copyLabel,
  copiedLabel,
  extraLeft,
  extraRight,
}: TextActionBarProps) {
  const t = useTranslations("text.buttons");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-background/50 dark:bg-foreground/[0.03] border-t border-border">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <AppButton
          color="tertiary"
          small
          onClick={onSample}
        >
          <FileText className="w-3.5 h-3.5 mr-1" />
          {sampleLabel ?? t("sampleText")}
        </AppButton>
        {text && (
          <AppButton
            color="tertiary"
            small
            onClick={onClear}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {clearLabel ?? t("clear")}
          </AppButton>
        )}
        {extraLeft}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {extraRight}
        <AppButton
          color="secondary"
          small
          onClick={handleCopy}
          disabled={!text}
          className="font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              {copiedLabel ?? t("copied")}
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              {copyLabel ?? t("copy")}
            </>
          )}
        </AppButton>
      </div>
    </div>
  );
}

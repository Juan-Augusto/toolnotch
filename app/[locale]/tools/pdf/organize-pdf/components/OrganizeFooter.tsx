"use client";

import React from "react";
import { AppButton } from "@/components/ui";

export interface OrganizeFooterProps {
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  disabled: boolean;
  saveLabel: string;
  savingLabel: string;
  clearLabel: string;
}

export default function OrganizeFooter({
  onSave,
  onReset,
  saving,
  disabled,
  saveLabel,
  savingLabel,
  clearLabel,
}: OrganizeFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
      <AppButton
        onClick={onSave}
        disabled={disabled || saving}
        color="primary"
        withArrow
        className="w-full sm:w-auto"
      >
        {saving ? savingLabel : saveLabel}
      </AppButton>

      {!saving && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-label hover:text-foreground transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer self-center sm:self-auto py-2 sm:py-0"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}

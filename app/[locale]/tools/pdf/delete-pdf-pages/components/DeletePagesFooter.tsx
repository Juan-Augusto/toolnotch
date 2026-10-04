"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { AppButton } from "@/components/ui";

export interface DeletePagesFooterProps {
  onDelete: () => void;
  onReset: () => void;
  deleting: boolean;
  disabled: boolean;
  deleteLabel: string;
  deletingLabel: string;
  clearLabel: string;
}

export default function DeletePagesFooter({
  onDelete,
  onReset,
  deleting,
  disabled,
  deleteLabel,
  deletingLabel,
  clearLabel,
}: DeletePagesFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
      <AppButton
        onClick={onDelete}
        disabled={disabled || deleting}
        color="primary"
        withArrow
        className="w-full sm:w-auto"
      >
        <Trash2 className="w-4 h-4 mr-1.5 shrink-0" />
        <span>{deleting ? deletingLabel : deleteLabel}</span>
      </AppButton>

      {!deleting && (
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

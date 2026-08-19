"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "default" | "panel" | "primary" | "foreground" | "grey" | "gray";
  opacity?: boolean;
}

export default function Button({
  children,
  className = "",
  color = "default",
  opacity = false,
  ...props
}: ButtonProps) {
  let colorClasses = "";

  if (color === "primary") {
    colorClasses = opacity
      ? "bg-neon/10 text-neon hover:not-disabled:bg-neon/15 border border-neon/30"
      : "bg-neon hover:not-disabled:bg-emerald-500 text-white dark:text-black border border-transparent";
  } else if (color === "foreground") {
    colorClasses = opacity
      ? "bg-foreground/10 text-foreground hover:not-disabled:bg-foreground/20 border-2 border-foreground/70"
      : "bg-foreground hover:not-disabled:opacity-90 text-background border border-transparent";
  } else if (color === "grey" || color === "gray") {
    colorClasses = opacity
      ? "bg-gray-100/40 hover:not-disabled:bg-gray-200/40 dark:bg-gray-800/20 dark:hover:not-disabled:bg-gray-800/40 text-tx-secondary hover:not-disabled:text-tx-primary border border-bd-base/60"
      : "bg-gray-100 hover:not-disabled:bg-gray-200 dark:bg-gray-800 dark:hover:not-disabled:bg-gray-700 text-tx-secondary hover:not-disabled:text-tx-primary border border-transparent";
  } else if (color === "panel") {
    colorClasses = opacity
      ? "bg-elevated/40 hover:not-disabled:bg-elevated/60 text-tx-primary border border-bd-base"
      : "bg-elevated hover:not-disabled:bg-gray-200/50 dark:bg-surface dark:hover:not-disabled:bg-gray-800/50 text-tx-primary border border-bd-base";
  } else {
    // default
    colorClasses = opacity
      ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:not-disabled:bg-blue-600/20 border border-blue-600/60 dark:border-blue-500/60"
      : "bg-blue-600 hover:not-disabled:bg-blue-700 text-white border border-transparent";
  }

  return (
    <button
      className={`w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-6 rounded-lg transition-all text-base ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

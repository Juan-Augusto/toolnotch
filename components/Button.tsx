"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "default" | "panel";
}

export default function Button({
  children,
  className = "",
  color = "default",
  ...props
}: ButtonProps) {
  const colorClasses =
    color === "panel"
      ? "bg-elevated hover:not-disabled:bg-gray-200/50 dark:bg-surface dark:hover:not-disabled:bg-gray-800/50 text-tx-primary border border-bd-base"
      : "bg-blue-600 hover:not-disabled:bg-blue-700 text-white";

  return (
    <button
      className={`w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-6 rounded-lg transition-colors text-base ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

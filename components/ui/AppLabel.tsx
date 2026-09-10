"use client";

import type { LabelHTMLAttributes, ReactNode } from "react";

export interface AppLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode;
}

export default function AppLabel({
  children,
  className = "",
  ...props
}: AppLabelProps) {
  return (
    <label
      className={`inline-block font-mono text-xs font-semibold uppercase  text-foreground mb-1.5 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

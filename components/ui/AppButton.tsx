"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export type AppButtonColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "panel"
  | "default"
  | "foreground"
  | "grey"
  | "gray"
  | "danger";

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  color?: AppButtonColor;
  withArrow?: boolean;
  className?: string;
  rounded?: boolean;
  small?: boolean;
  opacity?: boolean;
}

export default function AppButton({
  children,
  color = "primary",
  withArrow = false,
  className = "",
  disabled = false,
  rounded = false,
  small = false,
  opacity = false,
  ...props
}: AppButtonProps) {
  const variant =
    color === "secondary"
      ? "secondary"
      : color === "tertiary" || color === "panel"
        ? "tertiary"
        : "primary";

  const colorStyles: Record<"primary" | "secondary" | "tertiary", string> = {
    primary:
      "bg-primary text-background  disabled:bg-primary/25 disabled:text-background/40",
    secondary:
      "bg-secondary text-background disabled:bg-secondary/25 disabled:text-background/40",
    tertiary:
      "bg-tertiary text-foreground hover:not-disabled:border-border disabled:bg-tertiary/40 disabled:text-label/40",
  };

  const sizeClasses = small ? "px-5 py-3 text-xs" : "px-6 py-3.5 text-sm";
  const radiusClasses = rounded ? "rounded-full" : "rounded-[2px]";

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer select-none active:not-disabled:scale-[0.98] disabled:cursor-not-allowed ${sizeClasses} ${radiusClasses} ${colorStyles[variant]} ${opacity ? "opacity-80" : ""} ${className}`}
      {...props}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
      {withArrow && (
        <ArrowRight className={small ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
    </button>
  );
}

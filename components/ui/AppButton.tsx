"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export type AppButtonColor =
  | "primary"
  | "primary-2"
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
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  rounded?: boolean;
  small?: boolean;
  opacity?: boolean;
  suppressHydrationWarning?: boolean;
}

export default function AppButton({
  children,
  color = "primary",
  withArrow = false,
  icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  rounded = false,
  small = false,
  opacity = false,
  suppressHydrationWarning = true,
  ...props
}: AppButtonProps) {
  const variant =
    color === "secondary" || color === "primary-2"
      ? "secondary"
      : color === "tertiary" || color === "panel"
        ? "tertiary"
        : "primary";

  const colorStyles: Record<"primary" | "secondary" | "tertiary", string> = {
    primary:
      "bg-primary text-white dark:text-black hover:shadow-[0px_4px_0px_var(--color-primary-shadow)] active:bg-primary-shadow disabled:bg-primary/25 disabled:text-background/40",
    secondary:
      "bg-secondary text-white dark:text-black hover:shadow-[0px_4px_0px_var(--color-secondary-shadow)] active:bg-secondary-shadow disabled:bg-secondary/25 disabled:text-background/40",
    tertiary:
      "border border-border bg-tertiary text-foreground hover:shadow-[0px_4px_0px_var(--color-tertiary-shadow)] active:bg-tertiary-shadow disabled:bg-tertiary/40 disabled:text-label/40",
  };

  const sizeClasses = small
    ? "px-5 py-3 text-xs"
    : "px-5 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm";
  const radiusClasses = rounded ? "rounded-full" : "rounded-[2px]";

  return (
    <button
      disabled={disabled}
      suppressHydrationWarning={suppressHydrationWarning}
      className={`inline-flex items-center justify-center hover:-translate-y-1 active:translate-y-0 active:shadow-none disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:translate-y-0 gap-2.5 font-semibold uppercase whitespace-nowrap transition-all duration-200 cursor-pointer select-none disabled:cursor-not-allowed ${sizeClasses} ${radiusClasses} ${colorStyles[variant]} ${opacity ? "opacity-80" : ""} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}
      <span className="inline-flex items-center gap-2">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}
      {withArrow && !icon && (
        <ArrowRight className={small ? "w-3.5 h-3.5" : "w-4 h-4"} />
      )}
    </button>
  );
}

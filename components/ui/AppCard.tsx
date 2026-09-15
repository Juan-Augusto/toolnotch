import type { HTMLAttributes, ReactNode } from "react";
import AppCornerAccents from "./AppCornerAccents";

export interface AppCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  cornerAccents?: boolean;
  withCornerAccents?: boolean;
  border?: boolean;
  hover?: boolean;
}

export default function AppCard({
  children,
  className = "",
  cornerAccents = true,
  withCornerAccents,
  border,
  hover,
  ...props
}: AppCardProps) {
  const hasCustomPadding = /(?:^|\s|\w+:)(?:p|px|py|pt|pr|pb|pl)-/.test(className);
  const defaultPadding = hasCustomPadding ? "" : "p-3 sm:p-6";

  return (
    <div
      className={`relative bg-tertiary ${defaultPadding} ${hover ? "hover:border-foreground/20" : ""} ${border ? "border border-border" : ""} ${className}`.trim()}
      {...props}
    >
      {withCornerAccents && <AppCornerAccents />}

      {children}
    </div>
  );
}

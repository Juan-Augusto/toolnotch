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
  const showCornerAccents =
    withCornerAccents !== undefined ? withCornerAccents : cornerAccents;

  return (
    <div
      className={`relative bg-tertiary p-6 ${hover ? "hover:border-foreground/20" : ""} ${border ? "border border-border" : ""} ${className}`}
      {...props}
    >
      {showCornerAccents && <AppCornerAccents />}

      {children}
    </div>
  );
}

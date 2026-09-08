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
      className={`relative bg-tertiary/40 p-6 ${hover ? "hover:bg-tertiary" : ""} ${className}`}
      {...props}
    >
      {border && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
        </svg>
      )}

      {showCornerAccents && <AppCornerAccents />}

      {children}
    </div>
  );
}

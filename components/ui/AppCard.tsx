import type { HTMLAttributes, ReactNode } from "react";
import AppCornerAccents from "./AppCornerAccents";

export interface AppCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export default function AppCard({
  children,
  className = "",
  ...props
}: AppCardProps) {
  return (
    <div
      className={`relative bg-tertiary/20 dark:bg-background p-6 ${className}`}
      {...props}
    >
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

      <AppCornerAccents />

      {children}
    </div>
  );
}

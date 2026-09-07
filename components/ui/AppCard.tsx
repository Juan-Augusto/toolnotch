import type { HTMLAttributes, ReactNode } from "react";

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

      <span
        className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-t-3 border-l-3 border-foreground dark:border-foreground pointer-events-none z-10"
        aria-hidden="true"
      />
      <span
        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-t-3 border-r-3 border-foreground dark:border-foreground pointer-events-none z-10"
        aria-hidden="true"
      />
      <span
        className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 border-b-3 border-l-3 border-foreground dark:border-foreground pointer-events-none z-10"
        aria-hidden="true"
      />
      <span
        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-3 border-r-3 border-foreground dark:border-foreground pointer-events-none z-10"
        aria-hidden="true"
      />

      {children}
    </div>
  );
}

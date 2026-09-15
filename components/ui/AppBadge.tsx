import type { HTMLAttributes, ReactNode } from "react";

export interface AppBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  bg?: string;
  text?: string;
  icon?: ReactNode;
  className?: string;
}

export function AppBadge({
  children,
  bg = "",
  text = "",
  icon,
  className = "",
  ...props
}: AppBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 md:px-2.5 py-0.5 text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-wide uppercase rounded-[2px] whitespace-nowrap ${bg} ${text} ${className}`}
      {...props}
    >
      {icon && (
        <span className="shrink-0 inline-flex items-center [&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-3.5 sm:[&>svg]:h-3.5">{icon}</span>
      )}
      {children !== undefined && <span>{children}</span>}
    </span>
  );
}

export default AppBadge;

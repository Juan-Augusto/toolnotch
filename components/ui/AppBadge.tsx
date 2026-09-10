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
      className={`inline-flex items-center gap-2 px-2.5 py-0.5 text-[12px] font-mono font-bold uppercase  rounded-[2px] whitespace-nowrap ${bg} ${text} ${className}`}
      {...props}
    >
      {icon && (
        <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}
      {children !== undefined && <span>{children}</span>}
    </span>
  );
}

export default AppBadge;

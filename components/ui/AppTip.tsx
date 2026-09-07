import type { HTMLAttributes, ReactNode } from "react";
import { Siren } from "lucide-react";

export interface AppTipProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function AppTip({
  title,
  description,
  icon,
  className = "",
  children,
  ...props
}: AppTipProps) {
  const content = description ?? children;

  return (
    <div
      className={`relative w-full p-6 border-dashed-5-primary bg-primary/5 rounded-[2px] ${className}`}
      {...props}
    >
      {(title || icon) && (
        <div className="flex items-center gap-2.5 mb-3 select-none">
          <div className="text-primary shrink-0 flex items-center justify-center">
            {icon ?? <Siren className="w-5 h-5 stroke-[2]" />}
          </div>
          {title && (
            <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-wider text-foreground">
              {title}
            </span>
          )}
        </div>
      )}

      {content && (
        <div className="font-mono text-xs md:text-sm text-label/90 leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}

export default AppTip;

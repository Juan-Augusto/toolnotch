"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export interface AccordionGroup {
  name: string;
  content: ReactNode;
  id?: string;
  defaultOpen?: boolean;
}

export interface AppAccordionProps {
  group?: AccordionGroup | AccordionGroup[];
  groups?: AccordionGroup[];
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  allowMultiple?: boolean;
  defaultOpenAll?: boolean;
}

export function AppAccordion({
  group,
  groups,
  className = "",
  itemClassName = "",
  headerClassName = "",
  contentClassName = "",
  allowMultiple = true,
  defaultOpenAll = false,
}: AppAccordionProps) {
  const normalizedGroups: AccordionGroup[] = useMemo(() => {
    if (groups && groups.length > 0) {
      return groups;
    }
    if (!group) {
      return [];
    }
    return Array.isArray(group) ? group : [group];
  }, [group, groups]);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    normalizedGroups.forEach((grp, idx) => {
      const key = grp.id ?? `${grp.name}-${idx}`;
      if (grp.defaultOpen !== undefined) {
        map[key] = grp.defaultOpen;
      } else if (defaultOpenAll) {
        map[key] = true;
      } else if (normalizedGroups.length === 1) {
        map[key] = true;
      } else {
        map[key] = false;
      }
    });
    return map;
  });

  const isItemOpen = (key: string) => Boolean(openMap[key]);

  const toggleItem = (key: string) => {
    setOpenMap((prev) => {
      const currentlyOpen = Boolean(prev[key]);
      if (!allowMultiple) {
        return { [key]: !currentlyOpen };
      }
      return {
        ...prev,
        [key]: !currentlyOpen,
      };
    });
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {normalizedGroups.map((grp, idx) => {
        const key = grp.id ?? `${grp.name}-${idx}`;
        const open = isItemOpen(key);

        return (
          <div key={key} className={`relative ${itemClassName}`}>
            <span
              className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-t-3 border-l-3 border-foreground pointer-events-none z-10"
              aria-hidden="true"
            />
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-t-3 border-r-3 border-foreground pointer-events-none z-10"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 border-b-3 border-l-3 border-foreground pointer-events-none z-10"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-3 border-r-3 border-foreground pointer-events-none z-10"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => toggleItem(key)}
              aria-expanded={open}
              className={`relative w-full border-dashed-5 flex items-center justify-between px-6 py-4 text-left select-none cursor-pointer bg-panel hover:text-primary transition-colors ${headerClassName}`}
            >
              <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-wider text-foreground">
                {grp.name}
              </span>

              <span className="shrink-0 ml-4 flex items-center justify-center">
                {open ? (
                  <Minus className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-foreground stroke-[3]" />
                )}
              </span>

              {open && (
                <>
                  <span
                    className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 border-b-3 border-l-3 border-foreground pointer-events-none z-10"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-3 border-r-3 border-foreground pointer-events-none z-10"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>

            {open && (
              <div
                className={`p-6 border-dashed-5 border-t-transparent! font-mono text-xs md:text-sm text-label/90 leading-relaxed ${contentClassName}`}
              >
                {grp.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AppAccordion;

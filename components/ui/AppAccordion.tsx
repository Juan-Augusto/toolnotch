"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {normalizedGroups.map((grp, idx) => {
        const key = grp.id ?? `${grp.name}-${idx}`;
        const open = isItemOpen(key);

        return (
          <div
            key={key}
            className={`border border-border/60 bg-card rounded-[2px] transition-colors ${
              open ? " border-secondary" : "hover:border-border "
            } ${itemClassName}`}
          >
            <button
              type="button"
              onClick={() => toggleItem(key)}
              aria-expanded={open}
              className={`w-full flex font-medium items-center justify-between px-6 py-4 text-left select-none cursor-pointer bg-tertiary hover:text-foreground transition-colors ${
                open ? "text-secondary hover:text-secondary" : "text-label"
              } ${headerClassName}`}
            >
              <span className=" uppercase ">{grp.name}</span>

              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="shrink-0 ml-4 flex items-center justify-center text-foreground"
              >
                {open ? (
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: {
                        duration: 0.28,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      },
                      opacity: { duration: 0.2, delay: 0.05 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        duration: 0.22,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div
                    className={`p-6 border-t border-border/60 text-label leading-relaxed ${contentClassName}`}
                  >
                    {grp.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default AppAccordion;

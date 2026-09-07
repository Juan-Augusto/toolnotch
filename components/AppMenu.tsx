"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface MenuItem {
  name: string;
  tags?: string[];
  link?: string;
  click?: () => void;
}

export interface MenuGroup {
  name: string;
  tags?: string[];
  items: MenuItem[];
}

export interface AppMenuProps {
  group?: MenuGroup | MenuGroup[];
  groups?: MenuGroup[];
  className?: string;
}

export function AppMenu({
  group,
  groups,
  className = "",
}: AppMenuProps) {
  const normalizedGroups: MenuGroup[] = useMemo(() => {
    if (groups && groups.length > 0) {
      return groups;
    }
    if (!group) {
      return [];
    }
    return Array.isArray(group) ? group : [group];
  }, [group, groups]);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const isGroupOpen = (key: string) => {
    if (openMap[key] !== undefined) {
      return openMap[key];
    }
    return true;
  };

  const toggleGroup = (key: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [key]: prev[key] !== undefined ? !prev[key] : false,
    }));
  };

  return (
    <nav
      aria-label="Sidebar Menu"
      className={`w-64 shrink-0 flex flex-col border-r-dashed-5 bg-background select-none font-mono ${className}`}
    >
      {normalizedGroups.map((grp, groupIdx) => {
        const groupKey = `${grp.name}-${groupIdx}`;
        const open = isGroupOpen(groupKey);

        return (
          <div
            key={groupKey}
            className="border-b-dashed-5"
          >
            <button
              type="button"
              onClick={() => toggleGroup(groupKey)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left text-foreground hover:text-primary transition-colors cursor-pointer group"
              aria-expanded={open}
            >
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-foreground/70 transition-transform duration-200 ${
                  open ? "rotate-0" : "-rotate-90"
                }`}
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                {grp.name}
              </span>
              {grp.tags && grp.tags.length > 0 && (
                <div className="flex items-center gap-1 ml-auto flex-wrap">
                  {grp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-tertiary text-label border border-border/40 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="menu-group-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: {
                        duration: 0.24,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      },
                      opacity: { duration: 0.18, delay: 0.04 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        duration: 0.18,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      },
                      opacity: { duration: 0.12 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col pb-3 pt-0 px-2 space-y-0.5">
                    {grp.items.map((item, itemIdx) => {
                      const itemKey = `${item.name}-${itemIdx}`;
                      const isExternal =
                        item.link?.startsWith("http://") ||
                        item.link?.startsWith("https://");

                      const itemClasses =
                        "flex items-center justify-between gap-2 w-full px-4 py-2 font-mono text-xs text-label hover:text-foreground hover:bg-tertiary/30 rounded-[2px] transition-colors text-left";

                      const content = (
                        <>
                          <span className="truncate">{item.name}</span>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-tertiary/60 text-label/80 border border-border/30 uppercase"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      );

                      return (
                        <li key={itemKey}>
                          {item.link ? (
                            isExternal ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={item.click}
                                className={itemClasses}
                              >
                                {content}
                              </a>
                            ) : (
                              <Link
                                href={item.link}
                                onClick={item.click}
                                className={itemClasses}
                              >
                                {content}
                              </Link>
                            )
                          ) : item.click ? (
                            <button
                              type="button"
                              onClick={item.click}
                              className={itemClasses}
                            >
                              {content}
                            </button>
                          ) : (
                            <div className={itemClasses}>{content}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}

export default AppMenu;

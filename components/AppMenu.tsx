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
      className={`w-86 shrink-0 flex flex-col border-r-dashed-5 bg-panel select-none  ${className}`}
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
              className={`w-full flex text-base items-center gap-2.5 px-5 py-4 text-left text-foreground bg-background hover:text-primary transition-colors cursor-pointer group border-r-dashed-5 ${
                open ? "border-b-dashed-5" : ""
              }`}
              aria-expanded={open}
            >
              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                  open ? "rotate-0" : "-rotate-90"
                }`}
              />
              <span className=" font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                {grp.name}
              </span>
              {grp.tags && grp.tags.length > 0 && (
                <div className="flex items-center gap-1 ml-auto flex-wrap">
                  {grp.tags.map((tag) => (
                    <span
                      key={tag}
                      className=" px-1.5 py-0.5 rounded bg-panel text-label border border-border/40 uppercase"
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
                  <ul className="flex flex-col">
                    {grp.items.map((item, itemIdx) => {
                      const itemKey = `${item.name}-${itemIdx}`;
                      const isExternal =
                        item.link?.startsWith("http://") ||
                        item.link?.startsWith("https://");

                      const itemClasses =
                        "flex items-center font-light justify-between gap-2.5 w-full px-5 py-5 text-label hover:text-foreground hover:bg-tertiary/40 transition-colors text-left";

                      const content = (
                        <>
                          <span className="break-words leading-snug">{item.name}</span>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className=" px-1.5 py-0.5 rounded bg-tertiary/60 text-label/80 border border-border/30 uppercase"
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

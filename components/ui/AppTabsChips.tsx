"use client";

import { useId, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";

export interface AppTabsChipItem {
  id: string;
  label: ReactNode;
  count?: number | string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface AppTabsChipsProps {
  items: AppTabsChipItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
}

export function AppTabsChips({
  items,
  value,
  onChange,
  className = "",
  layoutId: customLayoutId,
}: AppTabsChipsProps) {
  const autoId = useId();
  const layoutId = customLayoutId ?? `tabs-chips-active-${autoId}`;

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const enabledItems = items.filter((item) => !item.disabled);
    const currentIndex = enabledItems.findIndex((item) => item.id === value);

    let nextIndex = -1;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % enabledItems.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex =
        (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = enabledItems.length - 1;
    }

    if (nextIndex >= 0 && enabledItems[nextIndex]) {
      e.preventDefault();
      onChange(enabledItems[nextIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`flex flex-wrap items-center gap-1.5 sm:gap-2 p-0.5 select-none ${className}`}
    >
      {items.map((item, idx) => {
        const isActive = item.id === value;

        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            id={`tab-chip-${item.id}`}
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => !item.disabled && onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            tabIndex={isActive ? 0 : -1}
            className={`relative shrink-0 flex font-medium items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-base uppercase rounded-[2px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              isActive
                ? "text-background font-semibold"
                : "text-label hover:text-foreground bg-tertiary border border-border hover:border-foreground/20 hover:bg-tertiary/70"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-secondary dark:bg-primary rounded-[2px] z-0"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 40,
                  bounce: 0,
                }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={` ${
                    isActive ? "text-background/85" : "text-label/70"
                  }`}
                >
                  ({item.count})
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default AppTabsChips;

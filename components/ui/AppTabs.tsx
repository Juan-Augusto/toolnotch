"use client";

import {
  useState,
  useId,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AppTabItem {
  id: string;
  label: ReactNode;
  badge?: string | number;
  icon?: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

export type AppTabInput = string | AppTabItem;
export type AppTabsColor = "secondary" | "primary";

export interface AppTabsProps {
  tabs: AppTabInput[];
  value?: string;
  defaultValue?: string;
  onChange?: (tabId: string) => void;
  color?: AppTabsColor;
  className?: string;
  listClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  inactiveTabClassName?: string;
  indicatorClassName?: string;
  contentClassName?: string;
  size?: "sm" | "md" | "lg";
  layoutId?: string;
  withRail?: boolean;
  fullWidth?: boolean;
  renderContent?: boolean;
}

export function AppTabs({
  tabs,
  value,
  defaultValue,
  onChange,
  color = "secondary",
  className = "",
  listClassName = "",
  tabClassName = "",
  activeTabClassName = "",
  inactiveTabClassName = "",
  indicatorClassName = "",
  contentClassName = "",
  size = "md",
  layoutId: customLayoutId,
  withRail = false,
  fullWidth = false,
  renderContent = true,
}: AppTabsProps) {
  const autoId = useId();
  const layoutId = customLayoutId ?? `app-tabs-indicator-${autoId}`;

  const normalizedTabs: AppTabItem[] = useMemo(() => {
    return tabs.map((t) => {
      if (typeof t === "string") {
        return { id: t, label: t };
      }
      return t;
    });
  }, [tabs]);

  const [internalActiveId, setInternalActiveId] = useState<string>(() => {
    if (defaultValue !== undefined) return defaultValue;
    if (normalizedTabs.length > 0) return normalizedTabs[0].id;
    return "";
  });

  const activeId = value !== undefined ? value : internalActiveId;

  const handleTabClick = (tab: AppTabItem) => {
    if (tab.disabled) return;
    if (value === undefined) {
      setInternalActiveId(tab.id);
    }
    onChange?.(tab.id);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const enabledTabs = normalizedTabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === activeId);

    let nextIndex = -1;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex >= 0 && enabledTabs[nextIndex]) {
      e.preventDefault();
      handleTabClick(enabledTabs[nextIndex]);
    }
  };

  const sizeClasses: Record<"sm" | "md" | "lg", { tab: string; text: string }> =
    {
      sm: {
        tab: "pb-1.5 pt-0.5 px-0.5",
        text: "text-xs ",
      },
      md: {
        tab: "pb-2 pt-1 px-1",
        text: "text-xs md:text-sm ",
      },
      lg: {
        tab: "pb-2.5 pt-1.5 px-1.5",
        text: "text-sm md:text-base st",
      },
    };

  const isSecondary = color === "secondary";
  const activeTextColor = isSecondary ? "text-secondary" : "text-primary";
  const activeBgColor = isSecondary ? "bg-secondary" : "bg-primary";
  const activeBadgeClasses = isSecondary
    ? "bg-secondary/15 text-secondary border-secondary/30"
    : "bg-primary/15 text-primary border-primary/30";
  const focusRingColor = isSecondary
    ? "focus-visible:ring-secondary/60"
    : "focus-visible:ring-primary/60";

  const activeTabObj = normalizedTabs.find((t) => t.id === activeId);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={`relative flex items-center gap-3.5 sm:gap-5 overflow-x-auto scrollbar-none select-none ${
          withRail ? "border-b border-border/40" : ""
        } ${listClassName}`}
      >
        {normalizedTabs.map((tab, idx) => {
          const isActive = tab.id === activeId;

          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              tabIndex={isActive ? 0 : -1}
              className={`relative inline-flex items-center justify-center gap-1.5 font-mono font-semibold uppercase transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap outline-none focus-visible:ring-1 ${focusRingColor} rounded-xs ${
                sizeClasses[size].tab
              } ${sizeClasses[size].text} ${fullWidth ? "flex-1" : ""} ${
                isActive
                  ? `${activeTextColor} ${activeTabClassName}`
                  : `text-label/70 hover:text-foreground ${inactiveTabClassName}`
              } ${tabClassName}`}
            >
              {tab.icon && (
                <span className="shrink-0 text-current">{tab.icon}</span>
              )}

              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded font-mono text-[10px] uppercase border ${
                    isActive
                      ? activeBadgeClasses
                      : "bg-tertiary text-label/80 border-border/40"
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeBgColor} rounded-full z-10 ${indicatorClassName}`}
                  transition={{
                    type: "spring",
                    stiffness: 460,
                    damping: 36,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {renderContent && activeTabObj?.content && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabObj.id}`}
          aria-labelledby={`tab-${activeTabObj.id}`}
          className={`mt-4 ${contentClassName}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTabObj.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              {activeTabObj.content}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AppTabs;

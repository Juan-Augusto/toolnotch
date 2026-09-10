"use client";

import {
  useState,
  useId,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { motion } from "framer-motion";

export interface SegmentOption<T = string> {
  label: ReactNode;
  value: T;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string | number;
}

export type SegmentInput<T = string> = SegmentOption<T> | string | number;
export type AppSegmentedControlColor = "secondary" | "primary";

export interface AppSegmentedControlProps<T = string> {
  options: SegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  label?: ReactNode;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  color?: AppSegmentedControlColor;
  withDashedBorder?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  layoutId?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
}

export function AppSegmentedControl<T = string>({
  options,
  value,
  defaultValue,
  onChange,
  label,
  error,
  helperText,
  disabled = false,
  name,
  id,
  color = "secondary",
  withDashedBorder = true,
  fullWidth = true,
  size = "md",
  layoutId: customLayoutId,
  className = "",
  containerClassName = "",
  labelClassName = "",
  buttonClassName = "",
  activeButtonClassName = "",
  inactiveButtonClassName = "",
}: AppSegmentedControlProps<T>) {
  const autoId = useId();
  const controlId = id ?? autoId;
  const labelId = `${controlId}-label`;
  const layoutId = customLayoutId ?? `segmented-control-pill-${autoId}`;

  // Normalize options to SegmentOption<T> format
  const normalizedOptions: SegmentOption<T>[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string" || typeof opt === "number") {
        return { label: String(opt), value: opt as unknown as T };
      }
      return opt;
    });
  }, [options]);

  const [internalValue, setInternalValue] = useState<T>(() => {
    if (defaultValue !== undefined) return defaultValue;
    if (normalizedOptions.length > 0) return normalizedOptions[0].value;
    return "" as unknown as T;
  });

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleSelect = (optionValue: T, isOptionDisabled?: boolean) => {
    if (disabled || isOptionDisabled) return;
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const enabledOptions = normalizedOptions.filter((opt) => !opt.disabled);
    const currentIndex = enabledOptions.findIndex(
      (opt) => opt.value === currentValue,
    );

    let nextIndex = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % enabledOptions.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = enabledOptions.length - 1;
    }

    if (nextIndex >= 0 && enabledOptions[nextIndex]) {
      e.preventDefault();
      handleSelect(enabledOptions[nextIndex].value);
    }
  };

  const sizeClasses: Record<
    "sm" | "md" | "lg",
    { button: string; text: string }
  > = {
    sm: {
      button: "h-8 px-2.5",
      text: "text-xs ",
    },
    md: {
      button: "h-11 px-4",
      text: " ",
    },
    lg: {
      button: "h-13 px-5",
      text: "text-sm sm:text-base st",
    },
  };

  const isSecondary = color === "secondary";

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label
          id={labelId}
          className={`font-mono text-xs font-semibold uppercase  text-foreground mb-2 select-none ${
            disabled ? "opacity-50" : ""
          } ${labelClassName}`}
        >
          {label}
        </label>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={
            currentValue !== undefined && currentValue !== null
              ? String(currentValue)
              : ""
          }
        />
      )}

      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-disabled={disabled}
        className={`
          flex items-center gap-2 select-none overflow-x-auto scrollbar-none
          ${withDashedBorder ? "border-dashed-5 p-2 sm:p-2.5" : ""}
          ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
          ${className}
        `}
      >
        {normalizedOptions.map((opt) => {
          const isSelected = opt.value === currentValue;
          const isOptionDisabled = disabled || Boolean(opt.disabled);

          return (
            <button
              key={String(opt.value)}
              role="radio"
              type="button"
              aria-checked={isSelected}
              disabled={isOptionDisabled}
              onClick={() => handleSelect(opt.value, isOptionDisabled)}
              onKeyDown={handleKeyDown}
              tabIndex={isSelected ? 0 : -1}
              className={`
                relative
                ${fullWidth ? "flex-1" : "shrink-0"}
                inline-flex
                items-center
                justify-center
                font-mono
                uppercase
                transition-colors
                duration-150
                rounded-[2px]
                cursor-pointer
                outline-none
                focus-visible:ring-1
                ${
                  isSecondary
                    ? "focus-visible:ring-secondary/60"
                    : "focus-visible:ring-primary/60"
                }
                disabled:cursor-not-allowed
                disabled:opacity-40
                ${sizeClasses[size].button}
                ${
                  isSelected
                    ? activeButtonClassName
                    : `bg-tertiary hover:bg-border/30 text-foreground ${inactiveButtonClassName}`
                }
                ${buttonClassName}
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId={layoutId}
                  className={`
                    absolute
                    inset-0
                    rounded-[2px]
                    z-0
                    ${isSecondary ? "bg-secondary" : "bg-primary"}
                  `}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}

              <span
                className={`
                  relative
                  z-10
                  inline-flex
                  items-center
                  justify-center
                  gap-1.5
                  truncate
                  ${sizeClasses[size].text}
                  ${
                    isSelected
                      ? "text-background font-black "
                      : "text-foreground font-bold "
                  }
                `}
              >
                {opt.icon && (
                  <span className="shrink-0 text-current">{opt.icon}</span>
                )}
                <span>{opt.label}</span>
                {opt.badge !== undefined && (
                  <span
                    className={`
                      ml-1
                      px-1.5
                      py-0.2
                      rounded
                      font-mono
                      text-[10px]
                      uppercase
                      ${
                        isSelected
                          ? "bg-background/20 text-background font-bold"
                          : "bg-tertiary text-label border border-border/40"
                      }
                    `}
                  >
                    {opt.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <span className="font-mono text-xs text-red-500 mt-1.5 ">{error}</span>
      )}

      {helperText && !error && (
        <span className="font-mono text-xs text-label/70 mt-1.5 ">
          {helperText}
        </span>
      )}
    </div>
  );
}

export default AppSegmentedControl;

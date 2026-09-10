"use client";

import {
  useState,
  useId,
  useMemo,
  useRef,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/composables/useClickOutside";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface AppSelectProps<T = string> {
  options: (SelectOption<T> | string)[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  label?: ReactNode;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  dropdownClassName?: string;
}

export function AppSelect<T = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "SELECIONE...",
  label,
  error,
  helperText,
  disabled = false,
  name,
  id,
  className = "",
  containerClassName = "",
  labelClassName = "",
  dropdownClassName = "",
}: AppSelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const labelId = `${selectId}-label`;

  const [internalValue, setInternalValue] = useState<T | undefined>(
    value !== undefined ? value : defaultValue,
  );
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(() => setIsOpen(false), isOpen, containerRef);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const normalizedOptions: SelectOption<T>[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { label: opt, value: opt as unknown as T };
      }
      return opt;
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === currentValue);
  }, [normalizedOptions, currentValue]);

  const handleSelect = (optionValue: T) => {
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = normalizedOptions.findIndex(
          (opt) => opt.value === currentValue,
        );
        const nextIndex =
          currentIndex < normalizedOptions.length - 1 ? currentIndex + 1 : 0;
        const nextOption = normalizedOptions[nextIndex];
        if (nextOption && !nextOption.disabled) {
          handleSelect(nextOption.value);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = normalizedOptions.findIndex(
          (opt) => opt.value === currentValue,
        );
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : normalizedOptions.length - 1;
        const prevOption = normalizedOptions[prevIndex];
        if (prevOption && !prevOption.disabled) {
          handleSelect(prevOption.value);
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col w-full ${containerClassName}`}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={selectId}
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

      <div className="relative w-full">
        <button
          id={selectId}
          type="button"
          role="combobox"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`
            w-full
            h-12
            px-4
            py-3
            font-mono
            text-sm
            
            text-foreground
            border
            rounded-[2px]
            transition-colors
            duration-150
            outline-none
            flex
            items-center
            justify-between
            text-left
            disabled:opacity-40
            disabled:cursor-not-allowed
            cursor-pointer
            ${
              error
                ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20 bg-tertiary"
                : isOpen
                  ? "border-secondary bg-secondary/5 ring-1 ring-secondary/20"
                  : "border-border hover:border-foreground/30 bg-tertiary"
            }
            ${className}
          `}
        >
          <span
            className={`truncate uppercase ${
              selectedOption ? "text-foreground" : "text-label/50"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 ml-2 shrink-0 text-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            className={`
              absolute
              left-0
              top-full
              mt-1.5
              w-full
              z-50
              bg-tertiary
              border
              border-border
              rounded-[2px]
              max-h-60
              overflow-y-auto
              py-1
              ${dropdownClassName}
            `}
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === currentValue;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    px-4
                    py-2.5
                    font-mono
                    text-sm
                    uppercase
                    
                    text-left
                    transition-colors
                    select-none
                    ${
                      opt.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : isSelected
                          ? "text-primary font-semibold cursor-pointer"
                          : " hover:bg-border/30 text-label hover:text-foreground cursor-pointer"
                    }
                  `}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}
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

export default AppSelect;

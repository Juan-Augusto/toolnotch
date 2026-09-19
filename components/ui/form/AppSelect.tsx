"use client";

import {
  useState,
  useId,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { ChevronDown, Search, X } from "lucide-react";
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
  searchable?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
}

export function AppSelect<T = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Selecione...",
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
  searchable = true,
  searchPlaceholder = "Buscar...",
  noResultsText = "Nenhum resultado encontrado",
}: AppSelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const labelId = `${selectId}-label`;

  const [internalValue, setInternalValue] = useState<T | undefined>(
    value !== undefined ? value : defaultValue,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return normalizedOptions;
    const query = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return normalizedOptions.filter((opt) => {
      const labelNorm = String(opt.label)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const valNorm = String(opt.value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return labelNorm.includes(query) || valNorm.includes(query);
    });
  }, [normalizedOptions, searchQuery, searchable]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === currentValue);
  }, [normalizedOptions, currentValue]);

  useEffect(() => {
    if (isOpen && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isOpen, searchable]);

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
        const currentIndex = filteredOptions.findIndex(
          (opt) => opt.value === currentValue,
        );
        const nextIndex =
          currentIndex < filteredOptions.length - 1 ? currentIndex + 1 : 0;
        const nextOption = filteredOptions[nextIndex];
        if (nextOption && !nextOption.disabled) {
          handleSelect(nextOption.value);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = filteredOptions.findIndex(
          (opt) => opt.value === currentValue,
        );
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : filteredOptions.length - 1;
        const prevOption = filteredOptions[prevIndex];
        if (prevOption && !prevOption.disabled) {
          handleSelect(prevOption.value);
        }
      }
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        const firstValid = filteredOptions.find((opt) => !opt.disabled);
        if (firstValid) {
          handleSelect(firstValid.value);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        const currentIndex = filteredOptions.findIndex(
          (opt) => opt.value === currentValue,
        );
        const nextIndex =
          currentIndex < filteredOptions.length - 1 ? currentIndex + 1 : 0;
        const nextOption = filteredOptions[nextIndex];
        if (nextOption && !nextOption.disabled) {
          handleSelect(nextOption.value);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        const currentIndex = filteredOptions.findIndex(
          (opt) => opt.value === currentValue,
        );
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : filteredOptions.length - 1;
        const prevOption = filteredOptions[prevIndex];
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
          className={`text-xs font-semibold text-foreground mb-2 select-none ${
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
          value={currentValue !== undefined ? String(currentValue) : undefined}
          data-value={currentValue !== undefined ? String(currentValue) : undefined}
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
            className={`truncate ${
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
              shadow-lg
              overflow-hidden
              flex
              flex-col
              ${dropdownClassName}
            `}
          >
            {searchable && (
              <div
                className="p-2 border-b border-border/80 bg-tertiary shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 text-label/60 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className="w-full h-8 pl-8 pr-7 bg-background border border-border rounded-[2px] text-xs font-mono text-foreground placeholder:text-label/50 outline-none focus:border-primary/60 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      aria-label="Limpar pesquisa"
                      className="absolute right-2 text-label/60 hover:text-foreground p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
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
                        text-sm
                        text-left
                        transition-colors
                        select-none
                        ${
                          opt.disabled
                            ? "opacity-40 cursor-not-allowed"
                            : isSelected
                              ? "text-primary font-semibold cursor-pointer bg-primary/5"
                              : "hover:bg-border/30 text-label hover:text-foreground cursor-pointer"
                        }
                      `}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-xs font-mono text-label/60 text-center">
                  {noResultsText}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1.5 ">{error}</span>
      )}

      {helperText && !error && (
        <span className="text-xs text-label/70 mt-1.5 ">
          {helperText}
        </span>
      )}
    </div>
  );
}

export default AppSelect;

"use client";

import {
  useState,
  useId,
  useEffect,
  type InputHTMLAttributes,
  type ReactNode,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import type { Formatter } from "@/utils/formatters/types";

export interface AppInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: ReactNode;
  error?: string;
  helperText?: string;
  formatter?: Formatter<any>;
  onValueChange?: (rawValue: any, formattedValue: string) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  labelClassName?: string;
  flat?: boolean;
}

export function AppInput({
  label,
  error,
  helperText,
  formatter,
  onValueChange,
  onChange,
  onFocus,
  onBlur,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  className = "",
  containerClassName = "",
  labelClassName = "",
  id,
  type = "text",
  flat = false,
  ...props
}: AppInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [displayValue, setDisplayValue] = useState<string>(() => {
    const initial = value !== undefined ? value : defaultValue;
    if (formatter && initial !== undefined && initial !== null) {
      return formatter.toString(initial);
    }
    return initial !== undefined && initial !== null ? String(initial) : "";
  });

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      const nextDisplay =
        formatter && value !== null
          ? formatter.toString(value)
          : value !== null
            ? String(value)
            : "";
      setDisplayValue(nextDisplay);
    }
  }, [value, formatter]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setDisplayValue(inputVal);

    if (formatter) {
      const raw = formatter.toValue(inputVal);
      onValueChange?.(raw, inputVal);
    } else {
      onValueChange?.(inputVal, inputVal);
    }

    onChange?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    if (formatter && displayValue) {
      const raw = formatter.toValue(displayValue);
      const formatted = formatter.toString(raw);
      if (formatted && formatted !== displayValue) {
        setDisplayValue(formatted);
        onValueChange?.(raw, formatted);
      }
    }

    onBlur?.(e);
  };

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={` text-xs font-semibold uppercase  text-foreground mb-2 select-none ${
            disabled ? "opacity-50" : ""
          } ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full
            h-12
            px-4
            py-3
            text-sm
            text-foreground
            rounded-[2px]
            transition-colors
            duration-150
            outline-none
            placeholder:text-label/50
            placeholder:
            placeholder:uppercase
            disabled:opacity-40
            disabled:cursor-not-allowed
            ${
              flat
                ? "bg-transparent border-0 bg-transparent! border-0! focus:bg-transparent!"
                : `bg-tertiary border focus:bg-secondary/3 ${
                    error
                      ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                      : isFocused
                        ? "border-secondary ring-1 ring-secondary/20"
                        : "border-border hover:border-foreground/30"
                  }`
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {error && <span className=" text-xs text-red-500 mt-1.5 ">{error}</span>}

      {helperText && !error && (
        <span className=" text-xs text-label/70 mt-1.5 ">{helperText}</span>
      )}
    </div>
  );
}

export default AppInput;

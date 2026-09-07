"use client";

import React, {
  useState,
  useId,
  useRef,
  useEffect,
  type ReactNode,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { Check, Minus } from "lucide-react";

export interface AppCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event?: ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  boxClassName?: string;
}

export function AppCheckbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  error,
  helperText,
  indeterminate = false,
  disabled = false,
  id,
  className = "",
  containerClassName = "",
  labelClassName = "",
  boxClassName = "",
  name,
  value,
  ...props
}: AppCheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const [internalChecked, setInternalChecked] = useState<boolean>(
    checked !== undefined ? checked : defaultChecked
  );

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked, e);
  };

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label
        htmlFor={inputId}
        className={`inline-flex items-center gap-3 select-none ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={inputRef}
            id={inputId}
            name={name}
            value={value}
            type="checkbox"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`
              w-5
              h-5
              rounded-[2px]
              flex
              items-center
              justify-center
              transition-colors
              duration-150
              peer-focus-visible:ring-2
              peer-focus-visible:ring-[#56fff7]
              peer-focus-visible:ring-offset-1
              peer-focus-visible:ring-offset-[#121518]
              ${
                error
                  ? "border border-red-500 bg-[#202327]"
                  : isChecked || indeterminate
                    ? "bg-[#56fff7] border border-[#56fff7] shadow-[0_0_8px_rgba(86,255,247,0.3)]"
                    : "bg-[#202327] dark:bg-[#1a1d20] border border-[#454b54] hover:border-[#5c636e]"
              }
              ${boxClassName}
            `}
          >
            {indeterminate ? (
              <Minus className="w-3.5 h-3.5 text-[#121518] stroke-[3.5]" />
            ) : isChecked ? (
              <Check className="w-3.5 h-3.5 text-[#121518] stroke-[3.5]" />
            ) : null}
          </div>
        </div>

        {label && (
          <span
            className={`font-mono text-sm font-semibold uppercase tracking-wider text-foreground ${labelClassName}`}
          >
            {label}
          </span>
        )}
      </label>

      {error && (
        <span className="font-mono text-xs text-red-500 mt-1.5 tracking-wide">
          {error}
        </span>
      )}

      {helperText && !error && (
        <span className="font-mono text-xs text-label/70 mt-1.5 tracking-wide">
          {helperText}
        </span>
      )}
    </div>
  );
}

export default AppCheckbox;

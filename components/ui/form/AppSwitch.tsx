"use client";

import {
  useState,
  useId,
  type ReactNode,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

export interface AppSwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event?: ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  labelPosition?: "left" | "right";
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  trackClassName?: string;
  thumbClassName?: string;
}

export function AppSwitch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  labelPosition = "right",
  error,
  helperText,
  disabled = false,
  id,
  className = "",
  containerClassName = "",
  labelClassName = "",
  trackClassName = "",
  thumbClassName = "",
  name,
  value,
  ...props
}: AppSwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;

  const [internalChecked, setInternalChecked] = useState<boolean>(
    checked !== undefined ? checked : defaultChecked,
  );

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked, e);
  };

  const labelElement = label ? (
    <span
      className={`font-mono text-sm font-semibold uppercase  text-foreground ${labelClassName}`}
    >
      {label}
    </span>
  ) : null;

  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label
        htmlFor={switchId}
        className={`inline-flex items-center gap-3 select-none ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
      >
        {labelPosition === "left" && labelElement}

        <div className="relative flex items-center">
          <input
            id={switchId}
            name={name}
            value={value}
            type="checkbox"
            role="switch"
            disabled={disabled}
            checked={isChecked}
            onChange={handleChange}
            className="peer sr-only"
            aria-checked={isChecked}
            {...props}
          />
          <div
            className={`
              w-11
              h-6
              rounded-full
              border
              border-border
              bg-panel
              p-0.5
              flex
              items-center
              transition-colors
              duration-200
              peer-focus-visible:ring-2
              peer-focus-visible:ring-secondary
              peer-focus-visible:ring-offset-1
              peer-focus-visible:ring-offset-background
              ${
                error
                  ? "border-red-500"
                  : isChecked
                    ? "border-secondary"
                    : "hover:border-foreground/30"
              }
              ${trackClassName}
            `}
          >
            <div
              className={`
                w-[18px]
                h-[18px]
                rounded-full
                transition-all
                duration-200
                ease-in-out
                ${
                  isChecked
                    ? "translate-x-[20px] bg-secondary"
                    : "translate-x-0 bg-border"
                }
                ${thumbClassName}
              `}
            />
          </div>
        </div>

        {labelPosition === "right" && labelElement}
      </label>

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

export default AppSwitch;

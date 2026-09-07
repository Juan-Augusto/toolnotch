"use client";

import React, {
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
  /**
   * Texto ou elemento de rótulo acima do input.
   */
  label?: ReactNode;
  /**
   * Mensagem de erro exibida abaixo do input com estilo de erro.
   */
  error?: string;
  /**
   * Texto de auxílio exibido abaixo do input.
   */
  helperText?: string;
  /**
   * Formatador opcional (ex: CurrencyFormatter, DateFormatter).
   * Converte valores brutos em strings formatadas e vice-versa.
   */
  formatter?: Formatter<any>;
  /**
   * Callback disparado na alteração do valor com o valor bruto tipado e a string formatada.
   */
  onValueChange?: (rawValue: any, formattedValue: string) => void;
  /**
   * Callback de mudança padrão do React.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Classes adicionais para o container do input.
   */
  containerClassName?: string;
  /**
   * Classes adicionais para o label.
   */
  labelClassName?: string;
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
  ...props
}: AppInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // Gerencia o valor interno para suportar formatação
  const [displayValue, setDisplayValue] = useState<string>(() => {
    const initial = value !== undefined ? value : defaultValue;
    if (formatter && initial !== undefined && initial !== null) {
      return formatter.toString(initial);
    }
    return initial !== undefined && initial !== null ? String(initial) : "";
  });

  const [isFocused, setIsFocused] = useState(false);

  // Sincroniza se a prop value externa mudar (modo controlado)
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

    // Reformatar para string canônica ao perder o foco se houver formatter
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
          className={`font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-2 select-none ${
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
            font-mono
            text-sm
            tracking-wider
            text-foreground
            bg-[#202327]
            dark:bg-[#1a1d20]
            border
            rounded-[2px]
            transition-colors
            duration-150
            outline-none
            placeholder:text-label/50
            placeholder:font-mono
            placeholder:uppercase
            disabled:opacity-40
            disabled:cursor-not-allowed
            focus:bg-secondary/3
            ${
              error
                ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                : isFocused
                  ? "border-[#56fff7] ring-1 ring-[#56fff7]/20 shadow-[0_0_10px_rgba(86,255,247,0.15)]"
                  : "border-[#3a3f47] hover:border-[#4d535e]"
            }
            ${className}
          `}
          {...props}
        />
      </div>

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

export default AppInput;

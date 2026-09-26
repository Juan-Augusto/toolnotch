"use client";

import {
  useState,
  useId,
  type TextareaHTMLAttributes,
  type ReactNode,
  type ChangeEvent,
  type FocusEvent,
} from "react";

export interface AppTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Texto ou elemento de rótulo acima do textarea.
   */
  label?: ReactNode;
  /**
   * Mensagem de erro exibida abaixo do textarea com estilo de erro.
   */
  error?: string;
  /**
   * Texto de auxílio exibido abaixo do textarea.
   */
  helperText?: string;
  /**
   * Quantidade de linhas visíveis (padrão: 4).
   */
  rows?: number;
  /**
   * Callback disparado na alteração do valor com a nova string.
   */
  onValueChange?: (value: string) => void;
  /**
   * Classes adicionais para o container do textarea.
   */
  containerClassName?: string;
  /**
   * Classes adicionais para o label.
   */
  labelClassName?: string;
  /**
   * Variante de estilo de fundo ("tertiary" | "background").
   */
  variant?: "tertiary" | "background";
  /**
   * Se true, renderiza sem borda e sem fundo.
   */
  flat?: boolean;
}

export function AppTextarea({
  label,
  error,
  helperText,
  rows = 4,
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
  variant = "tertiary",
  flat = false,
  ...props
}: AppTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const hasWidthClass = /(?:^|\s)(w-\S+|flex-1|flex-auto|flex-none|flex-initial)(?:\s|$)/.test(
    containerClassName,
  );

  return (
    <div
      className={`flex flex-col ${hasWidthClass ? "" : "w-full"} ${containerClassName}`}
    >
      {label && (
        <label
          htmlFor={textareaId}
          className={`text-xs font-semibold text-foreground mb-2 select-none ${
            disabled ? "opacity-50" : ""
          } ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <textarea
          id={textareaId}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full
            px-4
            py-2.5 sm:py-3
            text-xs sm:text-sm
            text-foreground
            rounded-[2px]
            transition-colors
            duration-150
            outline-none
            placeholder:text-label/50
            disabled:opacity-40
            disabled:cursor-not-allowed
            resize-y
            ${
              flat
                ? "bg-transparent border-0 bg-transparent! border-0! focus:bg-transparent!"
                : `border ${
                    error
                      ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20 bg-tertiary"
                      : isFocused
                        ? "border-secondary bg-secondary/5 ring-1 ring-secondary/20"
                        : `border-border hover:border-foreground/30 ${
                            variant === "background" ||
                            className.includes("bg-background")
                              ? "bg-background"
                              : "bg-tertiary"
                          } focus:border-secondary focus:bg-secondary/5 focus:ring-1 focus:ring-secondary/20`
                  }`
            }
            ${className}
          `}
          {...props}
        />
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

export default AppTextarea;

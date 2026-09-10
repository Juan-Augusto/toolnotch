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

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className={`font-mono text-xs font-semibold uppercase  text-foreground mb-2 select-none ${
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
            py-3
            font-mono
            text-sm
            
            text-foreground
            bg-tertiary
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
            resize-y
            ${
              error
                ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/20"
                : isFocused
                  ? "border-secondary ring-1 ring-secondary/20"
                  : "border-border hover:border-foreground/30"
            }
            ${className}
          `}
          {...props}
        />
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

export default AppTextarea;

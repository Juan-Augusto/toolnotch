"use client";

import {
  useState,
  useRef,
  useId,
  useCallback,
  type ReactNode,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { FileUp, File as FileIcon, X } from "lucide-react";

export interface RejectedFile {
  file: File;
  reason: "size" | "type" | "count";
}

export interface AppDropfileProps {
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  title?: ReactNode;
  description?: ReactNode;
  label?: ReactNode;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  value?: File[] | File | null;
  defaultValue?: File[] | File | null;
  onFilesChange?: (files: File[]) => void;
  onFileChange?: (file: File | null) => void;
  onReject?: (rejected: RejectedFile[]) => void;
  showSelectedFiles?: boolean;
  containerClassName?: string;
  className?: string;
  labelClassName?: string;
  id?: string;
  name?: string;
}

export function matchAccept(file: File, accept?: string): boolean {
  if (!accept || accept.trim() === "" || accept === "*") return true;

  const patterns = accept
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  if (patterns.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileType = (file.type || "").toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) {
      return fileName.endsWith(pattern);
    }
    if (pattern.endsWith("/*")) {
      const baseType = pattern.slice(0, -2);
      return fileType.startsWith(`${baseType}/`);
    }
    return fileType === pattern;
  });
}

function normalizeFiles(input?: File[] | File | null): File[] {
  if (!input) return [];
  return Array.isArray(input) ? input : [input];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function AppDropfile({
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  title,
  description,
  label,
  icon,
  error,
  helperText,
  disabled = false,
  value,
  defaultValue,
  onFilesChange,
  onFileChange,
  onReject,
  showSelectedFiles = false,
  containerClassName = "",
  className = "",
  labelClassName = "",
  id,
  name,
}: AppDropfileProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [internalFiles, setInternalFiles] = useState<File[]>(() =>
    normalizeFiles(value !== undefined ? value : defaultValue),
  );

  const isControlled = value !== undefined;
  const currentFiles = isControlled ? normalizeFiles(value) : internalFiles;

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      if (disabled) return;

      const incoming = Array.from(fileList);
      if (incoming.length === 0) return;

      const accepted: File[] = [];
      const rejected: RejectedFile[] = [];

      for (const file of incoming) {
        if (!matchAccept(file, accept)) {
          rejected.push({ file, reason: "type" });
          continue;
        }
        if (maxSize !== undefined && file.size > maxSize) {
          rejected.push({ file, reason: "size" });
          continue;
        }
        accepted.push(file);
      }

      if (!multiple) {
        const finalAccepted = accepted.slice(0, 1);
        if (accepted.length > 1) {
          for (let i = 1; i < accepted.length; i++) {
            rejected.push({ file: accepted[i], reason: "count" });
          }
        }

        if (rejected.length > 0) {
          onReject?.(rejected);
        }

        if (finalAccepted.length > 0) {
          if (!isControlled) {
            setInternalFiles(finalAccepted);
          }
          onFilesChange?.(finalAccepted);
          onFileChange?.(finalAccepted[0] ?? null);
        }
      } else {
        const newFiles: File[] = [];
        for (const file of accepted) {
          const isDuplicate = currentFiles.some(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified,
          );
          if (!isDuplicate) {
            newFiles.push(file);
          }
        }

        let combined = [...currentFiles, ...newFiles];

        if (maxFiles !== undefined && combined.length > maxFiles) {
          const availableSlots = Math.max(0, maxFiles - currentFiles.length);
          const allowedNew = newFiles.slice(0, availableSlots);
          const overflow = newFiles.slice(availableSlots);

          combined = [...currentFiles, ...allowedNew];

          for (const file of overflow) {
            rejected.push({ file, reason: "count" });
          }
        }

        if (rejected.length > 0) {
          onReject?.(rejected);
        }

        if (newFiles.length > 0) {
          if (!isControlled) {
            setInternalFiles(combined);
          }
          onFilesChange?.(combined);
          onFileChange?.(combined[0] ?? null);
        }
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [
      disabled,
      accept,
      maxSize,
      maxFiles,
      multiple,
      isControlled,
      currentFiles,
      onFilesChange,
      onFileChange,
      onReject,
    ],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer?.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    if (disabled) return;
    const updated = currentFiles.filter((_, idx) => idx !== index);
    if (!isControlled) {
      setInternalFiles(updated);
    }
    onFilesChange?.(updated);
    onFileChange?.(updated[0] ?? null);
  };

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`font-mono text-xs font-semibold uppercase  text-foreground mb-2 select-none ${
            disabled ? "opacity-50" : ""
          } ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={disabled}
        aria-label={
          typeof title === "string"
            ? title
            : multiple
              ? "Clique ou arraste arquivos aqui"
              : "Clique ou arraste o arquivo aqui"
        }
        className={`
          relative
          w-full
          flex
          flex-col
          items-center
          justify-center
          p-8
          md:p-10
          text-center
          select-none
          rounded-[2px]
          transition-all
          duration-150
          outline-none
          border-2
          border-dashed
          ${
            disabled
              ? "opacity-40 cursor-not-allowed border-border bg-tertiary/20"
              : error
                ? "border-red-500 bg-red-500/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-red-500"
                : isDragging
                  ? "border-secondary bg-secondary/10 cursor-copy scale-[1.005]"
                  : "border-secondary/70 hover:border-secondary bg-panel/40 hover:bg-secondary/5 cursor-pointer focus-visible:ring-1 focus-visible:ring-secondary focus-visible:border-secondary"
          }
          ${className}
        `}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
          tabIndex={-1}
        />

        <div className="text-secondary mb-3 flex items-center justify-center transition-transform duration-150">
          {icon ?? <FileUp className="w-8 h-8 stroke-[1.75]" />}
        </div>

        <p className="font-mono text-xs md:text-sm font-bold uppercase  text-foreground mb-1">
          {title ??
            (multiple
              ? "CLIQUE OU ARRASTE ARQUIVOS AQUI"
              : "CLIQUE OU ARRASTE O ARQUIVO AQUI")}
        </p>

        <p className="font-mono text-xs text-label/80 ">
          {description ??
            (multiple
              ? "Clique ou arraste arquivos aqui"
              : "Clique ou arraste o arquivo aqui")}
        </p>
      </div>

      {showSelectedFiles && currentFiles.length > 0 && (
        <div className="flex flex-col gap-2 mt-3 w-full">
          {currentFiles.map((file, idx) => (
            <div
              key={`${file.name}-${file.size}-${idx}`}
              className="flex items-center justify-between px-3.5 py-2.5 bg-tertiary/40 border border-border rounded-[2px]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileIcon className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-mono text-xs text-foreground truncate max-w-[200px] md:max-w-xs">
                  {file.name}
                </span>
                <span className="font-mono text-[11px] text-label shrink-0">
                  ({formatFileSize(file.size)})
                </span>
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(idx);
                  }}
                  className="text-label hover:text-red-500 transition-colors p-1 rounded-xs cursor-pointer"
                  aria-label={`Remover ${file.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

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

export default AppDropfile;

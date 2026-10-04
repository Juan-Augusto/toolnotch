"use client";

import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  ShieldCheck,
  FileCode2,
  Wand2,
  Maximize2,
  Minimize2,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import { AppSelect } from "@/components/ui/form/AppSelect";
import { AppCard } from "@/components/ui";
import {
  formatJson,
  minifyJson,
  validateJson,
  calculateJsonStats,
  tryFixJson,
  type IndentType,
} from "@/lib/dev/json";

const SAMPLE_JSON = `{
  "projeto": "ToolNotch Dev Tools",
  "versao": "2.0.0",
  "ativo": true,
  "configuracoes": {
    "ambiente": "producao",
    "timeoutMs": 5000,
    "features": [
      "cpf-generator",
      "cnpj-generator",
      "address-generator",
      "uuid-generator",
      "json-formatter"
    ]
  },
  "autor": {
    "nome": "ToolNotch Team",
    "contato": "dev@toolnotch.com"
  }
}`;

interface AppJsonFormatterProps {
  locale?: string;
}

export default function AppJsonFormatter({ locale = "pt" }: AppJsonFormatterProps) {
  const [inputJson, setInputJson] = useState(SAMPLE_JSON);
  const [indent, setIndent] = useState<IndentType>(2);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validation = useMemo(() => validateJson(inputJson), [inputJson]);
  const stats = useMemo(() => calculateJsonStats(inputJson), [inputJson]);

  const handleFormat = (customIndent?: IndentType) => {
    const useIndent = customIndent !== undefined ? customIndent : indent;
    const res = formatJson(inputJson, useIndent);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setInputJson(res.formatted);
      setErrorMessage(null);
    }
  };

  const handleMinify = () => {
    const res = minifyJson(inputJson);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setInputJson(res.minified);
      setErrorMessage(null);
    }
  };

  const handleAutoFix = () => {
    const fixed = tryFixJson(inputJson);
    const res = formatJson(fixed, indent);
    setInputJson(res.formatted);
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setErrorMessage(null);
    }
  };

  const handleClear = () => {
    setInputJson("");
    setErrorMessage(null);
  };

  const handleLoadSample = () => {
    setInputJson(SAMPLE_JSON);
    setErrorMessage(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!inputJson.trim()) return;
    const blob = new Blob([inputJson], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-${Date.now()}.json`;
    a.click;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isPt = locale === "pt";
  const isEs = locale === "es";

  const labels = {
    formatBtn: isPt ? "Formatar" : isEs ? "Formatear" : "Format",
    minifyBtn: isPt ? "Minificar" : isEs ? "Minificar" : "Minify",
    autoFixBtn: isPt ? "Auto-Corrigir" : isEs ? "Auto-Corregir" : "Auto-Fix",
    sampleBtn: isPt ? "Exemplo" : isEs ? "Ejemplo" : "Sample",
    clearBtn: isPt ? "Limpar" : isEs ? "Limpiar" : "Clear",
    copyBtn: isPt ? "Copiar" : isEs ? "Copiar" : "Copy",
    downloadBtn: isPt ? "Baixar JSON" : isEs ? "Descargar JSON" : "Download JSON",
    copied: isPt ? "Copiado!" : isEs ? "¡Copiado!" : "Copied!",
    validJson: isPt ? "JSON VÁLIDO" : isEs ? "JSON VÁLIDO" : "VALID JSON",
    invalidJson: isPt ? "ERRO DE SINTAXE" : isEs ? "ERROR DE SINTAXIS" : "SYNTAX ERROR",
    statsSize: isPt ? "Tamanho:" : isEs ? "Tamaño:" : "Size:",
    statsLines: isPt ? "Linhas:" : isEs ? "Líneas:" : "Lines:",
    statsKeys: isPt ? "Chaves:" : isEs ? "Claves:" : "Keys:",
    statsDepth: isPt ? "Profundidade:" : isEs ? "Profundidad:" : "Depth:",
    statsType: isPt ? "Tipo Raiz:" : isEs ? "Tipo Raíz:" : "Root Type:",
    placeholder: isPt
      ? "Cole ou digite seu código JSON aqui..."
      : isEs
        ? "Pega o escribe tu código JSON aquí..."
        : "Paste or type your JSON code here...",
  };

  return (
    <div className="w-full space-y-6">
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/70">
          <div className="flex flex-wrap items-center gap-2">
            <AppButton
              color="primary"
              small
              onClick={() => handleFormat()}
              className="gap-1.5 font-mono text-sm font-semibold !py-2 !px-4"
            >
              <FileCode2 className="w-4 h-4" />
              <span>{labels.formatBtn}</span>
            </AppButton>

            <div className="w-32 sm:w-36">
              <AppSelect
                size="sm"
                variant="background"
                searchable={false}
                className="font-mono text-xs sm:text-sm !bg-background !h-9 !py-1.5"
                value={String(indent)}
                options={[
                  { value: "2", label: isPt ? "2 Espaços" : "2 Spaces" },
                  { value: "4", label: isPt ? "4 Espaços" : "4 Spaces" },
                  { value: "tab", label: "Tab" },
                ]}
                onChange={(val) => {
                  const newIndent = val === "tab" ? "tab" : (Number(val) as 2 | 4);
                  setIndent(newIndent);
                  handleFormat(newIndent);
                }}
              />
            </div>

            <AppButton
              color="tertiary"
              small
              onClick={handleMinify}
              className="gap-1.5 font-mono text-sm !bg-background !py-2 !px-3.5"
            >
              <Minimize2 className="w-4 h-4" />
              <span>{labels.minifyBtn}</span>
            </AppButton>

            <AppButton
              color="tertiary"
              small
              onClick={handleAutoFix}
              className="gap-1.5 font-mono text-sm !bg-background !py-2 !px-3.5"
              title="Corrige aspas simples e vírgulas sobrando"
            >
              <Wand2 className="w-4 h-4 text-amber-500" />
              <span>{labels.autoFixBtn}</span>
            </AppButton>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AppButton
              color="tertiary"
              small
              onClick={handleLoadSample}
              className="gap-1.5 font-mono text-sm !bg-background !py-2 !px-3.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{labels.sampleBtn}</span>
            </AppButton>

            <AppButton
              color="tertiary"
              small
              onClick={handleClear}
              className="gap-1.5 font-mono text-sm text-red-500 hover:text-red-600 !bg-background !py-2 !px-3.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>{labels.clearBtn}</span>
            </AppButton>

            <AppButton
              color="tertiary"
              small
              onClick={handleCopy}
              className="gap-1.5 font-mono text-sm !bg-background !py-2 !px-3.5"
              disabled={!inputJson.trim()}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{labels.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{labels.copyBtn}</span>
                </>
              )}
            </AppButton>

            <AppButton
              color="tertiary"
              small
              onClick={handleDownload}
              className="gap-1.5 font-mono text-sm !bg-background !py-2 !px-3.5"
              disabled={!inputJson.trim()}
            >
              <Download className="w-4 h-4" />
              <span>{labels.downloadBtn}</span>
            </AppButton>
          </div>
        </div>

        {/* Editor Area */}
        <div className="pt-4 space-y-3">
          <div className="relative">
            <textarea
              value={inputJson}
              onChange={(e) => {
                setInputJson(e.target.value);
                setErrorMessage(null);
              }}
              placeholder={labels.placeholder}
              rows={16}
              spellCheck={false}
              className="w-full bg-background border border-border rounded-[2px] p-4 font-mono text-sm text-foreground focus:outline-none focus:border-primary placeholder:text-muted leading-relaxed resize-y"
            />
          </div>

          {/* Validation Status Banner */}
          {inputJson.trim().length > 0 && (
            <div
              className={`p-3 rounded-[2px] border text-sm font-mono flex items-center justify-between ${
                validation.isValid && !errorMessage
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {validation.isValid && !errorMessage ? (
                  <>
                    <FileCheck2 className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{labels.validJson}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="font-medium">
                      {labels.invalidJson}:{" "}
                      {errorMessage || validation.error?.message}
                      {validation.error?.line &&
                        ` (Linha ${validation.error.line}, Coluna ${validation.error.column})`}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Statistics Bar */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-border/70 text-sm font-mono text-label">
              <div className="p-2.5 bg-background border border-border rounded-[2px]">
                <span className="block text-xs uppercase tracking-wider text-muted font-normal mb-0.5">
                  {labels.statsSize}
                </span>
                <span className="font-semibold text-foreground">
                  {stats.sizeBytes < 1024
                    ? `${stats.sizeBytes} B`
                    : `${(stats.sizeBytes / 1024).toFixed(2)} KB`}
                </span>
              </div>

              <div className="p-2.5 bg-background border border-border rounded-[2px]">
                <span className="block text-xs uppercase tracking-wider text-muted font-normal mb-0.5">
                  {labels.statsLines}
                </span>
                <span className="font-semibold text-foreground">
                  {stats.linesCount}
                </span>
              </div>

              <div className="p-2.5 bg-background border border-border rounded-[2px]">
                <span className="block text-xs uppercase tracking-wider text-muted font-normal mb-0.5">
                  {labels.statsKeys}
                </span>
                <span className="font-semibold text-foreground">
                  {stats.keysCount}
                </span>
              </div>

              <div className="p-2.5 bg-background border border-border rounded-[2px]">
                <span className="block text-xs uppercase tracking-wider text-muted font-normal mb-0.5">
                  {labels.statsDepth}
                </span>
                <span className="font-semibold text-foreground">
                  {stats.depth} níveis
                </span>
              </div>

              <div className="p-2.5 bg-background border border-border rounded-[2px] col-span-2 sm:col-span-1">
                <span className="block text-xs uppercase tracking-wider text-muted font-normal mb-0.5">
                  {labels.statsType}
                </span>
                <span className="font-semibold text-foreground uppercase">
                  {stats.rootType}
                </span>
              </div>
            </div>
          )}
        </div>
      </AppCard>
    </div>
  );
}

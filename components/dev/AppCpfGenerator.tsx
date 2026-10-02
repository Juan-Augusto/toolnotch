"use client";

import React, { useState, useCallback, useId } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  FileCheck2,
  List,
  Sparkles,
  Search,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import { AppSwitch } from "@/components/ui/form/AppSwitch";
import { AppSelect } from "@/components/ui/form/AppSelect";
import { AppCard } from "@/components/ui";
import {
  generateSingleCpf,
  generateMultipleCpfs,
  validateCpf,
  BRAZILIAN_STATES_BY_CPF_REGION,
  formatCpf,
} from "@/lib/dev/cpf";

const DEFAULT_INITIAL_CPF = "714.283.910-64";

interface AppCpfGeneratorProps {
  locale?: string;
}

export default function AppCpfGenerator({ locale = "pt" }: AppCpfGeneratorProps) {
  const [formatted, setFormatted] = useState(true);
  const [selectedState, setSelectedState] = useState("ALL");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentCpf, setCurrentCpf] = useState(DEFAULT_INITIAL_CPF);
  const [bulkList, setBulkList] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Validator state
  const [inputValidationCpf, setInputValidationCpf] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message?: string;
  } | null>(null);

  const formattedSwitchId = useId();
  const quantitySelectId = useId();
  const stateSelectId = useId();

  const handleGenerate = useCallback(() => {
    if (quantity === 1) {
      const newCpf = generateSingleCpf({
        formatted,
        stateCode: selectedState,
      });
      setCurrentCpf(newCpf);
      setBulkList([]);
    } else {
      const list = generateMultipleCpfs(quantity, {
        formatted,
        stateCode: selectedState,
      });
      setBulkList(list);
      setCurrentCpf(list[0]);
    }
  }, [formatted, selectedState, quantity]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  const copyAllBulk = async () => {
    const text = bulkList.join("\n");
    await copyToClipboard(text, "all-bulk");
  };

  const handleValidate = (val: string) => {
    setInputValidationCpf(val);
    if (!val.trim()) {
      setValidationResult(null);
      return;
    }
    const result = validateCpf(val);
    setValidationResult(result);
  };

  const stateOptions = Object.entries(BRAZILIAN_STATES_BY_CPF_REGION).map(
    ([code, data]) => ({
      value: code,
      label: data.name,
    })
  );

  const isPt = locale === "pt";
  const isEs = locale === "es";

  const labels = {
    generateBtn: isPt
      ? "Gerar Novo CPF"
      : isEs
        ? "Generar Nuevo CPF"
        : "Generate New CPF",
    generateBulkBtn: isPt
      ? `Gerar ${quantity} CPFs`
      : isEs
        ? `Generar ${quantity} CPFs`
        : `Generate ${quantity} CPFs`,
    formatLabel: isPt
      ? "Formatar com pontuação (XXX.XXX.XXX-XX)"
      : isEs
        ? "Formatear con puntos y guion"
        : "Format with dots & dash",
    stateLabel: isPt
      ? "Estado / Região Fiscal:"
      : isEs
        ? "Estado / Región Fiscal:"
        : "State / Tax Region:",
    quantityLabel: isPt ? "Quantidade:" : isEs ? "Cantidad:" : "Quantity:",
    copied: isPt ? "Copiado!" : isEs ? "¡Copiado!" : "Copied!",
    copy: isPt ? "Copiar" : isEs ? "Copiar" : "Copy",
    copyAll: isPt ? "Copiar Todos" : isEs ? "Copiar Todos" : "Copy All",
    validateTitle: isPt
      ? "Validador de CPF em Tempo Real"
      : isEs
        ? "Validador de CPF en Tiempo Real"
        : "Real-time CPF Validator",
    validatePlaceholder: isPt
      ? "Digite ou cole um CPF para testar..."
      : isEs
        ? "Escribe o pega un CPF para probar..."
        : "Type or paste a CPF to test...",
    valid: isPt
      ? "CPF VÁLIDO (Dígitos verificadores corretos)"
      : isEs
        ? "CPF VÁLIDO (Dígitos correctos)"
        : "VALID CPF (Correct check digits)",
    invalid: isPt
      ? "CPF INVÁLIDO"
      : isEs
        ? "CPF INVÁLIDO"
        : "INVALID CPF",
  };

  return (
    <div className="w-full space-y-6">
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary">
        {/* Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-border/70 items-end">
          <div>
            <label
              htmlFor={stateSelectId}
              className="block text-xs font-semibold uppercase font-mono text-foreground mb-2"
            >
              {labels.stateLabel}
            </label>
            <AppSelect
              id={stateSelectId}
              size="sm"
              variant="background"
              className="font-mono text-xs sm:text-sm !bg-background !h-9 !py-1.5"
              value={selectedState}
              options={stateOptions}
              onChange={(val) => {
                setSelectedState(val);
              }}
            />
          </div>

          <div>
            <label
              htmlFor={quantitySelectId}
              className="block text-xs font-semibold uppercase font-mono text-foreground mb-2"
            >
              {labels.quantityLabel}
            </label>
            <AppSelect
              id={quantitySelectId}
              size="sm"
              variant="background"
              searchable={false}
              className="font-mono text-xs sm:text-sm !bg-background !h-9 !py-1.5"
              value={String(quantity)}
              options={[
                { value: "1", label: isPt ? "1 CPF" : "1 CPF" },
                { value: "5", label: "5 CPFs" },
                { value: "10", label: "10 CPFs" },
                { value: "25", label: "25 CPFs" },
                { value: "50", label: "50 CPFs" },
              ]}
              onChange={(val) => {
                setQuantity(Number(val));
              }}
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2.5 py-1 min-h-[36px]">
              <div className="shrink-0 flex items-center">
                <AppSwitch
                  id={formattedSwitchId}
                  checked={formatted}
                  onChange={(checked) => setFormatted(checked)}
                />
              </div>
              <label
                htmlFor={formattedSwitchId}
                className="text-xs font-mono font-medium text-foreground cursor-pointer select-none leading-snug break-words"
              >
                {labels.formatLabel}
              </label>
            </div>
          </div>
        </div>

        {/* Generation Output Section */}
        {quantity === 1 ? (
          <div className="pt-6 space-y-5">
            <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono font-semibold uppercase text-primary mb-1">
                  CPF GERADO:
                </div>
                <div className="text-base sm:text-lg md:text-xl font-mono font-semibold text-foreground tracking-wide select-all">
                  {currentCpf}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <AppButton
                  color="tertiary"
                  small
                  onClick={() => copyToClipboard(currentCpf, "single")}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                  icon={
                    copiedIndex === "single" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="left"
                >
                  {copiedIndex === "single" ? labels.copied : labels.copy}
                </AppButton>
              </div>
            </div>

            <div className="flex justify-center">
              <AppButton
                color="primary"
                onClick={handleGenerate}
                className="gap-2 text-xs sm:text-sm font-semibold font-mono uppercase !py-2 !px-4"
                icon={<RefreshCw className="w-4 h-4" />}
                iconPosition="left"
              >
                <span>{labels.generateBtn}</span>
              </AppButton>
            </div>
          </div>
        ) : (
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-primary" />
                {bulkList.length || quantity} CPFs Gerados
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <AppButton
                  color="tertiary"
                  small
                  onClick={copyAllBulk}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                  disabled={bulkList.length === 0}
                  icon={
                    copiedIndex === "all-bulk" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="left"
                >
                  {copiedIndex === "all-bulk" ? labels.copied : labels.copyAll}
                </AppButton>
                <AppButton
                  color="primary"
                  small
                  onClick={handleGenerate}
                  className="gap-2 text-xs font-semibold font-mono uppercase !py-1.5 !px-3.5"
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  iconPosition="left"
                >
                  <span>{labels.generateBulkBtn}</span>
                </AppButton>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-3 bg-background border border-border rounded-[2px]">
              {(bulkList.length > 0
                ? bulkList
                : generateMultipleCpfs(quantity, {
                    formatted,
                    stateCode: selectedState,
                  })
              ).map((cpf, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-tertiary border border-border/70 rounded-[2px] group"
                >
                  <span className="font-mono text-xs sm:text-sm font-semibold select-all text-foreground">
                    {cpf}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cpf, `bulk-${i}`)}
                    className="p-1 hover:bg-background rounded text-label hover:text-primary transition-colors"
                    title={labels.copy}
                  >
                    {copiedIndex === `bulk-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppCard>

      {/* Real-time CPF Validator Section */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold uppercase font-mono text-foreground">
            {labels.validateTitle}
          </h2>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputValidationCpf}
              onChange={(e) => handleValidate(e.target.value)}
              placeholder={labels.validatePlaceholder}
              className="w-full bg-background border border-border rounded-[2px] px-3.5 py-2 text-xs sm:text-sm font-mono text-foreground focus:outline-none focus:border-primary placeholder:text-muted"
            />
          </div>

          {validationResult !== null && (
            <div
              className={`p-3 rounded-[2px] border text-xs font-mono flex items-center justify-between ${
                validationResult.isValid
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <FileCheck2 className="w-4 h-4 shrink-0 text-emerald-500" />
                ) : (
                  <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />
                )}
                <span>
                  {validationResult.isValid
                    ? `${labels.valid} — Formato: ${formatCpf(inputValidationCpf)}`
                    : `${labels.invalid}: ${validationResult.message}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </AppCard>
    </div>
  );
}

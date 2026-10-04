"use client";

import React, { useState, useCallback, useId } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Hash,
  Download,
  List,
  ShieldCheck,
  FileCheck2,
  Sliders,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import { AppSwitch } from "@/components/ui/form/AppSwitch";
import { AppSelect } from "@/components/ui/form/AppSelect";
import {
  AppSegmentedControl,
  type SegmentOption,
} from "@/components/ui/form/AppSegmentedControl";
import { AppCard } from "@/components/ui";
import {
  generateSingleUuid,
  generateMultipleUuids,
  validateUuid,
  type UuidVersion,
  type GenerateUuidOptions,
} from "@/lib/dev/uuid";

const DEFAULT_INITIAL_UUID = "4a1b2c3d-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

interface AppUuidGeneratorProps {
  locale?: string;
}

export default function AppUuidGenerator({ locale = "pt" }: AppUuidGeneratorProps) {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [urn, setUrn] = useState(false);
  const [quotes, setQuotes] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const [currentUuid, setCurrentUuid] = useState(DEFAULT_INITIAL_UUID);
  const [bulkList, setBulkList] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Validator state
  const [validateInput, setValidateInput] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    version?: number;
  } | null>(null);

  const uppercaseSwitchId = useId();
  const hyphensSwitchId = useId();
  const bracesSwitchId = useId();
  const urnSwitchId = useId();
  const quotesSwitchId = useId();
  const quantitySelectId = useId();

  const options: GenerateUuidOptions = {
    version,
    uppercase,
    hyphens,
    braces,
    urn,
    quotes,
  };

  const handleGenerate = useCallback(() => {
    if (quantity === 1) {
      const uuid = generateSingleUuid(options);
      setCurrentUuid(uuid);
      setBulkList([]);
    } else {
      const list = generateMultipleUuids(quantity, options);
      setBulkList(list);
      setCurrentUuid(list[0]);
    }
  }, [options, quantity]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const copyAllBulk = async () => {
    const text = bulkList.join("\n");
    await copyToClipboard(text, "all-bulk");
  };

  const downloadBulkTxt = () => {
    const text = (bulkList.length > 0 ? bulkList : [currentUuid]).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${version}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleValidate = (val: string) => {
    setValidateInput(val);
    if (!val.trim()) {
      setValidationResult(null);
      return;
    }
    const res = validateUuid(val);
    setValidationResult(res);
  };

  const isPt = locale === "pt";
  const isEs = locale === "es";

  const versionOptions: SegmentOption[] = [
    { value: "v4", label: "UUID v4 (Aleatório)" },
    { value: "v7", label: "UUID v7 (Time-Ordered / RFC 9562)" },
    { value: "v1", label: "UUID v1 (Timestamp)" },
  ];

  const labels = {
    generateBtn: isPt
      ? "Gerar Novo UUID"
      : isEs
        ? "Generar Nuevo UUID"
        : "Generate New UUID",
    generateBulkBtn: isPt
      ? `Gerar ${quantity} UUIDs`
      : isEs
        ? `Generar ${quantity} UUIDs`
        : `Generate ${quantity} UUIDs`,
    quantityLabel: isPt ? "Quantidade:" : isEs ? "Cantidad:" : "Quantity:",
    versionLabel: isPt ? "Versão do UUID:" : isEs ? "Versión del UUID:" : "UUID Version:",
    uppercaseLabel: isPt ? "MAIÚSCULAS" : isEs ? "MAYÚSCULAS" : "UPPERCASE",
    hyphensLabel: isPt ? "Hífens" : isEs ? "Guiones" : "Hyphens",
    bracesLabel: isPt ? "Chaves { }" : isEs ? "Llaves { }" : "Braces { }",
    urnLabel: isPt ? "Prefixo URN (urn:uuid:)" : isEs ? "Prefijo URN" : "URN Prefix",
    quotesLabel: isPt ? "Aspas \" \"" : isEs ? "Comillas \" \"" : "Quotes \" \"",
    copied: isPt ? "Copiado!" : isEs ? "¡Copiado!" : "Copied!",
    copy: isPt ? "Copiar" : isEs ? "Copiar" : "Copy",
    copyAll: isPt ? "Copiar Todos" : isEs ? "Copiar Todos" : "Copy All",
    downloadTxt: isPt ? "Baixar .TXT" : isEs ? "Descargar .TXT" : "Download .TXT",
    validateTitle: isPt
      ? "Validador e Inspetor de UUID"
      : isEs
        ? "Validador e Inspector de UUID"
        : "UUID Validator & Inspector",
    validatePlaceholder: isPt
      ? "Cole um UUID para validar formato e versão..."
      : isEs
        ? "Pega un UUID para validar formato y versión..."
        : "Paste a UUID to check validity and version...",
    valid: isPt
      ? "UUID VÁLIDO"
      : isEs
        ? "UUID VÁLIDO"
        : "VALID UUID",
    invalid: isPt
      ? "UUID INVÁLIDO (Sintaxe fora do padrão RFC)"
      : isEs
        ? "UUID INVÁLIDO"
        : "INVALID UUID",
  };

  return (
    <div className="w-full space-y-6">
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary">
        {/* Version Selector */}
        <div className="space-y-4 pb-5 border-b border-border/70">
          <div>
            <label className="block text-xs font-semibold uppercase font-mono text-foreground mb-2">
              {labels.versionLabel}
            </label>
            <AppSegmentedControl
              size="sm"
              fontWeight="medium"
              options={versionOptions}
              value={version}
              onChange={(val) => setVersion(val as UuidVersion)}
            />
          </div>

          {/* Options Toggles */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2.5">
              <label
                htmlFor={quantitySelectId}
                className="text-xs font-semibold uppercase font-mono text-foreground shrink-0"
              >
                {labels.quantityLabel}
              </label>
              <div className="w-32 sm:w-36">
                <AppSelect
                  id={quantitySelectId}
                  size="sm"
                  variant="background"
                  searchable={false}
                  className="font-mono text-xs sm:text-sm !bg-background !h-9 !py-1.5"
                  value={String(quantity)}
                  options={[
                    { value: "1", label: "1 UUID" },
                    { value: "5", label: "5 UUIDs" },
                    { value: "10", label: "10 UUIDs" },
                    { value: "25", label: "25 UUIDs" },
                    { value: "50", label: "50 UUIDs" },
                    { value: "100", label: "100 UUIDs" },
                  ]}
                  onChange={(val) => setQuantity(Number(val))}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <div className="flex items-center gap-2">
                <AppSwitch
                  id={uppercaseSwitchId}
                  checked={uppercase}
                  onChange={(c) => setUppercase(c)}
                />
                <label htmlFor={uppercaseSwitchId} className="text-xs font-mono font-medium cursor-pointer text-foreground select-none">
                  {labels.uppercaseLabel}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <AppSwitch
                  id={hyphensSwitchId}
                  checked={hyphens}
                  onChange={(c) => setHyphens(c)}
                />
                <label htmlFor={hyphensSwitchId} className="text-xs font-mono font-medium cursor-pointer text-foreground select-none">
                  {labels.hyphensLabel}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <AppSwitch
                  id={bracesSwitchId}
                  checked={braces}
                  onChange={(c) => setBraces(c)}
                />
                <label htmlFor={bracesSwitchId} className="text-xs font-mono font-medium cursor-pointer text-foreground select-none">
                  {labels.bracesLabel}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <AppSwitch
                  id={urnSwitchId}
                  checked={urn}
                  onChange={(c) => setUrn(c)}
                />
                <label htmlFor={urnSwitchId} className="text-xs font-mono font-medium cursor-pointer text-foreground select-none">
                  {labels.urnLabel}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <AppSwitch
                  id={quotesSwitchId}
                  checked={quotes}
                  onChange={(c) => setQuotes(c)}
                />
                <label htmlFor={quotesSwitchId} className="text-xs font-mono font-medium cursor-pointer text-foreground select-none">
                  {labels.quotesLabel}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Output Area */}
        {quantity === 1 ? (
          <div className="pt-6 pb-2 text-center">
            <div className="inline-flex flex-col items-center max-w-full">
              <span className="text-xs font-semibold uppercase font-mono text-foreground mb-2">
                {version.toUpperCase()} Identifier
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 bg-background border border-border rounded-[2px] px-4 py-3 sm:px-6 sm:py-3.5 max-w-full">
                <span className="text-sm sm:text-base md:text-lg font-mono font-medium tracking-wide text-foreground select-all break-all">
                  {currentUuid}
                </span>
                <AppButton
                  color="tertiary"
                  small
                  onClick={() => copyToClipboard(currentUuid, "single")}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3 shrink-0"
                  icon={
                    copiedKey === "single" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="left"
                >
                  {copiedKey === "single" ? labels.copied : labels.copy}
                </AppButton>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <AppButton
                color="primary"
                onClick={handleGenerate}
                className="gap-2 text-xs sm:text-sm font-semibold font-mono uppercase !py-2.5 !px-5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{labels.generateBtn}</span>
              </AppButton>
            </div>
          </div>
        ) : (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-primary" />
                {bulkList.length || quantity} UUIDs Gerados
              </span>
              <div className="flex flex-wrap gap-2">
                <AppButton
                  color="tertiary"
                  small
                  onClick={downloadBulkTxt}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                  icon={<Download className="w-3.5 h-3.5" />}
                  iconPosition="left"
                >
                  {labels.downloadTxt}
                </AppButton>
                <AppButton
                  color="tertiary"
                  small
                  onClick={copyAllBulk}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                  disabled={bulkList.length === 0}
                  icon={
                    copiedKey === "all-bulk" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="left"
                >
                  {copiedKey === "all-bulk" ? labels.copied : labels.copyAll}
                </AppButton>
                <AppButton
                  color="primary"
                  small
                  onClick={handleGenerate}
                  className="gap-1.5 text-xs sm:text-sm font-mono font-semibold !py-2 !px-4"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{labels.generateBulkBtn}</span>
                </AppButton>
              </div>
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto p-3 bg-background border border-border rounded-[2px]">
              {(bulkList.length > 0
                ? bulkList
                : generateMultipleUuids(quantity, options)
              ).map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-tertiary border border-border/70 rounded-[2px] group"
                >
                  <span className="font-mono text-xs sm:text-sm font-normal select-all text-foreground break-all">
                    {uuid}
                  </span>
                  <button
                    onClick={() => copyToClipboard(uuid, `bulk-${i}`)}
                    className="p-1 hover:bg-background rounded text-label hover:text-primary transition-colors shrink-0 ml-2"
                    title={labels.copy}
                  >
                    {copiedKey === `bulk-${i}` ? (
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

      {/* UUID Validator */}
      <AppCard border className="p-5 sm:p-6 bg-tertiary">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <h2 className="text-xs font-semibold uppercase font-mono text-foreground">
            {labels.validateTitle}
          </h2>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={validateInput}
            onChange={(e) => handleValidate(e.target.value)}
            placeholder={labels.validatePlaceholder}
            className="w-full bg-background border border-border rounded-[2px] px-3.5 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary placeholder:text-muted"
          />

          {validationResult !== null && (
            <div
              className={`p-3.5 rounded-[2px] border text-sm font-mono flex items-center justify-between ${
                validationResult.isValid
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <FileCheck2 className="w-4 h-4 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {validationResult.isValid
                    ? `${labels.valid} - Versão identificada: RFC 4122 / 9562 Version ${validationResult.version}`
                    : labels.invalid}
                </span>
              </div>
            </div>
          )}
        </div>
      </AppCard>
    </div>
  );
}

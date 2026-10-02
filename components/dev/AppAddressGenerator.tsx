"use client";

import React, { useState, useCallback, useId } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  MapPin,
  List,
  Code2,
  FileText,
  Search,
  Loader2,
  Globe2,
  AlertTriangle,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import { AppSwitch } from "@/components/ui/form/AppSwitch";
import { AppSelect } from "@/components/ui/form/AppSelect";
import { AppCard } from "@/components/ui";
import {
  generateSingleAddress,
  generateMultipleAddresses,
  generateAddressFromApi,
  generateMultipleAddressesFromApi,
  fetchAddressFromApi,
  formatAddressLine,
  UF_LIST,
  type BrazilianAddress,
} from "@/lib/dev/address";

const DEFAULT_INITIAL_ADDRESS: BrazilianAddress = {
  cep: "01310-100",
  cepUnformatted: "01310100",
  logradouro: "Avenida Paulista",
  numero: "1578",
  complemento: "Apto 42",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  uf: "SP",
  estadoNome: "São Paulo",
  regiao: "Sudeste",
  ddd: "11",
};

interface AppAddressGeneratorProps {
  locale?: string;
}

export default function AppAddressGenerator({ locale = "pt" }: AppAddressGeneratorProps) {
  const [selectedUf, setSelectedUf] = useState("ALL");
  const [withComplement, setWithComplement] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentAddress, setCurrentAddress] = useState<BrazilianAddress>(DEFAULT_INITIAL_ADDRESS);
  const [bulkList, setBulkList] = useState<BrazilianAddress[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // CEP Lookup State
  const [cepQuery, setCepQuery] = useState("");
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepResult, setCepResult] = useState<BrazilianAddress | null>(null);
  const [cepError, setCepError] = useState<string | null>(null);

  const complementSwitchId = useId();
  const ufSelectId = useId();
  const quantitySelectId = useId();

  const isPt = locale === "pt";
  const isEs = locale === "es";

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGeneratorError(null);
    try {
      if (quantity === 1) {
        const addr = await generateAddressFromApi({ uf: selectedUf, withComplement });
        setCurrentAddress(addr);
        setBulkList([]);
      } else {
        const list = await generateMultipleAddressesFromApi(quantity, {
          uf: selectedUf,
          withComplement,
        });
        setBulkList(list);
        setCurrentAddress(list[0]);
      }
    } catch {
      // Graceful fallback to offline generator if API fails
      if (quantity === 1) {
        const fallbackAddr = generateSingleAddress({ uf: selectedUf, withComplement });
        setCurrentAddress(fallbackAddr);
        setBulkList([]);
      } else {
        const fallbackList = generateMultipleAddresses(quantity, {
          uf: selectedUf,
          withComplement,
        });
        setBulkList(fallbackList);
        setCurrentAddress(fallbackList[0]);
      }
      setGeneratorError(
        isPt
          ? "Instabilidade na API externa dos Correios/BrasilAPI. Endereço gerado via base local de contingência."
          : "Postal API connection error. Address generated using local contingency database."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [selectedUf, withComplement, quantity, isPt]);

  const formatCepInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const handleSearchCep = async (targetCep?: string) => {
    const rawCep = targetCep !== undefined ? targetCep : cepQuery;
    const clean = rawCep.replace(/\D/g, "");
    if (clean.length !== 8) {
      const errMsg = isPt
        ? "Digite um CEP válido com 8 dígitos (ex: 01310-100)."
        : "Enter a valid 8-digit postal code (e.g. 01310-100).";
      setGeneratorError(errMsg);
      setCepError(errMsg);
      return;
    }
    setIsGenerating(true);
    setIsSearchingCep(true);
    setGeneratorError(null);
    setCepError(null);
    try {
      const result = await fetchAddressFromApi(clean);
      setQuantity(1);
      setCurrentAddress(result);
      setBulkList([]);
      setCepResult(result);
      setCepQuery(result.cep !== "-" ? result.cep : clean);
      if (result.uf && result.uf !== "-") {
        setSelectedUf(result.uf);
      }
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : isPt
            ? "CEP não encontrado ou erro na consulta à API dos Correios."
            : "Postal code not found or error querying postal API.";
      setGeneratorError(errMsg);
      setCepError(errMsg);
      setCepResult(null);
    } finally {
      setIsGenerating(false);
      setIsSearchingCep(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const copyAddressFull = () => {
    const line = formatAddressLine(currentAddress);
    copyToClipboard(line, "full-address");
  };

  const copyAddressAsJson = () => {
    const jsonStr = JSON.stringify(currentAddress, null, 2);
    copyToClipboard(jsonStr, "address-json");
  };

  const copyAllBulk = async () => {
    const text = bulkList.map(formatAddressLine).join("\n");
    await copyToClipboard(text, "all-bulk");
  };

  const labels = {
    generateBtn: isPt
      ? "Gerar Novo Endereço"
      : isEs
        ? "Generar Nueva Dirección"
        : "Generate New Address",
    generateBulkBtn: isPt
      ? `Gerar ${quantity} Endereços`
      : isEs
        ? `Generar ${quantity} Direcciones`
        : `Generate ${quantity} Addresses`,
    ufLabel: isPt ? "Estado / UF:" : isEs ? "Estado / UF:" : "State / UF:",
    quantityLabel: isPt ? "Quantidade:" : isEs ? "Cantidad:" : "Quantity:",
    complementLabel: isPt
      ? "Gerar com complemento (Apto/Sala)"
      : isEs
        ? "Incluir complemento (Apto/Oficina)"
        : "Include apartment / suite",
    copied: isPt ? "Copiado!" : isEs ? "¡Copiado!" : "Copied!",
    copy: isPt ? "Copiar" : isEs ? "Copiar" : "Copy",
    copyFull: isPt
      ? "Copiar Linha Completa"
      : isEs
        ? "Copiar Dirección Completa"
        : "Copy Full Address",
    copyJson: isPt ? "Copiar JSON" : isEs ? "Copiar JSON" : "Copy JSON",
    copyAll: isPt ? "Copiar Todos" : isEs ? "Copiar Todos" : "Copy All",
    cepLookupTitle: isPt
      ? "Consultar CEP Oficial (Correios / BrasilAPI)"
      : isEs
        ? "Consultar Código Postal Oficial"
        : "Official Postal Code Lookup (Correios / BrasilAPI)",
    cepLookupPlaceholder: isPt
      ? "Digite o CEP (ex: 01310-100)..."
      : isEs
        ? "Ingrese el código postal..."
        : "Type postal code (e.g. 01310-100)...",
    searchBtn: isPt ? "Consultar CEP" : isEs ? "Buscar" : "Lookup CEP",
  };

  const ufOptions = UF_LIST.map((item) => ({
    value: item.uf,
    label: item.name,
  }));

  return (
    <div className="w-full space-y-6">
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary">
        {/* Direct CEP Search Bar */}
        <div className="pb-5 border-b border-border/70 space-y-3">
          <label className="block text-xs font-semibold uppercase font-mono text-foreground">
            {isPt ? "Buscar por CEP Específico:" : isEs ? "Consultar por Código Postal:" : "Lookup Specific Postal Code (CEP):"}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={cepQuery}
                onChange={(e) => setCepQuery(formatCepInput(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchCep();
                }}
                maxLength={9}
                placeholder={labels.cepLookupPlaceholder}
                className="w-full bg-background border border-border rounded-[2px] px-3.5 py-2 text-xs sm:text-sm font-mono text-foreground focus:outline-none focus:border-primary placeholder:text-muted"
              />
              {cepQuery && (
                <button
                  type="button"
                  onClick={() => setCepQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs font-mono p-1"
                >
                  ✕
                </button>
              )}
            </div>

            <AppButton
              color="primary"
              onClick={() => handleSearchCep()}
              disabled={isGenerating || isSearchingCep || !cepQuery.trim()}
              className="gap-2 text-xs sm:text-sm font-semibold font-mono uppercase !py-2 !px-4 shrink-0"
            >
              {isSearchingCep || isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{labels.searchBtn}</span>
            </AppButton>
          </div>

          {/* Quick Sample CEPs */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs font-mono text-label uppercase font-semibold mr-1">
              {isPt ? "Exemplos:" : "Samples:"}
            </span>
            {[
              { cep: "01310-100", label: "01310-100 (Av. Paulista)" },
              { cep: "22070-000", label: "22070-000 (Copacabana)" },
              { cep: "30130-005", label: "30130-005 (BH/Savassi)" },
              { cep: "70040-010", label: "70040-010 (Brasília)" },
              { cep: "40026-010", label: "40026-010 (Salvador)" },
              { cep: "80020-010", label: "80020-010 (Curitiba)" },
            ].map((item) => (
              <AppButton
                key={item.cep}
                color="tertiary"
                small
                className="!bg-background text-xs font-mono !font-medium !normal-case !py-1 !px-2.5"
                onClick={() => {
                  setCepQuery(item.cep);
                  handleSearchCep(item.cep);
                }}
              >
                {item.label}
              </AppButton>
            ))}
          </div>
        </div>

        {/* Generator Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-b border-border/70">
          <div>
            <label
              htmlFor={ufSelectId}
              className="block text-xs font-semibold uppercase font-mono text-foreground mb-2"
            >
              {labels.ufLabel}
            </label>
            <AppSelect
              id={ufSelectId}
              size="sm"
              variant="background"
              className="font-mono text-xs sm:text-sm !bg-background !h-9 !py-1.5"
              value={selectedUf}
              options={ufOptions}
              onChange={(val) => setSelectedUf(val)}
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
                { value: "1", label: isPt ? "1 Endereço" : "1 Address" },
                { value: "5", label: "5 Endereços" },
                { value: "10", label: "10 Endereços" },
                { value: "20", label: "20 Endereços" },
              ]}
              onChange={(val) => setQuantity(Number(val))}
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2.5 py-1 min-h-[36px]">
              <div className="shrink-0 flex items-center">
                <AppSwitch
                  id={complementSwitchId}
                  checked={withComplement}
                  onChange={(checked) => setWithComplement(checked)}
                />
              </div>
              <label
                htmlFor={complementSwitchId}
                className="text-xs font-mono font-medium text-foreground cursor-pointer select-none leading-snug break-words"
              >
                {labels.complementLabel}
              </label>
            </div>
          </div>
        </div>

        {/* Error Fallback Banner */}
        {generatorError && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-[2px] text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{generatorError}</span>
          </div>
        )}

        {quantity === 1 ? (
          <div className="pt-6 space-y-5">
            {/* Header / Address preview */}
            <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {isGenerating ? (
                <div className="space-y-2 w-full max-w-md animate-pulse">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span className="text-xs font-mono text-primary font-semibold uppercase">Consultando API Oficial...</span>
                  </div>
                  <div className="h-6 w-3/4 bg-border/60 rounded-[2px]" />
                  <div className="h-4 w-1/2 bg-border/40 rounded-[2px]" />
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>CEP: {currentAddress.cep}</span>
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-mono font-semibold text-foreground tracking-wide select-all">
                    {formatAddressLine(currentAddress)}
                  </div>
                  {(currentAddress.regiao !== "-" || currentAddress.ddd !== "-") && (
                    <div className="text-sm text-label font-mono mt-1">
                      {currentAddress.regiao && currentAddress.regiao !== "-" ? `Região ${currentAddress.regiao}` : ""}
                      {currentAddress.regiao && currentAddress.regiao !== "-" && currentAddress.ddd && currentAddress.ddd !== "-" ? " • " : ""}
                      {currentAddress.ddd && currentAddress.ddd !== "-" ? `DDD (${currentAddress.ddd})` : ""}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <AppButton
                  color="tertiary"
                  small
                  onClick={copyAddressFull}
                  disabled={isGenerating}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                  icon={
                    copiedKey === "full-address" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="left"
                >
                  {copiedKey === "full-address" ? labels.copied : labels.copyFull}
                </AppButton>

                <AppButton
                  color="tertiary"
                  small
                  onClick={copyAddressAsJson}
                  disabled={isGenerating}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                  icon={
                    copiedKey === "address-json" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Code2 className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="left"
                >
                  {copiedKey === "address-json" ? labels.copied : labels.copyJson}
                </AppButton>
              </div>
            </div>

            {/* Individual Breakdown fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">CEP:</span>
                  {currentAddress.cep && currentAddress.cep !== "-" && (
                    <button
                      onClick={() => copyToClipboard(currentAddress.cep, "cep")}
                      disabled={isGenerating}
                      className="text-label hover:text-primary p-0.5"
                    >
                      {copiedKey === "cep" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-24 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : (
                    currentAddress.cep || "-"
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">Logradouro:</span>
                  {currentAddress.logradouro && currentAddress.logradouro !== "-" && (
                    <button
                      onClick={() => copyToClipboard(currentAddress.logradouro, "logradouro")}
                      disabled={isGenerating}
                      className="text-label hover:text-primary p-0.5"
                    >
                      {copiedKey === "logradouro" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-48 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : (
                    currentAddress.logradouro || "-"
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">Número:</span>
                  {currentAddress.numero && currentAddress.numero !== "-" && (
                    <button
                      onClick={() => copyToClipboard(currentAddress.numero, "numero")}
                      disabled={isGenerating}
                      className="text-label hover:text-primary p-0.5"
                    >
                      {copiedKey === "numero" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-16 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : (
                    currentAddress.numero || "-"
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">Complemento:</span>
                  {currentAddress.complemento && currentAddress.complemento !== "-" && (
                    <button
                      onClick={() => copyToClipboard(currentAddress.complemento || "", "comp")}
                      disabled={isGenerating}
                      className="text-label hover:text-primary p-0.5"
                    >
                      {copiedKey === "comp" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-20 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : (
                    currentAddress.complemento || "-"
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">Bairro:</span>
                  {currentAddress.bairro && currentAddress.bairro !== "-" && (
                    <button
                      onClick={() => copyToClipboard(currentAddress.bairro, "bairro")}
                      disabled={isGenerating}
                      className="text-label hover:text-primary p-0.5"
                    >
                      {copiedKey === "bairro" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-28 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : (
                    currentAddress.bairro || "-"
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">Cidade:</span>
                  {currentAddress.cidade && currentAddress.cidade !== "-" && (
                    <button
                      onClick={() => copyToClipboard(currentAddress.cidade, "cidade")}
                      disabled={isGenerating}
                      className="text-label hover:text-primary p-0.5"
                    >
                      {copiedKey === "cidade" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-32 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : (
                    currentAddress.cidade || "-"
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">Estado (UF):</span>
                  {currentAddress.uf && currentAddress.uf !== "-" && (
                    <button
                      onClick={() => copyToClipboard(currentAddress.uf, "uf")}
                      disabled={isGenerating}
                      className="text-label hover:text-primary p-0.5"
                    >
                      {copiedKey === "uf" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-28 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : currentAddress.estadoNome && currentAddress.estadoNome !== "-" && currentAddress.uf && currentAddress.uf !== "-" ? (
                    `${currentAddress.estadoNome} (${currentAddress.uf})`
                  ) : currentAddress.uf && currentAddress.uf !== "-" ? (
                    currentAddress.uf
                  ) : currentAddress.estadoNome && currentAddress.estadoNome !== "-" ? (
                    currentAddress.estadoNome
                  ) : (
                    "-"
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">DDD Telefônico:</span>
                </div>
                <div className="font-normal text-sm text-foreground select-all font-mono">
                  {isGenerating ? (
                    <div className="h-5 w-20 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                  ) : currentAddress.ddd && currentAddress.ddd !== "-" ? (
                    `DDD ${currentAddress.ddd}`
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <AppButton
                color="primary"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="gap-2 text-xs sm:text-sm font-semibold font-mono uppercase !py-2.5 !px-5"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>{labels.generateBtn}</span>
              </AppButton>
            </div>
          </div>
        ) : (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-primary" />
                {bulkList.length || quantity} Endereços Gerados
              </span>
              <div className="flex gap-2">
                <AppButton
                  color="tertiary"
                  small
                  onClick={copyAllBulk}
                  className="gap-1.5 text-xs font-mono font-normal !bg-background !py-1.5 !px-3"
                  disabled={bulkList.length === 0 || isGenerating}
                >
                  {copiedKey === "all-bulk" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{labels.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{labels.copyAll}</span>
                    </>
                  )}
                </AppButton>
                <AppButton
                  color="primary"
                  small
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="gap-1.5 text-xs sm:text-sm font-mono font-semibold !py-2 !px-4"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>{labels.generateBulkBtn}</span>
                </AppButton>
              </div>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto p-3 bg-background border border-border rounded-[2px]">
              {isGenerating ? (
                Array.from({ length: Math.min(quantity, 5) }).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="p-3 bg-tertiary border border-border/70 rounded-[2px] flex items-center justify-between gap-3 animate-pulse"
                  >
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-border/60 rounded-[2px] w-3/4" />
                      <div className="h-3 bg-border/40 rounded-[2px] w-1/3" />
                    </div>
                  </div>
                ))
              ) : (
                (bulkList.length > 0
                  ? bulkList
                  : generateMultipleAddresses(quantity, {
                      uf: selectedUf,
                      withComplement,
                    })
                ).map((addr, i) => {
                  const line = formatAddressLine(addr);
                  return (
                    <div
                      key={i}
                      className="p-3 bg-tertiary border border-border/70 rounded-[2px] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-mono text-sm font-semibold select-all text-foreground truncate">
                          {line}
                        </div>
                        <div className="text-xs font-mono text-label">
                          CEP: {addr.cep} • {addr.cidade}/{addr.uf}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(line, `bulk-addr-${i}`)}
                        className="p-1.5 hover:bg-background rounded text-label hover:text-primary transition-colors shrink-0"
                        title={labels.copy}
                      >
                        {copiedKey === `bulk-addr-${i}` ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </AppCard>
    </div>
  );
}

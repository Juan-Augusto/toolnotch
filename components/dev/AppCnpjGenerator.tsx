"use client";

import React, { useState, useCallback, useId, useEffect } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Building2,
  ShieldCheck,
  Code2,
  List,
  Search,
  Loader2,
  AlertTriangle,
  FileText,
  Users,
} from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import { AppSwitch } from "@/components/ui/form/AppSwitch";
import { AppSelect } from "@/components/ui/form/AppSelect";
import { AppCard } from "@/components/ui";
import {
  generateSingleCnpj,
  generateMultipleCnpjs,
  generateCompanyDetails,
  generateCompanyFromApi,
  generateMultipleCompaniesFromApi,
  fetchCompanyFromApi,
  validateCnpj,
  formatCnpj,
  unformatCnpj,
  UF_CNPJ_LIST,
  type CompanyDetailsWithQsa,
} from "@/lib/dev/cnpj";

const DEFAULT_INITIAL_COMPANY: CompanyDetailsWithQsa = {
  cnpj: "18.236.120/0001-58",
  cnpjUnformatted: "18236120000158",
  razaoSocial: "NU PAGAMENTOS S.A. - INSTITUICAO DE PAGAMENTO",
  nomeFantasia: "NUBANK",
  inscricaoEstadual: "-",
  dataAbertura: "06/05/2013",
  situacaoCadastral: "ATIVA",
  naturezaJuridica: "205-4 - Sociedade Anônima Fechada",
  regimeTributario: "Demais (Lucro Presumido / Real)",
  capitalSocial: "R$ 4.566.216.597,00",
  cnaePrincipal: {
    codigo: "6462-0/00",
    descricao: "Holdings de instituições não-financeiras",
  },
  telefone: "(11) 3631-9300",
  email: "toc@nubank.com.br",
  endereco: {
    logradouro: "Rua Capote Valente",
    numero: "39",
    complemento: "-",
    bairro: "Pinheiros",
    cidade: "São Paulo",
    uf: "SP",
    cep: "05409-000",
  },
  qsa: [
    { nome: "David Velez Osorno", qualificacao: "Diretor Presidente" },
    { nome: "Cristina Junqueira", qualificacao: "Diretor" },
  ],
};

const SAMPLE_REAL_COMPANIES = [
  { name: "Nubank", cnpj: "18.236.120/0001-58" },
  { name: "Petrobras", cnpj: "33.000.167/0001-01" },
  { name: "Banco do Brasil", cnpj: "00.000.000/0001-91" },
  { name: "Google Brasil", cnpj: "06.990.590/0001-23" },
  { name: "Magazine Luiza", cnpj: "47.960.950/0001-21" },
  { name: "O Boticário", cnpj: "76.483.817/0001-20" },
  { name: "WEG Equipamentos", cnpj: "84.429.695/0001-11" },
  { name: "Localiza", cnpj: "17.262.213/0001-94" },
  { name: "Banco Inter", cnpj: "17.155.730/0001-64" },
  { name: "Suzano", cnpj: "15.144.017/0001-90" },
];

interface AppCnpjGeneratorProps {
  locale?: string;
}

export default function AppCnpjGenerator({ locale = "pt" }: AppCnpjGeneratorProps) {
  const [selectedUf, setSelectedUf] = useState("ALL");
  const [formatted, setFormatted] = useState(true);
  const [includeCompanyData, setIncludeCompanyData] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [company, setCompany] = useState<CompanyDetailsWithQsa>(DEFAULT_INITIAL_COMPANY);
  const [bulkList, setBulkList] = useState<CompanyDetailsWithQsa[]>([]);
  const [bulkCnpjOnly, setBulkCnpjOnly] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  // Search state
  const [cnpjQuery, setCnpjQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Validator state
  const [inputValidationCnpj, setInputValidationCnpj] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message?: string;
  } | null>(null);

  const formattedSwitchId = useId();
  const companyDataSwitchId = useId();
  const ufSelectId = useId();
  const quantitySelectId = useId();

  const isPt = locale === "pt";
  const isEs = locale === "es";

  const formatCnpjInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  };

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGeneratorError(null);
    try {
      if (includeCompanyData) {
        if (quantity === 1) {
          const newCompany = await generateCompanyFromApi({ uf: selectedUf, formatted });
          setCompany(newCompany);
          setBulkList([]);
          setBulkCnpjOnly([]);
        } else {
          const list = await generateMultipleCompaniesFromApi(quantity, {
            uf: selectedUf,
            formatted,
          });
          setBulkList(list);
          setBulkCnpjOnly([]);
          setCompany(list[0]);
        }
      } else {
        if (quantity === 1) {
          const single = generateSingleCnpj({ formatted });
          const simpleComp: CompanyDetailsWithQsa = {
            cnpj: single,
            cnpjUnformatted: unformatCnpj(single),
            razaoSocial: "--",
            nomeFantasia: "--",
            inscricaoEstadual: "--",
            dataAbertura: "--",
            situacaoCadastral: "--",
            naturezaJuridica: "--",
            regimeTributario: "--",
            capitalSocial: "--",
            cnaePrincipal: { codigo: "--", descricao: "--" },
            telefone: "--",
            email: "--",
            endereco: { logradouro: "--", numero: "--", bairro: "--", cidade: "--", uf: "--", cep: "--" },
            qsa: [],
          };
          setCompany(simpleComp);
          setBulkList([]);
          setBulkCnpjOnly([]);
        } else {
          const list = generateMultipleCnpjs(quantity, { formatted });
          setBulkCnpjOnly(list);
          setBulkList([]);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsGenerating(false);
    }
  }, [selectedUf, formatted, includeCompanyData, quantity]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleSearchCnpj = async (targetCnpj?: string) => {
    const raw = targetCnpj !== undefined ? targetCnpj : cnpjQuery;
    const clean = unformatCnpj(raw);
    if (clean.length !== 14) {
      setGeneratorError(
        isPt
          ? "Digite um CNPJ válido com 14 dígitos (ex: 18.236.120/0001-58)."
          : "Enter a valid 14-digit CNPJ (e.g. 18.236.120/0001-58)."
      );
      return;
    }
    setIsGenerating(true);
    setIsSearching(true);
    setGeneratorError(null);
    try {
      const result = await fetchCompanyFromApi(clean);
      if (!formatted) {
        result.cnpj = result.cnpjUnformatted;
      }
      setQuantity(1);
      setCompany(result);
      setBulkList([]);
      setBulkCnpjOnly([]);
      setCnpjQuery(result.cnpj);
      if (result.endereco?.uf && result.endereco.uf !== "-") {
        setSelectedUf(result.endereco.uf);
      }
    } catch (err) {
      const formattedCnpj = formatted ? formatCnpj(clean) : clean;
      const notFoundCompany: CompanyDetailsWithQsa = {
        cnpj: formattedCnpj,
        cnpjUnformatted: clean,
        razaoSocial: "--",
        nomeFantasia: "--",
        inscricaoEstadual: "--",
        dataAbertura: "--",
        situacaoCadastral: "--",
        naturezaJuridica: "--",
        regimeTributario: "--",
        capitalSocial: "--",
        cnaePrincipal: {
          codigo: "--",
          descricao: "--",
        },
        telefone: "--",
        email: "--",
        endereco: {
          logradouro: "--",
          numero: "--",
          complemento: "--",
          bairro: "--",
          cidade: "--",
          uf: "--",
          cep: "--",
        },
        qsa: [],
      };
      setQuantity(1);
      setCompany(notFoundCompany);
      setBulkList([]);
      setBulkCnpjOnly([]);
      setCnpjQuery(formattedCnpj);

      setGeneratorError(
        err instanceof Error
          ? err.message
          : isPt
            ? "CNPJ não encontrado na base de dados da Receita Federal."
            : "CNPJ not found in the Federal Revenue database."
      );
    } finally {
      setIsGenerating(false);
      setIsSearching(false);
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

  const copyCompanyAsJson = (data: CompanyDetailsWithQsa) => {
    const jsonStr = JSON.stringify(data, null, 2);
    copyToClipboard(jsonStr, "company-json");
  };

  const copyCompanyAsText = (data: CompanyDetailsWithQsa) => {
    const parts = [
      `CNPJ: ${data.cnpj}`,
      data.razaoSocial !== "-" ? `RAZÃO SOCIAL: ${data.razaoSocial}` : null,
      data.nomeFantasia !== "-" ? `NOME FANTASIA: ${data.nomeFantasia}` : null,
      data.situacaoCadastral !== "-" ? `SITUAÇÃO: ${data.situacaoCadastral}` : null,
      data.dataAbertura !== "-" ? `DATA ABERTURA: ${data.dataAbertura}` : null,
      data.naturezaJuridica !== "-" ? `NATUREZA JURÍDICA: ${data.naturezaJuridica}` : null,
      data.regimeTributario !== "-" ? `REGIME: ${data.regimeTributario}` : null,
      data.capitalSocial !== "-" ? `CAPITAL SOCIAL: ${data.capitalSocial}` : null,
      data.cnaePrincipal.codigo !== "-" ? `CNAE: ${data.cnaePrincipal.codigo} - ${data.cnaePrincipal.descricao}` : null,
      data.telefone !== "-" ? `TELEFONE: ${data.telefone}` : null,
      data.email !== "-" ? `EMAIL: ${data.email}` : null,
      data.endereco.logradouro !== "-" ? `ENDEREÇO: ${data.endereco.logradouro}, ${data.endereco.numero} - ${data.endereco.bairro}, ${data.endereco.cidade}/${data.endereco.uf} - CEP: ${data.endereco.cep}` : null,
    ].filter(Boolean);
    copyToClipboard(parts.join("\n"), "company-text");
  };

  const copyAllBulk = async () => {
    let text = "";
    if (bulkCnpjOnly.length > 0) {
      text = bulkCnpjOnly.join("\n");
    } else {
      text = bulkList.map((c) => `${c.cnpj} - ${c.razaoSocial}`).join("\n");
    }
    await copyToClipboard(text, "all-bulk");
  };

  const handleValidate = (val: string) => {
    setInputValidationCnpj(val);
    if (!val.trim()) {
      setValidationResult(null);
      return;
    }
    const result = validateCnpj(val);
    setValidationResult(result);
  };

  const labels = {
    generateBtn: isPt
      ? "Gerar Novo CNPJ"
      : isEs
        ? "Generar Nuevo CNPJ"
        : "Generate New CNPJ",
    generateBulkBtn: isPt
      ? `Gerar ${quantity} CNPJs`
      : isEs
        ? `Generar ${quantity} CNPJs`
        : `Generate ${quantity} CNPJs`,
    ufLabel: isPt ? "Estado / UF:" : isEs ? "Estado / UF:" : "State / UF:",
    quantityLabel: isPt ? "Quantidade:" : isEs ? "Cantidad:" : "Quantity:",
    formatLabel: isPt
      ? "Formatar com pontuação (XX.XXX.XXX/0001-XX)"
      : isEs
        ? "Formatear con puntuación"
        : "Format with dots & slash",
    companyDataLabel: isPt
      ? "Incluir dados completos da empresa"
      : isEs
        ? "Incluir datos completos de la empresa"
        : "Include full company data",
    copied: isPt ? "Copiado!" : isEs ? "¡Copiado!" : "Copied!",
    copy: isPt ? "Copiar" : isEs ? "Copiar" : "Copy",
    copyFull: isPt
      ? "Copiar Texto"
      : isEs
        ? "Copiar Texto"
        : "Copy Text",
    copyJson: isPt ? "Copiar JSON" : isEs ? "Copiar JSON" : "Copy JSON",
    copyAll: isPt ? "Copiar Todos" : isEs ? "Copiar Todos" : "Copy All",
    searchBtn: isPt ? "Consultar CNPJ" : isEs ? "Buscar" : "Lookup CNPJ",
    searchPlaceholder: isPt
      ? "Digite o CNPJ (ex: 18.236.120/0001-58)..."
      : isEs
        ? "Ingrese el CNPJ..."
        : "Type CNPJ (e.g. 18.236.120/0001-58)...",
    validateTitle: isPt
      ? "Validador de CNPJ em Tempo Real"
      : isEs
        ? "Validador de CNPJ en Tiempo Real"
        : "Real-time CNPJ Validator",
    validatePlaceholder: isPt
      ? "Digite ou cole um CNPJ para validar..."
      : isEs
        ? "Escribe o pega un CNPJ para validar..."
        : "Type or paste a CNPJ to validate...",
    valid: isPt
      ? "CNPJ VÁLIDO (Dígitos verificadores corretos)"
      : isEs
        ? "CNPJ VÁLIDO (Dígitos correctos)"
        : "VALID CNPJ (Correct check digits)",
    invalid: isPt
      ? "CNPJ INVÁLIDO"
      : isEs
        ? "CNPJ INVÁLIDO"
        : "INVALID CNPJ",
  };

  const ufOptions = UF_CNPJ_LIST.map((item) => ({
    value: item.uf,
    label: item.name,
  }));

  const isBulkMode = quantity > 1;

  return (
    <div className="w-full space-y-6">
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary">
        {/* Direct CNPJ Search Bar */}
        <div className="pb-5 border-b border-border/70 space-y-3">
          <label className="block text-xs font-semibold uppercase font-mono text-foreground">
            {isPt ? "Buscar por CNPJ Específico:" : isEs ? "Consultar por CNPJ:" : "Lookup Specific CNPJ:"}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={cnpjQuery}
                onChange={(e) => setCnpjQuery(formatCnpjInput(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchCnpj();
                }}
                maxLength={18}
                placeholder={labels.searchPlaceholder}
                className="w-full bg-background border border-border rounded-[2px] px-3.5 py-2 text-xs sm:text-sm font-mono text-foreground focus:outline-none focus:border-primary placeholder:text-muted"
              />
              {cnpjQuery && (
                <button
                  type="button"
                  onClick={() => setCnpjQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs font-mono p-1"
                >
                  ✕
                </button>
              )}
            </div>

            <AppButton
              color="primary"
              onClick={() => handleSearchCnpj()}
              disabled={isGenerating || isSearching || !cnpjQuery.trim()}
              className="gap-2 text-xs sm:text-sm font-semibold font-mono uppercase !py-2 !px-4 shrink-0"
            >
              {isSearching || isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{labels.searchBtn}</span>
            </AppButton>
          </div>

          {/* Quick Sample CNPJs */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs font-mono text-label uppercase font-semibold mr-1">
              {isPt ? "Exemplos:" : "Samples:"}
            </span>
            {SAMPLE_REAL_COMPANIES.map((item) => (
              <AppButton
                key={item.cnpj}
                color="tertiary"
                small
                className="!bg-background text-xs font-mono !font-medium !normal-case !py-1 !px-2.5"
                onClick={() => {
                  setCnpjQuery(item.cnpj);
                  handleSearchCnpj(item.cnpj);
                }}
              >
                {item.name}
              </AppButton>
            ))}
          </div>
        </div>

        {/* Generator Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-5 border-b border-border/70 items-end">
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
                { value: "1", label: isPt ? "1 CNPJ" : "1 CNPJ" },
                { value: "5", label: "5 CNPJs" },
                { value: "10", label: "10 CNPJs" },
                { value: "20", label: "20 CNPJs" },
              ]}
              onChange={(val) => setQuantity(Number(val))}
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

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2.5 py-1 min-h-[36px]">
              <div className="shrink-0 flex items-center">
                <AppSwitch
                  id={companyDataSwitchId}
                  checked={includeCompanyData}
                  onChange={(checked) => setIncludeCompanyData(checked)}
                />
              </div>
              <label
                htmlFor={companyDataSwitchId}
                className="text-xs font-mono font-medium text-foreground cursor-pointer select-none leading-snug break-words"
              >
                {labels.companyDataLabel}
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

        {!isBulkMode ? (
          <div className="pt-6 space-y-5">
            {/* Header / Company preview */}
            <div className="p-4 sm:p-5 bg-background border border-border rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {isGenerating ? (
                <div className="space-y-2 w-full max-w-md animate-pulse">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span className="text-xs font-mono text-primary font-semibold uppercase">Consultando Receita Federal...</span>
                  </div>
                  <div className="h-6 w-3/4 bg-border/60 rounded-[2px]" />
                  <div className="h-4 w-1/2 bg-border/40 rounded-[2px]" />
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase font-semibold mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>CNPJ: {company.cnpj}</span>
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-mono font-semibold text-foreground tracking-wide select-all">
                    {company.razaoSocial && company.razaoSocial !== "-" && company.razaoSocial !== "--"
                      ? company.razaoSocial
                      : company.cnpj}
                  </div>
                  {company.nomeFantasia && company.nomeFantasia !== "-" && company.nomeFantasia !== "--" && (
                    <div className="text-sm text-label font-mono mt-1">
                      {company.nomeFantasia} • Situação {company.situacaoCadastral} • {company.endereco.cidade}/{company.endereco.uf}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <AppButton
                  color="tertiary"
                  small
                  onClick={() => copyToClipboard(company.cnpj, "cnpj-main")}
                  disabled={isGenerating}
                  className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                  icon={
                    copiedKey === "cnpj-main" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                  iconPosition="left"
                >
                  {copiedKey === "cnpj-main" ? labels.copied : labels.copy}
                </AppButton>

                {includeCompanyData && company.razaoSocial !== "-" && company.razaoSocial !== "--" && (
                  <>
                    <AppButton
                      color="tertiary"
                      small
                      onClick={() => copyCompanyAsText(company)}
                      disabled={isGenerating}
                      className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                      icon={
                        copiedKey === "company-text" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )
                      }
                      iconPosition="left"
                    >
                      {copiedKey === "company-text" ? labels.copied : labels.copyFull}
                    </AppButton>

                    <AppButton
                      color="tertiary"
                      small
                      onClick={() => copyCompanyAsJson(company)}
                      disabled={isGenerating}
                      className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
                      icon={
                        copiedKey === "company-json" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Code2 className="w-3.5 h-3.5" />
                        )
                      }
                      iconPosition="left"
                    >
                      {copiedKey === "company-json" ? labels.copied : labels.copyJson}
                    </AppButton>
                  </>
                )}
              </div>
            </div>

            {/* Individual Breakdown fields */}
            {includeCompanyData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {/* CNPJ */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">CNPJ:</span>
                    {company.cnpj && company.cnpj !== "-" && company.cnpj !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.cnpj, "cnpj")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "cnpj" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono">
                    {isGenerating ? (
                      <div className="h-5 w-32 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.cnpj || "--"
                    )}
                  </div>
                </div>

                {/* Razão Social */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Razão Social:</span>
                    {company.razaoSocial && company.razaoSocial !== "-" && company.razaoSocial !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.razaoSocial, "razao")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "razao" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono truncate">
                    {isGenerating ? (
                      <div className="h-5 w-48 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.razaoSocial || "--"
                    )}
                  </div>
                </div>

                {/* Nome Fantasia */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Nome Fantasia:</span>
                    {company.nomeFantasia && company.nomeFantasia !== "-" && company.nomeFantasia !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.nomeFantasia, "fantasia")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "fantasia" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono truncate">
                    {isGenerating ? (
                      <div className="h-5 w-28 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.nomeFantasia || "--"
                    )}
                  </div>
                </div>

                {/* Situação Cadastral */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Situação Cadastral:</span>
                    {company.situacaoCadastral && company.situacaoCadastral !== "-" && company.situacaoCadastral !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.situacaoCadastral, "situacao")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "situacao" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono flex items-center gap-1.5">
                    {isGenerating ? (
                      <div className="h-5 w-20 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : company.situacaoCadastral !== "-" && company.situacaoCadastral !== "--" ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span>{company.situacaoCadastral}</span>
                      </>
                    ) : (
                      <span>--</span>
                    )}
                  </div>
                </div>

                {/* Data de Abertura */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Data de Abertura:</span>
                    {company.dataAbertura && company.dataAbertura !== "-" && company.dataAbertura !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.dataAbertura, "data")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "data" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono">
                    {isGenerating ? (
                      <div className="h-5 w-24 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.dataAbertura || "--"
                    )}
                  </div>
                </div>

                {/* Natureza Jurídica */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Natureza Jurídica:</span>
                    {company.naturezaJuridica && company.naturezaJuridica !== "-" && company.naturezaJuridica !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.naturezaJuridica, "natureza")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "natureza" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono truncate">
                    {isGenerating ? (
                      <div className="h-5 w-44 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.naturezaJuridica || "--"
                    )}
                  </div>
                </div>

                {/* Capital Social */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Capital Social:</span>
                    {company.capitalSocial && company.capitalSocial !== "-" && company.capitalSocial !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.capitalSocial, "capital")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "capital" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono">
                    {isGenerating ? (
                      <div className="h-5 w-24 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.capitalSocial || "--"
                    )}
                  </div>
                </div>

                {/* CNAE Principal */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">CNAE Principal:</span>
                    {company.cnaePrincipal.codigo && company.cnaePrincipal.codigo !== "-" && company.cnaePrincipal.codigo !== "--" && (
                      <button
                        onClick={() => copyToClipboard(`${company.cnaePrincipal.codigo} - ${company.cnaePrincipal.descricao}`, "cnae")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "cnae" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono truncate">
                    {isGenerating ? (
                      <div className="h-5 w-56 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : company.cnaePrincipal.codigo !== "-" && company.cnaePrincipal.codigo !== "--" ? (
                      `${company.cnaePrincipal.codigo} • ${company.cnaePrincipal.descricao}`
                    ) : (
                      "--"
                    )}
                  </div>
                </div>

                {/* Regime Tributário */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Regime Tributário:</span>
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono">
                    {isGenerating ? (
                      <div className="h-5 w-24 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.regimeTributario || "--"
                    )}
                  </div>
                </div>

                {/* Telefone */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Telefone:</span>
                    {company.telefone && company.telefone !== "-" && company.telefone !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.telefone, "fone")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "fone" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono">
                    {isGenerating ? (
                      <div className="h-5 w-24 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.telefone || "--"
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">E-mail:</span>
                    {company.email && company.email !== "-" && company.email !== "--" && (
                      <button
                        onClick={() => copyToClipboard(company.email, "email")}
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "email" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono truncate">
                    {isGenerating ? (
                      <div className="h-5 w-32 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : (
                      company.email || "--"
                    )}
                  </div>
                </div>

                {/* Endereço Completo */}
                <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase font-mono text-foreground">Endereço / Localização:</span>
                    {company.endereco?.logradouro && company.endereco.logradouro !== "-" && company.endereco.logradouro !== "--" && (
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${company.endereco.logradouro}, ${company.endereco.numero} - ${company.endereco.bairro}, ${company.endereco.cidade}/${company.endereco.uf} - CEP: ${company.endereco.cep}`,
                            "endereco"
                          )
                        }
                        disabled={isGenerating}
                        className="text-label hover:text-primary p-0.5"
                      >
                        {copiedKey === "endereco" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <div className="font-normal text-sm text-foreground select-all font-mono truncate">
                    {isGenerating ? (
                      <div className="h-5 w-40 bg-border/60 rounded-[2px] animate-pulse my-0.5" />
                    ) : company.endereco?.logradouro !== "-" && company.endereco?.logradouro !== "--" ? (
                      `${company.endereco.logradouro}, ${company.endereco.numero} • ${company.endereco.cidade}/${company.endereco.uf}`
                    ) : (
                      "--"
                    )}
                  </div>
                </div>

                {/* Quadro Societário (QSA) */}
                {company.qsa && company.qsa.length > 0 && (
                  <div className="p-3.5 bg-background border border-border rounded-[2px] space-y-1 sm:col-span-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        Quadro de Sócios e Administradores (QSA):
                      </span>
                    </div>
                    <div className="font-normal text-xs text-foreground font-mono flex flex-wrap gap-2 pt-1">
                      {company.qsa.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-tertiary border border-border/70 rounded-[2px]"
                        >
                          <strong>{s.nome}</strong> ({s.qualificacao})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
          /* Bulk Mode View */
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-1.5">
                <List className="w-3.5 h-3.5 text-primary" />
                {quantity} CNPJs Gerados
              </span>
              <div className="flex gap-2">
                <AppButton
                  color="tertiary"
                  small
                  onClick={copyAllBulk}
                  className="gap-1.5 text-xs font-mono font-normal !bg-background !py-1.5 !px-3"
                  disabled={isGenerating || (bulkList.length === 0 && bulkCnpjOnly.length === 0)}
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
              ) : bulkCnpjOnly.length > 0 ? (
                bulkCnpjOnly.map((cnpjStr, i) => (
                  <div
                    key={i}
                    className="p-3 bg-tertiary border border-border/70 rounded-[2px] flex items-center justify-between gap-3"
                  >
                    <div className="font-mono text-sm font-semibold select-all text-foreground">
                      {cnpjStr}
                    </div>
                    <button
                      onClick={() => copyToClipboard(cnpjStr, `bulk-cnpj-${i}`)}
                      className="p-1.5 hover:bg-background rounded text-label hover:text-primary transition-colors shrink-0"
                      title={labels.copy}
                    >
                      {copiedKey === `bulk-cnpj-${i}` ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                (bulkList.length > 0
                  ? bulkList
                  : [company]
                ).map((item, i) => (
                  <div
                    key={i}
                    className="p-3 bg-tertiary border border-border/70 rounded-[2px] flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-mono text-sm font-semibold select-all text-foreground truncate">
                        {item.cnpj} {item.razaoSocial !== "-" ? `• ${item.razaoSocial}` : ""}
                      </div>
                      <div className="text-xs font-mono text-label">
                        {item.nomeFantasia !== "-" ? item.nomeFantasia : item.situacaoCadastral} • {item.endereco.cidade}/{item.endereco.uf}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${item.cnpj} - ${item.razaoSocial}`, `bulk-c-${i}`)}
                      className="p-1.5 hover:bg-background rounded text-label hover:text-primary transition-colors shrink-0"
                      title={labels.copy}
                    >
                      {copiedKey === `bulk-c-${i}` ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </AppCard>

      {/* Real-time CNPJ Validator Card */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold uppercase font-mono text-foreground">
            {labels.validateTitle}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="text"
            value={inputValidationCnpj}
            onChange={(e) => handleValidate(e.target.value)}
            maxLength={18}
            placeholder={labels.validatePlaceholder}
            className="flex-1 bg-background border border-border rounded-[2px] px-3.5 py-2 text-xs sm:text-sm font-mono text-foreground focus:outline-none focus:border-primary placeholder:text-muted"
          />

          <div className="flex items-center gap-2 shrink-0">
            {validationResult && (
              <div
                className={`px-3 py-1.5 rounded-[2px] font-mono text-xs uppercase font-semibold flex items-center gap-1.5 border ${
                  validationResult.isValid
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                    : "bg-red-500/10 text-red-500 border-red-500/30"
                }`}
              >
                {validationResult.isValid ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{labels.valid}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{validationResult.message || labels.invalid}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </AppCard>
    </div>
  );
}

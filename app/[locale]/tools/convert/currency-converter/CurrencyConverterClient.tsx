"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpDown,
  Check,
  Copy,
  AlertTriangle,
  Clock,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { getRates } from "@/lib/currency";
import { CURRENCIES } from "@/data/currencies";
import {
  AppCard,
  AppButton,
  AppSelect,
  AppInput,
  AppTable,
  AppTableHeader,
  AppTableBody,
  AppTableRow,
  AppTableHead,
  AppTableCell,
} from "@/components/ui";
import ConvertToolHeader from "../components/ConvertToolHeader";
import CurrencyConverterContent, {
  type RichContent,
} from "./components/CurrencyConverterContent";
import type { FaqItem } from "@/components/AppFaqSection";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  BRL: "R$",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "AU$",
  CHF: "CHF",
  CNY: "¥",
  INR: "₹",
  MXN: "MX$",
  ARS: "AR$",
  CLP: "CLP$",
  COP: "COL$",
  NZD: "NZ$",
  SGD: "S$",
  HKD: "HK$",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  TRY: "₺",
  ZAR: "R",
};

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  BRL: "🇧🇷",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  INR: "🇮🇳",
  MXN: "🇲🇽",
  ARS: "🇦🇷",
  CLP: "🇨🇱",
  COP: "🇨🇴",
  PEN: "🇵🇪",
  UYU: "🇺🇾",
  NZD: "🇳🇿",
  SGD: "🇸🇬",
  HKD: "🇭🇰",
  SEK: "🇸🇪",
  NOK: "🇳🇴",
  DKK: "🇩🇰",
  PLN: "🇵🇱",
  TRY: "🇹🇷",
  ZAR: "🇿🇦",
};

const POPULAR_PAIRS = [
  { from: "USD", to: "BRL", label: "USD → BRL" },
  { from: "EUR", to: "BRL", label: "EUR → BRL" },
  { from: "EUR", to: "USD", label: "EUR → USD" },
  { from: "GBP", to: "BRL", label: "GBP → BRL" },
  { from: "USD", to: "EUR", label: "USD → EUR" },
  { from: "USD", to: "JPY", label: "USD → JPY" },
];

const QUICK_AMOUNTS = ["1", "10", "50", "100", "500", "1000"];

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function CurrencyConverterClient({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("convert.shared");
  const tc = useTranslations("convert.currency");

  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getRates(from).then(({ rates: r, stale: s }) => {
      if (!isMounted) return;
      if (Object.keys(r).length > 0) {
        setRates(r);
        setStale(s);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [from]);

  const numericAmount = parseFloat(amount);
  const isValidAmount = !isNaN(numericAmount) && numericAmount >= 0;

  const currentRate = rates[to] ?? null;
  const inverseRate = currentRate && currentRate > 0 ? 1 / currentRate : null;

  const convertedResult = useMemo(() => {
    if (!isValidAmount || currentRate === null) return null;
    return numericAmount * currentRate;
  }, [numericAmount, isValidAmount, currentRate]);

  const formattedResult = useMemo(() => {
    if (convertedResult === null) return "—";
    return new Intl.NumberFormat(
      locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: convertedResult < 0.01 ? 6 : 4,
      },
    ).format(convertedResult);
  }, [convertedResult, locale]);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const handleCopy = useCallback(async () => {
    if (convertedResult === null) return;
    try {
      await navigator.clipboard.writeText(`${formattedResult} ${to}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [convertedResult, formattedResult, to]);

  const currencyOptions = useMemo(() => {
    return CURRENCIES.map((c) => {
      const flag = CURRENCY_FLAGS[c.code] ? `${CURRENCY_FLAGS[c.code]} ` : "";
      return {
        value: c.code,
        label: `${flag}${c.code} · ${c.name}`,
      };
    });
  }, []);

  const getCurrencyName = useCallback((code: string) => {
    const item = CURRENCIES.find((c) => c.code === code);
    return item ? item.name : code;
  }, []);

  const headerBadges = useMemo(() => {
    return [
      {
        text:
          typeof tc.has === "function" && tc.has("badgeLive")
            ? tc("badgeLive")
            : "Cotações em Tempo Real",
        bg: "bg-tertiary",
        textColor: "text-foreground",
        icon: (
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        ),
      },
      {
        text:
          typeof tc.has === "function" && tc.has("badge150")
            ? tc("badge150")
            : "150+ Moedas",
        bg: "bg-tertiary",
        textColor: "text-foreground",
        icon: <DollarSign className="w-3.5 h-3.5 text-primary shrink-0 mr-1" />,
      },
      {
        text:
          typeof tc.has === "function" && tc.has("badgeFree")
            ? tc("badgeFree")
            : "100% Grátis",
        bg: "bg-foreground",
        textColor: "text-background",
        icon: <Sparkles className="w-3.5 h-3.5 shrink-0 mr-1" />,
      },
    ];
  }, [tc]);

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <div className="w-full">
        <ConvertToolHeader
          title={title}
          description={description}
          locale={locale}
          badges={headerBadges}
        />

        <section aria-label={title} className="mb-10 sm:mb-14 w-full">
          <AppCard border cornerAccents={true} className="p-4 sm:p-6 bg-tertiary">
            {stale && (
              <div
                role="alert"
                className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs px-3.5 py-2 rounded-[2px] flex items-center gap-2 font-mono"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{tc("staleWarning")}</span>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs px-3.5 py-2 rounded-[2px] flex items-center gap-2 font-mono"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{tc("errorFetching")}</span>
              </div>
            )}

            {/* Barra de Pares Populares */}
            <div className="pb-3 mb-3 border-b border-border/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-sm font-semibold text-foreground shrink-0 mr-1.5">
                {locale === "pt"
                  ? "Populares:"
                  : locale === "es"
                    ? "Populares:"
                    : "Popular:"}
              </span>
              {POPULAR_PAIRS.map((pair) => {
                const isCurrent = from === pair.from && to === pair.to;
                return (
                  <button
                    key={pair.label}
                    type="button"
                    onClick={() => {
                      setFrom(pair.from);
                      setTo(pair.to);
                    }}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded-[2px] transition-colors cursor-pointer shrink-0 border ${
                      isCurrent
                        ? "bg-secondary text-background border-secondary"
                        : "bg-background border-border text-foreground hover:border-secondary"
                    }`}
                  >
                    {pair.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {/* Bloco De / Origem */}
              <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr,260px] md:grid-cols-[1fr,300px] gap-3.5 items-end">
                  <div>
                    <AppInput
                      id="currency-amount"
                      label={tc("amountLabel")}
                      labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      variant="tertiary"
                      prefix={
                        CURRENCY_SYMBOLS[from] ? (
                          <span className="font-mono font-bold text-label/50 text-base sm:text-lg select-none">
                            {CURRENCY_SYMBOLS[from]}
                          </span>
                        ) : undefined
                      }
                      className="h-12 text-2xl sm:text-3xl font-mono font-bold"
                    />

                    {/* Atalhos de Valores Rápidos */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-xs font-semibold text-foreground shrink-0 mr-1.5">
                        {locale === "pt"
                          ? "Atalhos:"
                          : locale === "es"
                            ? "Atajos:"
                            : "Presets:"}
                      </span>
                      {QUICK_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmount(amt)}
                          className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-[2px] border transition-colors cursor-pointer ${
                            amount === amt
                              ? "bg-secondary text-background border-secondary"
                              : "bg-tertiary border-border text-foreground hover:border-secondary"
                          }`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <AppSelect
                      id="currency-from"
                      name="currency-from"
                      label={tc("fromLabel")}
                      labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2"
                      options={currencyOptions}
                      value={from}
                      onChange={(val) => setFrom(val)}
                      className="h-12 font-mono text-xs sm:text-sm"
                      dropdownClassName="min-w-[260px] sm:min-w-[300px]"
                    />
                  </div>
                </div>
              </div>

              {/* Botão Inverter (Swap) */}
              <div className="relative flex items-center justify-center py-1">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border/70" />
                </div>
                <button
                  type="button"
                  onClick={swap}
                  aria-label={t("swap")}
                  title={t("swap")}
                  className="relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-background hover:bg-tertiary border border-border hover:border-primary/60 text-xs font-mono font-semibold uppercase text-label hover:text-primary rounded-[2px] transition-colors cursor-pointer group"
                >
                  <ArrowUpDown className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-300" />
                  <span>{t("swap")}</span>
                </button>
              </div>

              {/* Bloco Para / Destino */}
              <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr,260px] md:grid-cols-[1fr,300px] gap-3.5 items-end">
                  <div>
                    <span className="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2">
                      {t("result")}
                    </span>
                    <div
                      id="currency-conversion-result-container"
                      aria-live="polite"
                      className="w-full h-12 px-3 bg-tertiary border border-border rounded-[2px] flex items-center truncate"
                    >
                      {CURRENCY_SYMBOLS[to] && (
                        <span className="font-mono font-bold text-label/50 text-base sm:text-lg mr-2 select-none shrink-0">
                          {CURRENCY_SYMBOLS[to]}
                        </span>
                      )}
                      <span
                        data-testid="currency-conversion-result"
                        className="text-2xl sm:text-3xl font-mono font-bold text-primary tracking-tight truncate"
                      >
                        {loading ? (
                          <span className="text-label text-base font-normal animate-pulse">
                            {tc("loading")}
                          </span>
                        ) : (
                          formattedResult
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <AppSelect
                      id="currency-to"
                      name="currency-to"
                      label={tc("toLabel")}
                      labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2"
                      options={currencyOptions}
                      value={to}
                      onChange={(val) => setTo(val)}
                      className="h-12 font-mono text-xs sm:text-sm"
                      dropdownClassName="min-w-[260px] sm:min-w-[300px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Taxas de Câmbio e Ações */}
            <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-label">
              <div>
                {currentRate && !loading && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-background border border-border rounded-[2px] text-label">
                      1 {from} ={" "}
                      <strong className="text-foreground">
                        {currentRate.toFixed(4)}
                      </strong>{" "}
                      {to}
                    </span>
                    {inverseRate && (
                      <span className="px-2 py-0.5 bg-background border border-border rounded-[2px] text-label/80">
                        1 {to} ={" "}
                        <strong className="text-foreground">
                          {inverseRate.toFixed(4)}
                        </strong>{" "}
                        {from}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <AppButton
                  type="button"
                  color={copied ? "primary" : "panel"}
                  onClick={handleCopy}
                  disabled={convertedResult === null || loading}
                  className="h-8 px-3 text-xs font-mono uppercase flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{tc("copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{tc("copyResult")}</span>
                    </>
                  )}
                </AppButton>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-1.5 text-[11px] font-mono text-label/60">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{tc("ratesFooter")}</span>
            </div>
          </AppCard>

          {/* Tabela de Conversão Rápida para Moedas */}
          {currentRate && !loading && (
            <div className="mt-8 pt-6 border-t border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2.5 sm:mb-3.5">
                <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono">
                  {locale === "pt"
                    ? "Tabela de Conversão Rápida"
                    : locale === "es"
                      ? "Tabla de Conversión Rápida"
                      : "Quick Conversion Table"}
                </h2>
                <span className="text-xs font-mono text-label">
                  {from} ⇄ {to}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* De -> Para */}
                <AppTable hoverable={true} aria-label={`${from} → ${to}`}>
                  <AppTableHeader>
                    <AppTableRow hoverable={false}>
                      <AppTableHead>{from}</AppTableHead>
                      <AppTableHead align="right">{to}</AppTableHead>
                    </AppTableRow>
                  </AppTableHeader>
                  <AppTableBody>
                    {[1, 5, 10, 25, 50, 100, 500, 1000].map((val) => (
                      <AppTableRow key={val}>
                        <AppTableCell className="text-label">
                          {val.toLocaleString()} {from}
                        </AppTableCell>
                        <AppTableCell align="right" className="font-bold text-foreground">
                          {(val * currentRate).toLocaleString(
                            locale === "pt"
                              ? "pt-BR"
                              : locale === "es"
                                ? "es-ES"
                                : "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}{" "}
                          {to}
                        </AppTableCell>
                      </AppTableRow>
                    ))}
                  </AppTableBody>
                </AppTable>

                {/* Para -> De */}
                <AppTable hoverable={true} aria-label={`${to} → ${from}`}>
                  <AppTableHeader>
                    <AppTableRow hoverable={false}>
                      <AppTableHead>{to}</AppTableHead>
                      <AppTableHead align="right">{from}</AppTableHead>
                    </AppTableRow>
                  </AppTableHeader>
                  <AppTableBody>
                    {[1, 5, 10, 25, 50, 100, 500, 1000].map((val) => (
                      <AppTableRow key={val}>
                        <AppTableCell className="text-label">
                          {val.toLocaleString()} {to}
                        </AppTableCell>
                        <AppTableCell align="right" className="font-bold text-foreground">
                          {inverseRate
                            ? (val * inverseRate).toLocaleString(
                                locale === "pt"
                                  ? "pt-BR"
                                  : locale === "es"
                                    ? "es-ES"
                                    : "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )
                            : "—"}{" "}
                          {from}
                        </AppTableCell>
                      </AppTableRow>
                    ))}
                  </AppTableBody>
                </AppTable>
              </div>
            </div>
          )}
        </section>

        {/* Seção Padronizada de Detalhes */}
        <CurrencyConverterContent
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  );
}

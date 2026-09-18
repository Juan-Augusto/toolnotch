"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpDown,
  Check,
  Copy,
  Scale,
  Zap,
  Sparkles,
  Sliders,
} from "lucide-react";
import { convert, formatResult } from "@/lib/units";
import { UnitCategory } from "@/lib/unitTypes";
import { UNITS, UNIT_LABELS } from "@/data/units";
import { TEMPERATURE_UNITS } from "@/lib/temperature";
import { AppCard, AppButton, AppSelect, AppInput } from "@/components/ui";
import ConvertToolHeader from "../components/ConvertToolHeader";
import AppQuickReferenceTable from "@/components/converter/AppQuickReferenceTable";
import UnitConverterContent, {
  type RichContent,
} from "./components/UnitConverterContent";
import type { FaqItem } from "@/components/AppFaqSection";

const CATEGORIES: UnitCategory[] = [
  "length",
  "weight",
  "temperature",
  "area",
  "volume",
  "speed",
  "time",
  "digital-storage",
  "pressure",
];

const COMMON_SHORTCUTS: Partial<
  Record<UnitCategory, { from: string; to: string; label: string }[]>
> = {
  length: [
    { from: "meter", to: "foot", label: "m → ft" },
    { from: "kilometer", to: "mile", label: "km → mi" },
    { from: "centimeter", to: "inch", label: "cm → in" },
    { from: "inch", to: "centimeter", label: "in → cm" },
    { from: "meter", to: "yard", label: "m → yd" },
  ],
  weight: [
    { from: "kilogram", to: "pound", label: "kg → lb" },
    { from: "gram", to: "ounce", label: "g → oz" },
    { from: "pound", to: "kilogram", label: "lb → kg" },
    { from: "kilogram", to: "gram", label: "kg → g" },
  ],
  temperature: [
    { from: "celsius", to: "fahrenheit", label: "°C → °F" },
    { from: "fahrenheit", to: "celsius", label: "°F → °C" },
    { from: "celsius", to: "kelvin", label: "°C → K" },
  ],
  area: [
    { from: "square meter", to: "square foot", label: "m² → ft²" },
    { from: "hectare", to: "acre", label: "ha → ac" },
    { from: "square kilometer", to: "square mile", label: "km² → mi²" },
  ],
  volume: [
    { from: "liter", to: "gallon (US)", label: "L → gal" },
    { from: "milliliter", to: "fluid ounce", label: "ml → fl oz" },
    { from: "cubic meter", to: "liter", label: "m³ → L" },
  ],
  speed: [
    { from: "kilometer per hour", to: "mile per hour", label: "km/h → mph" },
    { from: "meter per second", to: "kilometer per hour", label: "m/s → km/h" },
    { from: "knot", to: "kilometer per hour", label: "kn → km/h" },
  ],
  time: [
    { from: "hour", to: "minute", label: "h → min" },
    { from: "minute", to: "second", label: "min → s" },
    { from: "day", to: "hour", label: "d → h" },
  ],
  "digital-storage": [
    { from: "gigabyte", to: "megabyte", label: "GB → MB" },
    { from: "terabyte", to: "gigabyte", label: "TB → GB" },
    { from: "megabyte", to: "kilobyte", label: "MB → KB" },
  ],
  pressure: [
    { from: "bar", to: "psi", label: "bar → psi" },
    { from: "atmosphere", to: "bar", label: "atm → bar" },
    { from: "pascal", to: "bar", label: "Pa → bar" },
  ],
};

const QUICK_AMOUNTS = ["1", "5", "10", "50", "100", "1000"];

function getUnitsForCategory(category: UnitCategory): string[] {
  if (category === "temperature") return [...TEMPERATURE_UNITS];
  return Object.keys(UNITS[category] ?? {});
}

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function UnitConverterClient({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("convert.shared");
  const tu = useTranslations("convert.units");
  const tc = useTranslations("convert.categories");
  const tuMeta = useTranslations("convert.unit");

  const [category, setCategory] = useState<UnitCategory>("length");

  const units = useMemo(() => getUnitsForCategory(category), [category]);
  const [from, setFrom] = useState(() => units[0]);
  const [to, setTo] = useState(() => units[1] ?? units[0]);
  const [inputValue, setInputValue] = useState("1");
  const [copied, setCopied] = useState(false);

  const handleCategoryChange = useCallback((newCat: UnitCategory) => {
    setCategory(newCat);
    const newUnits = getUnitsForCategory(newCat);
    setFrom(newUnits[0]);
    setTo(newUnits[1] ?? newUnits[0]);
  }, []);

  const getUnitLabel = useCallback(
    (u: string) => {
      if (typeof tu.has === "function" && tu.has(u)) return tu(u);
      return UNIT_LABELS[u] ?? u;
    },
    [tu],
  );

  const unitOptions = useMemo(() => {
    return units.map((u) => ({
      value: u,
      label: getUnitLabel(u),
    }));
  }, [units, getUnitLabel]);

  const numericValue = parseFloat(inputValue);
  const isValidNumber = !isNaN(numericValue);

  const result = useMemo(() => {
    if (!isValidNumber) return "";
    return formatResult(convert(numericValue, from, to, category));
  }, [numericValue, isValidNumber, from, to, category]);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
    if (result && result !== "N/A") {
      setInputValue(result);
    }
  }, [from, to, result]);

  const handleCopy = useCallback(async () => {
    if (!result || result === "N/A") return;
    try {
      await navigator.clipboard.writeText(`${result} ${getUnitLabel(to)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [result, getUnitLabel, to]);

  const headerBadges = useMemo(() => {
    return [
      {
        text:
          locale === "pt"
            ? "200+ Unidades"
            : locale === "es"
              ? "200+ Unidades"
              : "200+ Units",
        bg: "bg-tertiary",
        textColor: "text-foreground",
        icon: <Scale className="w-3.5 h-3.5 text-primary shrink-0 mr-1" />,
      },
      {
        text:
          locale === "pt"
            ? "Cálculo Offline Instantâneo"
            : locale === "es"
              ? "Cálculo Offline Instantáneo"
              : "Instant Offline Calc",
        bg: "bg-tertiary",
        textColor: "text-foreground",
        icon: <Zap className="w-3.5 h-3.5 text-secondary shrink-0 mr-1" />,
      },
      {
        text:
          locale === "pt"
            ? "Alta Precisão"
            : locale === "es"
              ? "Alta Precisión"
              : "High Precision",
        bg: "bg-foreground",
        textColor: "text-background",
        icon: <Sparkles className="w-3.5 h-3.5 shrink-0 mr-1" />,
      },
    ];
  }, [locale]);

  const handleCategoryKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % CATEGORIES.length;
      handleCategoryChange(CATEGORIES[nextIndex]);
      document.getElementById(`unit-tab-${CATEGORIES[nextIndex]}`)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
      handleCategoryChange(CATEGORIES[prevIndex]);
      document.getElementById(`unit-tab-${CATEGORIES[prevIndex]}`)?.focus();
    }
  };

  const shortcuts = COMMON_SHORTCUTS[category] ?? [];

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
          {/* Wrapping Category Tabs (No horizontal cutoff) */}
          <div
            role="tablist"
            aria-label={tuMeta("categoryLabel")}
            className="flex flex-wrap gap-1.5 sm:gap-2 mb-4"
          >
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat}
                id={`unit-tab-${cat}`}
                role="tab"
                aria-selected={category === cat}
                aria-controls="unit-converter-panel"
                tabIndex={category === cat ? 0 : -1}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-[2px] transition-colors cursor-pointer border ${
                  category === cat
                    ? "bg-secondary text-background border-secondary font-bold"
                    : "bg-tertiary border-border text-foreground hover:border-secondary"
                }`}
              >
                {tc(cat)}
              </button>
            ))}
          </div>

          {/* Clean, Precision Converter Card with Corner Accents */}
          <AppCard
            id="unit-converter-panel"
            role="tabpanel"
            aria-labelledby={`unit-tab-${category}`}
            border
            cornerAccents={true}
            className="p-4 sm:p-6 bg-tertiary"
          >
            {/* Barra de Atalhos de Pares de Unidade */}
            {shortcuts.length > 0 && (
              <div className="pb-3 mb-3 border-b border-border/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-sm font-semibold text-foreground shrink-0 mr-1.5 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {locale === "pt"
                      ? "Pares:"
                      : locale === "es"
                        ? "Pares:"
                        : "Pairs:"}
                  </span>
                </span>
                {shortcuts.map((sc) => {
                  const isCurrent = from === sc.from && to === sc.to;
                  return (
                    <button
                      key={sc.label}
                      type="button"
                      onClick={() => {
                        setFrom(sc.from);
                        setTo(sc.to);
                      }}
                      className={`px-2.5 py-1 text-xs font-mono font-medium rounded-[2px] transition-colors cursor-pointer shrink-0 border ${
                        isCurrent
                          ? "bg-secondary text-background border-secondary"
                          : "bg-background border-border text-foreground hover:border-secondary"
                      }`}
                    >
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-3">
              {/* Bloco De / Origem */}
              <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr,260px] md:grid-cols-[1fr,300px] gap-3.5 items-end">
                  <div>
                    <AppInput
                      id="unit-amount"
                      label={tuMeta("amountLabel")}
                      labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                      type="number"
                      inputMode="decimal"
                      step="any"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="0"
                      variant="tertiary"
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
                          onClick={() => setInputValue(amt)}
                          className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-[2px] border transition-colors cursor-pointer ${
                            inputValue === amt
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
                      id="unit-from"
                      name="unit-from"
                      label={tuMeta("fromLabel")}
                      labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2"
                      options={unitOptions}
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
                      id="unit-conversion-result-container"
                      aria-live="polite"
                      className="w-full h-12 px-3 bg-tertiary border border-border rounded-[2px] flex items-center truncate"
                    >
                      <span
                        data-testid="conversion-result"
                        className="text-2xl sm:text-3xl font-mono font-bold text-primary tracking-tight truncate"
                      >
                        {result || "—"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <AppSelect
                      id="unit-to"
                      name="unit-to"
                      label={tuMeta("toLabel")}
                      labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2"
                      options={unitOptions}
                      value={to}
                      onChange={(val) => setTo(val)}
                      className="h-12 font-mono text-xs sm:text-sm"
                      dropdownClassName="min-w-[260px] sm:min-w-[300px]"
                    />
                  </div>
                </div>
              </div>
            </div>

          {/* Equation & Action */}
          <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-label">
            <div className="truncate">
              {result && result !== "—" && (
                <p>
                  {inputValue} {getUnitLabel(from)} ={" "}
                  <span className="font-semibold text-foreground">
                    {result} {getUnitLabel(to)}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <AppButton
                type="button"
                color={copied ? "primary" : "panel"}
                onClick={handleCopy}
                disabled={!result || result === "—"}
                className="h-8 px-3 text-xs font-mono uppercase flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{tuMeta("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{tuMeta("copyResult")}</span>
                  </>
                )}
              </AppButton>
            </div>
          </div>
        </AppCard>

        {/* Tabela de Referência Rápida Redesenhada */}
        <AppQuickReferenceTable
          fromUnit={from}
          toUnit={to}
          category={category}
        />
      </section>

      {/* Seção Padronizada de Detalhes */}
      <UnitConverterContent
        richContent={richContent}
        faqs={faqs}
        locale={locale}
      />
      </div>
    </main>
  );
}

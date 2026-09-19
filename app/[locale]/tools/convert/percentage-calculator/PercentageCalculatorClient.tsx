"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, RotateCcw } from "lucide-react";
import { AppCard, AppButton, AppInput } from "@/components/ui";
import ConvertToolHeader from "../components/ConvertToolHeader";
import PercentageCalculatorContent, {
  type RichContent,
} from "./components/PercentageCalculatorContent";
import type { FaqItem } from "@/components/AppFaqSection";

type Mode = "percentOf" | "whatPercent" | "percentChange";

interface Props {
  title: string;
  description: string;
  faqs: FaqItem[];
  richContent?: RichContent;
  locale?: string;
}

export default function PercentageCalculatorClient({
  title,
  description,
  faqs,
  richContent,
  locale = "pt",
}: Props) {
  const t = useTranslations("percentage");
  const [activeTab, setActiveTab] = useState<Mode>("percentOf");
  const [copied, setCopied] = useState(false);

  // Mode 1: What is X% of Y
  const [poPct, setPoPct] = useState("15");
  const [poNum, setPoNum] = useState("200");

  // Mode 2: X is what % of Y
  const [wpX, setWpX] = useState("30");
  const [wpY, setWpY] = useState("200");

  // Mode 3: Percent Change from X to Y
  const [pcFrom, setPcFrom] = useState("100");
  const [pcTo, setPcTo] = useState("150");

  // Calculations
  const poResult = useMemo(() => {
    const p = parseFloat(poPct);
    const n = parseFloat(poNum);
    if (isNaN(p) || isNaN(n)) return null;
    return parseFloat(((n * p) / 100).toFixed(6));
  }, [poPct, poNum]);

  const wpResult = useMemo(() => {
    const x = parseFloat(wpX);
    const y = parseFloat(wpY);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    return parseFloat(((x / y) * 100).toFixed(6));
  }, [wpX, wpY]);

  const pcData = useMemo(() => {
    const from = parseFloat(pcFrom);
    const to = parseFloat(pcTo);
    if (isNaN(from) || isNaN(to) || from === 0) return null;
    const diff = to - from;
    const pct = (diff / from) * 100;
    const isIncrease = pct >= 0;
    return {
      value: parseFloat(Math.abs(pct).toFixed(6)),
      isIncrease,
      diff: parseFloat(diff.toFixed(6)),
    };
  }, [pcFrom, pcTo]);

  const clearCurrentTab = useCallback(() => {
    if (activeTab === "percentOf") {
      setPoPct("");
      setPoNum("");
    } else if (activeTab === "whatPercent") {
      setWpX("");
      setWpY("");
    } else {
      setPcFrom("");
      setPcTo("");
    }
  }, [activeTab]);

  const currentResultString = useMemo(() => {
    if (activeTab === "percentOf") {
      return poResult !== null ? String(poResult) : "";
    }
    if (activeTab === "whatPercent") {
      return wpResult !== null ? `${wpResult}%` : "";
    }
    if (activeTab === "percentChange") {
      if (!pcData) return "";
      const label = pcData.isIncrease
        ? t("percentChange.increase")
        : t("percentChange.decrease");
      return `${pcData.value}% (${label})`;
    }
    return "";
  }, [activeTab, poResult, wpResult, pcData, t]);

  const handleCopy = useCallback(async () => {
    if (!currentResultString) return;
    try {
      await navigator.clipboard.writeText(currentResultString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [currentResultString]);

  const tabs: { id: Mode; label: string }[] = [
    { id: "percentOf", label: t("tabs.percentOf") },
    { id: "whatPercent", label: t("tabs.whatPercent") },
    { id: "percentChange", label: t("tabs.percentChange") },
  ];

  const headerBadges = useMemo(() => {
    return [
      {
        text:
          locale === "pt"
            ? "3 Modos de Cálculo"
            : locale === "es"
              ? "3 Modos de Cálculo"
              : "3 Calculation Modes",
        bg: "bg-tertiary",
        textColor: "text-foreground",
      },
      {
        text:
          locale === "pt"
            ? "Acréscimo & Desconto"
            : locale === "es"
              ? "Aumento & Descuento"
              : "Increase & Decrease",
        bg: "bg-tertiary",
        textColor: "text-foreground",
      },
      {
        text:
          locale === "pt"
            ? "Cálculo Instantâneo"
            : locale === "es"
              ? "Cálculo Instantáneo"
              : "Instant Calculation",
        bg: "bg-foreground",
        textColor: "text-background",
      },
    ];
  }, [locale]);

  const QUICK_PERCENTAGES = ["5", "10", "15", "20", "25", "50", "75"];

  const handleTabKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
      document.getElementById(`percentage-tab-${tabs[nextIndex].id}`)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex].id);
      document.getElementById(`percentage-tab-${tabs[prevIndex].id}`)?.focus();
    }
  };

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
        {/* Mode Selector Tabs (Wrapping, No Cutoff) */}
        <div
          role="tablist"
          aria-label={title}
          className="flex flex-wrap gap-1.5 sm:gap-2 mb-4"
        >
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              id={`percentage-tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="percentage-calculator-panel"
              tabIndex={activeTab === tab.id ? 0 : -1}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded-[2px] transition-colors cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-secondary text-background border-secondary font-bold"
                  : "bg-tertiary border-border text-foreground hover:border-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AppCard
          id="percentage-calculator-panel"
          role="tabpanel"
          aria-labelledby={`percentage-tab-${activeTab}`}
          border
          cornerAccents={true}
          className="p-4 sm:p-6 bg-tertiary"
        >
          {/* TAB 1: Quanto é X% de Y */}
          {activeTab === "percentOf" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                  <div className="relative">
                    <AppInput
                      id="po-pct"
                      label={`${t("percentOf.label1")} (%)`}
                      labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                      type="number"
                      inputMode="decimal"
                      step="any"
                      value={poPct}
                      onChange={(e) => setPoPct(e.target.value)}
                      placeholder="0"
                      variant="tertiary"
                      className="h-12 pr-8 text-2xl sm:text-3xl font-mono font-bold"
                    />
                    <span className="absolute right-3.5 bottom-3.5 font-mono font-bold text-label/60 select-none pointer-events-none">%</span>
                  </div>

                  {/* Atalhos Rápidos de Porcentagem */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-xs font-semibold text-foreground shrink-0 mr-1.5">
                      {locale === "pt" ? "Atalhos:" : locale === "es" ? "Atajos:" : "Presets:"}
                    </span>
                    {QUICK_PERCENTAGES.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setPoPct(pct)}
                        className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-[2px] border transition-colors cursor-pointer ${
                          poPct === pct
                            ? "bg-secondary text-background border-secondary"
                            : "bg-tertiary border-border text-foreground hover:border-secondary"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                  <AppInput
                    id="po-num"
                    label={t("percentOf.label2")}
                    labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={poNum}
                    onChange={(e) => setPoNum(e.target.value)}
                    placeholder="0"
                    variant="tertiary"
                    className="h-12 text-2xl sm:text-3xl font-mono font-bold"
                  />
                </div>
              </div>

              {/* Fórmula Passo a Passo */}
              {poResult !== null && (
                <div className="p-3 bg-background border border-border rounded-[2px] text-xs font-mono text-label flex flex-wrap items-center justify-between gap-2">
                  <span>
                    {t("formula")}: <strong className="text-foreground">({poNum} × {poPct}) ÷ 100</strong>
                  </span>
                  <span className="text-primary font-bold">
                    = {poResult}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: X é qual % de Y */}
          {activeTab === "whatPercent" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                  <AppInput
                    id="wp-x"
                    label={t("whatPercent.label1")}
                    labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={wpX}
                    onChange={(e) => setWpX(e.target.value)}
                    placeholder="0"
                    variant="tertiary"
                    className="h-12 text-2xl sm:text-3xl font-mono font-bold"
                  />
                </div>

                <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                  <AppInput
                    id="wp-y"
                    label={t("whatPercent.label2")}
                    labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={wpY}
                    onChange={(e) => setWpY(e.target.value)}
                    placeholder="0"
                    variant="tertiary"
                    className="h-12 text-2xl sm:text-3xl font-mono font-bold"
                  />
                </div>
              </div>

              {/* Fórmula Passo a Passo */}
              {wpResult !== null && (
                <div className="p-3 bg-background border border-border rounded-[2px] text-xs font-mono text-label flex flex-wrap items-center justify-between gap-2">
                  <span>
                    {t("formula")}: <strong className="text-foreground">({wpX} ÷ {wpY}) × 100</strong>
                  </span>
                  <span className="text-primary font-bold">
                    = {wpResult}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Variação de X para Y */}
          {activeTab === "percentChange" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                  <AppInput
                    id="pc-from"
                    label={t("percentChange.label1")}
                    labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={pcFrom}
                    onChange={(e) => setPcFrom(e.target.value)}
                    placeholder="0"
                    variant="tertiary"
                    className="h-12 text-2xl sm:text-3xl font-mono font-bold"
                  />
                </div>

                <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
                  <AppInput
                    id="pc-to"
                    label={t("percentChange.label2")}
                    labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={pcTo}
                    onChange={(e) => setPcTo(e.target.value)}
                    placeholder="0"
                    variant="tertiary"
                    className="h-12 text-2xl sm:text-3xl font-mono font-bold"
                  />
                </div>
              </div>

              {/* Fórmula Passo a Passo */}
              {pcData && (
                <div className="p-3 bg-background border border-border rounded-[2px] text-xs font-mono text-label flex flex-wrap items-center justify-between gap-2">
                  <span>
                    {locale === "pt" ? "Diferença" : locale === "es" ? "Diferencia" : "Difference"}: <strong className="text-foreground">{pcData.diff > 0 ? `+${pcData.diff}` : pcData.diff}</strong>
                    {" · "}{t("formula")}: <strong className="text-foreground">(({pcTo} - {pcFrom}) ÷ {pcFrom}) × 100</strong>
                  </span>
                  <span className={`font-bold ${pcData.isIncrease ? "text-emerald-500" : "text-red-500"}`}>
                    = {pcData.isIncrease ? `+${pcData.value}%` : `-${pcData.value}%`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Bloco de Resultado em Destaque */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between gap-4"
          >
            <div>
              <span className="text-xs uppercase font-mono font-semibold text-label tracking-wider block">
                {activeTab === "percentChange"
                  ? t("percentChange.resultPrefix")
                  : t("percentOf.resultPrefix")}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span
                  data-testid="percentage-result"
                  className="text-2xl sm:text-3xl font-mono font-bold text-primary tracking-tight"
                >
                  {currentResultString || "—"}
                </span>
              </div>
            </div>

            {/* Ações: Copiar & Limpar */}
            <div className="flex items-center gap-2">
              <AppButton
                type="button"
                color={copied ? "primary" : "panel"}
                onClick={handleCopy}
                disabled={!currentResultString}
                className="h-8 px-3 text-xs font-mono uppercase flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t("copyResult")}</span>
                  </>
                )}
              </AppButton>

              <button
                type="button"
                onClick={clearCurrentTab}
                title={t("clear")}
                aria-label={t("clear")}
                className="w-8 h-8 rounded-[2px] bg-background border border-border flex items-center justify-center text-label hover:text-foreground hover:border-primary transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </AppCard>
      </section>

      {/* Seção Padronizada de Detalhes */}
      <PercentageCalculatorContent
        richContent={richContent}
        faqs={faqs}
        locale={locale}
      />
      </div>
    </main>
  );
}

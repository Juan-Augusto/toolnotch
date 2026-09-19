"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { convert, formatResult } from "@/lib/units";
import { UnitCategory } from "@/lib/unitTypes";
import { UNITS, UNIT_LABELS } from "@/data/units";
import { TEMPERATURE_UNITS } from "@/lib/temperature";
import AppQuickReferenceTable from "./AppQuickReferenceTable";
import { AppCard, AppInput, AppSelect } from "@/components/ui";
import { ArrowUpDown } from "lucide-react";

interface ConversionWidgetProps {
  category: UnitCategory;
  defaultFrom?: string;
  defaultTo?: string;
}

function getUnitsForCategory(category: UnitCategory): string[] {
  if (category === "temperature") return [...TEMPERATURE_UNITS];
  return Object.keys(UNITS[category] ?? {});
}

function getDefaultUnits(category: UnitCategory): [string, string] {
  const units = getUnitsForCategory(category);
  return [units[0], units[1] ?? units[0]];
}

export default function AppConversionWidget({
  category,
  defaultFrom,
  defaultTo,
}: ConversionWidgetProps) {
  const t = useTranslations("convert.shared");
  const tu = useTranslations("convert.units");
  const getUnitLabel = useCallback(
    (u: string) =>
      typeof tu.has === "function" && tu.has(u) ? tu(u) : (UNIT_LABELS[u] ?? u),
    [tu],
  );
  const units = useMemo(() => getUnitsForCategory(category), [category]);
  const [defaults] = useState(() => getDefaultUnits(category));
  const [from, setFrom] = useState(defaultFrom ?? defaults[0]);
  const [to, setTo] = useState(defaultTo ?? defaults[1]);
  const [inputValue, setInputValue] = useState("1");

  useEffect(() => {
    if (defaultFrom) setFrom(defaultFrom);
  }, [defaultFrom]);

  useEffect(() => {
    if (defaultTo) setTo(defaultTo);
  }, [defaultTo]);

  const unitOptions = useMemo(() => {
    return units.map((u) => ({
      value: u,
      label: getUnitLabel(u),
    }));
  }, [units, getUnitLabel]);

  const result = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return "";
    return formatResult(convert(num, from, to, category));
  }, [inputValue, from, to, category]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setInputValue(result || "1");
  };

  return (
    <div className="space-y-4">
      <AppCard border cornerAccents={true} className="p-4 sm:p-6 bg-tertiary">
        <div className="space-y-3">
          {/* Bloco De / Origem */}
          <div className="bg-background border border-border rounded-[2px] p-3.5 sm:p-4.5">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,260px] md:grid-cols-[1fr,300px] gap-3.5 items-end">
              <div>
                <AppInput
                  id="widget-input-amount"
                  label={t("enterValue")}
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

                {/* Atalhos Rápidos */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-xs font-semibold text-foreground shrink-0 mr-1.5">
                    Atalhos:
                  </span>
                  {["1", "5", "10", "50", "100"].map((amt) => (
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
                  id="widget-select-from"
                  name="widget-select-from"
                  label={t("from")}
                  labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
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
              title={t("swap")}
              aria-label={t("swap")}
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
                  id="widget-conversion-result-container"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={t("result")}
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
                  id="widget-select-to"
                  name="widget-select-to"
                  label={t("to")}
                  labelClassName="block text-xs font-mono font-semibold uppercase text-label tracking-wide mb-2 cursor-pointer"
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

        {/* Linha de Equação */}
        {result && result !== "—" && (
          <div className="mt-4 pt-3.5 border-t border-border/60 text-center text-xs font-mono text-label">
            {inputValue} {getUnitLabel(from)} ={" "}
            <span className="font-semibold text-foreground">
              {result} {getUnitLabel(to)}
            </span>
          </div>
        )}
      </AppCard>

      <AppQuickReferenceTable fromUnit={from} toUnit={to} category={category} />
    </div>
  );
}

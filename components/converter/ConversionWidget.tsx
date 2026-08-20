"use client";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { convert, formatResult } from "@/lib/units";
import { UnitCategory } from "@/lib/unitTypes";
import { UNITS, UNIT_LABELS } from "@/data/units";
import { TEMPERATURE_UNITS } from "@/lib/temperature";
import QuickReferenceTable from "./QuickReferenceTable";
import Button from "../Button";
import { ArrowLeftRightIcon } from "lucide-react";
import Label from "../Label";

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

export default function ConversionWidget({
  category,
  defaultFrom,
  defaultTo,
}: ConversionWidgetProps) {
  const t = useTranslations("convert.shared");
  const tu = useTranslations("convert.units");
  const getUnitLabel = (u: string) => (typeof tu.has === 'function' && tu.has(u)) ? tu(u) : (UNIT_LABELS[u] ?? u);
  const units = getUnitsForCategory(category);
  const [defaults] = useState(() => getDefaultUnits(category));
  const [from, setFrom] = useState(defaultFrom ?? defaults[0]);
  const [to, setTo] = useState(defaultTo ?? defaults[1]);
  const [inputValue, setInputValue] = useState("1");

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
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label>{t("from")}</Label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full input mb-2"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {getUnitLabel(u)}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full input"
            placeholder={t("enterValue")}
          />
        </div>

        <Button
          onClick={swap}
          color="primary"
          rounded
          small
          className="mb-1"
          title={t("swap")}
        >
          <ArrowLeftRightIcon className="w-4.5 h-4.5" />
        </Button>

        <div className="flex-1">
          <Label>{t("to")}</Label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full input mb-2"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {getUnitLabel(u)}
              </option>
            ))}
          </select>
          <div data-testid="conversion-result" className="w-full px-4 py-2! input bg-surface font-mono font-semibold">
            {result || "—"}
          </div>
        </div>
      </div>

      {result && (
        <p className="text-sm text-gray-500 text-center">
          {inputValue} {getUnitLabel(from)} ={" "}
          <strong>
            {result} {getUnitLabel(to)}
          </strong>
        </p>
      )}

      <QuickReferenceTable fromUnit={from} toUnit={to} category={category} />
    </div>
  );
}

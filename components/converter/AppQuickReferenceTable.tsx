"use client";

import { useMemo } from "react";
import { convert, formatResult } from "@/lib/units";
import { UnitCategory } from "@/lib/unitTypes";
import { UNIT_LABELS } from "@/data/units";
import { useTranslations } from "next-intl";
import AppTable, {
  AppTableHeader,
  AppTableBody,
  AppTableRow,
  AppTableHead,
  AppTableCell,
} from "@/components/ui/AppTable";

const REFERENCE_VALUES = [1, 2, 5, 10, 20, 50, 100, 500];

interface QuickReferenceTableProps {
  fromUnit: string;
  toUnit: string;
  category: UnitCategory;
}

export default function AppQuickReferenceTable({
  fromUnit,
  toUnit,
  category,
}: QuickReferenceTableProps) {
  const t = useTranslations("convert.shared");
  const tu = useTranslations("convert.units");

  const forwardRows = useMemo(() => {
    return REFERENCE_VALUES.map((val) => ({
      from: val,
      to: formatResult(convert(val, fromUnit, toUnit, category)),
    }));
  }, [fromUnit, toUnit, category]);

  const reverseRows = useMemo(() => {
    return REFERENCE_VALUES.map((val) => ({
      from: val,
      to: formatResult(convert(val, toUnit, fromUnit, category)),
    }));
  }, [fromUnit, toUnit, category]);

  const fromLabel =
    typeof tu.has === "function" && tu.has(fromUnit)
      ? tu(fromUnit)
      : (UNIT_LABELS[fromUnit] ?? fromUnit);
  const toLabel =
    typeof tu.has === "function" && tu.has(toUnit)
      ? tu(toUnit)
      : (UNIT_LABELS[toUnit] ?? toUnit);

  const isSameUnit = fromUnit === toUnit;

  return (
    <section aria-labelledby="quick-reference-heading" className="mt-8 pt-6 border-t border-border/80">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2.5 sm:mb-3.5">
        <h2
          id="quick-reference-heading"
          className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono"
        >
          {t("quickReference")}
        </h2>
        <span className="text-xs font-mono text-label">
          {fromLabel} ⇄ {toLabel}
        </span>
      </div>

      <div className={`grid grid-cols-1 ${isSameUnit ? "" : "sm:grid-cols-2"} gap-3.5 sm:gap-4`}>
        {/* Tabela De -> Para */}
        <AppTable hoverable={true} aria-label={`${fromLabel} → ${toLabel}`}>
          <AppTableHeader>
            <AppTableRow hoverable={false}>
              <AppTableHead>{fromLabel}</AppTableHead>
              <AppTableHead align="right">{toLabel}</AppTableHead>
            </AppTableRow>
          </AppTableHeader>
          <AppTableBody>
            {forwardRows.map((row, i) => (
              <AppTableRow key={i}>
                <AppTableCell className="text-label font-normal">
                  {row.from}
                </AppTableCell>
                <AppTableCell align="right" className="font-semibold text-foreground">
                  {row.to}
                </AppTableCell>
              </AppTableRow>
            ))}
          </AppTableBody>
        </AppTable>

        {/* Tabela Para -> De (Bilateral) */}
        {!isSameUnit && (
          <AppTable hoverable={true} aria-label={`${toLabel} → ${fromLabel}`}>
            <AppTableHeader>
              <AppTableRow hoverable={false}>
                <AppTableHead>{toLabel}</AppTableHead>
                <AppTableHead align="right">{fromLabel}</AppTableHead>
              </AppTableRow>
            </AppTableHeader>
            <AppTableBody>
              {reverseRows.map((row, i) => (
                <AppTableRow key={i}>
                  <AppTableCell className="text-label font-normal">
                    {row.from}
                  </AppTableCell>
                  <AppTableCell align="right" className="font-semibold text-foreground">
                    {row.to}
                  </AppTableCell>
                </AppTableRow>
              ))}
            </AppTableBody>
          </AppTable>
        )}
      </div>
    </section>
  );
}


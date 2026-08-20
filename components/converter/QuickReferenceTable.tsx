"use client";
import { useMemo } from "react";
import { convert, formatResult } from "@/lib/units";
import { UnitCategory } from "@/lib/unitTypes";
import { UNIT_LABELS } from "@/data/units";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";

const REFERENCE_VALUES = [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 500, 1000];

interface QuickReferenceTableProps {
  fromUnit: string;
  toUnit: string;
  category: UnitCategory;
}

export default function QuickReferenceTable({
  fromUnit,
  toUnit,
  category,
}: QuickReferenceTableProps) {
  const t = useTranslations("convert.shared");
  const tu = useTranslations("convert.units");

  const rows = useMemo(() => {
    return REFERENCE_VALUES.slice(0, 8).map((val) => ({
      from: val,
      to: formatResult(convert(val, fromUnit, toUnit, category)),
    }));
  }, [fromUnit, toUnit, category]);

  const fromLabel = (typeof tu.has === 'function' && tu.has(fromUnit)) ? tu(fromUnit) : (UNIT_LABELS[fromUnit] ?? fromUnit);
  const toLabel = (typeof tu.has === 'function' && tu.has(toUnit)) ? tu(toUnit) : (UNIT_LABELS[toUnit] ?? toUnit);

  return (
    <div className="mt-8 bg-card border border-bd-base rounded-2xl overflow-hidden">
      <div className="bg-gray-50/80 dark:bg-surface px-5 py-3 border-b border-bd-base flex items-center gap-2">
        <Zap className="w-4 h-4 text-neon" />
        <h3 className="text-xs font-bold text-tx-secondary uppercase tracking-wider!">
          {t("quickReference")}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-tx-secondary bg-gray-50/50 dark:bg-surface/50 border-b border-bd-base">
            <tr>
              <th className="px-5 py-3 font-semibold w-1/2">{fromLabel}</th>
              <th className="px-5 py-3 font-semibold w-1/2">{toLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bd-base">
            {rows.map((row, i) => (
              <tr
                key={i}
                className="group hover:bg-gray-50 dark:hover:bg-surface/80 transition-colors"
              >
                <td className="px-5 py-2.5 text-tx-secondary group-hover:text-tx-primary transition-colors">
                  {row.from}
                </td>
                <td className="px-5 py-2.5 font-bold text-tx-primary">
                  {row.to}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

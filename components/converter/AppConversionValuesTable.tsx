import { buildConversionRows } from "@/lib/conversionTable";
import { UnitCategory } from "@/lib/unitTypes";
import AppTable, {
  AppTableHeader,
  AppTableBody,
  AppTableRow,
  AppTableHead,
  AppTableCell,
} from "@/components/ui/AppTable";

interface ConversionValuesTableProps {
  fromUnit: string;
  toUnit: string;
  category: UnitCategory;
  /** Localised label for the "from" column header, e.g. "Polegadas (in)". */
  fromLabel: string;
  /** Localised label for the "to" column header. */
  toLabel: string;
  /** Localised <h2> for the section. */
  heading: string;
  /** Localised sentence introducing the table. */
  caption: string;
}

/**
 * Common-values reference table for a conversion pair.
 *
 * Server component — the numbers are computed at build time from the same
 * `convert()` used by the live widget, so the table can never disagree with
 * the tool above it. Rendered as a real <table> with scoped headers so it is
 * a candidate for a featured snippet.
 */
export default function AppConversionValuesTable({
  fromUnit,
  toUnit,
  category,
  fromLabel,
  toLabel,
  heading,
  caption,
}: ConversionValuesTableProps) {
  const rows = buildConversionRows(fromUnit, toUnit, category);

  return (
    <section aria-labelledby="conversion-table-heading" className="mt-8 sm:mt-10">
      <h2
        id="conversion-table-heading"
        className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground font-mono mb-2 sm:mb-3"
      >
        {heading}
      </h2>
      <p className="leading-relaxed text-label font-mono text-xs sm:text-sm mb-4">
        {caption}
      </p>
      <AppTable hoverable={true}>
        <AppTableHeader>
          <AppTableRow hoverable={false}>
            <AppTableHead>{fromLabel}</AppTableHead>
            <AppTableHead align="right">{toLabel}</AppTableHead>
          </AppTableRow>
        </AppTableHeader>
        <AppTableBody>
          {rows.map((row) => (
            <AppTableRow key={row.from}>
              <AppTableCell className="text-label font-normal">
                {row.from}
              </AppTableCell>
              <AppTableCell align="right" className="font-bold text-foreground">
                {row.to}
              </AppTableCell>
            </AppTableRow>
          ))}
        </AppTableBody>
      </AppTable>
    </section>
  );
}

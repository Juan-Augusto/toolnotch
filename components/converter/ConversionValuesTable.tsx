import { buildConversionRows } from '@/lib/conversionTable'
import { UnitCategory } from '@/lib/unitTypes'

interface ConversionValuesTableProps {
  fromUnit: string
  toUnit: string
  category: UnitCategory
  /** Localised label for the "from" column header, e.g. "Polegadas (in)". */
  fromLabel: string
  /** Localised label for the "to" column header. */
  toLabel: string
  /** Localised <h2> for the section. */
  heading: string
  /** Localised sentence introducing the table. */
  caption: string
}

/**
 * Common-values reference table for a conversion pair.
 *
 * Server component — the numbers are computed at build time from the same
 * `convert()` used by the live widget, so the table can never disagree with
 * the tool above it. Rendered as a real <table> with scoped headers so it is
 * a candidate for a featured snippet.
 */
export default function ConversionValuesTable({
  fromUnit,
  toUnit,
  category,
  fromLabel,
  toLabel,
  heading,
  caption,
}: ConversionValuesTableProps) {
  const rows = buildConversionRows(fromUnit, toUnit, category)

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-3 section-heading">{heading}</h2>
      <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
        {caption}
      </p>
      <div className="card-neon p-4 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th
                scope="col"
                className="text-left font-semibold pb-2 border-b"
                style={{ color: 'var(--text-primary)', borderColor: 'var(--base-border)' }}
              >
                {fromLabel}
              </th>
              <th
                scope="col"
                className="text-left font-semibold pb-2 border-b"
                style={{ color: 'var(--text-primary)', borderColor: 'var(--base-border)' }}
              >
                {toLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.from}>
                <th
                  scope="row"
                  className="text-left font-normal py-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {row.from}
                </th>
                <td className="py-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {row.to}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

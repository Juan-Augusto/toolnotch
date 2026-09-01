import Link from 'next/link'

export interface GradeConversionRow {
  /** Brazilian 0–10 band, e.g. "9,5 – 10,0" */
  decimal: string
  /** Brazilian 0–100 band, e.g. "95 – 100" */
  percent: string
  /** US letter grade, e.g. "A−" */
  letter: string
  /** GPA points on the 4.0 scale, e.g. "4.0" */
  gpa: string
}

export interface GradeConversionColumns {
  decimal: string
  percent: string
  letter: string
  gpa: string
}

interface Props {
  heading: string
  intro: string
  columns: GradeConversionColumns
  rows: GradeConversionRow[]
  disclaimer: string
  exampleHeading: string
  exampleBody: string
  ctaLabel: string
  ctaHref: string
}

/**
 * Brazilian grade (0–10 / 0–100) to US GPA 4.0 conversion table.
 * Presentational only — every string comes from the caller's message catalog.
 */
export default function BrGradeConversionTable({
  heading,
  intro,
  columns,
  rows,
  disclaimer,
  exampleHeading,
  exampleBody,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <section
      className="space-y-5 animate-fade-in-up"
      style={{ color: 'var(--text-secondary)' }}
    >
      <h2 className="text-xl font-bold section-heading">{heading}</h2>

      <p className="leading-relaxed">{intro}</p>

      <div className="overflow-x-auto card-neon p-1">
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">{heading}</caption>
          <thead>
            <tr className="text-left">
              <th scope="col" className="px-3 py-2 font-semibold">{columns.decimal}</th>
              <th scope="col" className="px-3 py-2 font-semibold">{columns.percent}</th>
              <th scope="col" className="px-3 py-2 font-semibold">{columns.letter}</th>
              <th scope="col" className="px-3 py-2 font-semibold">{columns.gpa}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.gpa + row.decimal} className="border-t border-bd-base">
                <td className="px-3 py-2 whitespace-nowrap">{row.decimal}</td>
                <td className="px-3 py-2 whitespace-nowrap">{row.percent}</td>
                <td className="px-3 py-2 whitespace-nowrap font-medium">{row.letter}</td>
                <td className="px-3 py-2 whitespace-nowrap font-semibold">{row.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="protip-neon">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {disclaimer}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {exampleHeading}
        </h3>
        <p className="leading-relaxed">{exampleBody}</p>
      </div>

      <p className="leading-relaxed">
        <Link href={ctaHref} className="underline underline-offset-2 font-medium">
          {ctaLabel}
        </Link>
      </p>
    </section>
  )
}

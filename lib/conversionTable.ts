import { convert, formatResult } from './units'
import { UnitCategory } from './unitTypes'

/**
 * The reference values rendered in <ConversionValuesTable> on every
 * `/tools/convert/[slug]` page. Chosen to cover the range people actually
 * search for ("how many cm is 10 inches") while staying small enough to be a
 * featured-snippet candidate.
 */
export const CONVERSION_TABLE_VALUES = [1, 2, 5, 10, 20, 50, 100] as const

export interface ConversionTableRow {
  /** The input value, in the `from` unit. */
  from: number
  /** The converted value, already formatted for display. */
  to: string
}

/**
 * Builds the rows of the common-values table for a conversion pair.
 *
 * Pure wrapper over `convert()` + `formatResult()` — it does not implement any
 * conversion maths of its own, so the numbers always agree with the live
 * widget on the same page.
 */
export function buildConversionRows(
  from: string,
  to: string,
  category: UnitCategory,
  values: readonly number[] = CONVERSION_TABLE_VALUES
): ConversionTableRow[] {
  return values.map((value) => ({
    from: value,
    to: formatResult(convert(value, from, to, category)),
  }))
}

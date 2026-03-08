import { UNITS } from '@/data/units'
import { convertTemperature } from './temperature'
import { UnitCategory } from './unitTypes'

export function convert(value: number, from: string, to: string, category: UnitCategory): number {
  if (category === 'temperature') {
    return convertTemperature(value, from, to)
  }

  const categoryUnits = UNITS[category]
  if (!categoryUnits) return value

  const fromFactor = categoryUnits[from]
  const toFactor = categoryUnits[to]
  if (fromFactor === undefined || toFactor === undefined) return value

  return value * fromFactor / toFactor
}

export function formatResult(value: number): string {
  if (isNaN(value) || !isFinite(value)) return 'N/A'
  if (Math.abs(value) === 0) return '0'
  if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(6)
  }
  // Show up to 8 significant figures, remove trailing zeros
  return parseFloat(value.toPrecision(8)).toString()
}

export type UnitCategory =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'time'
  | 'data'
  | 'pressure'

export interface Unit {
  label: string
  factor: number // relative to base unit; ignored for temperature
}

export interface UnitGroup {
  label: string
  base: string // base unit key
  units: Record<string, Unit>
}

export interface ConversionResult {
  value: number
  formatted: string
}

export interface CurrencyRateCache {
  rates: Record<string, number>
  base: string
  ts: number // Date.now() timestamp
}

export interface ConversionPair {
  slug: string
  category: UnitCategory | 'currency'
  from: string
  to: string
  title: string
  description: string
}

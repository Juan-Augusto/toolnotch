export type UnitCategory =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'time'
  | 'digital-storage'
  | 'pressure'

export interface UnitOption {
  value: string
  label: string
  factor?: number
}

export interface ConversionPair {
  slug: string
  category: UnitCategory
  from: string
  to: string
  title: string
  description: string
}

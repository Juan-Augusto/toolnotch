export type Sex = 'male' | 'female'
export type UnitSystem = 'metric' | 'imperial'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export interface BmiResult {
  bmi: number
  category: 'underweight' | 'normal' | 'overweight' | 'obese'
}

export interface TdeeResult {
  bmr: number
  tdee: number
  goals: {
    maintain: number
    lose_slow: number   // tdee - 250
    lose_fast: number   // tdee - 500
    gain_slow: number   // tdee + 250
    gain_fast: number   // tdee + 500
  }
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary:   1.2,
  light:       1.375,
  moderate:    1.55,
  active:      1.725,
  very_active: 1.9,
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const rounded = parseFloat(bmi.toFixed(1))
  let category: BmiResult['category']
  if (rounded < 18.5) category = 'underweight'
  else if (rounded < 25) category = 'normal'
  else if (rounded < 30) category = 'overweight'
  else category = 'obese'
  return { bmi: rounded, category }
}

export function calculateTdee(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
  activity: ActivityLevel,
): TdeeResult {
  // Mifflin-St Jeor
  const bmr =
    sex === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity]
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    goals: {
      maintain:  Math.round(tdee),
      lose_slow: Math.round(tdee - 250),
      lose_fast: Math.round(tdee - 500),
      gain_slow: Math.round(tdee + 250),
      gain_fast: Math.round(tdee + 500),
    },
  }
}

// Unit conversions
export function lbsToKg(lbs: number): number {
  return parseFloat((lbs * 0.453592).toFixed(1))
}
export function kgToLbs(kg: number): number {
  return parseFloat((kg / 0.453592).toFixed(1))
}
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  return { feet: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) }
}
export function feetInchesToCm(feet: number, inches: number): number {
  return parseFloat(((feet * 12 + inches) * 2.54).toFixed(1))
}

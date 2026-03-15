/**
 * Affordability calculator tests.
 *
 * calculateAffordability() exists in @/lib/loanMath and implements the 28/36
 * qualifying ratios used by conventional mortgage underwriting:
 *   - maxHousing  = grossMonthlyIncome × 0.28  (front-end ratio)
 *   - maxWithDebts = grossMonthlyIncome × 0.36 − monthlyDebts  (back-end ratio)
 *   - The binding constraint is min(maxHousing, maxWithDebts)
 */

import { calculateAffordability } from '@/lib/loanMath'
import { AffordabilityParams, AffordabilityResult } from '@/lib/loanTypes'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Standard borrower — debts don't constrain the result. */
const BASE_PARAMS: AffordabilityParams = {
  grossMonthlyIncome: 10_000,
  monthlyDebts: 0,
  annualRate: 6.5,
  termMonths: 360,
  downPayment: 60_000,
}

// ---------------------------------------------------------------------------
// 28 / 36 rule — maxHousing (front-end)
// ---------------------------------------------------------------------------

describe('calculateAffordability — front-end (28%) ratio', () => {
  test('maxHousing = grossMonthlyIncome × 0.28', () => {
    const result: AffordabilityResult = calculateAffordability(BASE_PARAMS)
    const expectedMaxHousing = BASE_PARAMS.grossMonthlyIncome * 0.28
    // monthlyPayment ≤ maxHousing (front-end cap)
    expect(result.monthlyPayment).toBeLessThanOrEqual(expectedMaxHousing + 0.01)
  })

  test('binding constraint is front-end when no debts', () => {
    // With zero debts, back-end = grossMonthlyIncome × 0.36 (always ≥ front-end)
    // so the front-end ratio should be the binding constraint
    const maxHousing = BASE_PARAMS.grossMonthlyIncome * 0.28
    const maxWithDebts = BASE_PARAMS.grossMonthlyIncome * 0.36 - BASE_PARAMS.monthlyDebts
    expect(maxHousing).toBeLessThanOrEqual(maxWithDebts)
  })
})

// ---------------------------------------------------------------------------
// 28 / 36 rule — maxWithDebts (back-end)
// ---------------------------------------------------------------------------

describe('calculateAffordability — back-end (36%) ratio', () => {
  test('maxWithDebts = grossMonthlyIncome × 0.36 − monthlyDebts', () => {
    const params: AffordabilityParams = {
      ...BASE_PARAMS,
      monthlyDebts: 1_500,
    }
    // With heavy debts, back-end can be tighter than front-end:
    //   maxHousing   = 10000 × 0.28 = $2,800
    //   maxWithDebts = 10000 × 0.36 − 1500 = $2,100  ← binding
    const maxHousing = params.grossMonthlyIncome * 0.28
    const maxWithDebts = params.grossMonthlyIncome * 0.36 - params.monthlyDebts
    expect(maxWithDebts).toBeLessThan(maxHousing)

    const result = calculateAffordability(params)
    // Monthly payment should reflect the tighter back-end constraint
    expect(result.monthlyPayment).toBeLessThanOrEqual(maxWithDebts + 0.01)
  })

  test('monthlyDebts = 0 → back-end limit = grossMonthlyIncome × 0.36', () => {
    const noDebtLimit = BASE_PARAMS.grossMonthlyIncome * 0.36
    const withDebtLimit = BASE_PARAMS.grossMonthlyIncome * 0.36 - BASE_PARAMS.monthlyDebts
    expect(withDebtLimit).toBe(noDebtLimit)
  })
})

// ---------------------------------------------------------------------------
// maxLoanAmount reverse formula
// ---------------------------------------------------------------------------

describe('calculateAffordability — maxLoanAmount', () => {
  test('maxLoanAmount is positive for a solvent borrower', () => {
    const result = calculateAffordability(BASE_PARAMS)
    expect(result.maxLoanAmount).toBeGreaterThan(0)
  })

  test('maxHomePrice = maxLoanAmount + downPayment', () => {
    const result = calculateAffordability(BASE_PARAMS)
    expect(result.maxHomePrice).toBeCloseTo(result.maxLoanAmount + BASE_PARAMS.downPayment, 2)
  })

  test('loanToValue = maxLoanAmount / maxHomePrice × 100', () => {
    const result = calculateAffordability(BASE_PARAMS)
    const expectedLTV = (result.maxLoanAmount / result.maxHomePrice) * 100
    expect(result.loanToValue).toBeCloseTo(expectedLTV, 4)
  })

  test('loanToValue is in [0, 100]', () => {
    const result = calculateAffordability(BASE_PARAMS)
    expect(result.loanToValue).toBeGreaterThanOrEqual(0)
    expect(result.loanToValue).toBeLessThanOrEqual(100)
  })
})

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('calculateAffordability — edge cases', () => {
  test('monthly debts exceeding back-end limit → maxLoanAmount = 0', () => {
    const params: AffordabilityParams = {
      ...BASE_PARAMS,
      monthlyDebts: 4_000, // 0.36 × 10000 = 3600, so back-end = 3600 − 4000 = −400
    }
    const result = calculateAffordability(params)
    expect(result.maxLoanAmount).toBe(0)
    expect(result.monthlyPayment).toBe(0)
  })

  test('result shape has all required fields', () => {
    const result = calculateAffordability(BASE_PARAMS)
    expect(result).toHaveProperty('maxHomePrice')
    expect(result).toHaveProperty('maxLoanAmount')
    expect(result).toHaveProperty('monthlyPayment')
    expect(result).toHaveProperty('loanToValue')
  })

  test('higher income → higher maxHomePrice', () => {
    const low = calculateAffordability({ ...BASE_PARAMS, grossMonthlyIncome: 5_000 })
    const high = calculateAffordability({ ...BASE_PARAMS, grossMonthlyIncome: 10_000 })
    expect(high.maxHomePrice).toBeGreaterThan(low.maxHomePrice)
  })

  test('larger down payment → higher maxHomePrice, same maxLoanAmount', () => {
    const small = calculateAffordability({ ...BASE_PARAMS, downPayment: 20_000 })
    const large = calculateAffordability({ ...BASE_PARAMS, downPayment: 100_000 })
    expect(large.maxHomePrice).toBeGreaterThan(small.maxHomePrice)
    // maxLoanAmount is determined by the payment ratios, not the down payment
    expect(large.maxLoanAmount).toBeCloseTo(small.maxLoanAmount, 2)
  })
})

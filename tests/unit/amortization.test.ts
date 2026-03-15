import { calculateLoan } from '@/lib/loanMath'
import { AmortizationRow } from '@/lib/loanTypes'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toCents(n: number): number {
  return Math.round(n * 100) / 100
}

// Standard test fixture — 30-year mortgage
const MORTGAGE = { principal: 300_000, annualRate: 6.5, termMonths: 360 }
// Shorter fixture for faster row-by-row assertions
const SHORT_LOAN = { principal: 10_000, annualRate: 6.0, termMonths: 24 }

// ---------------------------------------------------------------------------
// Amortization schedule — structure
// ---------------------------------------------------------------------------

describe('amortization schedule — structure', () => {
  test('row count equals termMonths', () => {
    const { amortization } = calculateLoan(MORTGAGE)
    expect(amortization).toHaveLength(MORTGAGE.termMonths)
  })

  test('months are sequential starting at 1', () => {
    const { amortization } = calculateLoan(SHORT_LOAN)
    amortization.forEach((row: AmortizationRow, idx: number) => {
      expect(row.month).toBe(idx + 1)
    })
  })

  test('each row has all required fields', () => {
    const { amortization } = calculateLoan(SHORT_LOAN)
    amortization.forEach((row: AmortizationRow) => {
      expect(row).toHaveProperty('month')
      expect(row).toHaveProperty('payment')
      expect(row).toHaveProperty('principal')
      expect(row).toHaveProperty('interest')
      expect(row).toHaveProperty('balance')
    })
  })

  test('returns empty amortization for zero principal', () => {
    const { amortization } = calculateLoan({ principal: 0, annualRate: 6.5, termMonths: 60 })
    expect(amortization).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Amortization schedule — first row correctness
// ---------------------------------------------------------------------------

describe('amortization schedule — first row', () => {
  test('first-row interest = P × monthly_rate', () => {
    const { amortization, monthlyPayment } = calculateLoan(MORTGAGE)
    const expectedInterest = MORTGAGE.principal * (MORTGAGE.annualRate / 12 / 100)
    expect(amortization[0].interest).toBeCloseTo(expectedInterest, 6)
  })

  test('first-row principal = payment − interest', () => {
    const { amortization, monthlyPayment } = calculateLoan(MORTGAGE)
    const expectedPrincipal = monthlyPayment - amortization[0].interest
    expect(amortization[0].principal).toBeCloseTo(expectedPrincipal, 6)
  })

  test('first-row balance = P − principal paid', () => {
    const { amortization } = calculateLoan(MORTGAGE)
    const expectedBalance = MORTGAGE.principal - amortization[0].principal
    expect(amortization[0].balance).toBeCloseTo(expectedBalance, 4)
  })

  test('first-row payment equals the computed monthlyPayment', () => {
    const { amortization, monthlyPayment } = calculateLoan(SHORT_LOAN)
    expect(amortization[0].payment).toBeCloseTo(monthlyPayment, 6)
  })
})

// ---------------------------------------------------------------------------
// Amortization schedule — final row correctness
// ---------------------------------------------------------------------------

describe('amortization schedule — final row', () => {
  test('final balance ≤ $0.01 (mortgage 30-year)', () => {
    const { amortization } = calculateLoan(MORTGAGE)
    const lastRow = amortization[amortization.length - 1]
    expect(lastRow.balance).toBeLessThanOrEqual(0.01)
  })

  test('final balance ≤ $0.01 (short loan 24-month)', () => {
    const { amortization } = calculateLoan(SHORT_LOAN)
    const lastRow = amortization[amortization.length - 1]
    expect(lastRow.balance).toBeLessThanOrEqual(0.01)
  })

  test('final balance is non-negative', () => {
    const { amortization } = calculateLoan(MORTGAGE)
    const lastRow = amortization[amortization.length - 1]
    expect(lastRow.balance).toBeGreaterThanOrEqual(0)
  })
})

// ---------------------------------------------------------------------------
// Amortization schedule — running balance decreases monotonically
// ---------------------------------------------------------------------------

describe('amortization schedule — balance trajectory', () => {
  test('balance decreases every month (standard amortization)', () => {
    const { amortization } = calculateLoan(SHORT_LOAN)
    for (let i = 1; i < amortization.length; i++) {
      expect(amortization[i].balance).toBeLessThan(amortization[i - 1].balance)
    }
  })

  test('interest portion decreases over time', () => {
    const { amortization } = calculateLoan(SHORT_LOAN)
    // Interest in last month must be less than interest in first month
    expect(amortization[amortization.length - 1].interest).toBeLessThan(amortization[0].interest)
  })

  test('principal portion increases over time', () => {
    const { amortization } = calculateLoan(SHORT_LOAN)
    // Principal paid in last month must be greater than in first month
    expect(amortization[amortization.length - 1].principal).toBeGreaterThan(amortization[0].principal)
  })
})

// ---------------------------------------------------------------------------
// Amortization schedule — aggregate totals
// ---------------------------------------------------------------------------

describe('amortization schedule — aggregate totals', () => {
  const cases: Array<[string, { principal: number; annualRate: number; termMonths: number }]> = [
    ['30-year mortgage', MORTGAGE],
    ['24-month loan', SHORT_LOAN],
    ['15-year mortgage', { principal: 200_000, annualRate: 5.0, termMonths: 180 }],
  ]

  test.each(cases)(
    'sum of principal payments ≈ original loan amount (±$0.01) — %s',
    (_label, params) => {
      const { amortization } = calculateLoan(params)
      const sumPrincipal = amortization.reduce((acc, row) => acc + row.principal, 0)
      expect(Math.abs(sumPrincipal - params.principal)).toBeLessThanOrEqual(0.01)
    },
  )

  test.each(cases)(
    'total interest = (monthlyPayment × n) − principal — %s',
    (_label, params) => {
      const { amortization, monthlyPayment, totalInterest } = calculateLoan(params)
      const expectedInterest = monthlyPayment * params.termMonths - params.principal
      expect(toCents(totalInterest)).toBeCloseTo(toCents(expectedInterest), 2)
    },
  )

  test.each(cases)(
    'sum of interest payments ≈ totalInterest (±$0.01) — %s',
    (_label, params) => {
      const { amortization, totalInterest } = calculateLoan(params)
      const sumInterest = amortization.reduce((acc, row) => acc + row.interest, 0)
      expect(Math.abs(sumInterest - totalInterest)).toBeLessThanOrEqual(0.01)
    },
  )

  test.each(cases)(
    'every row: payment = principal + interest — %s',
    (_label, params) => {
      const { amortization } = calculateLoan(params)
      // Allow floating-point tolerance of $0.0001
      amortization.forEach((row) => {
        expect(Math.abs(row.payment - (row.principal + row.interest))).toBeLessThan(0.0001)
      })
    },
  )
})

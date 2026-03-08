import { LoanParams, LoanResult, AmortizationRow, AffordabilityParams, AffordabilityResult } from './loanTypes'

export function calculateLoan(params: LoanParams): LoanResult {
  const { principal, annualRate, termMonths } = params
  if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, amortization: [] }
  }

  const r = annualRate / 12 / 100
  const n = termMonths
  const monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const amortization: AmortizationRow[] = []
  let balance = principal

  for (let month = 1; month <= n; month++) {
    const interest = balance * r
    const principalPaid = monthlyPayment - interest
    balance = Math.max(0, balance - principalPaid)

    amortization.push({
      month,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    })
  }

  const totalPayment = monthlyPayment * n
  const totalInterest = totalPayment - principal

  return { monthlyPayment, totalPayment, totalInterest, amortization }
}

export function calculateAffordability(params: AffordabilityParams): AffordabilityResult {
  const { grossMonthlyIncome, monthlyDebts, annualRate, termMonths, downPayment } = params

  const maxHousing = grossMonthlyIncome * 0.28
  const maxWithDebts = grossMonthlyIncome * 0.36 - monthlyDebts
  const maxMonthly = Math.min(maxHousing, maxWithDebts)

  const r = annualRate / 12 / 100
  const n = termMonths
  // Reverse formula: P = M * ((1+r)^n - 1) / (r * (1+r)^n)
  const maxLoanAmount = maxMonthly > 0
    ? maxMonthly * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
    : 0

  const maxHomePrice = maxLoanAmount + downPayment
  const loanToValue = maxHomePrice > 0 ? (maxLoanAmount / maxHomePrice) * 100 : 0

  const result = calculateLoan({ principal: maxLoanAmount, annualRate, termMonths })

  return {
    maxHomePrice,
    maxLoanAmount,
    monthlyPayment: result.monthlyPayment,
    loanToValue,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

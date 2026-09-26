import {
  LoanParams,
  LoanResult,
  AmortizationRow,
  AffordabilityParams,
  AffordabilityResult,
  RefinanceParams,
  RefinanceResult,
  CompoundInterestParams,
  CompoundInterestResult,
  CompoundInterestYearRow,
  DebtPayoffParams,
  DebtPayoffResult,
} from './loanTypes'

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

export function calculateRefinance(params: RefinanceParams): RefinanceResult {
  const { currentBalance, currentRate, currentTermMonths, newRate, newTermMonths, closingCosts } = params

  if (currentBalance <= 0 || currentRate <= 0 || currentTermMonths <= 0 || newRate <= 0 || newTermMonths <= 0) {
    return {
      currentMonthlyPayment: 0,
      newMonthlyPayment: 0,
      monthlySavings: 0,
      currentTotalInterest: 0,
      newTotalInterest: 0,
      lifetimeSavings: 0,
      breakEvenMonths: null,
    }
  }

  const currentLoan = calculateLoan({
    principal: currentBalance,
    annualRate: currentRate,
    termMonths: currentTermMonths,
  })

  const newLoan = calculateLoan({
    principal: currentBalance,
    annualRate: newRate,
    termMonths: newTermMonths,
  })

  const monthlySavings = currentLoan.monthlyPayment - newLoan.monthlyPayment
  const breakEvenMonths =
    monthlySavings > 0 && closingCosts >= 0
      ? Math.ceil(closingCosts / monthlySavings)
      : null

  const lifetimeSavings = currentLoan.totalInterest - (newLoan.totalInterest + closingCosts)

  return {
    currentMonthlyPayment: currentLoan.monthlyPayment,
    newMonthlyPayment: newLoan.monthlyPayment,
    monthlySavings,
    currentTotalInterest: currentLoan.totalInterest,
    newTotalInterest: newLoan.totalInterest,
    lifetimeSavings,
    breakEvenMonths,
  }
}

export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
  const { initialDeposit, monthlyContribution, annualRate, years } = params

  if (years <= 0) {
    return {
      endingBalance: Math.max(0, initialDeposit),
      totalContributions: 0,
      totalInterest: 0,
      annualBreakdown: [],
    }
  }

  const annualBreakdown: CompoundInterestYearRow[] = []
  let balance = Math.max(0, initialDeposit)
  let totalContributed = 0
  const monthlyRate = (annualRate / 100) / 12

  for (let year = 1; year <= years; year++) {
    for (let m = 1; m <= 12; m++) {
      const monthInterest = balance * (annualRate > 0 ? monthlyRate : 0)
      balance += monthInterest
      if (monthlyContribution > 0) {
        balance += monthlyContribution
        totalContributed += monthlyContribution
      }
    }

    const principalInvested = Math.max(0, initialDeposit) + totalContributed
    const interestEarned = Math.max(0, balance - principalInvested)

    annualBreakdown.push({
      year,
      principalInvested,
      interestEarned,
      totalBalance: balance,
    })
  }

  const endingBalance = balance
  const totalInterest = Math.max(0, endingBalance - (Math.max(0, initialDeposit) + totalContributed))

  return {
    endingBalance,
    totalContributions: totalContributed,
    totalInterest,
    annualBreakdown,
  }
}

export function calculateDebtPayoff(params: DebtPayoffParams): DebtPayoffResult {
  const { balance, annualRate, monthlyPayment, extraPayment } = params

  if (balance <= 0 || annualRate <= 0 || monthlyPayment <= 0) {
    return {
      standardMonths: 0,
      acceleratedMonths: 0,
      monthsSaved: 0,
      standardTotalInterest: 0,
      acceleratedTotalInterest: 0,
      interestSaved: 0,
    }
  }

  const monthlyRate = (annualRate / 100) / 12

  function simulate(payment: number): { months: number; totalInterest: number } {
    let currentBalance = balance
    let totalInterest = 0
    let months = 0
    const maxMonths = 600

    while (currentBalance > 0.001 && months < maxMonths) {
      months++
      const interest = currentBalance * monthlyRate
      totalInterest += interest
      const principalPaid = Math.min(currentBalance, payment - interest)
      if (principalPaid <= 0) {
        return { months: maxMonths, totalInterest }
      }
      currentBalance -= principalPaid
    }

    return { months, totalInterest }
  }

  const standard = simulate(monthlyPayment)
  const accelerated = simulate(monthlyPayment + Math.max(0, extraPayment))

  const monthsSaved = Math.max(0, standard.months - accelerated.months)
  const interestSaved = Math.max(0, standard.totalInterest - accelerated.totalInterest)

  return {
    standardMonths: standard.months,
    acceleratedMonths: accelerated.months,
    monthsSaved,
    standardTotalInterest: standard.totalInterest,
    acceleratedTotalInterest: accelerated.totalInterest,
    interestSaved,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}


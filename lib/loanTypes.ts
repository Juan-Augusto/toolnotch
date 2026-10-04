export interface LoanParams {
  principal: number
  annualRate: number
  termMonths: number
}

export interface AmortizationRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  amortization: AmortizationRow[]
}

export interface AffordabilityParams {
  grossMonthlyIncome: number
  monthlyDebts: number
  annualRate: number
  termMonths: number
  downPayment: number
}

export interface AffordabilityResult {
  maxHomePrice: number
  maxLoanAmount: number
  monthlyPayment: number
  loanToValue: number
}

export interface RefinanceParams {
  currentBalance: number
  currentRate: number
  currentTermMonths: number
  newRate: number
  newTermMonths: number
  closingCosts: number
}

export interface RefinanceResult {
  currentMonthlyPayment: number
  newMonthlyPayment: number
  monthlySavings: number
  currentTotalInterest: number
  newTotalInterest: number
  lifetimeSavings: number
  breakEvenMonths: number | null
}

export interface CompoundInterestParams {
  initialDeposit: number
  monthlyContribution: number
  annualRate: number
  years: number
  compoundFrequency?: number // times per year: default 12 (monthly)
}

export interface CompoundInterestYearRow {
  year: number
  principalInvested: number
  interestEarned: number
  totalBalance: number
}

export interface CompoundInterestResult {
  endingBalance: number
  totalContributions: number
  totalInterest: number
  annualBreakdown: CompoundInterestYearRow[]
}

export interface DebtPayoffParams {
  balance: number
  annualRate: number
  monthlyPayment: number
  extraPayment: number
}

export interface DebtPayoffResult {
  standardMonths: number
  acceleratedMonths: number
  monthsSaved: number
  standardTotalInterest: number
  acceleratedTotalInterest: number
  interestSaved: number
}

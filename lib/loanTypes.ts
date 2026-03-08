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

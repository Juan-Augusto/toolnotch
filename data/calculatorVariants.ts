export interface CalculatorVariant {
  slug: string
  defaults: { principal: number; annualRate: number; termMonths: number }
  loanType: 'loan' | 'mortgage' | 'car' | 'personal' | 'student' | 'affordability' | 'interest'
}

export const CALCULATOR_VARIANTS: CalculatorVariant[] = [
  {
    slug: 'loan-calculator',
    defaults: { principal: 10000, annualRate: 6.5, termMonths: 60 },
    loanType: 'loan',
  },
  {
    slug: 'mortgage-calculator',
    defaults: { principal: 300000, annualRate: 6.5, termMonths: 360 },
    loanType: 'mortgage',
  },
  {
    slug: 'car-loan-calculator',
    defaults: { principal: 25000, annualRate: 7.0, termMonths: 60 },
    loanType: 'car',
  },
  {
    slug: 'personal-loan-calculator',
    defaults: { principal: 10000, annualRate: 10.0, termMonths: 36 },
    loanType: 'personal',
  },
  {
    slug: 'amortization-calculator',
    defaults: { principal: 200000, annualRate: 6.5, termMonths: 360 },
    loanType: 'mortgage',
  },
  {
    slug: 'home-affordability-calculator',
    defaults: { principal: 300000, annualRate: 6.5, termMonths: 360 },
    loanType: 'affordability',
  },
  {
    slug: 'refinance-calculator',
    defaults: { principal: 250000, annualRate: 5.5, termMonths: 300 },
    loanType: 'mortgage',
  },
  {
    slug: 'student-loan-calculator',
    defaults: { principal: 30000, annualRate: 5.5, termMonths: 120 },
    loanType: 'student',
  },
  {
    slug: 'interest-calculator',
    defaults: { principal: 10000, annualRate: 5.0, termMonths: 60 },
    loanType: 'interest',
  },
  {
    slug: '30-year-mortgage-calculator',
    defaults: { principal: 300000, annualRate: 6.5, termMonths: 360 },
    loanType: 'mortgage',
  },
  {
    slug: '15-year-mortgage-calculator',
    defaults: { principal: 300000, annualRate: 5.75, termMonths: 180 },
    loanType: 'mortgage',
  },
  {
    slug: 'fha-loan-calculator',
    defaults: { principal: 250000, annualRate: 6.75, termMonths: 360 },
    loanType: 'mortgage',
  },
  {
    slug: 'va-loan-calculator',
    defaults: { principal: 350000, annualRate: 6.25, termMonths: 360 },
    loanType: 'mortgage',
  },
  {
    slug: 'debt-payoff-calculator',
    defaults: { principal: 15000, annualRate: 18.0, termMonths: 60 },
    loanType: 'loan',
  },
]

import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import LoanCalculator from '@/components/finance/calculator/LoanCalculator'
import { CALCULATOR_VARIANTS } from '@/data/calculatorVariants'

const variant = CALCULATOR_VARIANTS.find(v => v.slug === 'va-loan-calculator')!

export const metadata: Metadata = {
  title: variant.metaTitle,
  description: variant.metaDescription,
}

export default function VaLoanCalculatorPage() {
  return (
    <ToolWrapper title={variant.title} description={variant.description} breadcrumbLabel="VA Loan Calculator" faqs={variant.faqs} adSlot="1234567890">
      <Suspense><LoanCalculator variant={variant} /></Suspense>
    </ToolWrapper>
  )
}

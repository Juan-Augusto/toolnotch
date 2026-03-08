import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import LoanCalculator from '@/components/finance/calculator/LoanCalculator'
import { CALCULATOR_VARIANTS } from '@/data/calculatorVariants'

const variant = CALCULATOR_VARIANTS.find(v => v.slug === 'refinance-calculator')!

export const metadata: Metadata = {
  title: variant.metaTitle,
  description: variant.metaDescription,
}

export default function RefinanceCalculatorPage() {
  return (
    <ToolWrapper title={variant.title} description={variant.description} breadcrumbLabel="Refinance Calculator" faqs={variant.faqs} adSlot="1234567890">
      <Suspense><LoanCalculator variant={variant} /></Suspense>
    </ToolWrapper>
  )
}

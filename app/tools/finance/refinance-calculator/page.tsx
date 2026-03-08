import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import LoanCalculator from '@/components/finance/calculator/LoanCalculator'
import { CALCULATOR_VARIANTS } from '@/data/calculatorVariants'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

const variant = CALCULATOR_VARIANTS.find(v => v.slug === 'refinance-calculator')!

export const metadata: Metadata = {
  title: variant.metaTitle,
  description: variant.metaDescription,
  alternates: { canonical: '/tools/finance/refinance-calculator' },
  openGraph: { title: variant.metaTitle, description: variant.metaDescription, url: '/tools/finance/refinance-calculator' },
}

export default function RefinanceCalculatorPage() {
  const jsonLd = buildJsonLd(
    webAppSchema(variant.title, '/tools/finance/refinance-calculator', variant.description, 'FinanceApplication'),
    faqSchema(variant.faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Finance Tools', url: '/tools/finance' },
      { name: variant.title, url: '/tools/finance/refinance-calculator' },
    ]),
  )
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper title={variant.title} description={variant.description} breadcrumbLabel={variant.title} faqs={variant.faqs} adSlot="1234567890">
        <Suspense><LoanCalculator variant={variant} /></Suspense>
      </ToolWrapper>
    </>
  )
}

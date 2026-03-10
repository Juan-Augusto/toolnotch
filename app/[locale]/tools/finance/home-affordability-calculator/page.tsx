import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { CALCULATOR_VARIANTS } from '@/data/calculatorVariants'
import type { FaqItem } from '@/components/FaqSection'
import LoanCalculator from '@/components/finance/calculator/LoanCalculator'
import ToolWrapper from '@/components/ToolWrapper'

const SLUG = 'home-affordability-calculator'
const PATH = `/tools/finance/${SLUG}`
const variant = CALCULATOR_VARIANTS.find(v => v.slug === SLUG)!

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: `finance.variants.${SLUG}` })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function HomeAffordabilityCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: `finance.variants.${SLUG}` })
  const faqs = t.raw('faqs') as FaqItem[]

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale, 'FinanceApplication'),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Finance Tools', url: '/tools/finance' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper title={t('title')} description={t('description')} breadcrumbLabel={t('title')} faqs={faqs} adSlot="1234567890">
        <Suspense><LoanCalculator variant={variant} /></Suspense>
      </ToolWrapper>
    </>
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import TdeeCalculator from '@/components/health/TdeeCalculator'

const PATH = '/tools/health/tdee-calculator'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'healthCalculator' })
  return {
    title: t('tdeeMetaTitle'),
    description: t('tdeeMetaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('tdeeMetaTitle'), url: PATH },
  }
}

export default async function TdeeCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'healthCalculator' })
  const faqs = t.raw('tdeeFaqs') as FaqItem[]

  const jsonLd = buildJsonLd(
    webAppSchema(t('tdeeTitle'), PATH, t('tdeeMetaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Health Tools', url: '/tools/health' },
      { name: t('tdeeTitle'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title={t('tdeeTitle')}
        description={t('tdeeDescription')}
        breadcrumbLabel={t('tdeeTitle')}
        faqs={faqs}
        adSlot="tdee-calculator"
      >
        <TdeeCalculator mode="maintain" locale={locale} />
      </ToolWrapper>
    </>
  )
}

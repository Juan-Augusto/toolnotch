import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import TdeeCalculator from '@/components/health/TdeeCalculator'

const PATH = '/tools/health/calorie-deficit-calculator'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'healthCalculator' })
  return {
    title: t('deficitMetaTitle'),
    description: t('deficitMetaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('deficitMetaTitle'), url: PATH },
  }
}

export default async function CalorieDeficitCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'healthCalculator' })
  const faqs = t.raw('tdeeFaqs') as FaqItem[]
  const richContentRaw = t.raw('deficitRichContent') as { whatIs: string; howToUse: string[]; whyItMatters: string; proTip: string } | undefined

  const jsonLd = buildJsonLd(
    webAppSchema(t('deficitTitle'), PATH, t('deficitMetaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Health Tools', url: '/tools/health' },
      { name: t('deficitTitle'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title={t('deficitTitle')}
        description={t('deficitDescription')}
        breadcrumbLabel={t('deficitTitle')}
        faqs={faqs}
        adSlot="calorie-deficit-calculator"
        richContent={richContentRaw}
      >
        <TdeeCalculator mode="deficit" locale={locale} />
      </ToolWrapper>
    </>
  )
}

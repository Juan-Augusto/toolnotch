import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AppToolWrapper from '@/components/AppToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/AppFaqSection'
import AppTdeeCalculator from '@/components/health/AppTdeeCalculator'

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
  const richContentRaw = t.raw('tdeeRichContent') as { whatIs: string; howToUse: string[]; whyItMatters: string; proTip: string } | undefined

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
      <AppToolWrapper
        title={t('tdeeTitle')}
        description={t('tdeeDescription')}
        breadcrumbLabel={t('tdeeTitle')}
        faqs={faqs}
        richContent={richContentRaw}
      >
        <AppTdeeCalculator mode="maintain" locale={locale} />
      </AppToolWrapper>
    </>
  )
}

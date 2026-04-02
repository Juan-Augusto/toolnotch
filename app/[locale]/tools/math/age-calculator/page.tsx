import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import AgeCalculator from '@/components/math/AgeCalculator'

const PATH = '/tools/math/age-calculator'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ageCalculator' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('metaTitle'), url: PATH },
  }
}

export default async function AgeCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ageCalculator' })
  const faqs = t.raw('faqs') as FaqItem[]

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Calculators', url: '/tools/math' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title={t('title')}
        description={t('description')}
        breadcrumbLabel={t('title')}
        faqs={faqs}
        adSlot="age-calculator"
      >
        <AgeCalculator locale={locale} />
      </ToolWrapper>
    </>
  )
}

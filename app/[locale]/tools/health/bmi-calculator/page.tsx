import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import BmiCalculator from '@/components/health/BmiCalculator'

const PATH = '/tools/health/bmi-calculator'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'healthCalculator' })
  return {
    title: t('bmiMetaTitle'),
    description: t('bmiMetaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('bmiMetaTitle'), url: PATH },
  }
}

export default async function BmiCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'healthCalculator' })
  const faqs = t.raw('bmiFaqs') as FaqItem[]

  const jsonLd = buildJsonLd(
    webAppSchema(t('bmiTitle'), PATH, t('bmiMetaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Health Tools', url: '/tools/health' },
      { name: t('bmiTitle'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title={t('bmiTitle')}
        description={t('bmiDescription')}
        breadcrumbLabel={t('bmiTitle')}
        faqs={faqs}
        adSlot="bmi-calculator"
      >
        <BmiCalculator locale={locale} />
      </ToolWrapper>
    </>
  )
}

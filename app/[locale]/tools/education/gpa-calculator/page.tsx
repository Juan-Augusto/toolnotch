import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import GpaCalculator from '@/components/education/GpaCalculator'

const PATH = '/tools/education/gpa-calculator'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gpaCalculator' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('metaTitle'), url: PATH },
  }
}

export default async function GpaCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gpaCalculator' })
  const faqs = t.raw('faqs') as FaqItem[]

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Education Tools', url: '/tools/education' },
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
        adSlot="gpa-calculator"
      >
        <GpaCalculator mode="semester" locale={locale} />
      </ToolWrapper>
    </>
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AppToolWrapper from '@/components/AppToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/AppFaqSection'
import AppGradeCalculator from '@/components/education/AppGradeCalculator'

const PATH = '/tools/education/grade-calculator'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gpaCalculator' })
  return {
    title: t('gradeMetaTitle'),
    description: t('gradeMetaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('gradeMetaTitle'), url: PATH },
  }
}

export default async function GradeCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gpaCalculator' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('gradeRichContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(t('gradeTitle'), PATH, t('gradeMetaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Education Tools', url: '/tools/education' },
      { name: t('gradeTitle'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppToolWrapper
        title={t('gradeTitle')}
        description={t('gradeDescription')}
        breadcrumbLabel={t('gradeTitle')}
        faqs={faqs}
        richContent={richContent}
      >
        <AppGradeCalculator />
      </AppToolWrapper>
    </>
  )
}

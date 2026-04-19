import type { Metadata } from 'next'
import Link from 'next/link'
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
  const richContentRaw = t.raw('bmiRichContent') as { whatIs: string; howToUse: string[]; whyItMatters: string; proTip: string } | undefined

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
        richContent={richContentRaw}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <Link href="/blog/bmi-vs-body-fat-percentage" className="text-blue-600 hover:underline dark:text-blue-400">
            Read: BMI vs Body Fat Percentage: What&apos;s the Difference? -&gt;
          </Link>
        </p>
        <BmiCalculator locale={locale} />
      </ToolWrapper>
    </>
  )
}

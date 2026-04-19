import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'text.readabilityChecker' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/tools/text/readability-checker'),
    openGraph: { title: t('metaTitle'), url: '/tools/text/readability-checker' },
  }
}

export default async function ReadabilityCheckerPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'text.readabilityChecker' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), '/tools/text/readability-checker', t('metaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: t('title'), url: '/tools/text/readability-checker' },
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
        adSlot="1234567890"
        richContent={richContent}
      >
        <WordCounterClient primaryStat="words" />
      </ToolWrapper>
    </>
  )
}

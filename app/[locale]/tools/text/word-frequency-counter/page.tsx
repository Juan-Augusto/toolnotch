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
  sections?: { heading: string; body: string }[]
}

interface RelatedRaw {
  heading: string
  items: { label: string; path: string }[]
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'text.wordFrequency' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/tools/text/word-frequency-counter'),
    openGraph: { title: t('metaTitle'), url: '/tools/text/word-frequency-counter' },
  }
}

export default async function WordFrequencyCounterPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'text.wordFrequency' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent
  const relatedRaw = t.raw('related') as RelatedRaw
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const relatedLinks = {
    heading: relatedRaw.heading,
    items: relatedRaw.items.map((i) => ({ label: i.label, href: `${localePrefix}${i.path}` })),
  }

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), '/tools/text/word-frequency-counter', t('metaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Text Tools', url: '/tools/text' },
      { name: t('title'), url: '/tools/text/word-frequency-counter' },
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
        richContent={richContent}
        relatedLinks={relatedLinks}
      >
        <WordCounterClient primaryStat="words" />
      </ToolWrapper>
    </>
  )
}

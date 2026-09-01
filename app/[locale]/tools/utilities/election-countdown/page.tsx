import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema, eventSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import { ELECTION_ROUNDS } from '@/lib/electionCountdownMath'
import ElectionCountdown from '@/components/utilities/ElectionCountdown'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

const PATH = '/tools/utilities/election-countdown'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'electionCountdown' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('metaTitle'), url: PATH },
  }
}

export default async function ElectionCountdownPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'electionCountdown' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Utilities', url: '/tools/utilities' },
      { name: t('title'), url: PATH },
    ]),
    eventSchema(t('title'), ELECTION_ROUNDS[0].targetDateUtc, PATH, locale, t('metaDescription')),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title={t('title')}
        description={t('description')}
        breadcrumbLabel={t('title')}
        faqs={faqs}
        adSlot="election-countdown"
        richContent={richContent}
      >
        <ElectionCountdown locale={locale} />
      </ToolWrapper>
    </>
  )
}

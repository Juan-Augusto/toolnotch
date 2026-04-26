import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import ToolWrapper from '@/components/ToolWrapper'
import CoinFlip from '@/components/fun/CoinFlip'

const PATH = '/tools/fun/coin-flip'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.coinFlip' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function CoinFlipPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.coinFlip' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Fun Tools', url: '/tools/fun' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper title={t('title')} description={t('description')} breadcrumbLabel={t('title')} faqs={faqs} adSlot="1234567890" richContent={richContent}>
        <CoinFlip />
      </ToolWrapper>
    </>
  )
}

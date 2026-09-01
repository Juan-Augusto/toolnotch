import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import ToolWrapper from '@/components/ToolWrapper'
import SpinWheelClient from '../spin-the-wheel/SpinWheelClient'

const PATH = '/tools/fun/wheel-of-names'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
  sections?: { heading: string; body: string }[]
  comparison?: {
    heading: string
    intro?: string
    columns: string[]
    rows: { feature: string; ours: string; theirs: string }[]
    caption?: string
  }
}

interface RelatedRaw {
  heading: string
  items: { label: string; path: string }[]
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.wheelOfNames' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function WheelOfNamesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.wheelOfNames' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent
  const relatedRaw = t.raw('related') as RelatedRaw
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const relatedLinks = {
    heading: relatedRaw.heading,
    items: relatedRaw.items.map((i) => ({ label: i.label, href: `${localePrefix}${i.path}` })),
  }

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
      <ToolWrapper
        title={t('title')}
        description={t('description')}
        breadcrumbLabel={t('title')}
        faqs={faqs}
        richContent={richContent}
        relatedLinks={relatedLinks}
      >
        <Suspense>
          <SpinWheelClient />
        </Suspense>
      </ToolWrapper>
    </>
  )
}

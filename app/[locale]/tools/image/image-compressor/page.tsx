import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ImageCompressorClient from './ImageCompressorClient'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'image.compressor' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates('/tools/image/image-compressor'),
  }
}

export default async function ImageCompressorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'image.compressor' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(
      t('title'),
      '/tools/image/image-compressor',
      t('metaDescription'),
      locale,
    ),
    faqSchema(faqs),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressorClient
        title={t('title')}
        description={t('description')}
        faqs={faqs}
        richContent={richContent}
      />
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { conversionPages } from '@/data/conversionPages'
import { locales } from '@/i18n'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema } from '@/lib/schema'
import ImageCompressorClient from '../image-compressor/ImageCompressorClient'
import type { FaqItem } from '@/components/FaqSection'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    conversionPages.map((p) => ({ locale, slug: p.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = conversionPages.find((p) => p.slug === slug)
  if (!page) return {}
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    // WS-6 AdSense audit: these programmatic format-permutation pages share the
    // full UI of `/tools/image/image-compressor` and carry only a widget plus
    // templated FAQs (~150 rendered words, no unique prose). They cannot reach
    // 500 words of unique content without bespoke per-pair articles (out of
    // Phase 0 scope), so noindex them while keeping them crawlable (follow) so
    // the internal-link graph still flows. The canonical `image-compressor`
    // page stays indexed and carries the head term. (WS-6 report; sitemap
    // follow-up removes them from app/sitemap.ts.)
    robots: { index: false, follow: true },
    alternates: buildAlternates(`/tools/image/${slug}`),
  }
}

export default async function SlugPage({ params }: Props) {
  const { locale, slug } = await params
  const page = conversionPages.find((p) => p.slug === slug)
  if (!page) notFound()

  // Use slug-specific FAQ content (from conversionPages); convert to FaqItem shape
  const faqs: FaqItem[] = page.faq.map((item) => ({
    question: item.q,
    answer: item.a,
  }))

  const jsonLd = buildJsonLd(
    webAppSchema(page.h1, `/tools/image/${slug}`, page.metaDescription, locale),
    faqSchema(faqs),
  )

  const t = await getTranslations({ locale, namespace: 'image.compressor' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressorClient
        defaultFormat={page.defaultFormat}
        title={page.h1}
        description={t('description')}
        faqs={faqs}
      />
    </>
  )
}

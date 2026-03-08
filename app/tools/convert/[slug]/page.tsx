import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolWrapper from '@/components/ToolWrapper'
import ConversionWidget from '@/components/converter/ConversionWidget'
import { COMMON_PAIRS } from '@/data/conversionPairs'
import { convert, formatResult } from '@/lib/units'
import { UNIT_LABELS } from '@/data/units'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export function generateStaticParams() {
  return COMMON_PAIRS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const pair = COMMON_PAIRS.find(p => p.slug === slug)
  if (!pair) return {}
  return {
    title: `${pair.title} — Free Online Converter | ToolNotch`,
    description: pair.description,
    alternates: { canonical: `/tools/convert/${slug}` },
    openGraph: { title: pair.title, description: pair.description, url: `/tools/convert/${slug}` },
  }
}

export default async function ConversionSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pair = COMMON_PAIRS.find(p => p.slug === slug)
  if (!pair) notFound()

  const featuredValue = formatResult(convert(1, pair.from, pair.to, pair.category))
  const fromLabel = UNIT_LABELS[pair.from] ?? pair.from
  const toLabel = UNIT_LABELS[pair.to] ?? pair.to

  const pageFaqs = [
    {
      question: `How many ${pair.to} are in a ${pair.from}?`,
      answer: `1 ${fromLabel} = ${featuredValue} ${toLabel}. ${pair.description}`,
    },
    {
      question: `How do I convert ${pair.from} to ${pair.to}?`,
      answer: `Use the converter above. Enter any value in the ${fromLabel} field and the result in ${toLabel} appears instantly.`,
    },
    {
      question: 'How accurate is this converter?',
      answer: 'Conversions use precise factor-based math with up to 8 significant figures. Results are rounded for display only.',
    },
    {
      question: 'Does this work offline?',
      answer: 'Yes — all unit conversions work entirely in your browser with no internet connection required.',
    },
  ]

  const jsonLd = buildJsonLd(
    webAppSchema(pair.title, `/tools/convert/${slug}`, pair.description),
    faqSchema(pageFaqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Converter', url: '/tools/convert' },
      { name: pair.title, url: `/tools/convert/${slug}` },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title={pair.title}
        description={pair.description}
        breadcrumbLabel={pair.title}
        faqs={pageFaqs}
        adSlot="1234567890"
      >
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <p className="text-lg font-semibold text-blue-800">
            1 {fromLabel} = <strong>{featuredValue} {toLabel}</strong>
          </p>
        </div>
        <ConversionWidget category={pair.category} defaultFrom={pair.from} defaultTo={pair.to} />
      </ToolWrapper>
    </>
  )
}

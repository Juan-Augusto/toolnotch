import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolWrapper from '@/components/ToolWrapper'
import ConversionWidget from '@/components/converter/ConversionWidget'
import { COMMON_PAIRS } from '@/data/conversionPairs'
import { convert, formatResult } from '@/lib/units'
import { UNIT_LABELS } from '@/data/units'

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
  }
}

const faqs = [
  { question: 'How accurate is this converter?', answer: 'Conversions use precise factor-based math with up to 8 significant figures. Results are rounded for display only.' },
  { question: 'Does this work offline?', answer: 'Yes — all unit conversions work entirely in your browser with no internet connection required.' },
  { question: 'Can I convert other units?', answer: 'Yes — use the dropdowns to select any supported unit. Or visit the Unit Converter for all 9 categories.' },
]

export default async function ConversionSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pair = COMMON_PAIRS.find(p => p.slug === slug)
  if (!pair) notFound()

  const featuredValue = formatResult(convert(1, pair.from, pair.to, pair.category))
  const fromLabel = UNIT_LABELS[pair.from] ?? pair.from
  const toLabel = UNIT_LABELS[pair.to] ?? pair.to

  return (
    <ToolWrapper
      title={pair.title}
      description={pair.description}
      breadcrumbLabel={pair.title}
      faqs={faqs}
      adSlot="1234567890"
    >
      {/* Featured snippet: first visible text */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
        <p className="text-lg font-semibold text-blue-800">
          1 {fromLabel} = <strong>{featuredValue} {toLabel}</strong>
        </p>
      </div>

      <ConversionWidget category={pair.category} defaultFrom={pair.from} defaultTo={pair.to} />
    </ToolWrapper>
  )
}

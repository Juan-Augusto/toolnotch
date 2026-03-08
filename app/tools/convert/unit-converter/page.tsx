import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import UnitConverterClient from './UnitConverterClient'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Unit Converter — Convert Length, Weight, Temperature & More | ToolNotch',
  description: 'Free online unit converter. Convert length, weight, temperature, area, volume, speed, time, digital storage, and pressure. 200+ units across 9 categories.',
  alternates: { canonical: '/tools/convert/unit-converter' },
  openGraph: { title: 'Unit Converter — 200+ Units Free | ToolNotch', url: '/tools/convert/unit-converter' },
}

const faqs = [
  { question: 'How many units are supported?', answer: 'Over 200 units across 9 categories: length, weight, temperature, area, volume, speed, time, digital storage, and pressure.' },
  { question: 'How accurate are the conversions?', answer: 'Conversions use precise factor-based math with up to 8 significant figures of precision. Results are rounded for display only.' },
  { question: 'Why is temperature different from other categories?', answer: 'Temperature uses offset-based formulas (°F = °C × 9/5 + 32), not simple multiplication factors. It requires special conversion logic.' },
  { question: 'Does this work offline?', answer: 'Yes — all unit conversions work without internet. Only the currency converter requires a connection to fetch live rates.' },
  { question: 'How do I convert meters to feet?', answer: 'Multiply meters by 3.28084. For example, 5 meters = 5 × 3.28084 = 16.4042 feet. Select Length category and set From: Meter, To: Foot.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Unit Converter', '/tools/convert/unit-converter', 'Convert between 200+ units across 9 categories including length, weight, temperature, area, volume, speed, time, digital storage, and pressure.'),
  faqSchema(faqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Converter', url: '/tools/convert' }, { name: 'Unit Converter', url: '/tools/convert/unit-converter' }]),
)

export default function UnitConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Unit Converter"
        description="Convert between 200+ units across 9 categories. Instant, accurate, no sign-up."
        breadcrumbLabel="Unit Converter"
        faqs={faqs}
        adSlot="1234567890"
      >
        <UnitConverterClient />
      </ToolWrapper>
    </>
  )
}

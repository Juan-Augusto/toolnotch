import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import UnitConverterClient from './UnitConverterClient'

export const metadata: Metadata = {
  title: 'Unit Converter — Convert Length, Weight, Temperature & More | ToolNotch',
  description: 'Free online unit converter. Convert length, weight, temperature, area, volume, speed, time, digital storage, and pressure. 200+ units across 9 categories.',
}

const faqs = [
  { question: 'How many units are supported?', answer: 'Over 200 units across 9 categories: length, weight, temperature, area, volume, speed, time, digital storage, and pressure.' },
  { question: 'How accurate are the conversions?', answer: 'Conversions use precise factor-based math with up to 8 significant figures of precision.' },
  { question: 'Why is temperature different from other categories?', answer: 'Temperature uses offset-based formulas (°F = °C × 9/5 + 32), not simple multiplication factors like other units.' },
  { question: 'Does this work offline?', answer: 'Yes — all unit conversions work without internet. Only the currency converter requires an internet connection.' },
]

export default function UnitConverterPage() {
  return (
    <ToolWrapper
      title="Unit Converter"
      description="Convert between 200+ units across 9 categories. Instant, accurate, no sign-up."
      breadcrumbLabel="Unit Converter"
      faqs={faqs}
      adSlot="1234567890"
    >
      <UnitConverterClient />
    </ToolWrapper>
  )
}

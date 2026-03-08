import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'

export const metadata: Metadata = {
  title: 'Reading Time Calculator — Estimate Reading & Speaking Time | ToolNotch',
  description: 'Calculate reading time for any text. Estimates both reading time (238 wpm) and speaking time (130 wpm). Useful for blog posts, speeches, and presentations.',
}

export default function ReadingTimeCalculatorPage() {
  return (
    <ToolWrapper
      title="Reading Time Calculator"
      description="Calculate how long it takes to read or speak your text. Paste your content below for an instant estimate."
      breadcrumbLabel="Reading Time Calculator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <WordCounterClient primaryStat="readingTime" />
    </ToolWrapper>
  )
}

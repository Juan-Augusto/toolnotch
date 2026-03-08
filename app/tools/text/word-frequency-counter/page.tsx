import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'

export const metadata: Metadata = {
  title: 'Word Frequency Counter — Find Most Used Words | ToolNotch',
  description: 'Find the most frequently used words in any text. Useful for SEO keyword analysis, studying writing style, and identifying overused words.',
}

export default function WordFrequencyCounterPage() {
  return (
    <ToolWrapper
      title="Word Frequency Counter"
      description="Find the most frequently used words in your text. Common words (the, and, is) are excluded to show meaningful keywords."
      breadcrumbLabel="Word Frequency Counter"
      faqs={faqs}
      adSlot="1234567890"
    >
      <WordCounterClient primaryStat="words" />
    </ToolWrapper>
  )
}

import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'

export const metadata: Metadata = {
  title: 'Readability Checker — Flesch Score & Reading Level | ToolNotch',
  description: 'Free readability checker. Get Flesch Reading Ease score, Flesch-Kincaid Grade Level, and Gunning Fog Index for any text. Improve your writing clarity.',
}

export default function ReadabilityCheckerPage() {
  return (
    <ToolWrapper
      title="Readability Checker"
      description="Check your text's reading level with Flesch Reading Ease, Flesch-Kincaid Grade, and Gunning Fog scores."
      breadcrumbLabel="Readability Checker"
      faqs={faqs}
      adSlot="1234567890"
    >
      <WordCounterClient primaryStat="words" />
    </ToolWrapper>
  )
}

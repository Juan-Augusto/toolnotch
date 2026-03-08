import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from './WordCounterClient'
import faqs from '@/data/faq/word-counter.json'

export const metadata: Metadata = {
  title: 'Word Counter — Count Words, Characters & Readability | ToolNotch',
  description: 'Free online word counter. Count words, characters, sentences, and get Flesch readability scores in real time. No sign-up required.',
  openGraph: {
    title: 'Word Counter — Free Online Text Analyzer',
    description: 'Count words, characters, sentences, and check readability in real time. 100% private — text never leaves your browser.',
  },
}

export default function WordCounterPage() {
  return (
    <ToolWrapper
      title="Word Counter"
      description="Count words, characters, sentences, and check readability in real time. Paste your text below."
      breadcrumbLabel="Word Counter"
      faqs={faqs}
      adSlot="1234567890"
    >
      <WordCounterClient primaryStat="words" />
    </ToolWrapper>
  )
}

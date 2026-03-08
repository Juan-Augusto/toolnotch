import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'

export const metadata: Metadata = {
  title: 'Sentence Counter — Count Sentences Online | ToolNotch',
  description: 'Free online sentence counter. Instantly count the number of sentences in your text along with words, characters, and readability scores.',
}

export default function SentenceCounterPage() {
  return (
    <ToolWrapper
      title="Sentence Counter"
      description="Count sentences in your text instantly. Also shows words, characters, and readability scores."
      breadcrumbLabel="Sentence Counter"
      faqs={faqs}
      adSlot="1234567890"
    >
      <WordCounterClient primaryStat="sentences" />
    </ToolWrapper>
  )
}

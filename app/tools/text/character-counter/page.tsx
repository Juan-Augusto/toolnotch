import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'

export const metadata: Metadata = {
  title: 'Character Counter — Count Characters with & without Spaces | ToolNotch',
  description: 'Free online character counter. Count characters with and without spaces, useful for Twitter, LinkedIn, Instagram, and other platforms with character limits.',
  openGraph: {
    title: 'Character Counter — Free Online Tool',
    description: 'Count characters with and without spaces instantly. Great for social media posts, SEO meta descriptions, and anywhere character limits matter.',
  },
}

export default function CharacterCounterPage() {
  return (
    <ToolWrapper
      title="Character Counter"
      description="Count characters with and without spaces. Perfect for Twitter posts, meta descriptions, and any text with character limits."
      breadcrumbLabel="Character Counter"
      faqs={faqs}
      adSlot="1234567890"
    >
      <WordCounterClient primaryStat="characters" />
    </ToolWrapper>
  )
}

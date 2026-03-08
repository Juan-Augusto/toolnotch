import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Word Frequency Counter — Find Most Used Words | ToolNotch',
  description: 'Find the most frequently used words in any text. Useful for SEO keyword analysis, studying writing style, and identifying overused words.',
  alternates: { canonical: '/tools/text/word-frequency-counter' },
}

const jsonLd = buildJsonLd(
  webAppSchema('Word Frequency Counter', '/tools/text/word-frequency-counter', 'Find the most frequently used words in any text. Common stopwords are excluded to show meaningful keywords.'),
  faqSchema([
    { question: 'What words are excluded from the frequency count?', answer: 'Common English stopwords are excluded — words like "the", "a", "and", "is", "it" that appear frequently but carry little meaning. This surfaces your actual content keywords.' },
    { question: 'How is keyword density calculated?', answer: 'Keyword density is the frequency of a word divided by total word count, expressed as a percentage. A keyword density of 1–3% is generally considered healthy for SEO.' },
    { question: 'How many top words are shown?', answer: 'The tool shows the top 10 most frequent content words in your text, ranked by count.' },
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Word Frequency Counter', url: '/tools/text/word-frequency-counter' }]),
)

export default function WordFrequencyCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Word Frequency Counter"
        description="Find the most frequently used words in your text. Common words (the, and, is) are excluded to show meaningful keywords."
        breadcrumbLabel="Word Frequency Counter"
        faqs={faqs}
        adSlot="1234567890"
      >
        <WordCounterClient primaryStat="words" />
      </ToolWrapper>
    </>
  )
}

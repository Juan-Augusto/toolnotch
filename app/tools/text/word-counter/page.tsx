import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from './WordCounterClient'
import faqs from '@/data/faq/word-counter.json'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Word Counter — Count Words, Characters & Readability | ToolNotch',
  description: 'Free online word counter. Count words, characters, sentences, and get Flesch readability scores in real time. No sign-up required.',
  alternates: { canonical: '/tools/text/word-counter' },
  openGraph: {
    title: 'Word Counter — Free Online Text Analyzer',
    description: 'Count words, characters, sentences, and check readability in real time. 100% private — text never leaves your browser.',
    url: '/tools/text/word-counter',
  },
}

const jsonLd = buildJsonLd(
  webAppSchema(
    'Word Counter',
    '/tools/text/word-counter',
    'Count words, characters, sentences, and check Flesch readability score in real time. 100% private — text never leaves your browser.',
  ),
  faqSchema(faqs),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Word Counter', url: '/tools/text/word-counter' },
  ]),
)

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Word Counter"
        description="Count words, characters, sentences, and check readability in real time. Paste your text below."
        breadcrumbLabel="Word Counter"
        faqs={faqs}
        adSlot="1234567890"
      >
        <WordCounterClient primaryStat="words" />
      </ToolWrapper>
    </>
  )
}

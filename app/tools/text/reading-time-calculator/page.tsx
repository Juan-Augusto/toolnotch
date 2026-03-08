import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Reading Time Calculator — Estimate Reading & Speaking Time | ToolNotch',
  description: 'Calculate reading time for any text. Estimates both reading time (238 wpm) and speaking time (130 wpm). Useful for blog posts, speeches, and presentations.',
  alternates: { canonical: '/tools/text/reading-time-calculator' },
  openGraph: { title: 'Reading Time Calculator — Free Online Tool', url: '/tools/text/reading-time-calculator' },
}

const jsonLd = buildJsonLd(
  webAppSchema('Reading Time Calculator', '/tools/text/reading-time-calculator', 'Calculate how long it takes to read or speak any text. Uses 238 words per minute for reading and 130 words per minute for speaking.'),
  faqSchema([
    { question: 'How long does it take to read 1000 words?', answer: 'At an average reading speed of 238 words per minute, 1000 words takes approximately 4 minutes to read. At a speaking pace of 130 words per minute, it takes about 8 minutes to deliver.' },
    { question: 'How long does it take to read 500 words?', answer: '500 words takes approximately 2 minutes to read silently and about 4 minutes to speak aloud at a natural presentation pace.' },
    { question: 'What is the average reading speed?', answer: 'The average adult reads approximately 238 words per minute for non-fiction and slightly faster for fiction. Speed readers can reach 400–700 wpm, though comprehension may decrease.' },
    { question: 'How long should a 5-minute speech be?', answer: 'A 5-minute speech is approximately 650–750 words at a natural speaking pace of 130–150 words per minute. A 10-minute speech is 1,300–1,500 words.' },
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Reading Time Calculator', url: '/tools/text/reading-time-calculator' }]),
)

export default function ReadingTimeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Reading Time Calculator"
        description="Calculate how long it takes to read or speak your text. Paste your content below for an instant estimate."
        breadcrumbLabel="Reading Time Calculator"
        faqs={faqs}
        adSlot="1234567890"
      >
        <WordCounterClient primaryStat="readingTime" />
      </ToolWrapper>
    </>
  )
}

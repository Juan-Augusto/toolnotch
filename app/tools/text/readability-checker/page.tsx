import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Readability Checker — Flesch Score & Reading Level | ToolNotch',
  description: 'Free readability checker. Get Flesch Reading Ease score, Flesch-Kincaid Grade Level, and Gunning Fog Index for any text. Improve your writing clarity.',
  alternates: { canonical: '/tools/text/readability-checker' },
  openGraph: { title: 'Readability Checker — Free Online Tool', url: '/tools/text/readability-checker' },
}

const jsonLd = buildJsonLd(
  webAppSchema('Readability Checker', '/tools/text/readability-checker', 'Check text readability with Flesch Reading Ease, Flesch-Kincaid Grade Level, and Gunning Fog Index scores.'),
  faqSchema([
    { question: 'What is a good Flesch Reading Ease score?', answer: 'Scores of 60–70 are considered standard and suitable for most audiences. Scores above 70 are easy to read. Scores below 30 are very difficult, typical of academic or legal text. Most popular novels score 60–80.' },
    { question: 'What is the Flesch-Kincaid Grade Level?', answer: 'The Flesch-Kincaid Grade Level estimates the US school grade needed to understand a text. A score of 8 means an 8th grader can read it. Aim for 6–8 for general audiences.' },
    { question: 'What is the Gunning Fog Index?', answer: 'The Gunning Fog Index estimates the years of formal education needed to understand a text on first reading. Scores above 17 are considered very hard. Most newspapers target a score of 11–14.' },
    { question: 'How do I improve my readability score?', answer: 'Use shorter sentences (target 15–20 words average), prefer common words over complex ones, break long paragraphs into shorter ones, and use active voice instead of passive voice.' },
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Readability Checker', url: '/tools/text/readability-checker' }]),
)

export default function ReadabilityCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Readability Checker"
        description="Check your text's reading level with Flesch Reading Ease, Flesch-Kincaid Grade, and Gunning Fog scores."
        breadcrumbLabel="Readability Checker"
        faqs={faqs}
        adSlot="1234567890"
      >
        <WordCounterClient primaryStat="words" />
      </ToolWrapper>
    </>
  )
}

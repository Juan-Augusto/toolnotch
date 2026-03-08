import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Keyword Density Checker — SEO Keyword Analysis | ToolNotch',
  description: 'Free keyword density checker. Paste your content and see the most frequent keywords as a percentage of total words. Useful for SEO content optimization.',
  alternates: { canonical: '/tools/text/keyword-density-checker' },
  openGraph: { title: 'Keyword Density Checker — Free SEO Tool | ToolNotch', url: '/tools/text/keyword-density-checker' },
}

const keywordFaqs = [
  { question: 'What is keyword density?', answer: 'Keyword density is how often a keyword appears in your text as a percentage of total words. A keyword that appears 10 times in a 1000-word article has a density of 1%.' },
  { question: 'What is the ideal keyword density for SEO?', answer: 'Most SEO experts recommend 1–3% keyword density. Over-optimizing (keyword stuffing) above 5% can trigger Google penalties. Focus on natural, helpful writing rather than hitting a specific percentage.' },
  { question: 'How is keyword density calculated?', answer: 'Keyword Density (%) = (Number of times keyword appears ÷ Total word count) × 100. For example, a word appearing 15 times in a 500-word article has a density of 3%.' },
  { question: 'Which words are excluded from the analysis?', answer: 'Common stopwords (the, a, and, is, it, etc.) are automatically excluded so you see meaningful content keywords only.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Keyword Density Checker', '/tools/text/keyword-density-checker', 'Check keyword density in any text. See the most frequent keywords and their percentage of total words for SEO optimization.'),
  faqSchema(keywordFaqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Text Tools', url: '/tools/text' }, { name: 'Keyword Density Checker', url: '/tools/text/keyword-density-checker' }]),
)

export default function KeywordDensityCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Keyword Density Checker"
        description="Paste your content to see the most frequent keywords and their density percentage. Useful for SEO content optimization."
        breadcrumbLabel="Keyword Density Checker"
        faqs={keywordFaqs.concat(faqs)}
        adSlot="1234567890"
      >
        <WordCounterClient primaryStat="words" />
      </ToolWrapper>
    </>
  )
}

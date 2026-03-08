import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Sentence Counter — Count Sentences Online | ToolNotch',
  description: 'Free online sentence counter. Instantly count the number of sentences in your text along with words, characters, and readability scores.',
  alternates: { canonical: '/tools/text/sentence-counter' },
}

const jsonLd = buildJsonLd(
  webAppSchema('Sentence Counter', '/tools/text/sentence-counter', 'Count sentences, words, and characters in any text. Also shows Flesch readability score and average words per sentence.'),
  faqSchema([
    { question: 'How does the sentence counter count sentences?', answer: 'Sentences are detected by splitting on sentence-ending punctuation (. ! ?) followed by a space or end of text. Abbreviations and decimal numbers may occasionally cause slight inaccuracies.' },
    { question: 'How many sentences should a paragraph have?', answer: 'Most style guides recommend 3–5 sentences per paragraph for readability. Academic writing may use longer paragraphs, while web writing benefits from shorter ones (2–3 sentences).' },
    { question: 'What is the average words per sentence for easy reading?', answer: 'The Flesch readability formula uses words-per-sentence as a key metric. Aim for 15–20 words per sentence for general audiences. Sentences over 30 words are considered difficult.' },
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Sentence Counter', url: '/tools/text/sentence-counter' }]),
)

export default function SentenceCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Sentence Counter"
        description="Count sentences in your text instantly. Also shows words, characters, and readability scores."
        breadcrumbLabel="Sentence Counter"
        faqs={faqs}
        adSlot="1234567890"
      >
        <WordCounterClient primaryStat="sentences" />
      </ToolWrapper>
    </>
  )
}

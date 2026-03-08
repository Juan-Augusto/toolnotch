import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import WordCounterClient from '../word-counter/WordCounterClient'
import faqs from '@/data/faq/word-counter.json'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Character Counter — Count Characters with & without Spaces | ToolNotch',
  description: 'Free online character counter. Count characters with and without spaces, useful for Twitter, LinkedIn, Instagram, and other platforms with character limits.',
  alternates: { canonical: '/tools/text/character-counter' },
  openGraph: {
    title: 'Character Counter — Free Online Tool',
    description: 'Count characters with and without spaces instantly. Great for social media posts, SEO meta descriptions, and anywhere character limits matter.',
    url: '/tools/text/character-counter',
  },
}

const jsonLd = buildJsonLd(
  webAppSchema(
    'Character Counter',
    '/tools/text/character-counter',
    'Count characters with and without spaces. Perfect for Twitter posts (280 chars), meta descriptions (155 chars), and any text with character limits.',
  ),
  faqSchema([
    { question: 'How many characters does Twitter allow?', answer: 'Twitter/X allows 280 characters per post. SMS messages are typically limited to 160 characters. LinkedIn posts allow up to 3,000 characters.' },
    { question: 'Does the character counter include spaces?', answer: 'Yes — the "Characters" stat includes spaces. "Characters (no spaces)" shows the count with all spaces removed.' },
    { question: 'Is my text stored anywhere?', answer: 'No. All character counting happens in your browser. Your text never leaves your device.' },
    { question: 'What is the character limit for a meta description?', answer: 'Google typically displays 155–160 characters of a meta description in search results. Keep them between 140–155 characters for best results.' },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Character Counter', url: '/tools/text/character-counter' },
  ]),
)

export default function CharacterCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Character Counter"
        description="Count characters with and without spaces. Perfect for Twitter posts, meta descriptions, and any text with character limits."
        breadcrumbLabel="Character Counter"
        faqs={faqs}
        adSlot="1234567890"
      >
        <WordCounterClient primaryStat="characters" />
      </ToolWrapper>
    </>
  )
}

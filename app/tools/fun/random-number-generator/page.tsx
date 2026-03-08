import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import NumberGenerator from '@/components/fun/NumberGenerator'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Random Number Generator — Generate Numbers Between Any Range | ToolNotch',
  description: 'Free random number generator. Generate one or multiple random numbers between any range. Supports unique numbers, sorting, and batch generation up to 1000.',
  alternates: { canonical: '/tools/fun/random-number-generator' },
  openGraph: { title: 'Random Number Generator — Any Range | ToolNotch', url: '/tools/fun/random-number-generator' },
}

const faqs = [
  { question: 'How random are the numbers?', answer: 'Numbers are generated using JavaScript\'s Math.random() which produces a uniformly distributed result. For cryptographically secure random numbers, use a dedicated security tool.' },
  { question: 'Can I generate multiple numbers at once?', answer: 'Yes — set Count to any number between 1 and 1000 to generate multiple results at once.' },
  { question: 'What does "unique numbers" mean?', answer: 'When "allow duplicates" is unchecked, each number appears at most once in the results. Useful for lottery draws or random sampling without replacement.' },
  { question: 'How do I generate a random number between 1 and 10?', answer: 'Set Min to 1, Max to 10, Count to 1, and click Generate. The result will be a random integer from 1 to 10 inclusive.' },
  { question: 'Can I generate lottery numbers?', answer: 'Yes — set Min: 1, Max: 49 (or your lottery\'s range), Count: 6, and disable duplicates. Click Generate for 6 unique random numbers.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Random Number Generator', '/tools/fun/random-number-generator', 'Generate random numbers between any range. Supports batch generation up to 1000, unique numbers, and sorted output.'),
  faqSchema(faqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Random Number Generator', url: '/tools/fun/random-number-generator' }]),
)

export default function RandomNumberGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Random Number Generator"
        description="Generate random numbers between any range. Supports batch generation and unique numbers."
        breadcrumbLabel="Random Number Generator"
        faqs={faqs}
        adSlot="1234567890"
      >
        <NumberGenerator />
      </ToolWrapper>
    </>
  )
}

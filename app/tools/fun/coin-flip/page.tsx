import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import CoinFlip from '@/components/fun/CoinFlip'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Coin Flip — Flip a Virtual Coin Online | ToolNotch',
  description: 'Flip a virtual coin for a random heads or tails result. Includes flip animation and history. Free, instant, no sign-up.',
  alternates: { canonical: '/tools/fun/coin-flip' },
  openGraph: { title: 'Coin Flip — Virtual Heads or Tails', url: '/tools/fun/coin-flip' },
}

const faqs = [
  { question: 'Is the coin flip truly fair?', answer: 'Yes. Each flip is determined by Math.random(), giving heads and tails an equal 50% probability.' },
  { question: 'Can I flip multiple times?', answer: 'Yes — just click Flip Coin again. Your last 10 flips are shown in the history below the coin.' },
  { question: 'What is the probability of getting heads 10 times in a row?', answer: 'The probability of getting heads 10 times in a row is (0.5)^10 = 1/1024, or about 0.1%. Each flip is independent — past results don\'t affect future flips.' },
  { question: 'Does it work without an internet connection?', answer: 'Yes. Once the page is loaded, the coin flip works 100% offline.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Coin Flip', '/tools/fun/coin-flip', 'Virtual coin flip for a random heads or tails result. Includes 3D flip animation and flip history.'),
  faqSchema(faqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Coin Flip', url: '/tools/fun/coin-flip' }]),
)

export default function CoinFlipPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Coin Flip"
        description="Click to flip a virtual coin and get a random heads or tails result."
        breadcrumbLabel="Coin Flip"
        faqs={faqs}
        adSlot="1234567890"
      >
        <CoinFlip />
      </ToolWrapper>
    </>
  )
}

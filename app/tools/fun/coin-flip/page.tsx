import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import CoinFlip from '@/components/fun/CoinFlip'

export const metadata: Metadata = {
  title: 'Coin Flip — Flip a Virtual Coin Online | ToolNotch',
  description: 'Flip a virtual coin for a random heads or tails result. Includes flip animation and history. Free, instant, no sign-up.',
}

const faqs = [
  { question: 'Is the coin flip truly fair?', answer: 'Yes. Each flip is determined by Math.random(), giving heads and tails an equal 50% probability.' },
  { question: 'Can I flip multiple times?', answer: 'Yes — just click Flip Coin again. Your last 10 flips are shown in the history below the coin.' },
  { question: 'Does it work without an internet connection?', answer: 'Yes. Once the page is loaded, the coin flip works 100% offline.' },
  { question: 'Why does a real coin sometimes land on edge?', answer: 'A real coin has a very small (approximately 1 in 6000) chance of landing on its edge. Our virtual coin is purely heads or tails.' },
]

export default function CoinFlipPage() {
  return (
    <ToolWrapper
      title="Coin Flip"
      description="Click to flip a virtual coin and get a random heads or tails result."
      breadcrumbLabel="Coin Flip"
      faqs={faqs}
      adSlot="1234567890"
    >
      <CoinFlip />
    </ToolWrapper>
  )
}

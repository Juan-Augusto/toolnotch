import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import YesNoWheel from '@/components/fun/YesNoWheel'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Yes or No Wheel — Let the Wheel Decide | ToolNotch',
  description: 'Spin the Yes or No wheel to make a random decision. Includes optional "Maybe" segment. Free, instant, no sign-up.',
  alternates: { canonical: '/tools/fun/yes-or-no-wheel' },
  openGraph: { title: 'Yes or No Wheel — Spin to Decide | ToolNotch', url: '/tools/fun/yes-or-no-wheel' },
}

const faqs = [
  { question: 'Is the result truly random?', answer: 'Yes — the outcome is decided by Math.random() before the animation, giving equal probability to each segment.' },
  { question: 'Can I add a "Maybe" option?', answer: 'Yes — toggle "Include Maybe" below the wheel to add a third yellow segment.' },
  { question: 'What is this good for?', answer: 'Making decisions when you\'re stuck, settling friendly debates, or just adding an element of fun to any choice.' },
  { question: 'Can I spin again?', answer: 'Yes — just click Spin again for a new random result every time.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Yes or No Wheel', '/tools/fun/yes-or-no-wheel', 'Spin the Yes or No wheel for a random answer. Add a Maybe option for a three-way decision.'),
  faqSchema(faqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Yes or No Wheel', url: '/tools/fun/yes-or-no-wheel' }]),
)

export default function YesOrNoWheelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Yes or No Wheel"
        description="Spin to get a random Yes or No answer. Add Maybe for a third option."
        breadcrumbLabel="Yes or No Wheel"
        faqs={faqs}
        adSlot="1234567890"
      >
        <YesNoWheel />
      </ToolWrapper>
    </>
  )
}

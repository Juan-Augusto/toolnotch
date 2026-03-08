import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import SpinWheelClient from './SpinWheelClient'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Spin the Wheel — Free Random Decision Maker | ToolNotch',
  description: 'Free customizable spin wheel. Add your own options and spin to make random decisions. Shareable via URL. Great for classrooms, teams, and games.',
  alternates: { canonical: '/tools/fun/spin-the-wheel' },
  openGraph: { title: 'Spin the Wheel — Free Custom Spin Wheel', url: '/tools/fun/spin-the-wheel' },
}

const faqs = [
  { question: 'Can I save my wheel?', answer: 'Yes — your items are saved in the URL. Copy and bookmark the URL to save your wheel or share it with others.' },
  { question: 'Is the spin truly random?', answer: 'Yes, the winner is determined by Math.random() before the animation starts. The spin animation is for fun — the result is already decided.' },
  { question: 'How many items can I add?', answer: 'You can add as many items as you like, though the wheel becomes harder to read with more than 20 items.' },
  { question: 'Can I use this in the classroom?', answer: 'Absolutely! Teachers love the spin wheel for picking students, assigning topics, and making fair random decisions.' },
  { question: 'How is this different from Wheel of Names?', answer: 'Our spin wheel is completely free, requires no account, saves your items in the URL for easy sharing, and works on any device including offline.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Spin the Wheel', '/tools/fun/spin-the-wheel', 'Free customizable spin wheel. Add your options and spin to make a random decision. Items saved in URL for easy sharing.'),
  faqSchema(faqs),
  howToSchema('How to use the spin wheel', [
    'Type your options in the text box on the right, one per line.',
    'Click Spin to start the wheel spinning.',
    'The wheel stops on a randomly selected winner.',
    'Copy the URL to share your wheel with anyone.',
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Spin the Wheel', url: '/tools/fun/spin-the-wheel' }]),
)

export default function SpinTheWheelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Spin the Wheel"
        description="Add your options and spin to make a random decision. Your items are saved in the URL for easy sharing."
        breadcrumbLabel="Spin the Wheel"
        faqs={faqs}
        adSlot="1234567890"
      >
        <Suspense>
          <SpinWheelClient />
        </Suspense>
      </ToolWrapper>
    </>
  )
}

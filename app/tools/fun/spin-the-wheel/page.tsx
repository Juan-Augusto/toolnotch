import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import SpinWheelClient from './SpinWheelClient'

export const metadata: Metadata = {
  title: 'Spin the Wheel — Free Random Decision Maker | ToolNotch',
  description: 'Free customizable spin wheel. Add your own options and spin to make random decisions. Shareable via URL. Great for classrooms, teams, and games.',
}

const faqs = [
  { question: 'Can I save my wheel?', answer: 'Yes — your items are saved in the URL. Copy and bookmark the URL to save your wheel or share it with others.' },
  { question: 'Is the spin truly random?', answer: 'Yes, the winner is determined by Math.random() before the animation starts. The spin animation is for fun — the result is already decided.' },
  { question: 'How many items can I add?', answer: 'You can add as many items as you like, though the wheel becomes harder to read with more than 20 items.' },
  { question: 'Can I use this in the classroom?', answer: 'Absolutely! Teachers love the spin wheel for picking students, assigning topics, and making fair decisions.' },
  { question: 'Does it work on mobile?', answer: 'Yes, the spin wheel is fully responsive and works on phones and tablets.' },
]

export default function SpinTheWheelPage() {
  return (
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
  )
}

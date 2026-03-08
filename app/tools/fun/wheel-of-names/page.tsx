import type { Metadata } from 'next'
import { Suspense } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import SpinWheelClient from '../spin-the-wheel/SpinWheelClient'

export const metadata: Metadata = {
  title: 'Wheel of Names Alternative — Free Online Spin Wheel | ToolNotch',
  description: 'Looking for a Wheel of Names alternative? Our free spin wheel is customizable, shareable via URL, and works without sign-up. Add names and spin instantly.',
}

const faqs = [
  { question: 'How is this different from Wheel of Names?', answer: 'Our wheel is completely free, requires no account, saves your items in the URL for easy sharing, and works on any device.' },
  { question: 'Can I share my wheel with others?', answer: 'Yes — your items are encoded in the URL. Copy the URL to share your exact wheel setup with anyone.' },
  { question: 'Does it work on mobile?', answer: 'Yes — fully responsive and touch-friendly on phones and tablets.' },
  { question: 'Is there a limit on names?', answer: 'No hard limit. You can add as many names as you need, though readability is best with 20 or fewer.' },
]

export default function WheelOfNamesPage() {
  return (
    <ToolWrapper
      title="Wheel of Names — Free Spin Wheel"
      description="Free Wheel of Names alternative. Add your names, spin, and share via URL. No sign-up required."
      breadcrumbLabel="Wheel of Names"
      faqs={faqs}
      adSlot="1234567890"
    >
      <Suspense>
        <SpinWheelClient />
      </Suspense>
    </ToolWrapper>
  )
}

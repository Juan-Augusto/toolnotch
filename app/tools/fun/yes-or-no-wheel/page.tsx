import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import YesNoWheel from '@/components/fun/YesNoWheel'

export const metadata: Metadata = {
  title: 'Yes or No Wheel — Let the Wheel Decide | ToolNotch',
  description: 'Spin the Yes or No wheel to make a random decision. Includes optional "Maybe" segment. Free, instant, no sign-up.',
}

const faqs = [
  { question: 'Is the result truly random?', answer: 'Yes — the outcome is decided by Math.random() before the animation, giving equal probability to each segment.' },
  { question: 'Can I add a "Maybe" option?', answer: 'Yes — toggle "Include Maybe" below the wheel to add a third segment.' },
  { question: 'What is this good for?', answer: 'Making decisions when you\'re stuck, settling friendly debates, or just adding an element of fun to any choice.' },
  { question: 'Can I spin again?', answer: 'Yes — just click Spin again for a new random result every time.' },
]

export default function YesOrNoWheelPage() {
  return (
    <ToolWrapper
      title="Yes or No Wheel"
      description="Spin to get a random Yes or No answer. Add Maybe for a third option."
      breadcrumbLabel="Yes or No Wheel"
      faqs={faqs}
      adSlot="1234567890"
    >
      <YesNoWheel />
    </ToolWrapper>
  )
}

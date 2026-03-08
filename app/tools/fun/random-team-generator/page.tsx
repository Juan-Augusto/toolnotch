import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import TeamGenerator from '@/components/fun/TeamGenerator'

export const metadata: Metadata = {
  title: 'Random Team Generator — Split Names into Fair Teams | ToolNotch',
  description: 'Free random team generator. Paste a list of names, choose how many teams, and get fairly shuffled teams instantly. Perfect for sports, classrooms, and work.',
}

const faqs = [
  { question: 'How are teams balanced?', answer: 'Names are shuffled randomly using the Fisher-Yates algorithm, then assigned to teams round-robin. Teams will differ by at most one member.' },
  { question: 'Can I choose how many teams?', answer: 'Yes — set 2 to 10 teams. You can also regenerate as many times as you like to get different groupings.' },
  { question: 'Is it truly random?', answer: 'Yes — the shuffle is different every time you click Generate. No names are preferred or excluded.' },
  { question: 'Can I copy the results?', answer: 'Yes — click "Copy all" to copy the full team assignments to your clipboard in text format.' },
]

export default function RandomTeamGeneratorPage() {
  return (
    <ToolWrapper
      title="Random Team Generator"
      description="Paste names, choose the number of teams, and get randomly balanced groups instantly."
      breadcrumbLabel="Team Generator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <TeamGenerator />
    </ToolWrapper>
  )
}

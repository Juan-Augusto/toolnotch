import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import DiceRoller from '@/components/fun/DiceRoller'

export const metadata: Metadata = {
  title: 'Dice Roller — Roll Any Dice Online (d6, d20, d100) | ToolNotch',
  description: 'Free online dice roller. Roll d4, d6, d8, d10, d12, d20, d100, or any custom dice with notation like 3d6+5. Perfect for D&D, RPGs, and board games.',
}

const faqs = [
  { question: 'What dice notation does this support?', answer: 'Standard notation: NdX+M where N=count, X=sides, M=modifier. Examples: "d6" (one six-sided die), "2d10" (two ten-sided dice), "3d6+5" (three six-sided dice plus 5).' },
  { question: 'What is a d20?', answer: 'A d20 is a 20-sided die used in D&D and other tabletop RPGs. It\'s used for attack rolls, saving throws, and ability checks.' },
  { question: 'Can I roll multiple dice at once?', answer: 'Yes — use notation like "5d6" to roll five six-sided dice simultaneously. The result shows each individual die plus the total.' },
  { question: 'Are the rolls truly random?', answer: 'Yes, each die is independently rolled using Math.random() which gives a uniform distribution across all sides.' },
]

export default function DiceRollerPage() {
  return (
    <ToolWrapper
      title="Dice Roller"
      description="Roll any dice using standard notation (1d6, 2d10+5, 3d20). Supports all standard RPG dice."
      breadcrumbLabel="Dice Roller"
      faqs={faqs}
      adSlot="1234567890"
    >
      <DiceRoller />
    </ToolWrapper>
  )
}

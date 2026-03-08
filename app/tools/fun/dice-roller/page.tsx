import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import DiceRoller from '@/components/fun/DiceRoller'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Dice Roller — Roll Any Dice Online (d6, d20, d100) | ToolNotch',
  description: 'Free online dice roller. Roll d4, d6, d8, d10, d12, d20, d100, or any custom dice with notation like 3d6+5. Perfect for D&D, RPGs, and board games.',
  alternates: { canonical: '/tools/fun/dice-roller' },
  openGraph: { title: 'Dice Roller — Roll d6, d20, d100 & More | ToolNotch', url: '/tools/fun/dice-roller' },
}

const faqs = [
  { question: 'What dice notation does this support?', answer: 'Standard notation: NdX+M where N=count, X=sides, M=modifier. Examples: "d6" (one six-sided die), "2d10" (two ten-sided dice), "3d6+5" (three six-sided dice plus 5).' },
  { question: 'What is a d20?', answer: 'A d20 is a 20-sided die used in D&D and other tabletop RPGs. It\'s used for attack rolls, saving throws, and ability checks.' },
  { question: 'Can I roll multiple dice at once?', answer: 'Yes — use notation like "5d6" to roll five six-sided dice simultaneously. The result shows each individual die plus the total.' },
  { question: 'Are the rolls truly random?', answer: 'Yes, each die is independently rolled using Math.random() which gives a uniform distribution across all sides.' },
  { question: 'What dice are used in D&D?', answer: 'D&D uses seven dice: d4, d6, d8, d10, d12, d20, and d100 (percentile die). The d20 is used most frequently for skill checks and attacks.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Dice Roller', '/tools/fun/dice-roller', 'Roll any dice using standard notation (1d6, 2d10+5, 3d20). Supports all standard RPG dice including d4, d6, d8, d10, d12, d20, d100.'),
  faqSchema(faqs),
  howToSchema('How to roll dice online', [
    'Type your dice notation in the input field (e.g., "2d6" for two six-sided dice).',
    'Or click a preset button like d6, d20, or d100.',
    'Click Roll to generate random results.',
    'See individual die results, total, and roll history.',
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Dice Roller', url: '/tools/fun/dice-roller' }]),
)

export default function DiceRollerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Dice Roller"
        description="Roll any dice using standard notation (1d6, 2d10+5, 3d20). Supports all standard RPG dice."
        breadcrumbLabel="Dice Roller"
        faqs={faqs}
        adSlot="1234567890"
      >
        <DiceRoller />
      </ToolWrapper>
    </>
  )
}

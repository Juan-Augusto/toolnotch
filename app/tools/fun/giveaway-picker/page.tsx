import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import NamePicker from '@/components/fun/NamePicker'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Giveaway Picker — Pick a Random Winner Online | ToolNotch',
  description: 'Free random giveaway winner picker. Paste your entry list, click Pick, and get a random winner instantly. No signup. Fair and transparent.',
  alternates: { canonical: '/tools/fun/giveaway-picker' },
  openGraph: { title: 'Giveaway Picker — Pick a Random Winner | ToolNotch', url: '/tools/fun/giveaway-picker' },
}

const faqs = [
  { question: 'How do I pick a random winner for a giveaway?', answer: 'Paste your list of entrants (one per line), click Pick, and the tool randomly selects a winner using Math.random() for a fair, unbiased result.' },
  { question: 'Is the selection truly random and fair?', answer: 'Yes. Winners are selected using JavaScript\'s Math.random() which gives every name an equal probability of being picked.' },
  { question: 'Can I pick multiple winners?', answer: 'Yes — enable "Remove on pick" and click Pick multiple times. Each winner is removed from the pool so they can\'t win twice.' },
  { question: 'How do I prove the result is fair?', answer: 'Take a screenshot of the result screen showing the winner\'s name and share it with your audience. The randomness is transparent.' },
  { question: 'Can I use this for Instagram or YouTube giveaways?', answer: 'Yes — manually copy your commenter names into the text box and use the picker to select a random winner.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Giveaway Picker', '/tools/fun/giveaway-picker', 'Free random giveaway winner picker. Paste your entry list and pick a fair, random winner instantly. No signup required.'),
  faqSchema(faqs),
  howToSchema('How to pick a random giveaway winner', [
    'Paste your list of entrants — one name per line — into the text box.',
    'Enable "Remove on pick" if you want to pick multiple unique winners.',
    'Click Pick to randomly select a winner.',
    'Take a screenshot of the result to share with your audience as proof of fairness.',
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Giveaway Picker', url: '/tools/fun/giveaway-picker' }]),
)

export default function GiveawayPickerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Giveaway Winner Picker"
        description="Paste your entry list and randomly pick a winner. Fair, transparent, and free — no signup required."
        breadcrumbLabel="Giveaway Picker"
        faqs={faqs}
        adSlot="1234567890"
      >
        <NamePicker />
      </ToolWrapper>
    </>
  )
}

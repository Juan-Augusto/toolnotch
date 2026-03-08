import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import NamePicker from '@/components/fun/NamePicker'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Random Name Picker — Draw a Name from a List | ToolNotch',
  description: 'Free random name picker. Paste your list of names, click Pick, and get a winner instantly. Supports pick-without-replacement for raffles and giveaways.',
  alternates: { canonical: '/tools/fun/random-name-picker' },
  openGraph: { title: 'Random Name Picker — Pick a Random Winner | ToolNotch', url: '/tools/fun/random-name-picker' },
}

const faqs = [
  { question: 'What is "pick without replacement"?', answer: 'When enabled, each picked name is removed from the pool so it won\'t be selected again. Perfect for raffles where every participant gets an equal, one-time chance.' },
  { question: 'Is the pick truly random?', answer: 'Yes. Names are selected using Math.random() which produces an unpredictable result each time.' },
  { question: 'Can I use this for classroom activities?', answer: 'Absolutely. Paste your student list, enable "remove on pick" so no student is called twice, and use it for random questioning or task assignment.' },
  { question: 'How many names can I add?', answer: 'There\'s no hard limit. The tool works with lists of any size, from 2 to hundreds of names.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Random Name Picker', '/tools/fun/random-name-picker', 'Pick a random name from your list. Supports pick-without-replacement for raffles, giveaways, and classroom use.'),
  faqSchema(faqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Random Name Picker', url: '/tools/fun/random-name-picker' }]),
)

export default function RandomNamePickerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Random Name Picker"
        description="Paste your list of names and pick a random winner. Enable 'remove on pick' for raffles without repeats."
        breadcrumbLabel="Random Name Picker"
        faqs={faqs}
        adSlot="1234567890"
      >
        <NamePicker />
      </ToolWrapper>
    </>
  )
}

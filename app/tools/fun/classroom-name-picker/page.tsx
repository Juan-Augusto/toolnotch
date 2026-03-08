import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import NamePicker from '@/components/fun/NamePicker'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Classroom Name Picker — Random Student Picker | ToolNotch',
  description: 'Free random classroom name picker for teachers. Paste your student list and pick a name randomly. No signup, works on iPad and Chromebook.',
  alternates: { canonical: '/tools/fun/classroom-name-picker' },
  openGraph: { title: 'Classroom Name Picker — Random Student Selector | ToolNotch', url: '/tools/fun/classroom-name-picker' },
}

const faqs = [
  { question: 'How do teachers use a random name picker?', answer: 'Paste your student roster (one name per line), enable "Remove on pick" so no student is called twice, and click Pick each time you want to select a student for a question or task.' },
  { question: 'Does this work on an iPad or Chromebook?', answer: 'Yes — it works on any device with a web browser including iPads, Chromebooks, and Android tablets. No app download required.' },
  { question: 'Can I save my student list?', answer: 'Your list is not saved between sessions for privacy. Paste your list at the start of class. For permanent saving, bookmark the Spin the Wheel page which saves items in the URL.' },
  { question: 'Can I make sure every student gets called?', answer: 'Yes — enable "Remove on pick". Each picked student is removed from the pool so the tool works through your entire class without repeats.' },
  { question: 'Is this free for teachers?', answer: 'Yes, completely free. No signup, no account, no credit card. Just open the page and start using it.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Classroom Name Picker', '/tools/fun/classroom-name-picker', 'Free random student picker for teachers. Paste your class roster and randomly select students. Works on any device.'),
  faqSchema(faqs),
  howToSchema('How to use the classroom name picker', [
    'Paste your student names into the text box, one per line.',
    'Enable "Remove on pick" to ensure every student gets called without repeats.',
    'Click Pick to randomly select a student.',
    'The selected name is shown with a confetti animation. Click Pick again for the next student.',
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Fun Tools', url: '/tools/fun' }, { name: 'Classroom Name Picker', url: '/tools/fun/classroom-name-picker' }]),
)

export default function ClassroomNamePickerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Classroom Name Picker"
        description="Randomly pick student names for questions, tasks, or groups. Works on iPad, Chromebook, and any browser. No signup required."
        breadcrumbLabel="Classroom Name Picker"
        faqs={faqs}
        adSlot="1234567890"
      >
        <NamePicker />
      </ToolWrapper>
    </>
  )
}

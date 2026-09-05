import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import ToolWrapper from '@/components/ToolWrapper'
import NamePicker from '@/components/fun/NamePicker'

const PATH = '/tools/fun/classroom-name-picker'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.classroomNamePicker' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function ClassroomNamePickerPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.classroomNamePicker' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    faqSchema(faqs),
    howToSchema('How to use the classroom name picker', [
      'Paste your student names into the text box, one per line.',
      'Enable "Remove on pick" to ensure every student gets called without repeats.',
      'Click Pick to randomly select a student.',
      'The selected name is shown with a confetti animation. Click Pick again for the next student.',
    ]),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Fun Tools', url: '/tools/fun' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper title={t('title')} description={t('description')} breadcrumbLabel={t('title')} faqs={faqs} richContent={richContent} suppressHowToSchema>
        <NamePicker />
      </ToolWrapper>
    </>
  )
}

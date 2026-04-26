import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import ToolWrapper from '@/components/ToolWrapper'
import DiceRoller from '@/components/fun/DiceRoller'

const PATH = '/tools/fun/dice-roller'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.diceRoller' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function DiceRollerPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.diceRoller' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    faqSchema(faqs),
    howToSchema('How to roll dice online', [
      'Type your dice notation in the input field (e.g., "2d6" for two six-sided dice).',
      'Or click a preset button like d6, d20, or d100.',
      'Click Roll to generate random results.',
      'See individual die results, total, and roll history.',
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
      <ToolWrapper title={t('title')} description={t('description')} breadcrumbLabel={t('title')} faqs={faqs} adSlot="1234567890" richContent={richContent}>
        <DiceRoller />
      </ToolWrapper>
    </>
  )
}

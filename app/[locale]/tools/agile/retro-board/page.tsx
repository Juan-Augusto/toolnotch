import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import RetroBoardTool from './RetroBoardTool'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

const PATH = '/tools/agile/retro-board'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'agile.retroBoard' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function RetroBoardPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'agile.retroBoard' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Agile Tools', url: '/tools/agile' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RetroBoardTool
        title={t('title')}
        description={t('description')}
        faqs={faqs}
        richContent={richContent}
        columns={{
          wentWell: t('columns.wentWell'),
          toImprove: t('columns.toImprove'),
          actionItems: t('columns.actionItems'),
        }}
        labels={{
          placeholder: t('placeholder'),
          addButton: t('addButton'),
          voteAriaLabel: t('voteAriaLabel'),
          deleteAriaLabel: t('deleteAriaLabel'),
          exportButton: t('exportButton'),
          clearButton: t('clearButton'),
          clearConfirm: t('clearConfirm'),
          emptyHint: t('emptyHint'),
          exportHeading: t('exportHeading'),
          copiedToast: t('copiedToast'),
        }}
      />
    </>
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import type { FaqItem } from '@/components/FaqSection'
import ToolWrapper from '@/components/ToolWrapper'

const PATH = '/tools/fun/typing-test'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.typingTest' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function TypingTestPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.typingTest' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  return (
    <ToolWrapper
      title={t('title')}
      description={t('description')}
      breadcrumbLabel={t('title')}
      faqs={faqs}
      adSlot="1234567890"
      richContent={richContent}
    >
      <div className="text-center py-8">
        <p className="text-gray-500">Coming soon</p>
      </div>
    </ToolWrapper>
  )
}

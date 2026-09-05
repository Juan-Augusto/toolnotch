import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, howToSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import PollingPlaceFinderContent, {
  type PollingPlaceFinderContentProps,
} from '@/components/utilities/PollingPlaceFinderContent'

const PATH = '/tools/utilities/polling-place-finder'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pollingPlaceFinder' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('metaTitle'), url: PATH },
  }
}

export default async function PollingPlaceFinderPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pollingPlaceFinder' })

  const faqs = t.raw('faqs') as FaqItem[]
  const intro = t('intro')
  const sections = t.raw('sections') as PollingPlaceFinderContentProps['sections']
  const cta = t.raw('cta') as PollingPlaceFinderContentProps['cta']
  const howToSteps = t.raw('howToSteps') as string[]

  // This is a content/explainer page, not an interactive tool — no
  // webAppSchema (see PRD "Explicit Recommendation" + CLAUDE.md SEO section).
  const jsonLd = buildJsonLd(
    howToSchema(t('title'), howToSteps),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Utilities', url: '/tools/utilities' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolWrapper
        title={t('title')}
        description={t('description')}
        breadcrumbLabel={t('title')}
        faqs={faqs}
        noCardWrapper
      >
        <PollingPlaceFinderContent intro={intro} sections={sections} cta={cta} />
      </ToolWrapper>
    </>
  )
}

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ToolWrapper from '@/components/ToolWrapper'
import { buildAlternatesForLocale, localizedPath } from '@/lib/i18nMeta'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'
import type { FaqItem } from '@/components/FaqSection'
import GpaCalculator from '@/components/education/GpaCalculator'
import BrGradeConversionTable, {
  type GradeConversionRow,
  type GradeConversionColumns,
} from '@/components/education/BrGradeConversionTable'
import { BLOG_SLUG_GROUPS, type BlogLocale } from '@/data/blog/slugTranslations'

const PATH = '/tools/education/gpa-calculator'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface HowTo {
  name: string
  steps: string[]
}

interface BrConversion {
  heading: string
  intro: string
  columns: GradeConversionColumns
  rows: GradeConversionRow[]
  disclaimer: string
  exampleHeading: string
  exampleBody: string
  ctaLabel: string
}

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gpaCalculator' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: { title: t('metaTitle'), url: localizedPath(PATH, locale) },
  }
}

export default async function GpaCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gpaCalculator' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent
  const howTo = t.raw('howTo') as HowTo
  const brConversion = t.raw('brConversion') as BrConversion

  // The conversion guide has a different slug in each language.
  const guideSlug =
    BLOG_SLUG_GROUPS['gpa-brazilian-grades'][locale as BlogLocale] ??
    BLOG_SLUG_GROUPS['gpa-brazilian-grades'].en
  const guideHref = localizedPath(`/blog/${guideSlug}`, locale)

  const jsonLd = buildJsonLd(
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
    howToSchema(howTo.name, howTo.steps),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Education Tools', url: '/tools/education' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title={t('title')}
        description={t('description')}
        breadcrumbLabel={t('title')}
        faqs={faqs}
        adSlot="gpa-calculator"
        richContent={richContent}
        extraContent={
          <BrGradeConversionTable
            heading={brConversion.heading}
            intro={brConversion.intro}
            columns={brConversion.columns}
            rows={brConversion.rows}
            disclaimer={brConversion.disclaimer}
            exampleHeading={brConversion.exampleHeading}
            exampleBody={brConversion.exampleBody}
            ctaLabel={brConversion.ctaLabel}
            ctaHref={guideHref}
          />
        }
      >
        <GpaCalculator mode="semester" locale={locale} />
      </ToolWrapper>
    </>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { buildAlternatesForLocale, localizedPath } from '@/lib/i18nMeta'
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
  buildLocalizedUrl,
} from '@/lib/schema'
import { CALCULATOR_VARIANTS } from '@/data/calculatorVariants'
import type { FaqItem } from '@/components/AppFaqSection'
import AppLoanCalculator from '@/components/finance/calculator/AppLoanCalculator'
import FinanceToolHeader from '../components/FinanceToolHeader'
import FinanceToolContent, { type RichContent } from '../components/FinanceToolContent'

const SLUG = 'mortgage-calculator'
const PATH = `/tools/finance/${SLUG}`
const variant = CALCULATOR_VARIANTS.find(v => v.slug === SLUG)!

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: `finance.variants.${SLUG}` })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale =
    locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: `${t('title')} | ToolNotch`,
      description: t('metaDescription'),
      url: localizedUrl,
      siteName: 'ToolNotch',
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | ToolNotch`,
      description: t('metaDescription'),
    },
  }
}

export default async function MortgageCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: `finance.variants.${SLUG}` })
  const faqs = (t.raw('faqs') as FaqItem[]) || []
  const richContent = (t.raw('richContent') as RichContent) || {}

  const homeLabel =
    locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const toolsLabel =
    locale === 'pt' ? 'Ferramentas' : locale === 'es' ? 'Herramientas' : 'Tools'
  const financeLabel =
    locale === 'pt' ? 'Finanças' : locale === 'es' ? 'Finanzas' : 'Finance'
  const localizedUrl = buildLocalizedUrl(PATH, locale)

  const howToSteps = Array.isArray(richContent?.howToUse)
    ? richContent.howToUse.filter(
        (s) => typeof s === 'string' && s.trim().length > 0,
      )
    : []

  const howToJsonLd =
    howToSteps.length >= 2 ? howToSchema(t('title'), howToSteps) : null

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath('/', locale) },
      { name: toolsLabel, url: localizedPath('/tools', locale) },
      { name: financeLabel, url: localizedPath('/tools/finance', locale) },
      { name: t('title'), url: localizedUrl },
    ]),
    webAppSchema(
      t('title'),
      PATH,
      t('metaDescription'),
      locale,
      'FinanceApplication',
    ),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : []),
  )

  const blogLinkPrefix =
    locale === 'pt' ? 'Leia:' : locale === 'es' ? 'Leer:' : 'Read:'
  const blogLinkTitle =
    locale === 'pt'
      ? 'Como Calcular a Parcela Mensal do Financiamento Imobiliário'
      : locale === 'es'
        ? 'Cómo Calcular la Cuota Mensual de la Hipoteca'
        : 'How to Calculate Your Mortgage Payment'
  const blogHref = localizedPath('/blog/how-to-calculate-mortgage-payment', locale)

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
        <FinanceToolHeader
          title={t('title')}
          description={t('description')}
          locale={locale}
        />

        <div className="w-full mb-10">
          <div className="mb-4 text-xs font-mono">
            <Link
              href={blogHref}
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>{blogLinkPrefix} {blogLinkTitle} →</span>
            </Link>
          </div>
          <Suspense>
            <AppLoanCalculator variant={variant} />
          </Suspense>
        </div>

        <FinanceToolContent
          currentToolSlug={SLUG}
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  )
}

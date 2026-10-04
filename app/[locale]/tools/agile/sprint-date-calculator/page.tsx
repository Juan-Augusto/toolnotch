import type { Metadata } from 'next'
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
import type { FaqItem } from '@/components/AppFaqSection'
import AgileToolHeader from '../components/AgileToolHeader'
import AgileToolContent, { type RichContent } from '../components/AgileToolContent'
import SprintDateCalculatorClient from './SprintDateCalculatorClient'

const PATH = '/tools/agile/sprint-date-calculator'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'agile.sprintDateCalculator' })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternatesForLocale(PATH, locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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
    category: 'productivity',
  }
}

export default async function SprintDateCalculatorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'agile.sprintDateCalculator' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const homeLabel = locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const toolsLabel = locale === 'pt' ? 'Ferramentas' : locale === 'es' ? 'Herramientas' : 'Tools'
  const agileLabel =
    locale === 'pt'
      ? 'Metodologias Ágeis'
      : locale === 'es'
        ? 'Metodologías Ágiles'
        : 'Agile & Scrum'
  const localizedUrl = buildLocalizedUrl(PATH, locale)

  const howToSteps = Array.isArray(richContent?.howToUse)
    ? richContent.howToUse.filter((s) => typeof s === 'string' && s.trim().length > 0)
    : []

  const howToJsonLd = howToSteps.length >= 2 ? howToSchema(t('title'), howToSteps) : null

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath('/', locale) },
      { name: toolsLabel, url: localizedPath('/tools', locale) },
      { name: agileLabel, url: localizedPath('/tools/agile', locale) },
      { name: t('title'), url: localizedUrl },
    ]),
    webAppSchema(t('title'), PATH, t('metaDescription'), locale, 'BusinessApplication'),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : []),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
        <div className="w-full">
          <AgileToolHeader
            title={t('title')}
            description={t('description')}
            locale={locale}
          />

          <div className="w-full mb-8 sm:mb-12">
            <SprintDateCalculatorClient
              labels={t.raw('labels') as Record<string, string>}
              locale={locale}
            />
          </div>

          <AgileToolContent
            currentToolSlug="sprint-date-calculator"
            richContent={richContent}
            faqs={faqs}
            locale={locale}
          />
        </div>
      </main>
    </>
  )
}

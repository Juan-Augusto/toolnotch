import type { Metadata } from 'next'
import { Suspense } from 'react'
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
import FunToolHeader from '../components/FunToolHeader'
import FunToolContent, { type RichContent } from '../components/FunToolContent'
import SpinWheelClient from '../spin-the-wheel/SpinWheelClient'

const PATH = '/tools/fun/wheel-of-names'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.wheelOfNames' })
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
    category: 'entertainment',
  }
}

export default async function WheelOfNamesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'fun.wheelOfNames' })
  const faqs = t.raw('faqs') as FaqItem[]
  const richContent = t.raw('richContent') as RichContent

  const homeLabel = locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const toolsLabel = locale === 'pt' ? 'Ferramentas' : locale === 'es' ? 'Herramientas' : 'Tools'
  const funLabel =
    locale === 'pt'
      ? 'Diversão & Aleatório'
      : locale === 'es'
        ? 'Diversión y Azar'
        : 'Fun & Random'
  const localizedUrl = buildLocalizedUrl(PATH, locale)

  const howToSteps = Array.isArray(richContent?.howToUse)
    ? richContent.howToUse.filter((s) => typeof s === 'string' && s.trim().length > 0)
    : [
        'Add names or raffle options in the text box, one per line.',
        'Click Spin to start the wheel.',
        'Watch the wheel pick a fair random winner.',
        'Copy and share the URL with your participants.',
      ]

  const howToJsonLd = howToSteps.length >= 2 ? howToSchema(t('title'), howToSteps) : null

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath('/', locale) },
      { name: toolsLabel, url: localizedPath('/tools', locale) },
      { name: funLabel, url: localizedPath('/tools/fun', locale) },
      { name: t('title'), url: localizedUrl },
    ]),
    webAppSchema(t('title'), PATH, t('metaDescription'), locale),
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
          <FunToolHeader
            title={t('title')}
            description={t('description')}
            locale={locale}
          />

          <div className="w-full mb-8 sm:mb-12">
            <Suspense>
              <SpinWheelClient locale={locale} mode="names" />
            </Suspense>
          </div>

          <FunToolContent
            currentToolSlug="wheel-of-names"
            richContent={richContent}
            faqs={faqs}
            locale={locale}
          />
        </div>
      </main>
    </>
  )
}

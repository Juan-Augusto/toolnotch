import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternatesForLocale } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema, buildLocalizedUrl, type FaqItem } from '@/lib/schema'
import { AppSystemArchitectureQuiz } from '@/components/interview/AppSystemArchitectureQuiz'
import AppInterviewDepth from '@/components/interview/AppInterviewDepth'
import AppBreadcrumb from '@/components/AppBreadcrumb'

const PATH = '/interview/system-architecture'
const TITLE = 'System Architecture Interview Quiz: Beginner to Advanced | ToolNotch'
const DESCRIPTION = 'Test your system design and distributed architecture knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers microservices, Circuit Breaker, Saga, rate limiting, and observability.'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'interview.systemArchitecture' })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'
  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    alternates: buildAlternatesForLocale(PATH, locale),
    keywords: [
      "system architecture interview questions",
      "system design quiz",
      "microservices interview",
      "circuit breaker pattern interview",
      "saga pattern distributed transactions",
      "distributed tracing OpenTelemetry",
      "staff engineer system design prep"
    ],
    openGraph: {
      title,
      description,
      url: localizedUrl,
      siteName: 'ToolNotch',
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function SystemArchitectureQuizPage({ params }: Props) {
  const { locale } = await params
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const t = await getTranslations({ locale, namespace: 'interview.systemArchitecture' })

  const depthFaqs = t.raw('faqs') as FaqItem[]
  const depthSections = [
    { heading: t('coversHeading'), body: t.raw('covers') as string[] },
    { heading: t('levelsHeading'), body: t.raw('levels') as string[] },
  ]
  const depthLists = [
    { heading: t('topicsHeading'), items: t.raw('topics') as string[] },
    { heading: t('howHeading'), ordered: true, items: t.raw('how') as string[] },
  ]

  const homeLabel = locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const simuladosLabel = locale === 'pt' ? 'Simulados' : locale === 'es' ? 'Simulados' : 'Interview Drills'
  const prefix = locale === 'en' ? '' : `/${locale}`

  const jsonLd = buildJsonLd(
    {
      '@type': 'Quiz',
      name: t('title'),
      description: t('metaDescription'),
      url: localizedUrl,
      educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
      about: {
        "@type": "Thing",
        "name": "System Architecture & Distributed Systems"
},
    },
    faqSchema(depthFaqs),
    breadcrumbSchema([
      { name: homeLabel, url: prefix || '/' },
      { name: simuladosLabel, url: `${prefix}/interview` },
      { name: 'System Architecture', url: localizedUrl },
    ]),
  )

  return (
    <main className="min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full pb-2 container">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || '/' },
            { label: simuladosLabel, href: `${prefix}/interview` },
            {
              label: 'System Architecture',
              href: `${prefix}${PATH}`,
              current: true,
            },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto pt-4 pb-8 md:pb-12 px-4 sm:px-0">
        <AppSystemArchitectureQuiz locale={locale} />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
        <AppInterviewDepth
          sections={depthSections}
          lists={depthLists}
          faqHeading={t('faqHeading')}
          faqs={depthFaqs}
        />
      </div>
    </main>
  )
}

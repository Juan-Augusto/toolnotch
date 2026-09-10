import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternatesForLocale } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema, buildLocalizedUrl, type FaqItem } from '@/lib/schema'
import { AppTypeScriptQuiz } from '@/components/interview/AppTypeScriptQuiz'
import AppInterviewDepth from '@/components/interview/AppInterviewDepth'
import AppBreadcrumb from '@/components/AppBreadcrumb'

const PATH = '/interview/typescript'
const TITLE = 'TypeScript Interview Quiz: Beginner to Advanced | ToolNotch'
const DESCRIPTION = 'Test your TypeScript knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers inference, generics, conditional types, mapped types, and compiled JS output.'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'interview.typescript' })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'
  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    alternates: buildAlternatesForLocale(PATH, locale),
    keywords: [
      "TypeScript interview questions",
      "TypeScript quiz",
      "TypeScript interview prep",
      "TypeScript generics quiz",
      "TypeScript conditional types",
      "TypeScript mapped types",
      "TypeScript type system",
      "TypeScript beginner to advanced",
      "TypeScript compiled JavaScript",
      "TypeScript best practices"
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

export default async function TypeScriptQuizPage({ params }: Props) {
  const { locale } = await params
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const t = await getTranslations({ locale, namespace: 'interview.typescript' })

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
        "name": "TypeScript",
        "description": "A strongly typed programming language that builds on JavaScript."
},
    },
    faqSchema(depthFaqs),
    breadcrumbSchema([
      { name: homeLabel, url: prefix || '/' },
      { name: simuladosLabel, url: `${prefix}/interview` },
      { name: 'TypeScript', url: localizedUrl },
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
              label: 'TypeScript',
              href: `${prefix}${PATH}`,
              current: true,
            },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto pt-4 pb-8 md:pb-12 px-4 sm:px-0">
        <AppTypeScriptQuiz locale={locale} />
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

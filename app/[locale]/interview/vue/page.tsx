import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternatesForLocale } from '@/lib/i18nMeta'
import {
  buildJsonLd,
  faqSchema,
  breadcrumbSchema,
  buildLocalizedUrl,
  interviewQuizSchema,
  type FaqItem,
} from '@/lib/schema'
import { AppVueQuiz } from '@/components/interview/AppVueQuiz'
import AppInterviewDepth from '@/components/interview/AppInterviewDepth'
import AppBreadcrumb from '@/components/AppBreadcrumb'
import AppRelatedInterviewDrills from '@/components/interview/AppRelatedInterviewDrills'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

const PATH = '/interview/vue'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'interview.vue' })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'
  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    alternates: buildAlternatesForLocale(PATH, locale),
    keywords: [
      "Vue.js interview questions",
      "Vue 3 quiz",
      "Composition API interview",
      "Vue reactivity Proxy internals",
      "Pinia state management quiz",
      "Vue SSR hydration mismatch",
      "frontend engineer interview prep"
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

export default async function VueQuizPage({ params }: Props) {
  const { locale } = await params
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const t = await getTranslations({ locale, namespace: 'interview.vue' })
  const questions = getInterviewQuestions('vue', locale)

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
    interviewQuizSchema({
      title: t('title'),
      description: t('metaDescription'),
      url: localizedUrl,
      locale,
      about: 'Vue.js Framework',
      questions,
    }),
    faqSchema(depthFaqs),
    breadcrumbSchema([
      { name: homeLabel, url: prefix || '/' },
      { name: simuladosLabel, url: `${prefix}/interview` },
      { name: 'Vue.js', url: localizedUrl },
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
              label: 'Vue.js',
              href: `${prefix}${PATH}`,
              current: true,
            },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto pt-4 pb-8 md:pb-12 px-4 sm:px-0">
        <AppVueQuiz locale={locale} />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
        <AppInterviewDepth
          sections={depthSections}
          lists={depthLists}
          faqHeading={t('faqHeading')}
          faqs={depthFaqs}
        />
        <AppRelatedInterviewDrills currentSlug="vue" locale={locale} />
      </div>
    </main>
  )
}

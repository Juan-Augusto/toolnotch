import type { Metadata } from 'next'
import Link from 'next/link'
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
import { AppNodejsFundamentalsQuiz } from '@/components/interview/AppNodejsFundamentalsQuiz'
import AppInterviewDepth from '@/components/interview/AppInterviewDepth'
import AppBreadcrumb from '@/components/AppBreadcrumb'
import AppRelatedInterviewDrills from '@/components/interview/AppRelatedInterviewDrills'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

const PATH = '/interview/nodejs-fundamentals'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'interview.nodejsFundamentals' })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'
  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    alternates: buildAlternatesForLocale(PATH, locale),
    keywords: [
      "Node.js interview questions",
      "Node.js fundamentals quiz",
      "Event loop phases libuv",
      "process.nextTick vs setImmediate",
      "V8 garbage collection Node.js",
      "Node.js stream backpressure",
      "backend engineer interview prep"
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

export default async function NodejsFundamentalsQuizPage({ params }: Props) {
  const { locale } = await params
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const t = await getTranslations({ locale, namespace: 'interview.nodejsFundamentals' })
  const questions = getInterviewQuestions('nodejs-fundamentals', locale)

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
      about: 'Node.js Runtime & Architecture',
      questions,
    }),
    faqSchema(depthFaqs),
    breadcrumbSchema([
      { name: homeLabel, url: prefix || '/' },
      { name: simuladosLabel, url: `${prefix}/interview` },
      { name: 'Node.js Fundamentals', url: localizedUrl },
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
              label: 'Node.js Fundamentals',
              href: `${prefix}${PATH}`,
              current: true,
            },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto pt-4 pb-8 md:pb-12 px-4 sm:px-0">
        <AppNodejsFundamentalsQuiz locale={locale} />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
        <aside className="protip-neon mb-8" data-testid="event-loop-cta">
          <p className="text-sm text-foreground">
            <strong>
              {locale === 'pt'
                ? 'Event loop ainda confuso?'
                : locale === 'es'
                  ? '¿El event loop aún te confunde?'
                  : 'Event loop still fuzzy?'}
            </strong>{' '}
            {locale === 'pt'
              ? 'Veja nextTick, promises e as fases do libuv animados em uma trilha de 7 lições.'
              : locale === 'es'
                ? 'Mira nextTick, promises y las fases de libuv animados en una ruta de 7 lecciones.'
                : 'Watch nextTick, promises and the libuv phases animated in a 7-lesson path.'}{' '}
            <Link href={`${prefix}/tools/dev/node-event-loop`} className="link-hover font-semibold underline">
              {locale === 'pt'
                ? 'Abrir o visualizador →'
                : locale === 'es'
                  ? 'Abrir el visualizador →'
                  : 'Open the visualizer →'}
            </Link>
          </p>
        </aside>
        <AppInterviewDepth
          sections={depthSections}
          lists={depthLists}
          faqHeading={t('faqHeading')}
          faqs={depthFaqs}
        />
        <AppRelatedInterviewDrills currentSlug="nodejs-fundamentals" locale={locale} />
      </div>
    </main>
  )
}

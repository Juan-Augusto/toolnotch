import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { isTriviaQuiz } from '@/lib/quizTypes'
import { QUIZ_REGISTRY, NOINDEX_QUIZ_IDS } from '@/lib/quizRegistry'
import { getQuizBySlug } from '@/lib/content/quizRepository'
import { buildAlternates } from '@/lib/i18nMeta'
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
} from '@/lib/schema'
import QuizPlayer from '@/components/quiz/QuizPlayer'
import TriviaPlayer from '@/components/quiz/TriviaPlayer'
import QuizDepth, { getQuizDepthContent } from '@/components/quiz/QuizDepth'
import RelatedQuizzes from '@/components/quiz/RelatedQuizzes'

// ── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return QUIZ_REGISTRY.flatMap(q =>
    locales.map(locale => ({ locale, slug: q.id }))
  )
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) return {}

  const depth = await getQuizDepthContent(slug, locale)
  const title = depth ? `${depth.metaTitle} | ToolNotch` : `${quiz.title} | ToolNotch`
  const description = depth ? depth.metaDescription : quiz.description

  return {
    title,
    description,
    alternates: buildAlternates(`/quiz/${slug}`),
    openGraph: { title, description },
    ...(NOINDEX_QUIZ_IDS.has(slug) ? { robots: { index: false, follow: true } } : {}),
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) notFound()

  const depth = await getQuizDepthContent(slug, locale)

  // Every quiz page carries exactly one primary entity (`Quiz`) + a
  // `BreadcrumbList`; the WS-3 depth pages add a topic `FAQPage` on top.
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Quizzes', url: '/quizzes' },
    { name: quiz.title, url: `/quiz/${slug}` },
  ])
  const quizEntity = {
    '@type': 'Quiz' as const,
    name: quiz.title,
    url: buildLocalizedUrl(`/quiz/${slug}`, locale),
    description: depth ? depth.metaDescription : quiz.description,
    educationalUse: 'Assessment',
    ...(depth?.about ? { about: { '@type': 'Thing', name: depth.about } } : {}),
  }
  const jsonLd = depth
    ? buildJsonLd(quizEntity, faqSchema(depth.faqs), breadcrumb)
    : buildJsonLd(quizEntity, breadcrumb)

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:bg-card dark:border-gray-700 p-8">
          {isTriviaQuiz(quiz) ? (
            <TriviaPlayer quiz={quiz} locale={locale} />
          ) : (
            <QuizPlayer quiz={quiz} locale={locale} />
          )}
        </div>
      </div>

      {depth && <QuizDepth content={depth} currentSlug={slug} />}
      {!depth && <RelatedQuizzes slug={slug} locale={locale} />}
    </main>
  )
}

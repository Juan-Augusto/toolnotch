import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { isTriviaQuiz } from '@/lib/quizTypes'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'
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
import WorldCupQuizDepth, { getQuizDepthContent } from '@/components/quiz/WorldCupQuizDepth'

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
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) notFound()

  const depth = await getQuizDepthContent(slug, locale)

  const jsonLd = depth
    ? buildJsonLd(
        {
          '@type': 'Quiz',
          name: quiz.title,
          url: buildLocalizedUrl(`/quiz/${slug}`, locale),
          description: depth.metaDescription,
          about: { '@type': 'Thing', name: 'FIFA World Cup' },
          educationalUse: 'Assessment',
        },
        faqSchema(depth.faqs),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Quizzes', url: '/quizzes' },
          { name: quiz.title, url: `/quiz/${slug}` },
        ]),
      )
    : null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:bg-card dark:border-gray-700 p-8">
          {isTriviaQuiz(quiz) ? (
            <TriviaPlayer quiz={quiz} locale={locale} />
          ) : (
            <QuizPlayer quiz={quiz} locale={locale} />
          )}
        </div>
      </div>

      {depth && <WorldCupQuizDepth content={depth} currentSlug={slug} />}
    </main>
  )
}

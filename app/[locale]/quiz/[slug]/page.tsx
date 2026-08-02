import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { isTriviaQuiz } from '@/lib/quizTypes'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'
import { getQuizBySlug } from '@/lib/content/quizRepository'
import { buildAlternates } from '@/lib/i18nMeta'
import QuizPlayer from '@/components/quiz/QuizPlayer'
import TriviaPlayer from '@/components/quiz/TriviaPlayer'

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
  return {
    title: `${quiz.title} | ToolNotch`,
    description: quiz.description,
    alternates: buildAlternates(`/quiz/${slug}`),
    openGraph: { title: quiz.title, description: quiz.description },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) notFound()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-8">
          {isTriviaQuiz(quiz) ? (
            <TriviaPlayer quiz={quiz} locale={locale} />
          ) : (
            <QuizPlayer quiz={quiz} locale={locale} />
          )}
        </div>
      </div>
    </main>
  )
}

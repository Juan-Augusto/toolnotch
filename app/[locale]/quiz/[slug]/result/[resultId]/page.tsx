import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AnyQuiz, isTriviaQuiz } from '@/lib/quizTypes'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'

// ── Static imports for all quiz JSON files ────────────────────────────────────
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'

import worldCupEnRaw from '@/data/quizzes/en/fifa-world-cup-winners.json'
import clubEnRaw from '@/data/quizzes/en/which-football-club-are-you.json'
import uclEnRaw from '@/data/quizzes/en/champions-league-trivia.json'
import worldCupPtRaw from '@/data/quizzes/pt/fifa-world-cup-winners.json'
import clubPtRaw from '@/data/quizzes/pt/which-football-club-are-you.json'
import uclPtRaw from '@/data/quizzes/pt/champions-league-trivia.json'
import worldCupEsRaw from '@/data/quizzes/es/fifa-world-cup-winners.json'
import clubEsRaw from '@/data/quizzes/es/which-football-club-are-you.json'
import uclEsRaw from '@/data/quizzes/es/champions-league-trivia.json'

// ── Quiz map ──────────────────────────────────────────────────────────────────
const QUIZ_MAP: Record<string, Record<string, unknown>> = {
  'what-career-suits-you':               { en: careerQuizRaw, pt: careerQuizRaw, es: careerQuizRaw },
  'which-programming-language-are-you':  { en: programmingQuizRaw, pt: programmingQuizRaw, es: programmingQuizRaw },
  'am-i-introverted-or-extroverted':     { en: introvertQuizRaw, pt: introvertQuizRaw, es: introvertQuizRaw },
  'what-type-of-traveler-are-you':       { en: travelerQuizRaw, pt: travelerQuizRaw, es: travelerQuizRaw },
  'which-decade-do-you-belong-in':       { en: decadeQuizRaw, pt: decadeQuizRaw, es: decadeQuizRaw },
  'fifa-world-cup-winners':              { en: worldCupEnRaw, pt: worldCupPtRaw, es: worldCupEsRaw },
  'which-football-club-are-you':         { en: clubEnRaw, pt: clubPtRaw, es: clubEsRaw },
  'champions-league-trivia':             { en: uclEnRaw, pt: uclPtRaw, es: uclEsRaw },
}

function getQuiz(slug: string, locale = 'en'): AnyQuiz | undefined {
  const localeKey = ['pt', 'es'].includes(locale) ? locale : 'en'
  return (QUIZ_MAP[slug]?.[localeKey] ?? QUIZ_MAP[slug]?.['en']) as AnyQuiz | undefined
}

const TRIVIA_TIER_IDS = ['legend', 'expert', 'fan', 'rookie'] as const

// ── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return QUIZ_REGISTRY.flatMap(q => {
    const meta = QUIZ_REGISTRY.find(r => r.id === q.id)
    if (meta?.type === 'trivia') {
      // Trivia quizzes: generate params for each locale + each tier
      return meta.locales.flatMap(locale =>
        TRIVIA_TIER_IDS.map(tierId => ({ locale, slug: q.id, resultId: tierId }))
      )
    }
    // Personality quizzes: generate params from results in English JSON
    const quiz = getQuiz(q.id, 'en')
    if (!quiz || isTriviaQuiz(quiz)) return []
    return quiz.results.flatMap(result =>
      ['en', 'pt', 'es'].map(locale => ({ locale, slug: q.id, resultId: result.id }))
    )
  })
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string; resultId: string }> }): Promise<Metadata> {
  const { locale, slug, resultId } = await params
  const quiz = getQuiz(slug, locale)
  if (!quiz) return {}

  if (isTriviaQuiz(quiz)) {
    const tier = quiz.tiers.find(t => t.id === resultId)
    if (!tier) return {}
    return {
      title: `I got "${tier.label}" on ${quiz.title} | ToolNotch`,
      description: tier.description.slice(0, 155),
      alternates: { canonical: `/quiz/${slug}/result/${resultId}` },
      openGraph: {
        title: `I got "${tier.label}" — ${quiz.title}`,
        description: tier.description.slice(0, 155),
        url: `/quiz/${slug}/result/${resultId}`,
      },
      twitter: { card: 'summary_large_image' },
    }
  }

  const result = quiz.results.find(r => r.id === resultId)
  if (!result) return {}
  return {
    title: `I got "${result.title}" on ${quiz.title} | ToolNotch`,
    description: result.description.slice(0, 155),
    alternates: { canonical: `/quiz/${slug}/result/${resultId}` },
    openGraph: {
      title: `I got "${result.title}" — ${quiz.title}`,
      description: result.description.slice(0, 155),
      url: `/quiz/${slug}/result/${resultId}`,
    },
    twitter: { card: 'summary_large_image' },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizResultPage({ params }: { params: Promise<{ locale: string; slug: string; resultId: string }> }) {
  const { locale, slug, resultId } = await params
  const quiz = getQuiz(slug, locale)
  if (!quiz) notFound()

  // ── Trivia result ────────────────────────────────────────────────────────
  if (isTriviaQuiz(quiz)) {
    const tier = quiz.tiers.find(t => t.id === resultId)
    if (!tier) notFound()

    const jsonLd = buildJsonLd(
      {
        '@type': 'Article',
        headline: `${tier.label} — ${quiz.title} Result`,
        description: tier.description.slice(0, 155),
        url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'}/quiz/${slug}/result/${resultId}`,
      },
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Quizzes', url: '/quizzes' },
        { name: quiz.title, url: `/quiz/${slug}` },
        { name: tier.label, url: `/quiz/${slug}/result/${resultId}` },
      ]),
    )

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-8 mb-8">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{quiz.title}</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{tier.label}</h1>
              <p className="text-gray-600 leading-relaxed dark:text-gray-400 mb-6">{tier.description}</p>
              <Link
                href={`/quiz/${slug}`}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              >
                Take this quiz →
              </Link>
            </div>
            <div className="text-center">
              <Link href="/quizzes" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Browse all quizzes →
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  // ── Personality result ───────────────────────────────────────────────────
  const result = quiz.results.find(r => r.id === resultId)
  if (!result) notFound()

  const jsonLd = buildJsonLd(
    {
      '@type': 'Article',
      headline: `${result.title} — ${quiz.title} Result`,
      description: result.description.slice(0, 155),
      url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'}/quiz/${slug}/result/${resultId}`,
    },
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Quizzes', url: '/quizzes' },
      { name: quiz.title, url: `/quiz/${slug}` },
      { name: result.title, url: `/quiz/${slug}/result/${resultId}` },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Result detail — indexable content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-8 mb-8">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{quiz.title}</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{result.title}</h1>
            <p className="text-gray-600 leading-relaxed dark:text-gray-400 mb-6">{result.description}</p>
            {result.traits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {result.traits.map(trait => (
                  <span key={trait} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium dark:bg-purple-900/30 dark:text-purple-400">
                    {trait}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/quiz/${slug}`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
            >
              Take this quiz →
            </Link>
          </div>

          {/* Other quizzes */}
          <div className="text-center">
            <Link href="/quizzes" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              Browse all quizzes →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { AnyQuiz, isTriviaQuiz } from '@/lib/quizTypes'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'
import { buildAlternates } from '@/lib/i18nMeta'
import QuizPlayer from '@/components/quiz/QuizPlayer'
import TriviaPlayer from '@/components/quiz/TriviaPlayer'

// ── Static imports for all quiz JSON files ────────────────────────────────────
// Personality quizzes (English only)
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'

// Sports — English
import worldCupEnRaw from '@/data/quizzes/en/fifa-world-cup-winners.json'
import clubEnRaw from '@/data/quizzes/en/which-football-club-are-you.json'
import uclEnRaw from '@/data/quizzes/en/champions-league-trivia.json'
import loveLangEnRaw from '@/data/quizzes/en/what-is-your-love-language.json'
import f1TriviaEnRaw from '@/data/quizzes/en/formula-1-trivia.json'
import f1DriverEnRaw from '@/data/quizzes/en/which-f1-driver-are-you.json'
// Sports — Portuguese
import worldCupPtRaw from '@/data/quizzes/pt/fifa-world-cup-winners.json'
import clubPtRaw from '@/data/quizzes/pt/which-football-club-are-you.json'
import uclPtRaw from '@/data/quizzes/pt/champions-league-trivia.json'
import loveLangPtRaw from '@/data/quizzes/pt/what-is-your-love-language.json'
import f1TriviaPtRaw from '@/data/quizzes/pt/formula-1-trivia.json'
import f1DriverPtRaw from '@/data/quizzes/pt/which-f1-driver-are-you.json'
// Sports — Spanish
import worldCupEsRaw from '@/data/quizzes/es/fifa-world-cup-winners.json'
import clubEsRaw from '@/data/quizzes/es/which-football-club-are-you.json'
import uclEsRaw from '@/data/quizzes/es/champions-league-trivia.json'
import loveLangEsRaw from '@/data/quizzes/es/what-is-your-love-language.json'
import f1TriviaEsRaw from '@/data/quizzes/es/formula-1-trivia.json'
import f1DriverEsRaw from '@/data/quizzes/es/which-f1-driver-are-you.json'

// ── Quiz map: slug → locale → raw data ────────────────────────────────────────
const QUIZ_MAP: Record<string, Record<string, unknown>> = {
  'what-career-suits-you':               { en: careerQuizRaw, pt: careerQuizRaw, es: careerQuizRaw },
  'which-programming-language-are-you':  { en: programmingQuizRaw, pt: programmingQuizRaw, es: programmingQuizRaw },
  'am-i-introverted-or-extroverted':     { en: introvertQuizRaw, pt: introvertQuizRaw, es: introvertQuizRaw },
  'what-type-of-traveler-are-you':       { en: travelerQuizRaw, pt: travelerQuizRaw, es: travelerQuizRaw },
  'which-decade-do-you-belong-in':       { en: decadeQuizRaw, pt: decadeQuizRaw, es: decadeQuizRaw },
  'fifa-world-cup-winners':              { en: worldCupEnRaw, pt: worldCupPtRaw, es: worldCupEsRaw },
  'which-football-club-are-you':         { en: clubEnRaw, pt: clubPtRaw, es: clubEsRaw },
  'champions-league-trivia':             { en: uclEnRaw, pt: uclPtRaw, es: uclEsRaw },
  'what-is-your-love-language':          { en: loveLangEnRaw, pt: loveLangPtRaw, es: loveLangEsRaw },
  'formula-1-trivia':                    { en: f1TriviaEnRaw, pt: f1TriviaPtRaw, es: f1TriviaEsRaw },
  'which-f1-driver-are-you':             { en: f1DriverEnRaw, pt: f1DriverPtRaw, es: f1DriverEsRaw },
}

function getQuiz(slug: string, locale: string): AnyQuiz | undefined {
  const localeKey = ['pt', 'es'].includes(locale) ? locale : 'en'
  return (QUIZ_MAP[slug]?.[localeKey] ?? QUIZ_MAP[slug]?.['en']) as AnyQuiz | undefined
}

// ── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return QUIZ_REGISTRY.flatMap(q =>
    locales.map(locale => ({ locale, slug: q.id }))
  )
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const quiz = getQuiz(slug, locale)
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
  const quiz = getQuiz(slug, locale)
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

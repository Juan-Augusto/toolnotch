import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'
import { AnyQuiz, isTriviaQuiz } from '@/lib/quizTypes'
import QuizCategoryFilter, { QuizCardData } from '@/components/quiz/QuizCategoryFilter'

// ── Static quiz imports (English for the hub display) ─────────────────────────
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'
import worldCupEnRaw from '@/data/quizzes/en/fifa-world-cup-winners.json'
import clubEnRaw from '@/data/quizzes/en/which-football-club-are-you.json'
import uclEnRaw from '@/data/quizzes/en/champions-league-trivia.json'
import loveLangEnRaw from '@/data/quizzes/en/what-is-your-love-language.json'
import f1TriviaEnRaw from '@/data/quizzes/en/formula-1-trivia.json'
import f1DriverEnRaw from '@/data/quizzes/en/which-f1-driver-are-you.json'

const PATH = '/quizzes'

// ── Quiz data map (English versions for display) ──────────────────────────────
const QUIZ_EN_MAP: Record<string, AnyQuiz> = {
  'what-career-suits-you':               careerQuizRaw as unknown as AnyQuiz,
  'which-programming-language-are-you':  programmingQuizRaw as unknown as AnyQuiz,
  'am-i-introverted-or-extroverted':     introvertQuizRaw as unknown as AnyQuiz,
  'what-type-of-traveler-are-you':       travelerQuizRaw as unknown as AnyQuiz,
  'which-decade-do-you-belong-in':       decadeQuizRaw as unknown as AnyQuiz,
  'fifa-world-cup-winners':              worldCupEnRaw as unknown as AnyQuiz,
  'which-football-club-are-you':         clubEnRaw as unknown as AnyQuiz,
  'champions-league-trivia':             uclEnRaw as unknown as AnyQuiz,
  'what-is-your-love-language':          loveLangEnRaw as unknown as AnyQuiz,
  'formula-1-trivia':                    f1TriviaEnRaw as unknown as AnyQuiz,
  'which-f1-driver-are-you':             f1DriverEnRaw as unknown as AnyQuiz,
}

// Build card data from registry + English quiz data
const ALL_QUIZ_CARDS: QuizCardData[] = QUIZ_REGISTRY.map(meta => {
  const quiz = QUIZ_EN_MAP[meta.id]
  const questionCount = quiz ? quiz.questions.length : 0
  return {
    id: meta.id,
    title: quiz?.title ?? meta.id,
    description: quiz?.description ?? '',
    category: meta.category === 'sports' ? 'sports' : 'personality',
    questionCount,
  }
})

const jsonLd = buildJsonLd(
  faqSchema([
    { question: 'Are these personality quizzes accurate?', answer: 'These quizzes are designed for entertainment and self-reflection, not clinical diagnosis. They are inspired by personality research but are not scientifically validated tests.' },
    { question: 'Are the sports trivia quizzes hard?', answer: 'The sports trivia quizzes range from straightforward to challenging. Each question has an explanation so you can learn even when you get something wrong.' },
    { question: 'Do I need to sign up to take a quiz?', answer: 'No. All quizzes are completely free with no account required. Just click and start answering.' },
    { question: 'Can I retake a quiz?', answer: 'Yes — click "Retake Quiz" on the result screen to start over with fresh answers.' },
    { question: 'How do I share my result?', answer: 'Use the WhatsApp or Copy Link buttons on the result screen to share your result with friends.' },
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Quizzes', url: '/quizzes' }]),
)

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'site' })
  return {
    title: 'Free Quizzes — Personality & Sports Trivia | ToolNotch',
    description: 'Take free personality and sports trivia quizzes. Test your football knowledge with our FIFA World Cup and Champions League quizzes, or discover your personality type.',
    alternates: buildAlternates(PATH),
    openGraph: { title: 'Free Personality & Sports Quizzes | ToolNotch' },
  }
}

export default async function QuizzesHubPage({ params }: Props) {
  await params
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Free Quizzes</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Free personality and sports trivia quizzes. Test your football knowledge or discover more about yourself.
            </p>
          </div>

          <QuizCategoryFilter quizzes={ALL_QUIZ_CARDS} />
        </div>
      </main>
    </>
  )
}

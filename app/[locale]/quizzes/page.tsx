import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import Link from 'next/link'
import { Quiz } from '@/lib/quizTypes'
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'

const PATH = '/quizzes'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'site' })
  return {
    title: 'Free Personality Quizzes — Discover Who You Are | ToolNotch',
    description: 'Take free personality quizzes to discover your career type, travel style, programming language personality, and more. Share your results with friends.',
    alternates: buildAlternates(PATH),
    openGraph: { title: 'Free Personality Quizzes | ToolNotch' },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const quizzes = [careerQuizRaw, programmingQuizRaw, introvertQuizRaw, travelerQuizRaw, decadeQuizRaw] as any[] as Quiz[]

const jsonLd = buildJsonLd(
  faqSchema([
    { question: 'Are these personality quizzes accurate?', answer: 'These quizzes are designed for entertainment and self-reflection, not clinical diagnosis. They are inspired by personality research but are not scientifically validated tests.' },
    { question: 'Do I need to sign up to take a quiz?', answer: 'No. All quizzes are completely free with no account required. Just click and start answering.' },
    { question: 'Can I retake a quiz?', answer: 'Yes — click "Retake Quiz" on the result screen to start over with fresh answers.' },
    { question: 'How do I share my result?', answer: 'Use the Twitter, WhatsApp, or Copy Link buttons on the result screen to share your result with friends.' },
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Quizzes', url: '/quizzes' }]),
)

export default async function QuizzesHubPage({ params }: Props) {
  await params
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Personality Quizzes</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Free, fun personality quizzes to discover more about yourself. Take a quiz and share your result.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-700 group"
              >
                <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400 mb-2">
                  {quiz.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed dark:text-gray-400 mb-4">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{quiz.questions.length} questions</span>
                  <span className="text-blue-600 font-medium group-hover:underline dark:text-blue-400">Take quiz →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

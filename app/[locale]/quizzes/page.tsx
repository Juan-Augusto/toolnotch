import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'
import { getQuizBySlug } from '@/lib/content/quizRepository'
import QuizCategoryFilter, { QuizCardData } from '@/components/quiz/QuizCategoryFilter'

const PATH = '/quizzes'

async function buildQuizCards(): Promise<QuizCardData[]> {
  return Promise.all(
    QUIZ_REGISTRY.map(async (meta) => {
      const quiz = await getQuizBySlug(meta.id, 'en')
      return {
        id: meta.id,
        title: quiz?.title ?? meta.id,
        description: quiz?.description ?? '',
        category: meta.category === 'sports' ? 'sports' : meta.category === 'backend' ? 'backend' : meta.category === 'civic' ? 'civic' : 'personality',
        questionCount: quiz?.questions.length ?? 0,
      }
    })
  )
}

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
  const quizCards = await buildQuizCards()
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

          <QuizCategoryFilter quizzes={quizCards} />
        </div>
      </main>
    </>
  )
}

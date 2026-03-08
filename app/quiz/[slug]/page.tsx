import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Quiz } from '@/lib/quizTypes'
import QuizPlayer from '@/components/quiz/QuizPlayer'
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALL_QUIZZES = [careerQuizRaw, programmingQuizRaw, introvertQuizRaw, travelerQuizRaw, decadeQuizRaw] as any[] as Quiz[]

export function generateStaticParams() {
  return ALL_QUIZZES.map(q => ({ slug: q.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const quiz = ALL_QUIZZES.find(q => q.id === slug)
  if (!quiz) return {}
  return {
    title: `${quiz.title} | ToolNotch`,
    description: quiz.description,
    openGraph: { title: quiz.title, description: quiz.description },
  }
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const quiz = ALL_QUIZZES.find(q => q.id === slug)
  if (!quiz) notFound()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <QuizPlayer quiz={quiz} />
        </div>
      </div>
    </main>
  )
}

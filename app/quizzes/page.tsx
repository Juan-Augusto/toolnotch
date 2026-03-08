import type { Metadata } from 'next'
import Link from 'next/link'
import { Quiz } from '@/lib/quizTypes'
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'

export const metadata: Metadata = {
  title: 'Free Personality Quizzes — Discover Who You Are | ToolNotch',
  description: 'Take free personality quizzes to discover your career type, travel style, programming language personality, and more. Share your results with friends.',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const quizzes = [careerQuizRaw, programmingQuizRaw, introvertQuizRaw, travelerQuizRaw, decadeQuizRaw] as any[] as Quiz[]

export default function QuizzesHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Personality Quizzes</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Free, fun personality quizzes to discover more about yourself. Take a quiz and share your result.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow hover:border-blue-300 group"
            >
              <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors mb-2">
                {quiz.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {quiz.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{quiz.questions.length} questions</span>
                <span className="text-blue-600 font-medium group-hover:underline">Take quiz →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

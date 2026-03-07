import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Personality Quizzes — Find Out What Type You Are',
  description: 'Free personality quizzes. Discover your career type, personality traits, travel style, and more. Share your results.',
}

export default function QuizzesHubPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quizzes</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}

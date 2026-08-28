'use client'
import { useState } from 'react'
import Link from 'next/link'

export interface QuizCardData {
  id: string
  title: string
  description: string
  category: 'sports' | 'personality' | 'backend' | 'civic'
  questionCount: number
}

interface QuizCategoryFilterProps {
  quizzes: QuizCardData[]
}

type ActiveCategory = 'all' | 'sports' | 'personality' | 'backend' | 'civic'

export default function QuizCategoryFilter({ quizzes }: QuizCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('all')

  const filtered = activeCategory === 'all'
    ? quizzes
    : quizzes.filter(q => q.category === activeCategory)

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(['all', 'sports', 'personality', 'backend', 'civic'] as ActiveCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-card border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:bg-card dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {cat === 'all' ? 'All' : cat === 'sports' ? 'Sports' : cat === 'personality' ? 'Personality' : cat === 'backend' ? 'Backend Engineering' : 'Civic & Media Literacy'}
          </button>
        ))}
      </div>

      {/* Quiz grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(quiz => (
          <Link
            key={quiz.id}
            href={`/quiz/${quiz.id}`}
            className="bg-card rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow hover:border-blue-300 dark:bg-card dark:border-gray-700 dark:hover:border-blue-700 group"
          >
            {/* Category badge */}
            <div className="mb-3">
              {quiz.category === 'sports' ? (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Sports
                </span>
              ) : quiz.category === 'backend' ? (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Backend Engineering
                </span>
              ) : quiz.category === 'civic' ? (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Civic & Media Literacy
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  Personality
                </span>
              )}
            </div>
            <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-blue-400 mb-2">
              {quiz.title}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed dark:text-gray-400 mb-4">
              {quiz.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>{quiz.questionCount} questions</span>
              <span className="text-blue-600 font-medium group-hover:underline dark:text-blue-400">Take quiz →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

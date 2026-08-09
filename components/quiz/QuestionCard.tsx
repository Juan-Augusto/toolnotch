'use client'
import { useTranslations } from 'next-intl'
import { Question } from '@/lib/quizTypes'

interface QuestionCardProps {
  question: Question
  selectedOption?: string
  onAnswer: (optionId: string) => void
  questionNumber: number
  total: number
}

export default function QuestionCard({ question, selectedOption, onAnswer, questionNumber, total }: QuestionCardProps) {
  const t = useTranslations('quiz')
  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t('question', { current: questionNumber, total })}</div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-snug">{question.text}</h2>
      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm font-medium ${
              selectedOption === option.id
                ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500'
                : 'border-gray-200 bg-card text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-600 dark:bg-card dark:text-gray-200 dark:hover:border-blue-600 dark:hover:bg-blue-900/20'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}

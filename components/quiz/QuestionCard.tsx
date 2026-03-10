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
      <div className="text-xs text-gray-400 font-medium">{t('question', { current: questionNumber, total })}</div>
      <h2 className="text-xl font-semibold text-gray-900 leading-snug">{question.text}</h2>
      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm font-medium ${
              selectedOption === option.id
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}

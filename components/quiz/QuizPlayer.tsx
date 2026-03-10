'use client'
import { useQuiz } from '@/hooks/useQuiz'
import { Quiz } from '@/lib/quizTypes'
import { useTranslations } from 'next-intl'
import QuestionCard from './QuestionCard'
import ResultCard from './ResultCard'

interface QuizPlayerProps {
  quiz: Quiz
  locale?: string
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const t = useTranslations('quiz')
  const { state, currentQuestion, selectedAnswers, result, start, answer, retake } = useQuiz(quiz)

  if (state === 'idle') {
    return (
      <div className="text-center space-y-6 py-8" lang="en">
        <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="text-gray-600 max-w-lg mx-auto">{quiz.description}</p>
        <div className="text-sm text-gray-400">{quiz.questions.length} questions · Takes about 2 minutes</div>
        <button
          onClick={start}
          className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
        >
          {t('start')}
        </button>
      </div>
    )
  }

  if (state === 'complete' && result) {
    return <ResultCard result={result} quiz={quiz} onRetake={retake} />
  }

  const question = quiz.questions[currentQuestion]
  const progress = (currentQuestion / quiz.questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div lang="en">
        <QuestionCard
          question={question}
          selectedOption={selectedAnswers[question.id]}
          onAnswer={(optionId) => answer(question.id, optionId)}
          questionNumber={currentQuestion + 1}
          total={quiz.questions.length}
        />
      </div>
    </div>
  )
}

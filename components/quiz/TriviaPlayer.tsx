'use client'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { TriviaQuiz } from '@/lib/quizTypes'
import { useTriviaQuiz } from '@/hooks/useTriviaQuiz'
import TriviaResultCard from './TriviaResultCard'

interface TriviaPlayerProps {
  quiz: TriviaQuiz
  locale?: string
}

export default function TriviaPlayer({ quiz }: TriviaPlayerProps) {
  const t = useTranslations('quiz')
  const {
    state,
    currentQuestion,
    selectedAnswers,
    result,
    revealed,
    timeRemaining,
    start,
    answer,
    retake,
  } = useTriviaQuiz(quiz)

  if (state === 'idle') {
    return (
      <div className="text-center space-y-6 py-8" lang="en">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">{quiz.description}</p>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          {quiz.questions.length} questions
        </div>
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
    return <TriviaResultCard result={result} quiz={quiz} onRetake={retake} />
  }

  const question = quiz.questions[currentQuestion]
  const progress = (currentQuestion / quiz.questions.length) * 100
  const selectedId = selectedAnswers[question.id]

  const getOptionClass = (optionId: string): string => {
    const base = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 text-sm font-medium'

    if (!revealed) {
      return `${base} border-gray-200 bg-card text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-600 dark:bg-card dark:text-gray-200 dark:hover:border-blue-600 dark:hover:bg-blue-900/20`
    }

    // Revealed state
    const isSelected = selectedId === optionId
    const isCorrect = optionId === question.correctAnswerId

    if (isSelected && isCorrect) {
      // Selected and correct → green background
      return `${base} border-green-500 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-500 cursor-not-allowed`
    }
    if (isSelected && !isCorrect) {
      // Selected and wrong → red background
      return `${base} border-red-500 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500 cursor-not-allowed`
    }
    if (!isSelected && isCorrect) {
      // Not selected but is correct → green border to reveal correct answer
      return `${base} border-green-500 bg-card text-gray-700 dark:bg-card dark:text-gray-200 cursor-not-allowed`
    }
    // Not selected, not correct
    return `${base} border-gray-200 bg-card text-gray-400 dark:border-gray-700 dark:bg-card dark:text-gray-500 cursor-not-allowed`
  }

  const isLastQuestion = currentQuestion + 1 >= quiz.questions.length

  return (
    <div className="space-y-6" lang="en">
      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-4"
        >
          {/* Question header row: number + timer */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {t('question', { current: currentQuestion + 1, total: quiz.questions.length })}
            </div>
            {timeRemaining !== null && (
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  timeRemaining <= 5
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {timeRemaining}s
              </div>
            )}
          </div>

          {/* Question text */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-snug">
            {question.text}
          </h2>

          {/* Feedback banner */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-sm font-medium px-4 py-2 rounded-lg ${
                  selectedId === question.correctAnswerId
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                {selectedId === question.correctAnswerId ? (
                  t('trivia.correct')
                ) : (
                  <span>
                    {t('trivia.wrong')}{' '}
                    {selectedId == null
                      ? t('trivia.timeUp')
                      : t('trivia.correctAnswer', {
                          answer: question.options.find(o => o.id === question.correctAnswerId)?.text ?? '',
                        })}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Option buttons */}
          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => answer(question.id, option.id)}
                disabled={revealed}
                className={getOptionClass(option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* Next / See result hint when revealed */}
          {revealed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-center text-gray-400 dark:text-gray-500"
            >
              {isLastQuestion ? t('trivia.seeResult') : t('trivia.nextQuestion')}…
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

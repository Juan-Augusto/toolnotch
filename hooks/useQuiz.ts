'use client'
import { useState, useCallback } from 'react'
import { Quiz, QuizResult, QuizState } from '@/lib/quizTypes'
import { calculateResult } from '@/lib/quizEngine'

export function useQuiz(quiz: Quiz) {
  const [state, setState] = useState<QuizState>('idle')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  const start = useCallback(() => {
    setState('active')
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setResult(null)
  }, [])

  const answer = useCallback((questionId: string, optionId: string) => {
    const newAnswers = { ...selectedAnswers, [questionId]: optionId }
    setSelectedAnswers(newAnswers)

    if (currentQuestion + 1 >= quiz.questions.length) {
      const finalResult = calculateResult(quiz, newAnswers)
      setResult(finalResult)
      setState('complete')
    } else {
      setCurrentQuestion(q => q + 1)
    }
  }, [selectedAnswers, currentQuestion, quiz])

  const retake = useCallback(() => {
    setState('idle')
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setResult(null)
  }, [])

  return {
    state,
    currentQuestion,
    selectedAnswers,
    result,
    start,
    answer,
    retake,
  }
}

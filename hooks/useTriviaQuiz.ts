'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { TriviaQuiz, QuizState } from '@/lib/quizTypes'
import { TriviaResult, calculateTriviaResult } from '@/lib/triviaEngine'

export function useTriviaQuiz(quiz: TriviaQuiz) {
  const [state, setState] = useState<QuizState>('idle')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<TriviaResult | null>(null)
  const [revealed, setRevealed] = useState(false)
  // Timer support — used only if quiz.timeLimitSeconds is set
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback((seconds: number) => {
    clearTimer()
    setTimeRemaining(seconds)
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearTimer()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  // Auto-advance when timer hits 0 (marks question as unanswered = wrong)
  useEffect(() => {
    if (timeRemaining === 0 && state === 'active' && !revealed) {
      const question = quiz.questions[currentQuestion]
      advanceQuestion(question.id, '__timeout__')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining])

  const start = useCallback(() => {
    setState('active')
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setResult(null)
    setRevealed(false)
    const limit = quiz.questions[0]?.timeLimitSeconds ?? quiz.timeLimitSeconds
    if (limit) startTimer(limit)
  }, [quiz, startTimer])

  const advanceQuestion = useCallback((questionId: string, optionId: string) => {
    clearTimer()
    const newAnswers = { ...selectedAnswers, [questionId]: optionId }
    setSelectedAnswers(newAnswers)
    setRevealed(true)

    // Short pause to show feedback, then advance
    setTimeout(() => {
      setRevealed(false)
      if (currentQuestion + 1 >= quiz.questions.length) {
        const finalResult = calculateTriviaResult(quiz, newAnswers)
        setResult(finalResult)
        setState('complete')
      } else {
        const next = currentQuestion + 1
        setCurrentQuestion(next)
        const limit = quiz.questions[next]?.timeLimitSeconds ?? quiz.timeLimitSeconds
        if (limit) startTimer(limit)
      }
    }, 1200)
  }, [selectedAnswers, currentQuestion, quiz, clearTimer, startTimer])

  const answer = useCallback((questionId: string, optionId: string) => {
    if (revealed) return // prevent double-answer during feedback pause
    advanceQuestion(questionId, optionId)
  }, [revealed, advanceQuestion])

  const retake = useCallback(() => {
    clearTimer()
    setState('idle')
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setResult(null)
    setRevealed(false)
    setTimeRemaining(null)
  }, [clearTimer])

  useEffect(() => () => clearTimer(), [clearTimer])

  return {
    state,
    currentQuestion,
    selectedAnswers,
    result,
    revealed,
    timeRemaining,
    start,
    answer,
    retake,
  }
}

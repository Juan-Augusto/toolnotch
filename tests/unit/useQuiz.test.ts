import { renderHook, act } from '@testing-library/react'
import { useQuiz } from '@/hooks/useQuiz'
import { Quiz, QuizResult, Question, Option } from '@/lib/quizTypes'

// ─── Minimal fixture ─────────────────────────────────────────────────────────

function makeResult(id: string): QuizResult {
  return {
    id,
    title: `Result ${id}`,
    description: `Description for ${id}`,
    image: `/images/${id}.jpg`,
    traits: [],
    shareText: `You got ${id}!`,
  }
}

function makeOption(id: string, resultId: string): Option {
  return { id, text: `Option ${id}`, scores: { [resultId]: 3 } }
}

function makeQuestion(id: string, resultId: string): Question {
  return {
    id,
    text: `Question ${id}?`,
    options: [makeOption(`${id}-opt-a`, resultId), makeOption(`${id}-opt-b`, resultId)],
  }
}

const RESULT_A = makeResult('result-a')
const RESULT_B = makeResult('result-b')

/** A two-question quiz fixture. */
const TWO_QUESTION_QUIZ: Quiz = {
  id: 'hook-test-quiz',
  title: 'Hook Test Quiz',
  description: 'Used for testing useQuiz hook',
  image: '/images/test.jpg',
  questions: [
    makeQuestion('q1', 'result-a'),
    makeQuestion('q2', 'result-a'),
  ],
  results: [RESULT_A, RESULT_B],
}

/** A single-question quiz — one answer drives straight to completion. */
const ONE_QUESTION_QUIZ: Quiz = {
  id: 'hook-test-quiz-single',
  title: 'Single Question Quiz',
  description: 'One question quiz for completion test',
  image: '/images/test.jpg',
  questions: [makeQuestion('q1', 'result-a')],
  results: [RESULT_A, RESULT_B],
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useQuiz hook', () => {
  describe('initial state', () => {
    it('starts in idle state', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      expect(result.current.state).toBe('idle')
    })

    it('starts with currentQuestion index 0', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      expect(result.current.currentQuestion).toBe(0)
    })

    it('starts with empty selectedAnswers', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      expect(result.current.selectedAnswers).toEqual({})
    })

    it('starts with null result', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      expect(result.current.result).toBeNull()
    })
  })

  describe('start()', () => {
    it('transitions state from idle to active', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })

      expect(result.current.state).toBe('active')
    })

    it('resets currentQuestion to 0 when called after answering', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })

      // currentQuestion has advanced to 1
      expect(result.current.currentQuestion).toBe(1)

      act(() => {
        result.current.start()
      })

      expect(result.current.currentQuestion).toBe(0)
    })

    it('clears selectedAnswers when re-started', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })

      act(() => {
        result.current.start()
      })

      expect(result.current.selectedAnswers).toEqual({})
    })
  })

  describe('answer()', () => {
    it('records the selected option in selectedAnswers', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })

      expect(result.current.selectedAnswers).toEqual({ q1: 'q1-opt-a' })
    })

    it('advances currentQuestion after answering a non-final question', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })

      expect(result.current.currentQuestion).toBe(1)
      expect(result.current.state).toBe('active')
    })

    it('transitions to complete state after answering the final question', () => {
      const { result } = renderHook(() => useQuiz(ONE_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })

      expect(result.current.state).toBe('complete')
    })

    it('sets a non-null result after answering the final question', () => {
      const { result } = renderHook(() => useQuiz(ONE_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })

      expect(result.current.result).not.toBeNull()
      expect(result.current.result?.id).toBe('result-a')
    })

    it('transitions to complete after answering ALL questions in a multi-question quiz', () => {
      const { result } = renderHook(() => useQuiz(TWO_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })
      act(() => {
        result.current.answer('q2', 'q2-opt-a')
      })

      expect(result.current.state).toBe('complete')
      expect(result.current.result).not.toBeNull()
    })
  })

  describe('retake()', () => {
    it('resets state back to idle from complete', () => {
      const { result } = renderHook(() => useQuiz(ONE_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })

      expect(result.current.state).toBe('complete')

      act(() => {
        result.current.retake()
      })

      expect(result.current.state).toBe('idle')
    })

    it('resets currentQuestion to 0', () => {
      const { result } = renderHook(() => useQuiz(ONE_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })
      act(() => {
        result.current.retake()
      })

      expect(result.current.currentQuestion).toBe(0)
    })

    it('clears selectedAnswers', () => {
      const { result } = renderHook(() => useQuiz(ONE_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })
      act(() => {
        result.current.retake()
      })

      expect(result.current.selectedAnswers).toEqual({})
    })

    it('clears the result', () => {
      const { result } = renderHook(() => useQuiz(ONE_QUESTION_QUIZ))

      act(() => {
        result.current.start()
      })
      act(() => {
        result.current.answer('q1', 'q1-opt-a')
      })
      act(() => {
        result.current.retake()
      })

      expect(result.current.result).toBeNull()
    })
  })
})

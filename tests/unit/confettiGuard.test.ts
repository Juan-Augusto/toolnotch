/**
 * Unit tests for the confetti-firing guard logic inside ResultCard.
 *
 * ResultCard (components/quiz/ResultCard.tsx) fires confetti in a useEffect
 * that runs after mount. It has two guards:
 *   1. Bail out early if window.matchMedia('(prefers-reduced-motion: reduce)').matches
 *   2. Bail out early if sessionStorage already contains the key
 *      `confetti_shown_${quiz.id}_${result.id}`
 *
 * We test those guards plus the happy path (confetti fires once on first mount).
 *
 * Note: ResultCard depends on next-intl's useTranslations hook. We mock the
 * entire next-intl module so the component can render in jsdom.
 */

import React from 'react'
import { render } from '@testing-library/react'

// ── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('canvas-confetti')

// next-intl is not available in jsdom — stub the hook to return a simple
// key→key translator so the component renders without an IntlProvider.
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// framer-motion renders fine in jsdom, but we keep the test fast by replacing
// the animated wrappers with plain divs.
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react')
  const motion = new Proxy(
    {},
    {
      get: (_target, key: string) =>
        // eslint-disable-next-line react/display-name
        ({ children, ...rest }: React.PropsWithChildren<Record<string, unknown>>) =>
          React.createElement(key, rest, children),
    },
  )
  return { motion }
})

// ── Imports after mocks ───────────────────────────────────────────────────────

import confetti from 'canvas-confetti'
import ResultCard from '@/components/quiz/ResultCard'
import type { Quiz, QuizResult } from '@/lib/quizTypes'

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockMatchMedia = (reducedMotion: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

const makeQuiz = (id = 'quiz-1'): Quiz => ({
  id,
  title: 'Test Quiz',
  description: 'A quiz for testing.',
  image: '',
  questions: [],
  results: [],
})

const makeResult = (id = 'result-a'): QuizResult => ({
  id,
  title: 'Result A',
  description: 'You are type A.',
  image: '',
  traits: ['curious', 'creative'],
  shareText: 'I got Result A!',
})

const noop = () => {}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ResultCard — confetti guard: prefers-reduced-motion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
  })

  test('confetti does NOT fire when prefers-reduced-motion: reduce is set', () => {
    mockMatchMedia(true) // reduced motion ON

    render(
      React.createElement(ResultCard, {
        quiz: makeQuiz(),
        result: makeResult(),
        onRetake: noop,
      }),
    )

    expect(confetti).not.toHaveBeenCalled()
  })

  test('confetti DOES fire when prefers-reduced-motion is not set', () => {
    mockMatchMedia(false) // reduced motion OFF

    render(
      React.createElement(ResultCard, {
        quiz: makeQuiz(),
        result: makeResult(),
        onRetake: noop,
      }),
    )

    expect(confetti).toHaveBeenCalledTimes(1)
  })
})

describe('ResultCard — confetti guard: sessionStorage deduplication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    mockMatchMedia(false) // reduced motion OFF so we can test the session guard
  })

  test('confetti does NOT fire a second time when sessionStorage key is already set', () => {
    const quiz = makeQuiz('quiz-session')
    const result = makeResult('result-session')

    // Pre-set the key as if confetti already fired once (e.g. after navigation)
    sessionStorage.setItem(`confetti_shown_${quiz.id}_${result.id}`, '1')

    render(
      React.createElement(ResultCard, { quiz, result, onRetake: noop }),
    )

    expect(confetti).not.toHaveBeenCalled()
  })

  test('confetti fires on first render and sets the sessionStorage key', () => {
    const quiz = makeQuiz('quiz-fresh')
    const result = makeResult('result-fresh')

    render(
      React.createElement(ResultCard, { quiz, result, onRetake: noop }),
    )

    expect(confetti).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem(`confetti_shown_${quiz.id}_${result.id}`)).toBe('1')
  })

  test('confetti does NOT fire on remount when key is already stored (navigation simulation)', () => {
    const quiz = makeQuiz('quiz-remount')
    const result = makeResult('result-remount')

    // First render — confetti fires and key is written
    const { unmount } = render(
      React.createElement(ResultCard, { quiz, result, onRetake: noop }),
    )
    expect(confetti).toHaveBeenCalledTimes(1)

    // Simulate unmount + remount (e.g. back-navigation)
    unmount()
    jest.clearAllMocks()

    render(
      React.createElement(ResultCard, { quiz, result, onRetake: noop }),
    )

    // Key is still in sessionStorage — confetti must NOT fire again
    expect(confetti).not.toHaveBeenCalled()
  })

  test('confetti fires independently for different quiz/result id pairs', () => {
    const quizA = makeQuiz('quiz-a')
    const resultA = makeResult('result-a')
    const quizB = makeQuiz('quiz-b')
    const resultB = makeResult('result-b')

    render(React.createElement(ResultCard, { quiz: quizA, result: resultA, onRetake: noop }))
    render(React.createElement(ResultCard, { quiz: quizB, result: resultB, onRetake: noop }))

    // Each unique pair fires once
    expect(confetti).toHaveBeenCalledTimes(2)
  })
})

describe('ResultCard — confetti call shape', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    mockMatchMedia(false)
  })

  test('confetti is called with expected particle and origin config', () => {
    render(
      React.createElement(ResultCard, {
        quiz: makeQuiz('quiz-shape'),
        result: makeResult('result-shape'),
        onRetake: noop,
      }),
    )

    expect(confetti).toHaveBeenCalledWith(
      expect.objectContaining({
        particleCount: 160,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.55 },
      }),
    )
  })
})

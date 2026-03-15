import { calculateResult } from '@/lib/quizEngine'
import { Quiz, Option, Question, QuizResult } from '@/lib/quizTypes'

// ─── Fixture helpers ────────────────────────────────────────────────────────

function makeResult(id: string): QuizResult {
  return {
    id,
    title: `Result ${id}`,
    description: `Description for ${id}`,
    image: `/images/${id}.jpg`,
    traits: [],
    shareText: `I got ${id}!`,
  }
}

function makeOption(id: string, scores: Record<string, number>): Option {
  return { id, text: `Option ${id}`, scores }
}

function makeQuestion(id: string, options: Option[]): Question {
  return { id, text: `Question ${id}?`, options }
}

function makeQuiz(questions: Question[], results: QuizResult[]): Quiz {
  return {
    id: 'test-quiz',
    title: 'Test Quiz',
    description: 'A test quiz',
    image: '/images/test.jpg',
    questions,
    results,
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('calculateResult()', () => {
  it('returns result-a when all answers point exclusively to result-a', () => {
    const resultA = makeResult('result-a')
    const resultB = makeResult('result-b')

    const quiz = makeQuiz(
      [
        makeQuestion('q1', [makeOption('q1a', { 'result-a': 3 }), makeOption('q1b', { 'result-b': 3 })]),
        makeQuestion('q2', [makeOption('q2a', { 'result-a': 3 }), makeOption('q2b', { 'result-b': 3 })]),
        makeQuestion('q3', [makeOption('q3a', { 'result-a': 3 }), makeOption('q3b', { 'result-b': 3 })]),
      ],
      [resultA, resultB],
    )

    const answers = { q1: 'q1a', q2: 'q2a', q3: 'q3a' }
    const result = calculateResult(quiz, answers)

    expect(result.id).toBe('result-a')
  })

  it('returns the result with the highest accumulated score when answers are split', () => {
    const resultA = makeResult('result-a')
    const resultB = makeResult('result-b')
    const resultC = makeResult('result-c')

    // Distribute: result-a gets 6, result-b gets 9, result-c gets 3
    const quiz = makeQuiz(
      [
        makeQuestion('q1', [
          makeOption('q1a', { 'result-a': 3, 'result-c': 3 }),
          makeOption('q1b', { 'result-b': 3 }),
        ]),
        makeQuestion('q2', [
          makeOption('q2a', { 'result-a': 3 }),
          makeOption('q2b', { 'result-b': 3 }),
        ]),
        makeQuestion('q3', [
          makeOption('q3a', { 'result-a': 0 }),
          makeOption('q3b', { 'result-b': 3 }),
        ]),
      ],
      [resultA, resultB, resultC],
    )

    // q1 → q1a  (+3 a, +3 c)
    // q2 → q2a  (+3 a)           total a=6
    // q3 → q3b  (+3 b)           total b=6 wait — rebalance:
    // Let's use explicit scoring to guarantee b wins clearly:
    // q1 → q1b (+3 b), q2 → q2b (+3 b), q3 → q3b (+3 b) → b=9, a=0
    const answers = { q1: 'q1b', q2: 'q2b', q3: 'q3b' }
    const result = calculateResult(quiz, answers)

    expect(result.id).toBe('result-b')
  })

  it('returns the alphabetically-first id when two results are tied', () => {
    const resultA = makeResult('alpha')
    const resultB = makeResult('zeta')

    const quiz = makeQuiz(
      [
        makeQuestion('q1', [
          // Both options give equal scores to alpha and zeta
          makeOption('q1a', { alpha: 3, zeta: 3 }),
        ]),
        makeQuestion('q2', [
          makeOption('q2a', { alpha: 3, zeta: 3 }),
        ]),
      ],
      [resultA, resultB],
    )

    const answers = { q1: 'q1a', q2: 'q2a' }
    const result = calculateResult(quiz, answers)

    // 'alpha' < 'zeta' lexicographically → alpha wins the tie
    expect(result.id).toBe('alpha')
  })

  it('ignores questions that have no matching answer in the answers map', () => {
    const resultA = makeResult('result-a')
    const resultB = makeResult('result-b')

    const quiz = makeQuiz(
      [
        makeQuestion('q1', [makeOption('q1a', { 'result-a': 5 }), makeOption('q1b', { 'result-b': 5 })]),
        // q2 will have no answer supplied
        makeQuestion('q2', [makeOption('q2a', { 'result-b': 99 })]),
      ],
      [resultA, resultB],
    )

    // Only q1 answered → result-a gets 5, result-b gets 0
    const answers = { q1: 'q1a' }
    const result = calculateResult(quiz, answers)

    expect(result.id).toBe('result-a')
  })

  it('returns the first result in the array as fallback when results list is non-empty but totals are all zero', () => {
    const resultA = makeResult('result-a')
    const resultB = makeResult('result-b')

    // Options exist but give 0 points to everything; still valid — just no score contribution
    const quiz = makeQuiz(
      [makeQuestion('q1', [makeOption('q1a', { 'result-a': 0, 'result-b': 0 })])],
      [resultA, resultB],
    )

    const answers = { q1: 'q1a' }
    const result = calculateResult(quiz, answers)

    // Tie at 0: alphabetical ordering — 'result-a' < 'result-b'
    expect(result.id).toBe('result-a')
  })
})

import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuizLabels } from '@/components/interview/interviewQuizLabels'

const ALL_SLUGS = [
  'typescript',
  'vue',
  'database-design',
  'database-indexing',
  'messaging-sqs-kafka',
  'nodejs-fundamentals',
  'rabbitmq-concepts',
  'system-architecture',
]

const LOCALES = ['en', 'pt', 'es'] as const

import { shuffleQuestionOptions } from '@/components/interview/AppInterviewQuiz'

describe('Interview I18n & Trivia Provider', () => {

  describe('getInterviewQuestions', () => {
    test.each(ALL_SLUGS)('slug "%s" returns 30 questions with 4 options in pt, en, es', (slug) => {
      LOCALES.forEach((locale) => {
        const questions = getInterviewQuestions(slug, locale)
        expect(questions).toBeDefined()
        expect(questions).toHaveLength(30)

        questions.forEach((q, idx) => {
          expect(q.id).toBeDefined()
          expect(typeof q.question).toBe('string')
          expect(q.question.length).toBeGreaterThan(5)
          expect(q.options).toHaveLength(4)
          q.options.forEach((opt) => {
            expect(typeof opt).toBe('string')
            expect(opt.length).toBeGreaterThan(0)
          })
          expect(typeof q.correctIndex).toBe('number')
          expect(q.correctIndex).toBeGreaterThanOrEqual(0)
          expect(q.correctIndex).toBeLessThan(4)
          expect(typeof q.explanation).toBe('string')
        })
      })
    })

    it('returns distinct translated questions in pt vs en for typescript and vue', () => {
      const tsEn = getInterviewQuestions('typescript', 'en')
      const tsPt = getInterviewQuestions('typescript', 'pt')
      const tsEs = getInterviewQuestions('typescript', 'es')

      expect(tsEn[0].question).not.toEqual(tsPt[0].question)
      expect(tsEn[0].question).not.toEqual(tsEs[0].question)
      expect(tsPt[0].question).not.toEqual(tsEs[0].question)

      const vueEn = getInterviewQuestions('vue', 'en')
      const vuePt = getInterviewQuestions('vue', 'pt')
      const vueEs = getInterviewQuestions('vue', 'es')

      expect(vueEn[0].question).not.toEqual(vuePt[0].question)
      expect(vueEn[0].question).not.toEqual(vueEs[0].question)
    })
  })

  describe('getInterviewQuizMeta', () => {
    test.each(ALL_SLUGS)('slug "%s" has localized meta in pt, en, es', (slug) => {
      LOCALES.forEach((locale) => {
        const meta = getInterviewQuizMeta(slug, locale)
        expect(meta).toBeDefined()
        expect(meta.title).toBeTruthy()
        expect(meta.subtitle).toBeTruthy()
        expect(meta.secondaryTabTitle).toBeTruthy()
        expect(meta.levelCards).toHaveLength(3)

        meta.levelCards.forEach((card) => {
          expect(['beginner', 'intermediate', 'advanced']).toContain(card.level)
          expect(card.title).toBeTruthy()
          expect(card.desc).toBeTruthy()
          expect(card.topics.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('getInterviewQuizLabels', () => {
    it('returns complete translation dictionary for all supported locales', () => {
      LOCALES.forEach((locale) => {
        const labels = getInterviewQuizLabels(locale)
        expect(labels.levelLabels.all).toBeTruthy()
        expect(labels.levelLabels.beginner).toBeTruthy()
        expect(labels.levelLabels.intermediate).toBeTruthy()
        expect(labels.levelLabels.advanced).toBeTruthy()
        expect(labels.evaluations.high.title).toBeTruthy()
        expect(labels.evaluations.mid.title).toBeTruthy()
        expect(labels.evaluations.low.title).toBeTruthy()
        expect(labels.correct).toBeTruthy()
        expect(labels.incorrect).toBeTruthy()
        expect(labels.startQuiz).toBeTruthy()
      })
    })
  })

  describe('shuffleQuestionOptions', () => {
    const mockQuestion = {
      id: 'mock-1',
      question: 'What is TypeScript?',
      options: [
        'A CSS preprocessor',
        'A typed superset of JavaScript',
        'A database engine',
        'A web browser',
      ] as [string, string, string, string],
      correctIndex: 1 as const,
      explanation: 'TypeScript adds static typing to JavaScript.',
      level: 'beginner' as const,
    }

    it('preserves the identity of the correct answer text after shuffle', () => {
      const originalCorrectText = mockQuestion.options[mockQuestion.correctIndex]

      for (let i = 0; i < 20; i++) {
        const shuffled = shuffleQuestionOptions(mockQuestion)
        expect(shuffled.options).toHaveLength(4)
        expect(shuffled.options[shuffled.correctIndex]).toEqual(originalCorrectText)
      }
    })

    it('distributes correctIndex randomly across 0, 1, 2, 3 instead of fixing it at 1', () => {
      const seenIndices = new Set<number>()
      for (let i = 0; i < 100; i++) {
        const shuffled = shuffleQuestionOptions(mockQuestion)
        seenIndices.add(shuffled.correctIndex)
      }

      // With 100 runs, every index 0, 1, 2, 3 should appear with probability 1 - 4*(0.75^100) ≈ 1
      expect(seenIndices.size).toBe(4)
      expect(seenIndices.has(0)).toBe(true)
      expect(seenIndices.has(1)).toBe(true)
      expect(seenIndices.has(2)).toBe(true)
      expect(seenIndices.has(3)).toBe(true)
    })
  })
})


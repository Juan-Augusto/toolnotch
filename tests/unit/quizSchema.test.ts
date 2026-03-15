import * as fs from 'fs'
import * as path from 'path'
import { Quiz } from '@/lib/quizTypes'

// ─── Locate all quiz JSON files ──────────────────────────────────────────────

const QUIZZES_DIR = path.resolve(__dirname, '../../data/quizzes')

function getQuizFiles(): string[] {
  return fs
    .readdirSync(QUIZZES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(QUIZZES_DIR, f))
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Quiz JSON schema validation', () => {
  const quizFiles = getQuizFiles()

  it('finds at least one quiz JSON file', () => {
    expect(quizFiles.length).toBeGreaterThan(0)
  })

  describe.each(quizFiles)('%s', (filePath) => {
    let quiz: Quiz

    beforeAll(() => {
      const raw = fs.readFileSync(filePath, 'utf-8')
      quiz = JSON.parse(raw) as Quiz
    })

    it('parses without error and has required top-level fields', () => {
      expect(quiz).toBeDefined()
      expect(typeof quiz.id).toBe('string')
      expect(typeof quiz.title).toBe('string')
      expect(Array.isArray(quiz.questions)).toBe(true)
      expect(Array.isArray(quiz.results)).toBe(true)
    })

    it('has at least one question and one result', () => {
      expect(quiz.questions.length).toBeGreaterThan(0)
      expect(quiz.results.length).toBeGreaterThan(0)
    })

    it('has no duplicate question IDs within the quiz', () => {
      const ids = quiz.questions.map((q) => q.id)
      const unique = new Set(ids)
      expect(unique.size).toBe(ids.length)
    })

    it('has no duplicate option IDs within any question', () => {
      for (const question of quiz.questions) {
        const optionIds = question.options.map((o) => o.id)
        const unique = new Set(optionIds)
        expect(unique.size).toBe(optionIds.length)
      }
    })

    it('every Option.scores key references a valid QuizResult.id in the same quiz', () => {
      const validResultIds = new Set(quiz.results.map((r) => r.id))

      for (const question of quiz.questions) {
        for (const option of question.options) {
          for (const scoreKey of Object.keys(option.scores)) {
            expect(validResultIds).toContain(scoreKey)
          }
        }
      }
    })

    it('every QuizResult has the required fields', () => {
      for (const result of quiz.results) {
        expect(typeof result.id).toBe('string')
        expect(typeof result.title).toBe('string')
        expect(typeof result.description).toBe('string')
        expect(typeof result.image).toBe('string')
        expect(Array.isArray(result.traits)).toBe(true)
        expect(typeof result.shareText).toBe('string')
      }
    })
  })
})

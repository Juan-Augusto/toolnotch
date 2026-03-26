import { TriviaQuiz, TriviaScoreTier } from './quizTypes'

export interface TriviaResult {
  score: number
  total: number
  percent: number
  tier: TriviaScoreTier
  correctIds: string[]
}

export function calculateTriviaResult(
  quiz: TriviaQuiz,
  answers: Record<string, string>
): TriviaResult {
  const correctIds: string[] = []
  let score = 0

  for (const question of quiz.questions) {
    if (answers[question.id] === question.correctAnswerId) {
      score++
      correctIds.push(question.id)
    }
  }

  const total = quiz.questions.length
  const percent = total === 0 ? 0 : Math.round((score / total) * 100)

  // Find the highest tier whose minPercent is <= percent
  // Tiers should be sorted descending by minPercent in the JSON
  const tier =
    [...quiz.tiers]
      .sort((a, b) => b.minPercent - a.minPercent)
      .find(t => percent >= t.minPercent) ?? quiz.tiers[quiz.tiers.length - 1]

  return { score, total, percent, tier, correctIds }
}

import { Quiz, QuizResult } from './quizTypes'

export function calculateResult(quiz: Quiz, answers: Record<string, string>): QuizResult {
  const totals: Record<string, number> = {}

  for (const question of quiz.questions) {
    const selectedOptionId = answers[question.id]
    if (!selectedOptionId) continue
    const option = question.options.find(o => o.id === selectedOptionId)
    if (!option) continue
    for (const [resultId, score] of Object.entries(option.scores)) {
      totals[resultId] = (totals[resultId] ?? 0) + score
    }
  }

  // Find the result with the highest score (tie-break: alphabetical by id)
  const sortedResults = quiz.results.slice().sort((a, b) => {
    const diff = (totals[b.id] ?? 0) - (totals[a.id] ?? 0)
    if (diff !== 0) return diff
    return a.id.localeCompare(b.id)
  })

  return sortedResults[0] ?? quiz.results[0]
}

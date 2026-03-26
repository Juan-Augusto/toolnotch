export interface Option {
  id: string
  text: string
  scores: Record<string, number>
}

export interface Question {
  id: string
  text: string
  options: Option[]
}

export interface QuizResult {
  id: string
  title: string
  description: string
  image: string
  traits: string[]
  shareText: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  image: string
  questions: Question[]
  results: QuizResult[]
}

export type QuizState = 'idle' | 'active' | 'complete'

// ─── Trivia Quiz Types ───────────────────────────────────────────────────────

export interface TriviaOption {
  id: string
  text: string
}

export interface TriviaQuestion {
  id: string
  text: string
  options: TriviaOption[]
  correctAnswerId: string
  timeLimitSeconds?: number
}

export interface TriviaScoreTier {
  id: string           // 'legend' | 'expert' | 'fan' | 'rookie'
  minPercent: number   // 80, 60, 40, 0
  label: string
  description: string  // 80–120 words of indexable text
  shareText: string
}

export interface TriviaQuiz {
  id: string
  type: 'trivia'
  category: string
  title: string
  description: string
  image: string
  timeLimitSeconds?: number
  questions: TriviaQuestion[]
  tiers: TriviaScoreTier[]
}

export type AnyQuiz = Quiz | TriviaQuiz

export function isTriviaQuiz(quiz: AnyQuiz): quiz is TriviaQuiz {
  return (quiz as TriviaQuiz).type === 'trivia'
}

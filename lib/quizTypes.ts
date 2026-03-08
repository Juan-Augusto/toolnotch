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

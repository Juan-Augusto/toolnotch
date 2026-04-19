export type QuizLevel = 'beginner' | 'intermediate' | 'advanced'
export type Screen = 'home' | 'quiz' | 'results'
export type ExplanationTab = 'why' | 'compiled' | 'best'

export interface InterviewQuestion {
  id: string
  topic: string
  question: string
  code: string | null
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  compiledJS: string | null
  bestPractice: string
  source: string
}

export interface UserAnswer {
  questionIndex: number
  chosenIndex: number
  correct: boolean
}

export interface QuizState {
  screen: Screen
  level: QuizLevel | null
  questions: InterviewQuestion[]
  currentIndex: number
  answered: boolean
  userAnswers: UserAnswer[]
  activeTab: ExplanationTab
}

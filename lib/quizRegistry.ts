export type QuizMeta = {
  id: string
  type: 'personality' | 'trivia'
  category: 'personality' | 'sports'
  locales: ('en' | 'pt' | 'es')[]
}

export const QUIZ_REGISTRY: QuizMeta[] = [
  // Sports
  { id: 'fifa-world-cup-winners',          type: 'trivia',      category: 'sports',      locales: ['en','pt','es'] },
  { id: 'which-football-club-are-you',     type: 'personality', category: 'sports',      locales: ['en','pt','es'] },
  { id: 'champions-league-trivia',         type: 'trivia',      category: 'sports',      locales: ['en','pt','es'] },
  { id: 'what-is-your-love-language',       type: 'personality', category: 'personality', locales: ['en','pt','es'] },
  { id: 'formula-1-trivia',                type: 'trivia',      category: 'sports',      locales: ['en','pt','es'] },
  { id: 'which-f1-driver-are-you',         type: 'personality', category: 'sports',      locales: ['en','pt','es'] },
  // Personality (English only)
  { id: 'what-career-suits-you',           type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'which-programming-language-are-you', type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'am-i-introverted-or-extroverted', type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'what-type-of-traveler-are-you',   type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'which-decade-do-you-belong-in',   type: 'personality', category: 'personality', locales: ['en'] },
]

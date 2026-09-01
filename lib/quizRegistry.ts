export type QuizMeta = {
  id: string
  type: 'personality' | 'trivia'
  category: 'personality' | 'sports' | 'backend' | 'civic'
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
  // Election 2026 (civic / political-adjacent, neutral by construction)
  { id: 'what-is-your-political-profile',        type: 'personality', category: 'personality', locales: ['en','pt','es'] },
  { id: 'political-echo-chamber-quiz',           type: 'personality', category: 'personality', locales: ['en','pt','es'] },
  { id: 'which-historical-figure-matches-you',   type: 'personality', category: 'personality', locales: ['en','pt','es'] },
  { id: 'fake-news-or-fact',                     type: 'trivia',      category: 'civic',       locales: ['en','pt','es'] },
  // Backend Engineering (English only)
  { id: 'nodejs-fundamentals',  type: 'trivia', category: 'backend', locales: ['en'] },
  { id: 'database-design',      type: 'trivia', category: 'backend', locales: ['en'] },
  { id: 'database-indexing',    type: 'trivia', category: 'backend', locales: ['en'] },
  { id: 'messaging-sqs-kafka',  type: 'trivia', category: 'backend', locales: ['en'] },
  { id: 'rabbitmq-concepts',    type: 'trivia', category: 'backend', locales: ['en'] },
  { id: 'system-architecture',  type: 'trivia', category: 'backend', locales: ['en'] },
  // Personality (English only)
  { id: 'what-career-suits-you',           type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'which-programming-language-are-you', type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'am-i-introverted-or-extroverted', type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'what-type-of-traveler-are-you',   type: 'personality', category: 'personality', locales: ['en'] },
  { id: 'which-decade-do-you-belong-in',   type: 'personality', category: 'personality', locales: ['en'] },
]

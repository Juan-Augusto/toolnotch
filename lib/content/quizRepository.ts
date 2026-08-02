import fs from 'fs/promises'
import path from 'path'
import type { AnyQuiz } from '@/lib/quizTypes'
import { isTriviaQuiz } from '@/lib/quizTypes'

const QUIZ_DIR = path.join(process.cwd(), 'data', 'quizzes')

function resolveLocaleKey(locale: string): 'en' | 'pt' | 'es' {
  return locale === 'pt' || locale === 'es' ? locale : 'en'
}

async function readQuizFile(slug: string, localeKey: string): Promise<AnyQuiz | null> {
  const candidates = [
    path.join(QUIZ_DIR, localeKey, `${slug}.json`),
    path.join(QUIZ_DIR, `${slug}.json`),
  ]
  if (localeKey !== 'en') candidates.push(path.join(QUIZ_DIR, 'en', `${slug}.json`))

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(raw) as AnyQuiz
    } catch {
      // try next candidate
    }
  }
  return null
}

export async function getQuizBySlug(slug: string, locale: string): Promise<AnyQuiz | undefined> {
  const quiz = await readQuizFile(slug, resolveLocaleKey(locale))
  return quiz ?? undefined
}

// Personality result ids come from the English source of truth, regardless of the requested locale.
export async function getQuizResultIds(slug: string): Promise<string[]> {
  const quiz = await getQuizBySlug(slug, 'en')
  if (!quiz || isTriviaQuiz(quiz)) return []
  return quiz.results.map((r) => r.id)
}

import { DiceNotation } from './randomTypes'

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickRandom<T>(arr: T[], count = 1): T[] {
  const shuffled = shuffleArray(arr)
  return shuffled.slice(0, Math.min(count, arr.length))
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function parseDiceNotation(notation: string): DiceNotation | null {
  const trimmed = notation.trim().toLowerCase()
  const match = trimmed.match(/^(\d*)d(\d+)([+-]\d+)?$/)
  if (!match) return null

  const count = match[1] ? parseInt(match[1]) : 1
  const sides = parseInt(match[2])
  const modifier = match[3] ? parseInt(match[3]) : 0

  if (count < 1 || count > 100 || sides < 2 || sides > 1000) return null

  return { count, sides, modifier }
}

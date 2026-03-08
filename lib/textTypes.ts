export interface TextStats {
  words: number
  characters: number
  charactersNoSpaces: number
  sentences: number
  paragraphs: number
  readingTime: number
  speakingTime: number
  fleschEase: number
  fleschGrade: number
  gunningFog: number
  avgWordsPerSentence: number
  avgSyllablesPerWord: number
  topWords: { word: string; count: number }[]
}

export type FleschLabel =
  | 'Very Easy'
  | 'Easy'
  | 'Standard'
  | 'Fairly Difficult'
  | 'Difficult'
  | 'Very Difficult'

export function getFleschLabel(score: number): FleschLabel {
  if (score >= 90) return 'Very Easy'
  if (score >= 70) return 'Easy'
  if (score >= 60) return 'Standard'
  if (score >= 50) return 'Fairly Difficult'
  if (score >= 30) return 'Difficult'
  return 'Very Difficult'
}

export function getFleschColor(score: number): string {
  if (score >= 90) return 'text-green-500'
  if (score >= 70) return 'text-green-400'
  if (score >= 60) return 'text-yellow-500'
  if (score >= 50) return 'text-orange-500'
  if (score >= 30) return 'text-red-400'
  return 'text-red-600'
}

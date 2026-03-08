import { TextStats } from './textTypes'
import { STOPWORDS } from '@/data/stopwords'

export function countSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!cleaned) return 0
  // Special endings
  const cleaned2 = cleaned.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  const cleaned3 = cleaned2.replace(/^y/, '')
  const vowelGroups = cleaned3.match(/[aeiouy]{1,2}/g)
  return Math.max(1, vowelGroups ? vowelGroups.length : 1)
}

function isComplexWord(word: string): boolean {
  const clean = word.replace(/[^a-zA-Z]/g, '')
  if (clean.length === 0) return false
  // Exclude proper nouns (capitalized mid-sentence)
  if (clean[0] === clean[0].toUpperCase() && clean !== clean.toUpperCase()) return false
  // Common suffixes that don't add complexity
  const simple = clean.toLowerCase()
  if (simple.endsWith('ing') || simple.endsWith('ed') || simple.endsWith('es') || simple.endsWith('er')) {
    const base = simple.replace(/(ing|ed|es|er)$/, '')
    if (countSyllables(base) < 3) return false
  }
  return countSyllables(clean) >= 3
}

export function analyzeText(text: string): TextStats {
  if (!text || text.trim().length === 0) {
    return {
      words: 0, characters: 0, charactersNoSpaces: 0,
      sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0,
      fleschEase: 0, fleschGrade: 0, gunningFog: 0,
      avgWordsPerSentence: 0, avgSyllablesPerWord: 0, topWords: [],
    }
  }

  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length

  // Words
  const wordList = text.trim().split(/\s+/).filter(w => w.length > 0)
  const words = wordList.length

  // Sentences: split on . ! ? followed by space or end
  const sentenceMatches = text.match(/[^.!?]*[.!?]+/g) ?? []
  const sentences = Math.max(1, sentenceMatches.length)

  // Paragraphs
  const paragraphMatches = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const paragraphs = Math.max(1, paragraphMatches.length)

  // Syllables
  const syllableList = wordList.map(w => countSyllables(w))
  const totalSyllables = syllableList.reduce((a, b) => a + b, 0)
  const avgSyllablesPerWord = words > 0 ? totalSyllables / words : 0
  const avgWordsPerSentence = words > 0 ? words / sentences : 0

  // Readability
  const fleschEase = words > 0 && sentences > 0
    ? 206.835 - 1.015 * (words / sentences) - 84.6 * (totalSyllables / words)
    : 0
  const fleschGrade = words > 0 && sentences > 0
    ? 0.39 * (words / sentences) + 11.8 * (totalSyllables / words) - 15.59
    : 0

  const complexWords = wordList.filter(isComplexWord).length
  const gunningFog = words > 0 && sentences > 0
    ? 0.4 * (words / sentences + 100 * (complexWords / words))
    : 0

  // Reading time
  const readingTime = Math.ceil(words / 238)
  const speakingTime = Math.ceil(words / 130)

  // Top words (exclude stopwords)
  const freq: Record<string, number> = {}
  for (const word of wordList) {
    const clean = word.toLowerCase().replace(/[^a-z']/g, '')
    if (clean.length > 1 && !STOPWORDS.has(clean)) {
      freq[clean] = (freq[clean] ?? 0) + 1
    }
  }
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))

  return {
    words, characters, charactersNoSpaces, sentences, paragraphs,
    readingTime, speakingTime,
    fleschEase: Math.round(fleschEase * 10) / 10,
    fleschGrade: Math.round(fleschGrade * 10) / 10,
    gunningFog: Math.round(gunningFog * 10) / 10,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    topWords,
  }
}

import { countSyllables, analyzeText } from '@/lib/textAnalysis'

// ── countSyllables — direct unit tests ───────────────────────────────────────

describe('countSyllables — basic words', () => {
  test('single-syllable words return 1', () => {
    expect(countSyllables('cat')).toBe(1)
    expect(countSyllables('dog')).toBe(1)
    expect(countSyllables('run')).toBe(1)
    expect(countSyllables('sky')).toBe(1)
  })

  test('two-syllable words return 2', () => {
    expect(countSyllables('happy')).toBe(2)
    expect(countSyllables('morning')).toBe(2)
    expect(countSyllables('funny')).toBe(2)
  })

  test('three-syllable words return 3 (heuristic ±1)', () => {
    // countSyllables is a heuristic — allow ±1 for words with silent vowels
    expect(countSyllables('beautiful')).toBeGreaterThanOrEqual(3)
    expect(countSyllables('beautiful')).toBeLessThanOrEqual(4)
    expect(countSyllables('however')).toBe(3)
    expect(countSyllables('another')).toBe(3)
  })
})

describe('countSyllables — single-character words', () => {
  test('single vowel character returns 1 (minimum)', () => {
    expect(countSyllables('a')).toBe(1)
    expect(countSyllables('i')).toBe(1)
  })

  test('single consonant character returns 1 (minimum enforced by Math.max)', () => {
    expect(countSyllables('b')).toBe(1)
    expect(countSyllables('t')).toBe(1)
    expect(countSyllables('n')).toBe(1)
  })

  test('single character result is never 0', () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    for (const ch of chars) {
      const result = countSyllables(ch)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).not.toBeNaN()
    }
  })
})

describe('countSyllables — numeric strings', () => {
  // The function strips non-alpha characters; a fully numeric string
  // produces an empty cleaned string and should return 0 per the
  // early-return `if (!cleaned) return 0` branch.
  test('all-numeric string returns 0 (stripped to empty, no throw)', () => {
    expect(() => countSyllables('1234')).not.toThrow()
    expect(countSyllables('1234')).toBe(0)
  })

  test('numeric string result is not NaN', () => {
    expect(countSyllables('9999')).not.toBeNaN()
    expect(countSyllables('0')).not.toBeNaN()
  })

  test('mixed alphanumeric strips digits and counts remaining letters', () => {
    // "cat3" → cleaned = "cat" → 1 syllable
    expect(countSyllables('cat3')).toBe(1)
  })
})

describe('countSyllables — punctuation and edge cases', () => {
  test('empty string returns 0', () => {
    expect(countSyllables('')).toBe(0)
  })

  test('word with trailing period is handled without throw', () => {
    expect(() => countSyllables('cat.')).not.toThrow()
    expect(countSyllables('cat.')).toBeGreaterThanOrEqual(1)
  })

  test('all-uppercase word counts correctly', () => {
    // "CAT" → cleaned = "cat" → 1 syllable
    expect(countSyllables('CAT')).toBe(1)
    expect(countSyllables('HAPPY')).toBe(2)
  })
})

// ── countSyllables tested indirectly via analyzeText ─────────────────────────

describe('countSyllables — indirect via analyzeText', () => {
  test('avgSyllablesPerWord is defined and non-NaN for normal text', () => {
    const result = analyzeText('The cat sat on the mat.')
    expect(result.avgSyllablesPerWord).not.toBeNaN()
    expect(result.avgSyllablesPerWord).toBeGreaterThan(0)
  })

  test('all-numeric text produces non-NaN avgSyllablesPerWord', () => {
    // Words like "1234 5678" strip to empty strings — countSyllables returns 0
    // avgSyllablesPerWord = totalSyllables / words; with 0 syllables this is 0, not NaN
    const result = analyzeText('1234 5678 9012')
    expect(result.avgSyllablesPerWord).not.toBeNaN()
  })

  test('single-character word text produces valid avgSyllablesPerWord', () => {
    const result = analyzeText('I a b c.')
    expect(result.avgSyllablesPerWord).not.toBeNaN()
    expect(result.avgSyllablesPerWord).toBeGreaterThanOrEqual(0)
  })
})

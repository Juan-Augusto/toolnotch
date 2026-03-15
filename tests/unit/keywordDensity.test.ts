import { analyzeText } from '@/lib/textAnalysis'
import { STOPWORDS } from '@/data/stopwords'

// ── topWords excludes stopwords ───────────────────────────────────────────────

describe('topWords — stopword exclusion', () => {
  test('common stopwords do not appear in topWords', () => {
    // This text repeats stopwords heavily; none should leak into topWords
    const text = 'the the the and and and is is is a a a of of of'
    const result = analyzeText(text)
    for (const { word } of result.topWords) {
      expect(STOPWORDS.has(word)).toBe(false)
    }
  })

  test('"the" is excluded even when it is the most frequent token', () => {
    const text = 'the the the cat sat'
    const result = analyzeText(text)
    const words = result.topWords.map(w => w.word)
    expect(words).not.toContain('the')
  })

  test('content words are retained after stopword filtering', () => {
    const text = 'the quick brown fox jumps over the lazy dog'
    const result = analyzeText(text)
    const words = result.topWords.map(w => w.word)
    // "quick", "brown", "fox", "jumps", "lazy" are not stopwords
    expect(words.some(w => ['quick', 'brown', 'fox', 'jumps', 'lazy'].includes(w))).toBe(true)
  })

  test('single-character tokens are excluded from topWords', () => {
    // The clean regex requires length > 1: clean.length > 1
    const text = 'a b c d e f'
    const result = analyzeText(text)
    for (const { word } of result.topWords) {
      expect(word.length).toBeGreaterThan(1)
    }
  })
})

// ── topWords sorted descending by count ──────────────────────────────────────

describe('topWords — sort order', () => {
  test('topWords are sorted descending by count', () => {
    // "apple" appears 5x, "banana" 3x, "cherry" 1x
    const text = 'apple apple apple apple apple banana banana banana cherry'
    const result = analyzeText(text)
    const counts = result.topWords.map(w => w.count)
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeLessThanOrEqual(counts[i - 1])
    }
  })

  test('most frequent word is first', () => {
    const text = 'apple apple apple banana banana cherry'
    const result = analyzeText(text)
    expect(result.topWords[0].word).toBe('apple')
    expect(result.topWords[0].count).toBe(3)
  })

  test('topWords contains at most 10 entries', () => {
    // Generate 15 unique content words each appearing once
    const uniqueWords = [
      'alpha', 'beta', 'gamma', 'delta', 'epsilon',
      'zeta', 'eta', 'theta', 'iota', 'kappa',
      'lambda', 'mu', 'nu', 'xi', 'omicron',
    ]
    const text = uniqueWords.join(' ')
    const result = analyzeText(text)
    expect(result.topWords.length).toBeLessThanOrEqual(10)
  })

  test('all topWords entries have a positive count', () => {
    const text = 'apple banana cherry apple banana apple'
    const result = analyzeText(text)
    for (const { count } of result.topWords) {
      expect(count).toBeGreaterThan(0)
    }
  })
})

// ── Duplicate words are merged correctly ─────────────────────────────────────

describe('topWords — duplicate merging', () => {
  test('same word repeated multiple times appears once with correct count', () => {
    const text = 'apple apple apple apple apple'
    const result = analyzeText(text)
    const appleEntry = result.topWords.find(w => w.word === 'apple')
    expect(appleEntry).toBeDefined()
    expect(appleEntry!.count).toBe(5)
    // Should appear exactly once
    const appleCount = result.topWords.filter(w => w.word === 'apple').length
    expect(appleCount).toBe(1)
  })

  test('case-insensitive deduplication: "Apple" and "apple" are merged', () => {
    // The implementation lowercases tokens: word.toLowerCase().replace(/[^a-z']/g, '')
    const text = 'Apple apple APPLE'
    const result = analyzeText(text)
    const appleEntry = result.topWords.find(w => w.word === 'apple')
    expect(appleEntry).toBeDefined()
    expect(appleEntry!.count).toBe(3)
    // Should appear exactly once
    const appleEntries = result.topWords.filter(w => w.word === 'apple')
    expect(appleEntries.length).toBe(1)
  })

  test('word with trailing punctuation is merged with clean version', () => {
    // "apple," and "apple." and "apple" all clean to "apple"
    const text = 'apple, apple. apple'
    const result = analyzeText(text)
    const appleEntry = result.topWords.find(w => w.word === 'apple')
    expect(appleEntry).toBeDefined()
    expect(appleEntry!.count).toBe(3)
  })

  test('two distinct content words have separate entries', () => {
    const text = 'apple banana apple banana apple'
    const result = analyzeText(text)
    const appleEntry = result.topWords.find(w => w.word === 'apple')
    const bananaEntry = result.topWords.find(w => w.word === 'banana')
    expect(appleEntry).toBeDefined()
    expect(bananaEntry).toBeDefined()
    expect(appleEntry!.count).toBe(3)
    expect(bananaEntry!.count).toBe(2)
  })

  test('empty text produces empty topWords array', () => {
    expect(analyzeText('').topWords).toEqual([])
  })

  test('text composed only of stopwords produces empty topWords', () => {
    const text = 'the and is a of for to in that'
    const result = analyzeText(text)
    expect(result.topWords).toEqual([])
  })
})

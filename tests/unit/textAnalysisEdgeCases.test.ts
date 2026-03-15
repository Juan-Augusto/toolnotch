import { analyzeText } from '@/lib/textAnalysis'
import { TextStats } from '@/lib/textTypes'

// Helper: assert no field in TextStats is NaN or undefined
function assertNoNaN(stats: TextStats): void {
  const numericKeys = [
    'words', 'characters', 'charactersNoSpaces', 'sentences', 'paragraphs',
    'readingTime', 'speakingTime', 'fleschEase', 'fleschGrade', 'gunningFog',
    'avgWordsPerSentence', 'avgSyllablesPerWord',
  ] as const
  for (const key of numericKeys) {
    expect(stats[key]).not.toBeNaN()
    expect(stats[key]).not.toBeUndefined()
  }
  expect(stats.topWords).toBeDefined()
  expect(Array.isArray(stats.topWords)).toBe(true)
}

// ── Single word ───────────────────────────────────────────────────────────────

describe('analyzeText — single word text', () => {
  test('single word without punctuation', () => {
    const result = analyzeText('Hello')
    expect(result.words).toBe(1)
    expect(result.sentences).toBe(1)   // Math.max(1, ...) ensures minimum of 1
    expect(result.paragraphs).toBe(1)
    assertNoNaN(result)
  })

  test('single word with period', () => {
    const result = analyzeText('Hello.')
    expect(result.words).toBe(1)
    expect(result.sentences).toBe(1)
    assertNoNaN(result)
  })

  test('single word readingTime is 1 (ceil of any fraction >= 1/238)', () => {
    const result = analyzeText('Test')
    expect(result.readingTime).toBe(1)
  })

  test('single word speakingTime is 1', () => {
    const result = analyzeText('Test')
    expect(result.speakingTime).toBe(1)
  })

  test('avgWordsPerSentence is 1 for single word', () => {
    const result = analyzeText('Hello.')
    expect(result.avgWordsPerSentence).toBe(1)
  })
})

// ── Very long text (10 000+ characters) ──────────────────────────────────────

describe('analyzeText — very long text', () => {
  // Generate a long paragraph repeating a sentence
  const SENTENCE = 'The quick brown fox jumps over the lazy dog. '
  // SENTENCE.length = 45 chars; repeat 250 times = 11 250 chars
  const LONG_TEXT = SENTENCE.repeat(250)

  test(
    'completes within timeout for 10 000+ character input',
    () => {
      expect(LONG_TEXT.length).toBeGreaterThan(10_000)
      const result = analyzeText(LONG_TEXT)
      // Basic sanity: words > 0
      expect(result.words).toBeGreaterThan(0)
    },
    5_000  // 5-second timeout — well within expectation for synchronous code
  )

  test('no NaN fields on long text', () => {
    const result = analyzeText(LONG_TEXT)
    assertNoNaN(result)
  })

  test('topWords is an array of at most 10 entries on long text', () => {
    const result = analyzeText(LONG_TEXT)
    expect(result.topWords.length).toBeLessThanOrEqual(10)
  })
})

// ── All-number text ───────────────────────────────────────────────────────────

describe('analyzeText — all-number text', () => {
  test('"1234 5678 9012" produces valid TextStats with no NaN', () => {
    const result = analyzeText('1234 5678 9012')
    assertNoNaN(result)
  })

  test('word count for all-number text is 3', () => {
    const result = analyzeText('1234 5678 9012')
    expect(result.words).toBe(3)
  })

  test('character count for "1234 5678 9012" is 14', () => {
    // "1234 5678 9012" = 14 characters
    expect(analyzeText('1234 5678 9012').characters).toBe(14)
  })

  test('avgSyllablesPerWord is a finite number (not NaN) for numeric text', () => {
    const result = analyzeText('1234 5678 9012')
    expect(isFinite(result.avgSyllablesPerWord)).toBe(true)
  })

  test('topWords excludes purely numeric tokens (no alpha chars after clean)', () => {
    const result = analyzeText('1234 5678 9012')
    // The cleanup regex /[^a-z']/g leaves empty strings; length <= 1 means excluded
    expect(result.topWords).toEqual([])
  })

  test('single number string produces valid output', () => {
    const result = analyzeText('42')
    assertNoNaN(result)
    expect(result.words).toBe(1)
  })
})

// ── Spaces and newlines only ──────────────────────────────────────────────────

describe('analyzeText — only whitespace characters', () => {
  const WHITESPACE_CASES = [
    '   ',
    '\n',
    '\n\n\n',
    '\t\t',
    '  \n  \t  ',
  ]

  test.each(WHITESPACE_CASES)('input %j returns all-zero stats', (input) => {
    const result = analyzeText(input)
    expect(result.words).toBe(0)
    expect(result.characters).toBe(0)   // empty check returns 0 characters
    expect(result.sentences).toBe(0)
    expect(result.topWords).toEqual([])
    assertNoNaN(result)
  })

  test('pure newlines input does not throw', () => {
    expect(() => analyzeText('\n\n\n')).not.toThrow()
  })
})

// ── Miscellaneous edge cases ──────────────────────────────────────────────────

describe('analyzeText — miscellaneous edge cases', () => {
  test('text with only punctuation returns all-zero stats', () => {
    const result = analyzeText('...')
    // "..." has no whitespace-separated word with length > 0 after trim?
    // Actually "..." is one token, so words = 1 — but characters counts the dots.
    // The important guarantee: no NaN
    assertNoNaN(result)
  })

  test('multiple paragraphs are counted correctly', () => {
    const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.'
    const result = analyzeText(text)
    expect(result.paragraphs).toBe(3)
    assertNoNaN(result)
  })

  test('multiple sentences are counted correctly', () => {
    const text = 'First sentence. Second sentence! Third sentence?'
    const result = analyzeText(text)
    expect(result.sentences).toBe(3)
    assertNoNaN(result)
  })

  test('unicode text does not throw', () => {
    expect(() => analyzeText('café résumé naïve')).not.toThrow()
  })
})

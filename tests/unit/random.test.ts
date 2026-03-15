import { shuffleArray, pickRandom, randomInt } from '@/lib/random'

// ── shuffleArray ──────────────────────────────────────────────────────────────

describe('shuffleArray', () => {
  const SOURCE = [1, 2, 3, 4, 5]

  test('returns an array with the same length as input', () => {
    expect(shuffleArray(SOURCE)).toHaveLength(SOURCE.length)
  })

  test('returns an array containing the same elements as input', () => {
    const result = shuffleArray(SOURCE)
    expect([...result].sort((a, b) => a - b)).toEqual([...SOURCE].sort((a, b) => a - b))
  })

  test('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5]
    const copy = [...original]
    shuffleArray(original)
    expect(original).toEqual(copy)
  })

  test('returns a new array reference, not the same object', () => {
    const arr = [1, 2, 3]
    expect(shuffleArray(arr)).not.toBe(arr)
  })

  test('works correctly on an empty array', () => {
    expect(shuffleArray([])).toEqual([])
  })

  test('works correctly on a single-element array', () => {
    expect(shuffleArray([42])).toEqual([42])
  })

  test('over 100 calls on [1,2,3,4,5], output differs from input at least 50% of the time', () => {
    const input = [1, 2, 3, 4, 5]
    let diffCount = 0
    const RUNS = 100

    for (let i = 0; i < RUNS; i++) {
      const result = shuffleArray(input)
      const isDifferent = result.some((val, idx) => val !== input[idx])
      if (isDifferent) diffCount++
    }

    // With 5 elements the probability of identity permutation is 1/120 ≈ 0.8%
    // so we expect >50% of shuffles to produce a different ordering
    expect(diffCount).toBeGreaterThanOrEqual(50)
  })
})

// ── pickRandom ────────────────────────────────────────────────────────────────

describe('pickRandom', () => {
  const SOURCE = ['a', 'b', 'c', 'd', 'e']

  test('returns exactly count items when count < array length', () => {
    expect(pickRandom(SOURCE, 3)).toHaveLength(3)
  })

  test('all returned items come from the source array', () => {
    const result = pickRandom(SOURCE, 4)
    result.forEach(item => expect(SOURCE).toContain(item))
  })

  test('count defaults to 1 and returns a single-element array', () => {
    const result = pickRandom(SOURCE)
    expect(result).toHaveLength(1)
    expect(SOURCE).toContain(result[0])
  })

  test('count=1 explicitly also returns a single-element array', () => {
    const result = pickRandom(SOURCE, 1)
    expect(result).toHaveLength(1)
  })

  test('returns the full array when count equals array length', () => {
    const result = pickRandom(SOURCE, SOURCE.length)
    expect(result).toHaveLength(SOURCE.length)
    result.forEach(item => expect(SOURCE).toContain(item))
  })

  test('clamps count to array length when count > array length', () => {
    // pickRandom does Math.min(count, arr.length), so asking for more than
    // available returns all elements (no duplicates, no out-of-bounds)
    const result = pickRandom(SOURCE, 100)
    expect(result).toHaveLength(SOURCE.length)
  })

  test('returns empty array when called with empty source', () => {
    expect(pickRandom([], 3)).toEqual([])
  })

  test('does not return duplicate items (because shuffleArray + slice is sampling without replacement)', () => {
    // Run many times and assert uniqueness holds for each call
    for (let i = 0; i < 50; i++) {
      const result = pickRandom(SOURCE, 4)
      const unique = new Set(result)
      expect(unique.size).toBe(result.length)
    }
  })
})

// ── randomInt ─────────────────────────────────────────────────────────────────

describe('randomInt', () => {
  test('always returns an integer', () => {
    for (let i = 0; i < 200; i++) {
      const n = randomInt(1, 100)
      expect(Number.isInteger(n)).toBe(true)
    }
  })

  test('result is always >= min and <= max', () => {
    for (let i = 0; i < 200; i++) {
      const n = randomInt(5, 15)
      expect(n).toBeGreaterThanOrEqual(5)
      expect(n).toBeLessThanOrEqual(15)
    }
  })

  test('randomInt(x, x) always returns x', () => {
    for (let i = 0; i < 50; i++) {
      expect(randomInt(7, 7)).toBe(7)
    }
  })

  test('over 200 calls, both min and max values appear at least once', () => {
    const RUNS = 200
    const MIN = 1
    const MAX = 10
    const seen = new Set<number>()

    for (let i = 0; i < RUNS; i++) {
      seen.add(randomInt(MIN, MAX))
    }

    expect(seen.has(MIN)).toBe(true)
    expect(seen.has(MAX)).toBe(true)
  })

  test('works with negative numbers', () => {
    for (let i = 0; i < 100; i++) {
      const n = randomInt(-10, -1)
      expect(n).toBeGreaterThanOrEqual(-10)
      expect(n).toBeLessThanOrEqual(-1)
    }
  })

  test('works when min is negative and max is positive', () => {
    for (let i = 0; i < 100; i++) {
      const n = randomInt(-5, 5)
      expect(n).toBeGreaterThanOrEqual(-5)
      expect(n).toBeLessThanOrEqual(5)
    }
  })
})

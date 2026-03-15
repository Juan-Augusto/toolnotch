import { getFleschLabel, getFleschColor, FleschLabel } from '@/lib/textTypes'

// ── getFleschLabel — boundary and typical values ──────────────────────────────

describe('getFleschLabel — score boundaries', () => {
  // Boundaries from the implementation:
  //   >= 90  → 'Very Easy'
  //   >= 70  → 'Easy'
  //   >= 60  → 'Standard'
  //   >= 50  → 'Fairly Difficult'
  //   >= 30  → 'Difficult'
  //   < 30   → 'Very Difficult'

  test('score of 90 returns "Very Easy"', () => {
    expect(getFleschLabel(90)).toBe<FleschLabel>('Very Easy')
  })

  test('score of 100 returns "Very Easy"', () => {
    expect(getFleschLabel(100)).toBe<FleschLabel>('Very Easy')
  })

  test('score of 89.9 returns "Easy"', () => {
    expect(getFleschLabel(89.9)).toBe<FleschLabel>('Easy')
  })

  test('score of 70 returns "Easy"', () => {
    expect(getFleschLabel(70)).toBe<FleschLabel>('Easy')
  })

  test('score of 69.9 returns "Standard"', () => {
    expect(getFleschLabel(69.9)).toBe<FleschLabel>('Standard')
  })

  test('score of 60 returns "Standard"', () => {
    expect(getFleschLabel(60)).toBe<FleschLabel>('Standard')
  })

  test('score of 59.9 returns "Fairly Difficult"', () => {
    expect(getFleschLabel(59.9)).toBe<FleschLabel>('Fairly Difficult')
  })

  test('score of 50 returns "Fairly Difficult"', () => {
    expect(getFleschLabel(50)).toBe<FleschLabel>('Fairly Difficult')
  })

  test('score of 49.9 returns "Difficult"', () => {
    expect(getFleschLabel(49.9)).toBe<FleschLabel>('Difficult')
  })

  test('score of 30 returns "Difficult"', () => {
    expect(getFleschLabel(30)).toBe<FleschLabel>('Difficult')
  })

  test('score of 29.9 returns "Very Difficult"', () => {
    expect(getFleschLabel(29.9)).toBe<FleschLabel>('Very Difficult')
  })

  test('score of 0 returns "Very Difficult"', () => {
    expect(getFleschLabel(0)).toBe<FleschLabel>('Very Difficult')
  })

  test('negative score returns "Very Difficult"', () => {
    expect(getFleschLabel(-10)).toBe<FleschLabel>('Very Difficult')
  })
})

describe('getFleschLabel — full label coverage', () => {
  const allLabels: FleschLabel[] = [
    'Very Easy', 'Easy', 'Standard', 'Fairly Difficult', 'Difficult', 'Very Difficult',
  ]

  test('all six labels are reachable', () => {
    const reached = new Set([
      getFleschLabel(95),
      getFleschLabel(75),
      getFleschLabel(65),
      getFleschLabel(55),
      getFleschLabel(40),
      getFleschLabel(10),
    ])
    for (const label of allLabels) {
      expect(reached).toContain(label)
    }
  })
})

// ── getFleschColor — boundary and class correctness ──────────────────────────

describe('getFleschColor — score boundaries', () => {
  // Boundaries from the implementation:
  //   >= 90  → 'text-green-500'
  //   >= 70  → 'text-green-400'
  //   >= 60  → 'text-yellow-500'
  //   >= 50  → 'text-orange-500'
  //   >= 30  → 'text-red-400'
  //   < 30   → 'text-red-600'

  test('score >= 90 returns text-green-500', () => {
    expect(getFleschColor(90)).toBe('text-green-500')
    expect(getFleschColor(100)).toBe('text-green-500')
  })

  test('score 70–89 returns text-green-400', () => {
    expect(getFleschColor(70)).toBe('text-green-400')
    expect(getFleschColor(89)).toBe('text-green-400')
  })

  test('score 60–69 returns text-yellow-500', () => {
    expect(getFleschColor(60)).toBe('text-yellow-500')
    expect(getFleschColor(69)).toBe('text-yellow-500')
  })

  test('score 50–59 returns text-orange-500', () => {
    expect(getFleschColor(50)).toBe('text-orange-500')
    expect(getFleschColor(59)).toBe('text-orange-500')
  })

  test('score 30–49 returns text-red-400', () => {
    expect(getFleschColor(30)).toBe('text-red-400')
    expect(getFleschColor(49)).toBe('text-red-400')
  })

  test('score < 30 returns text-red-600', () => {
    expect(getFleschColor(0)).toBe('text-red-600')
    expect(getFleschColor(29)).toBe('text-red-600')
    expect(getFleschColor(-5)).toBe('text-red-600')
  })
})

describe('getFleschColor — returned value is a valid Tailwind class string', () => {
  const testScores = [100, 80, 65, 55, 40, 10]

  test.each(testScores)('score %i returns a non-empty string', (score) => {
    const color = getFleschColor(score)
    expect(typeof color).toBe('string')
    expect(color.length).toBeGreaterThan(0)
    expect(color).toMatch(/^text-/)
  })
})

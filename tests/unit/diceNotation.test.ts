import { parseDiceNotation, randomInt } from '@/lib/random'
import type { DiceNotation } from '@/lib/randomTypes'

// ── parseDiceNotation ─────────────────────────────────────────────────────────

describe('parseDiceNotation — valid inputs', () => {
  test('parses "3d6" → count:3, sides:6, modifier:0', () => {
    const result = parseDiceNotation('3d6')
    expect(result).not.toBeNull()
    expect(result).toEqual<DiceNotation>({ count: 3, sides: 6, modifier: 0 })
  })

  test('parses "2d10+5" → count:2, sides:10, modifier:5', () => {
    const result = parseDiceNotation('2d10+5')
    expect(result).not.toBeNull()
    expect(result).toEqual<DiceNotation>({ count: 2, sides: 10, modifier: 5 })
  })

  test('parses "1d20-3" → count:1, sides:20, modifier:-3', () => {
    const result = parseDiceNotation('1d20-3')
    expect(result).not.toBeNull()
    expect(result).toEqual<DiceNotation>({ count: 1, sides: 20, modifier: -3 })
  })

  test('parses bare "d6" (no count prefix) → count:1, sides:6, modifier:0', () => {
    // The regex uses (\d*)d(\d+) where count defaults to 1 when prefix is empty
    const result = parseDiceNotation('d6')
    expect(result).not.toBeNull()
    expect(result!.count).toBe(1)
    expect(result!.sides).toBe(6)
    expect(result!.modifier).toBe(0)
  })

  test('parses "1d4" correctly', () => {
    expect(parseDiceNotation('1d4')).toEqual<DiceNotation>({ count: 1, sides: 4, modifier: 0 })
  })

  test('parses "1d100" correctly', () => {
    expect(parseDiceNotation('1d100')).toEqual<DiceNotation>({ count: 1, sides: 100, modifier: 0 })
  })

  test('parses "1d12+0" → modifier is 0 when specified', () => {
    // "+0" matches [+-]\d+ so modifier = 0
    const result = parseDiceNotation('1d12+0')
    expect(result).not.toBeNull()
    expect(result!.modifier).toBe(0)
  })

  test('is case-insensitive — "2D6" parses the same as "2d6"', () => {
    expect(parseDiceNotation('2D6')).toEqual(parseDiceNotation('2d6'))
  })

  test('trims leading/trailing whitespace', () => {
    expect(parseDiceNotation('  2d6  ')).toEqual<DiceNotation>({ count: 2, sides: 6, modifier: 0 })
  })
})

describe('parseDiceNotation — invalid inputs return null', () => {
  test('empty string returns null', () => {
    expect(parseDiceNotation('')).toBeNull()
  })

  test('plain number without dice notation returns null', () => {
    expect(parseDiceNotation('6')).toBeNull()
  })

  test('text without "d" returns null', () => {
    expect(parseDiceNotation('3x6')).toBeNull()
  })

  test('count > 100 returns null', () => {
    expect(parseDiceNotation('101d6')).toBeNull()
  })

  test('sides < 2 returns null', () => {
    expect(parseDiceNotation('1d1')).toBeNull()
  })

  test('sides > 1000 returns null', () => {
    expect(parseDiceNotation('1d1001')).toBeNull()
  })

  test('sides = 0 returns null', () => {
    expect(parseDiceNotation('1d0')).toBeNull()
  })

  test('random text returns null', () => {
    expect(parseDiceNotation('roll a die')).toBeNull()
  })
})

// ── Simulated roll using parseDiceNotation + randomInt ────────────────────────
// DiceRoller.tsx does:
//   const rollResults = Array.from({ length: parsed.count }, () => randomInt(1, parsed.sides))
//   const sum = rollResults.reduce((a, b) => a + b, 0)
//   const total = sum + parsed.modifier
// We replicate that logic here to test the contracts without rendering the component.

function simulateRoll(notation: string): { rolls: number[]; sum: number; total: number } | null {
  const parsed = parseDiceNotation(notation)
  if (!parsed) return null
  const rolls = Array.from({ length: parsed.count }, () => randomInt(1, parsed.sides))
  const sum = rolls.reduce((a, b) => a + b, 0)
  const total = sum + parsed.modifier
  return { rolls, sum, total }
}

describe('simulated dice roll', () => {
  test('roll result includes the modifier in the total', () => {
    // Use a large positive modifier so the effect is unambiguous
    const result = simulateRoll('1d6+10')!
    expect(result).not.toBeNull()
    expect(result.total).toBe(result.sum + 10)
  })

  test('roll total equals sum plus modifier for a negative modifier', () => {
    const result = simulateRoll('2d8-3')!
    expect(result.total).toBe(result.sum - 3)
  })

  test('roll total equals sum when modifier is 0', () => {
    const result = simulateRoll('3d6')!
    expect(result.total).toBe(result.sum)
  })

  test('roll result is always within [count*1+modifier, count*sides+modifier]', () => {
    // "4d6+2": min possible = 4*1+2 = 6, max possible = 4*6+2 = 26
    const notation = '4d6+2'
    const parsed = parseDiceNotation(notation)!
    const expectedMin = parsed.count * 1 + parsed.modifier
    const expectedMax = parsed.count * parsed.sides + parsed.modifier

    for (let i = 0; i < 200; i++) {
      const result = simulateRoll(notation)!
      expect(result.total).toBeGreaterThanOrEqual(expectedMin)
      expect(result.total).toBeLessThanOrEqual(expectedMax)
    }
  })

  test('roll result with no modifier stays within [count*1, count*sides]', () => {
    const notation = '3d6'
    const parsed = parseDiceNotation(notation)!

    for (let i = 0; i < 200; i++) {
      const result = simulateRoll(notation)!
      expect(result.total).toBeGreaterThanOrEqual(parsed.count)
      expect(result.total).toBeLessThanOrEqual(parsed.count * parsed.sides)
    }
  })

  test('individual roll values are always between 1 and sides inclusive', () => {
    const notation = '5d10'
    const parsed = parseDiceNotation(notation)!

    for (let i = 0; i < 100; i++) {
      const result = simulateRoll(notation)!
      result.rolls.forEach(r => {
        expect(r).toBeGreaterThanOrEqual(1)
        expect(r).toBeLessThanOrEqual(parsed.sides)
      })
    }
  })

  test('roll count equals the die count in notation', () => {
    const result = simulateRoll('3d6')!
    expect(result.rolls).toHaveLength(3)
  })
})

import { COMMON_PAIRS } from '@/data/conversionPairs'
import { UNITS } from '@/data/units'
import { convert } from '@/lib/units'
import { TEMPERATURE_UNITS } from '@/lib/temperature'
import { UnitCategory } from '@/lib/unitTypes'

// ---------------------------------------------------------------------------
// Build a lookup of all valid unit IDs per category (including temperature)
// ---------------------------------------------------------------------------

const VALID_UNITS: Record<string, Set<string>> = {}

for (const [cat, unitMap] of Object.entries(UNITS)) {
  VALID_UNITS[cat] = new Set(Object.keys(unitMap))
}
VALID_UNITS['temperature'] = new Set(TEMPERATURE_UNITS)

// ---------------------------------------------------------------------------
// No duplicate slugs
// ---------------------------------------------------------------------------

describe('COMMON_PAIRS — data integrity', () => {
  it('has no duplicate slugs', () => {
    const slugs = COMMON_PAIRS.map(p => p.slug)
    const unique = new Set(slugs)
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i)
    expect(duplicates).toEqual([])
    expect(unique.size).toBe(COMMON_PAIRS.length)
  })

  it('every pair has a non-empty slug', () => {
    for (const pair of COMMON_PAIRS) {
      expect(typeof pair.slug).toBe('string')
      expect(pair.slug.trim().length).toBeGreaterThan(0)
    }
  })

  it('every pair has a non-empty title', () => {
    for (const pair of COMMON_PAIRS) {
      expect(typeof pair.title).toBe('string')
      expect(pair.title.trim().length).toBeGreaterThan(0)
    }
  })

  it('every pair has a non-empty description', () => {
    for (const pair of COMMON_PAIRS) {
      expect(typeof pair.description).toBe('string')
      expect(pair.description.trim().length).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// All referenced unit IDs exist in the units data
// ---------------------------------------------------------------------------

describe('COMMON_PAIRS — unit ID references', () => {
  it('every "from" unit ID exists in its category', () => {
    const bad: string[] = []
    for (const pair of COMMON_PAIRS) {
      const validSet = VALID_UNITS[pair.category]
      if (!validSet || !validSet.has(pair.from)) {
        bad.push(`${pair.slug}: from="${pair.from}" not found in category="${pair.category}"`)
      }
    }
    expect(bad).toEqual([])
  })

  it('every "to" unit ID exists in its category', () => {
    const bad: string[] = []
    for (const pair of COMMON_PAIRS) {
      const validSet = VALID_UNITS[pair.category]
      if (!validSet || !validSet.has(pair.to)) {
        bad.push(`${pair.slug}: to="${pair.to}" not found in category="${pair.category}"`)
      }
    }
    expect(bad).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Every pair can be converted without throwing
// ---------------------------------------------------------------------------

describe('COMMON_PAIRS — convert() does not throw', () => {
  for (const pair of COMMON_PAIRS) {
    it(`${pair.slug} (${pair.from} → ${pair.to})`, () => {
      expect(() => convert(1, pair.from, pair.to, pair.category as UnitCategory)).not.toThrow()
    })
  }
})

// ---------------------------------------------------------------------------
// Every pair produces a finite, numeric result for value=1
// ---------------------------------------------------------------------------

describe('COMMON_PAIRS — convert() returns a finite number', () => {
  for (const pair of COMMON_PAIRS) {
    it(`${pair.slug} result is finite`, () => {
      const result = convert(1, pair.from, pair.to, pair.category as UnitCategory)
      expect(typeof result).toBe('number')
      expect(isFinite(result)).toBe(true)
    })
  }
})

// ---------------------------------------------------------------------------
// Every pair's conversion is reversible (round-trip ≈ 1)
// ---------------------------------------------------------------------------

describe('COMMON_PAIRS — round-trip fidelity', () => {
  for (const pair of COMMON_PAIRS) {
    it(`round-trips ${pair.slug}`, () => {
      const original = 100
      const there = convert(original, pair.from, pair.to, pair.category as UnitCategory)
      const back = convert(there, pair.to, pair.from, pair.category as UnitCategory)
      expect(back).toBeCloseTo(original, 6)
    })
  }
})

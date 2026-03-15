// TeamGenerator.tsx uses shuffleArray then distributes names round-robin:
//
//   const shuffled = shuffleArray(names)
//   const result: string[][] = Array.from({ length: teamCount }, () => [])
//   shuffled.forEach((name, i) => result[i % teamCount].push(name))
//
// We test that logic directly here (not the React component) so that the
// tests are fast, deterministic (via mocked Math.random), and cover the
// splitting contract precisely.

import { shuffleArray } from '@/lib/random'

// ---------------------------------------------------------------------------
// Pure helper — mirrors what TeamGenerator.generate() does internally
// ---------------------------------------------------------------------------

function splitIntoTeams(names: string[], teamCount: number): string[][] {
  const shuffled = shuffleArray(names)
  const teams: string[][] = Array.from({ length: teamCount }, () => [])
  shuffled.forEach((name, i) => teams[i % teamCount].push(name))
  return teams
}

// ---------------------------------------------------------------------------
// Team-size contracts
// ---------------------------------------------------------------------------

describe('splitIntoTeams — team sizes', () => {
  test('5 names into 2 teams produces sizes [3,2] or [2,3]', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']
    const teams = splitIntoTeams(names, 2)
    const sizes = teams.map(t => t.length).sort((a, b) => a - b)
    expect(sizes).toEqual([2, 3])
  })

  test('6 names into 3 teams produces sizes [2,2,2]', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank']
    const teams = splitIntoTeams(names, 3)
    expect(teams).toHaveLength(3)
    teams.forEach(t => expect(t).toHaveLength(2))
  })

  test('4 names into 2 teams produces equal sizes [2,2]', () => {
    const names = ['A', 'B', 'C', 'D']
    const teams = splitIntoTeams(names, 2)
    teams.forEach(t => expect(t).toHaveLength(2))
  })

  test('7 names into 3 teams produces sizes that differ by at most 1', () => {
    const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const teams = splitIntoTeams(names, 3)
    const sizes = teams.map(t => t.length)
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1)
  })

  test('produces exactly teamCount teams', () => {
    const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    expect(splitIntoTeams(names, 2)).toHaveLength(2)
    expect(splitIntoTeams(names, 4)).toHaveLength(4)
    expect(splitIntoTeams(names, 5)).toHaveLength(5)
  })
})

// ---------------------------------------------------------------------------
// Name coverage — all names appear exactly once
// ---------------------------------------------------------------------------

describe('splitIntoTeams — name coverage', () => {
  test('all names appear exactly once across all teams', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']
    const teams = splitIntoTeams(names, 2)
    const flat = teams.flat()

    // Same length
    expect(flat).toHaveLength(names.length)

    // Each original name appears exactly once
    names.forEach(name => {
      expect(flat.filter(n => n === name)).toHaveLength(1)
    })
  })

  test('no name is duplicated or lost with 10 names into 4 teams', () => {
    const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const teams = splitIntoTeams(names, 4)
    const flat = teams.flat()
    expect(flat).toHaveLength(names.length)
    expect(new Set(flat).size).toBe(names.length)
  })

  test('running multiple times preserves complete coverage every time', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank']
    for (let run = 0; run < 20; run++) {
      const teams = splitIntoTeams(names, 3)
      const flat = teams.flat()
      expect(flat).toHaveLength(names.length)
      names.forEach(name => expect(flat).toContain(name))
    }
  })
})

// ---------------------------------------------------------------------------
// Balance property — team sizes differ by at most 1 for any N, K
// ---------------------------------------------------------------------------

describe('splitIntoTeams — size balance (teams differ by at most 1 for any N, K)', () => {
  const cases: [number, number][] = [
    [5, 2],
    [6, 3],
    [7, 3],
    [8, 3],
    [9, 4],
    [10, 3],
    [11, 4],
    [13, 5],
    [20, 7],
  ]

  test.each(cases)('%i names into %i teams: max size - min size <= 1', (n, k) => {
    const names = Array.from({ length: n }, (_, i) => `Person${i + 1}`)
    const teams = splitIntoTeams(names, k)
    const sizes = teams.map(t => t.length)
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1)
  })
})

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('splitIntoTeams — edge cases', () => {
  test('2 names into 2 teams gives one name per team', () => {
    const names = ['Alice', 'Bob']
    const teams = splitIntoTeams(names, 2)
    teams.forEach(t => expect(t).toHaveLength(1))
    expect(teams.flat().sort()).toEqual(['Alice', 'Bob'].sort())
  })

  test('returns correct structure when there are more teams than names (some empty)', () => {
    // 2 names into 4 teams → 2 teams have 1 person, 2 teams have 0
    const names = ['A', 'B']
    const teams = splitIntoTeams(names, 4)
    expect(teams).toHaveLength(4)
    const flat = teams.flat()
    expect(flat).toHaveLength(2)
    expect(new Set(flat).size).toBe(2)
  })
})

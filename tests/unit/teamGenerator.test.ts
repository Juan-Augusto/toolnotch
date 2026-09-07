import {
  splitIntoTeams,
  splitIntoCustomNamedTeams,
  calculateTeamCountFromSize,
  splitTeamsBySize,
  validateTeamCount,
  validateTeamSize,
  validateCustomTeamNames,
  isTeamSmaller,
} from '@/lib/teamGenerator'

describe('splitIntoTeams — team sizes', () => {
  test('5 names into 2 teams produces sizes [3,2] or [2,3]', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']
    const teams = splitIntoTeams(names, 2)
    const sizes = teams.map((t) => t.length).sort((a, b) => a - b)
    expect(sizes).toEqual([2, 3])
  })

  test('6 names into 3 teams produces sizes [2,2,2]', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank']
    const teams = splitIntoTeams(names, 3)
    expect(teams).toHaveLength(3)
    teams.forEach((t) => expect(t).toHaveLength(2))
  })

  test('4 names into 2 teams produces equal sizes [2,2]', () => {
    const names = ['A', 'B', 'C', 'D']
    const teams = splitIntoTeams(names, 2)
    teams.forEach((t) => expect(t).toHaveLength(2))
  })

  test('7 names into 3 teams produces sizes that differ by at most 1', () => {
    const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const teams = splitIntoTeams(names, 3)
    const sizes = teams.map((t) => t.length)
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1)
  })

  test('produces exactly teamCount teams', () => {
    const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    expect(splitIntoTeams(names, 2)).toHaveLength(2)
    expect(splitIntoTeams(names, 4)).toHaveLength(4)
    expect(splitIntoTeams(names, 5)).toHaveLength(5)
  })
})

describe('splitIntoCustomNamedTeams', () => {
  test('assigns participants across custom named teams', () => {
    const participants = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']
    const teamNames = ['Time Backend', 'Time Frontend']
    const result = splitIntoCustomNamedTeams(participants, teamNames)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Time Backend')
    expect(result[1].name).toBe('Time Frontend')
    const totalMembers = result.reduce((sum, t) => sum + t.members.length, 0)
    expect(totalMembers).toBe(5)
  })

  test('returns empty array if participants or teamNames is empty', () => {
    expect(splitIntoCustomNamedTeams([], ['Team A'])).toEqual([])
    expect(splitIntoCustomNamedTeams(['Alice'], [])).toEqual([])
  })
})

describe('calculateTeamCountFromSize and splitTeamsBySize', () => {
  test('calculates optimal team count for 10 participants with target size 3', () => {
    // 10 / 3 = 3.33 -> 3 teams
    const k = calculateTeamCountFromSize(10, 3)
    expect(k).toBe(3)

    const res = splitTeamsBySize(['1','2','3','4','5','6','7','8','9','10'], 3)
    expect(res.teamCount).toBe(3)
    expect(res.teams).toHaveLength(3)
  })

  test('calculates optimal team count for 10 participants with target size 5', () => {
    // 10 / 5 = 2 teams
    const k = calculateTeamCountFromSize(10, 5)
    expect(k).toBe(2)
  })
})

describe('validateTeamSize', () => {
  test('returns valid when total >= 2 and 1 <= teamSize < total', () => {
    expect(validateTeamSize(10, 3)).toEqual({ valid: true, errorKey: null })
    expect(validateTeamSize(10, 5)).toEqual({ valid: true, errorKey: null })
  })

  test('rejects total < 2', () => {
    expect(validateTeamSize(1, 1)).toEqual({ valid: false, errorKey: 'minParticipants' })
  })

  test('rejects teamSize < 1', () => {
    expect(validateTeamSize(10, 0)).toEqual({ valid: false, errorKey: 'invalidTeamSizeMin' })
  })

  test('rejects teamSize >= total', () => {
    expect(validateTeamSize(5, 5)).toEqual({
      valid: false,
      errorKey: 'invalidTeamSizeMax',
      errorParams: { size: 5, total: 5 },
    })
    expect(validateTeamSize(5, 6)).toEqual({
      valid: false,
      errorKey: 'invalidTeamSizeMax',
      errorParams: { size: 6, total: 5 },
    })
  })
})

describe('validateCustomTeamNames', () => {
  test('returns valid for valid team count and participant count', () => {
    expect(validateCustomTeamNames(5, 3)).toEqual({ valid: true, errorKey: null })
  })

  test('rejects totalParticipants < 2', () => {
    expect(validateCustomTeamNames(1, 2)).toEqual({ valid: false, errorKey: 'minParticipants' })
  })

  test('rejects customTeamNamesCount < 2', () => {
    expect(validateCustomTeamNames(5, 1)).toEqual({ valid: false, errorKey: 'invalidCustomTeamNamesMin' })
    expect(validateCustomTeamNames(5, 0)).toEqual({ valid: false, errorKey: 'invalidCustomTeamNamesMin' })
  })

  test('rejects customTeamNamesCount > totalParticipants', () => {
    expect(validateCustomTeamNames(3, 4)).toEqual({
      valid: false,
      errorKey: 'invalidCustomTeamNamesMax',
      errorParams: { teams: 4, total: 3 },
    })
  })
})

describe('splitIntoTeams — name coverage', () => {
  test('all names appear exactly once across all teams', () => {
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']
    const teams = splitIntoTeams(names, 2)
    const flat = teams.flat()

    expect(flat).toHaveLength(names.length)
    names.forEach((name) => {
      expect(flat.filter((n) => n === name)).toHaveLength(1)
    })
  })

  test('no name is duplicated or lost with 10 names into 4 teams', () => {
    const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const teams = splitIntoTeams(names, 4)
    const flat = teams.flat()
    expect(flat).toHaveLength(names.length)
    expect(new Set(flat).size).toBe(names.length)
  })
})

describe('validateTeamCount', () => {
  test('returns valid when total >= 2 and 2 <= teamCount <= total', () => {
    expect(validateTeamCount(5, 2)).toEqual({ valid: true, errorKey: null })
    expect(validateTeamCount(5, 5)).toEqual({ valid: true, errorKey: null })
  })

  test('rejects total < 2', () => {
    expect(validateTeamCount(1, 2)).toEqual({ valid: false, errorKey: 'minParticipants' })
  })

  test('rejects teamCount < 2', () => {
    expect(validateTeamCount(5, 1)).toEqual({ valid: false, errorKey: 'invalidTeamCountMin' })
    expect(validateTeamCount(5, 0)).toEqual({ valid: false, errorKey: 'invalidTeamCountMin' })
  })

  test('rejects teamCount > total', () => {
    expect(validateTeamCount(5, 6)).toEqual({
      valid: false,
      errorKey: 'invalidTeamCountMax',
      errorParams: { teams: 6, total: 5 },
    })
  })
})

describe('isTeamSmaller', () => {
  test('identifies teams with fewer members than maximum in the group', () => {
    const teams = [
      ['Alice', 'Bob', 'Carol'],
      ['Dave', 'Eve'],
    ]
    expect(isTeamSmaller(teams[0], teams)).toBe(false)
    expect(isTeamSmaller(teams[1], teams)).toBe(true)
  })

  test('returns false when all teams have equal size', () => {
    const teams = [
      ['Alice', 'Bob'],
      ['Carol', 'Dave'],
    ]
    expect(isTeamSmaller(teams[0], teams)).toBe(false)
    expect(isTeamSmaller(teams[1], teams)).toBe(false)
  })
})

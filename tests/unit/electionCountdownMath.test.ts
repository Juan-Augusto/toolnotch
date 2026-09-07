import { ELECTION_ROUNDS, getActiveRound, getTimeRemaining } from '@/lib/electionCountdownMath'

// ---------------------------------------------------------------------------
// getTimeRemaining
// ---------------------------------------------------------------------------

describe('getTimeRemaining', () => {
  test('returns full breakdown for a target 2 days, 3 hours, 4 minutes, 5 seconds out', () => {
    const now = new Date('2026-10-02T16:55:55Z')
    const target = '2026-10-04T20:00:00Z'
    const parts = getTimeRemaining(target, now)
    expect(parts).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5, isPast: false })
  })

  test('returns isPast: true and all-zero parts when target is in the past', () => {
    const now = new Date('2026-10-05T00:00:00Z')
    const parts = getTimeRemaining('2026-10-04T20:00:00Z', now)
    expect(parts).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true })
  })

  test('exact-boundary instant (now === target) is treated as past', () => {
    const target = '2026-10-04T20:00:00Z'
    const parts = getTimeRemaining(target, new Date(target))
    expect(parts.isPast).toBe(true)
  })

  test('one second before the boundary is not past', () => {
    const parts = getTimeRemaining('2026-10-04T20:00:00Z', new Date('2026-10-04T19:59:59Z'))
    expect(parts.isPast).toBe(false)
    expect(parts.days).toBe(0)
    expect(parts.hours).toBe(0)
    expect(parts.minutes).toBe(0)
    expect(parts.seconds).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// getActiveRound
// ---------------------------------------------------------------------------

describe('getActiveRound', () => {
  test('before round 1 poll close → round1 is active', () => {
    const round = getActiveRound(new Date('2026-09-01T00:00:00Z'))
    expect(round.id).toBe('round1')
  })

  test('between round 1 and round 2 poll close → round2 is active', () => {
    const round = getActiveRound(new Date('2026-10-10T00:00:00Z'))
    expect(round.id).toBe('round2')
  })

  test('after round 2 poll close → round2 remains active (no round 3)', () => {
    const round = getActiveRound(new Date('2026-11-01T00:00:00Z'))
    expect(round.id).toBe('round2')
  })

  test('exact-boundary instant at round 1 poll close switches to round2', () => {
    const round = getActiveRound(new Date(ELECTION_ROUNDS[0].targetDateUtc))
    expect(round.id).toBe('round2')
  })

  test('one second before round 1 poll close is still round1', () => {
    const boundary = new Date(ELECTION_ROUNDS[0].targetDateUtc)
    const round = getActiveRound(new Date(boundary.getTime() - 1000))
    expect(round.id).toBe('round1')
  })
})

// ---------------------------------------------------------------------------
// ELECTION_ROUNDS — constants sanity check
// ---------------------------------------------------------------------------

describe('ELECTION_ROUNDS constants', () => {
  test('round1 is 2026-10-04, round2 is 2026-10-25, both at 20:00 UTC (17:00 BRT)', () => {
    expect(ELECTION_ROUNDS[0]).toEqual({
      id: 'round1',
      labelDate: '2026-10-04',
      targetDateUtc: '2026-10-04T20:00:00Z',
    })
    expect(ELECTION_ROUNDS[1]).toEqual({
      id: 'round2',
      labelDate: '2026-10-25',
      targetDateUtc: '2026-10-25T20:00:00Z',
    })
  })
})

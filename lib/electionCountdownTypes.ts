export interface ElectionRound {
  id: 'round1' | 'round2'
  /** Display-formatting date, e.g. '2026-10-04'. */
  labelDate: string
  /** ISO instant — polls-close (17:00 BRT / 20:00 UTC), not midnight. See PRD sourcing section. */
  targetDateUtc: string
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

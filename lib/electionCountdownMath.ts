import { ElectionRound, CountdownParts } from './electionCountdownTypes'

// Dates confirmed via TSE — see plans/25-election-2026/03-election-countdown/PRD.md sourcing
// section. Fixed by the Constitution + Lei das Eleições (9.504/1997): first Sunday of October
// (round 1) / last Sunday of October (runoff, if needed). Poll-close time 17:00 BRT = 20:00 UTC.
export const ELECTION_ROUNDS: ElectionRound[] = [
  { id: 'round1', labelDate: '2026-10-04', targetDateUtc: '2026-10-04T20:00:00Z' },
  { id: 'round2', labelDate: '2026-10-25', targetDateUtc: '2026-10-25T20:00:00Z' },
]

export function getTimeRemaining(targetIso: string, now: Date = new Date()): CountdownParts {
  const diffMs = new Date(targetIso).getTime() - now.getTime()
  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  const totalSeconds = Math.floor(diffMs / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: false,
  }
}

/** Which round the page should be counting down to right now. */
export function getActiveRound(now: Date = new Date()): ElectionRound {
  const round1 = ELECTION_ROUNDS[0]
  const isRound1Past = new Date(round1.targetDateUtc).getTime() <= now.getTime()
  return isRound1Past ? ELECTION_ROUNDS[1] : round1
}

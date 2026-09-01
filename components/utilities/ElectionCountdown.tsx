'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ELECTION_ROUNDS, getActiveRound, getTimeRemaining } from '@/lib/electionCountdownMath'
import type { CountdownParts, ElectionRound } from '@/lib/electionCountdownTypes'

interface Props {
  locale: string
}

function formatLabelDate(labelDate: string, locale: string): string {
  const dtLocale = locale === 'pt' ? 'pt-BR' : locale
  // labelDate is a plain 'YYYY-MM-DD' — construct as local midnight, not UTC, so the calendar
  // day displayed never shifts a day back in negative-UTC-offset timezones.
  const [year, month, day] = labelDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat(dtLocale, { dateStyle: 'long' }).format(date)
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 py-4 px-2 text-center">
      <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
        {String(value).padStart(2, '0')}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
        {label}
      </p>
    </div>
  )
}

export default function ElectionCountdown({ locale }: Props) {
  const t = useTranslations('electionCountdown')
  const [mounted, setMounted] = useState(false)
  const [round, setRound] = useState<ElectionRound>(() => getActiveRound())
  const [parts, setParts] = useState<CountdownParts>(() => getTimeRemaining(round.targetDateUtc))

  useEffect(() => {
    // Hydration-safe mount flag — SSR always renders the zeroed placeholder tiles,
    // then this fills in the real live values once the client takes over.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const id = setInterval(() => {
      const activeRound = getActiveRound()
      setRound(activeRound)
      setParts(getTimeRemaining(activeRound.targetDateUtc))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const round1 = ELECTION_ROUNDS[0]
  const round2 = ELECTION_ROUNDS[1]
  const round2Concluded = round.id === 'round2' && parts.isPast

  const roundLabel = round.id === 'round1' ? t('round1Label') : t('round2Label')

  return (
    <div className="space-y-6">
      {round2Concluded ? (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('electionConcludedRound2')}
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 p-4 text-center">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">{roundLabel}</p>
          {mounted ? (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <Tile value={parts.days} label={t('days')} />
              <Tile value={parts.hours} label={t('hours')} />
              <Tile value={parts.minutes} label={t('minutes')} />
              <Tile value={parts.seconds} label={t('seconds')} />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-hidden="true">
              <Tile value={0} label={t('days')} />
              <Tile value={0} label={t('hours')} />
              <Tile value={0} label={t('minutes')} />
              <Tile value={0} label={t('seconds')} />
            </div>
          )}
        </div>
      )}

      {/* Static reference dates — always shown, regardless of which round is currently active,
          so a visitor landing after round 1 still sees the full picture. */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t('round1Label')}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
            {formatLabelDate(round1.labelDate, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t('round2Label')}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
            {formatLabelDate(round2.labelDate, locale)}
          </p>
        </div>
      </div>
    </div>
  )
}

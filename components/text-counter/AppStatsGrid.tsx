'use client'
import { useTranslations } from 'next-intl'
import { TextStats } from '@/lib/textTypes'

interface StatCardProps {
  label: string
  value: string | number
  highlighted?: boolean
}

function StatCard({ label, value, highlighted }: StatCardProps) {
  return (
    <div
      className={`rounded-[2px] border p-3 sm:p-4 text-center transition-colors ${
        highlighted
          ? 'bg-blue-50 dark:bg-secondary/10 border-blue-200 dark:border-secondary text-foreground'
          : 'bg-background border-border text-foreground hover:border-border/80'
      }`}
    >
      <div className={`text-2xl sm:text-3xl font-mono font-bold ${highlighted ? 'text-secondary' : 'text-foreground'}`}>
        {value}
      </div>
      <div className="font-mono uppercase font-medium text-foreground mt-1 tracking-wider">{label}</div>
    </div>
  )
}

function formatTime(minutes: number): string {
  if (minutes < 1) return '< 1 min'
  if (minutes === 1) return '1 min'
  return `${minutes} min`
}

interface StatsGridProps {
  stats: TextStats
  primaryStat?: 'words' | 'characters' | 'sentences' | 'readingTime'
}

export default function AppStatsGrid({ stats, primaryStat = 'words' }: StatsGridProps) {
  const t = useTranslations('text.stats')
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
      <StatCard label={t('words')} value={stats.words.toLocaleString()} highlighted={primaryStat === 'words'} />
      <StatCard label={t('characters')} value={stats.characters.toLocaleString()} highlighted={primaryStat === 'characters'} />
      <StatCard label={t('charactersNoSpaces')} value={stats.charactersNoSpaces.toLocaleString()} />
      <StatCard label={t('sentences')} value={stats.sentences.toLocaleString()} highlighted={primaryStat === 'sentences'} />
      <StatCard label={t('paragraphs')} value={stats.paragraphs.toLocaleString()} />
      <StatCard label={t('readingTime')} value={formatTime(stats.readingTime)} highlighted={primaryStat === 'readingTime'} />
      <StatCard label={t('speakingTime')} value={formatTime(stats.speakingTime)} />
      <StatCard label={t('avgWordsPerSentence')} value={stats.avgWordsPerSentence} />
    </div>
  )
}

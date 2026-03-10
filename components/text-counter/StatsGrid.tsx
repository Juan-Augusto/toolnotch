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
    <div className={`rounded-lg border p-4 text-center ${highlighted ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`text-2xl font-bold ${highlighted ? 'text-blue-700' : 'text-gray-900'}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
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

export default function StatsGrid({ stats, primaryStat = 'words' }: StatsGridProps) {
  const t = useTranslations('text.stats')
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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

'use client'
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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <StatCard label="Words" value={stats.words.toLocaleString()} highlighted={primaryStat === 'words'} />
      <StatCard label="Characters" value={stats.characters.toLocaleString()} highlighted={primaryStat === 'characters'} />
      <StatCard label="Characters (no spaces)" value={stats.charactersNoSpaces.toLocaleString()} />
      <StatCard label="Sentences" value={stats.sentences.toLocaleString()} highlighted={primaryStat === 'sentences'} />
      <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
      <StatCard label="Reading Time" value={formatTime(stats.readingTime)} highlighted={primaryStat === 'readingTime'} />
      <StatCard label="Speaking Time" value={formatTime(stats.speakingTime)} />
      <StatCard label="Avg Words/Sentence" value={stats.avgWordsPerSentence} />
    </div>
  )
}

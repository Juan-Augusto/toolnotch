'use client'
import { useTranslations } from 'next-intl'

interface TopWordsChartProps {
  topWords: { word: string; count: number }[]
  className?: string
}

export default function AppTopWordsChart({ topWords, className = '' }: TopWordsChartProps) {
  const t = useTranslations('text.stats')
  if (topWords.length === 0) return null
  const maxCount = topWords[0]?.count ?? 1

  return (
    <div className={className}>
      <h3 className="font-medium uppercase text-foreground font-mono mb-3">
        {t('topWords')}
      </h3>
      <div className="space-y-2">
        {topWords.map(({ word, count }) => (
          <div key={word} className="flex items-center gap-3">
            <div className="w-28 text-foreground font-mono font-medium truncate">
              {word}
            </div>
            <div className="flex-1 bg-background border border-border rounded-[2px] h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }}
              />
            </div>
            <div className="w-10 font-mono font-bold text-foreground text-right">
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

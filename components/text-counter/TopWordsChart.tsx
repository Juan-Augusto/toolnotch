'use client'
import { useTranslations } from 'next-intl'

interface TopWordsChartProps {
  topWords: { word: string; count: number }[]
}

export default function TopWordsChart({ topWords }: TopWordsChartProps) {
  const t = useTranslations('text.stats')
  if (topWords.length === 0) return null
  const maxCount = topWords[0]?.count ?? 1

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('topWords')}</h3>
      <div className="space-y-2">
        {topWords.map(({ word, count }) => (
          <div key={word} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-700 font-medium truncate">{word}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <div className="w-8 text-xs text-gray-500 text-right">{count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

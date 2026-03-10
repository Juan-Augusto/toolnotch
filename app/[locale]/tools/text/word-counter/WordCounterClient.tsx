'use client'
import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { analyzeText } from '@/lib/textAnalysis'
import { TextStats } from '@/lib/textTypes'
import StatsGrid from '@/components/text-counter/StatsGrid'
import ReadabilityPanel from '@/components/text-counter/ReadabilityPanel'
import TopWordsChart from '@/components/text-counter/TopWordsChart'

const EMPTY_STATS: TextStats = {
  words: 0, characters: 0, charactersNoSpaces: 0,
  sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0,
  fleschEase: 0, fleschGrade: 0, gunningFog: 0,
  avgWordsPerSentence: 0, avgSyllablesPerWord: 0, topWords: [],
}

interface WordCounterClientProps {
  primaryStat?: 'words' | 'characters' | 'sentences' | 'readingTime'
  placeholder?: string
}

export default function WordCounterClient({ primaryStat = 'words', placeholder }: WordCounterClientProps) {
  const t = useTranslations('text')
  const [text, setText] = useState('')
  const [stats, setStats] = useState<TextStats>(EMPTY_STATS)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(analyzeText(text))
    }, 200)
    return () => clearTimeout(timer)
  }, [text])

  const handleClear = useCallback(() => setText(''), [])
  const handleSample = useCallback(() => setText(t('sampleText')), [t])

  return (
    <div>
      <div className="relative">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder ?? t('wordCounter.placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={handleSample}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-md transition-colors"
          >
            {t('buttons.sampleText')}
          </button>
          {text && (
            <button
              onClick={handleClear}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md transition-colors"
            >
              {t('buttons.clear')}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <StatsGrid stats={stats} primaryStat={primaryStat} />
        <ReadabilityPanel stats={stats} />
        {stats.topWords.length > 0 && <TopWordsChart topWords={stats.topWords} />}
      </div>
    </div>
  )
}

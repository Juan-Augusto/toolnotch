'use client'
import { useState, useEffect, useCallback } from 'react'
import { analyzeText } from '@/lib/textAnalysis'
import { TextStats } from '@/lib/textTypes'
import StatsGrid from '@/components/text-counter/StatsGrid'
import ReadabilityPanel from '@/components/text-counter/ReadabilityPanel'
import TopWordsChart from '@/components/text-counter/TopWordsChart'

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This sentence has been used for decades as a pangram — a phrase containing every letter of the alphabet. It is commonly used to demonstrate fonts, test typewriters, and practice typing.

Readability is an important consideration in writing. Clear, concise sentences help readers understand your message quickly. Long, convoluted sentences with complex vocabulary can make text difficult to parse, especially for readers who are not specialists in the subject matter at hand.

Good writing balances clarity with depth. Professional writers aim for a Flesch Reading Ease score between 60 and 70 for most audiences.`

const EMPTY_STATS: TextStats = {
  words: 0, characters: 0, charactersNoSpaces: 0,
  sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0,
  fleschEase: 0, fleschGrade: 0, gunningFog: 0,
  avgWordsPerSentence: 0, avgSyllablesPerWord: 0, topWords: [],
}

interface WordCounterClientProps {
  primaryStat?: 'words' | 'characters' | 'sentences' | 'readingTime'
}

export default function WordCounterClient({ primaryStat = 'words' }: WordCounterClientProps) {
  const [text, setText] = useState('')
  const [stats, setStats] = useState<TextStats>(EMPTY_STATS)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(analyzeText(text))
    }, 200)
    return () => clearTimeout(timer)
  }, [text])

  const handleClear = useCallback(() => setText(''), [])
  const handleSample = useCallback(() => setText(SAMPLE_TEXT), [])

  return (
    <div>
      <div className="relative">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Paste or type your text here to analyze it instantly..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={handleSample}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-md transition-colors"
          >
            Sample text
          </button>
          {text && (
            <button
              onClick={handleClear}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md transition-colors"
            >
              Clear
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

'use client'

import { useState } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import type { FaqItem } from '@/components/FaqSection'

const CARDS = ['1', '2', '3', '5', '8', '13', '21', '34', '?', '∞']
const NUMERIC_CARDS = ['1', '2', '3', '5', '8', '13', '21', '34']

interface Props {
  title: string
  description: string
  faqs: FaqItem[]
  labels: Record<string, string>
}

export default function PlanningPokerClient({ title, description, faqs, labels }: Props) {
  const [story, setStory] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  function reveal() {
    if (picked) setRevealed(true)
  }

  function reset() {
    setPicked(null)
    setRevealed(false)
  }

  const numericPick = picked && NUMERIC_CARDS.includes(picked) ? Number(picked) : null

  return (
    <ToolWrapper title={title} description={description} breadcrumbLabel={title} faqs={faqs} adSlot="planning-poker">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.storyLabel}</label>
          <textarea
            value={story}
            onChange={e => setStory(e.target.value)}
            placeholder={labels.storyPlaceholder}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">{labels.pickCardHeading}</p>
          <div className="flex flex-wrap gap-3">
            {CARDS.map(card => (
              <button
                key={card}
                onClick={() => { if (!revealed) setPicked(card) }}
                disabled={revealed}
                className={`w-14 h-20 rounded-xl border-2 text-xl font-bold transition-all select-none
                  ${picked === card
                    ? 'border-violet-600 bg-violet-600 text-white shadow-lg scale-105'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-violet-400 hover:shadow-md'
                  }
                  ${revealed ? 'opacity-70 cursor-default' : 'cursor-pointer'}
                `}
              >
                {card}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reveal}
            disabled={!picked || revealed}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {labels.revealButton}
          </button>
          <button
            onClick={reset}
            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {labels.resetButton}
          </button>
        </div>

        {revealed && picked && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
            <p className="text-sm text-violet-600 font-medium mb-2">{labels.yourPickLabel}</p>
            <div className="text-6xl font-extrabold text-violet-700 mb-4">{picked}</div>
            {numericPick !== null ? (
              <p className="text-sm text-gray-600">
                {labels.consensusLabel}: <span className="font-bold text-violet-700">{picked}</span>
                {' '}— {labels.averageLabel}: <span className="font-bold">{picked}</span>
              </p>
            ) : (
              <p className="text-sm text-orange-600 font-medium">{labels.noConsensusLabel}</p>
            )}
          </div>
        )}

        {!revealed && picked && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">{labels.yourPickLabel}: <span className="font-bold text-gray-800">{picked}</span></p>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}

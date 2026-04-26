'use client'

import { useState } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import type { FaqItem } from '@/components/FaqSection'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props {
  title: string
  description: string
  faqs: FaqItem[]
  labels: Record<string, string>
  richContent?: RichContent
}

export default function StandupGeneratorClient({ title, description, faqs, labels, richContent }: Props) {
  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blockers, setBlockers] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    const blockerText = blockers.trim() || labels.noBlockers
    const result = `**${labels.yesterdayHeading}**\n${yesterday.trim()}\n\n**${labels.todayHeading}**\n${today.trim()}\n\n**${labels.blockersHeading}**\n${blockerText}`
    setOutput(result)
  }

  function clear() {
    setYesterday('')
    setToday('')
    setBlockers('')
    setOutput('')
    setCopied(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canGenerate = yesterday.trim() && today.trim()

  return (
    <ToolWrapper title={title} description={description} breadcrumbLabel={title} faqs={faqs} adSlot="standup-generator" richContent={richContent}>
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.yesterday}</label>
          <textarea
            value={yesterday}
            onChange={e => setYesterday(e.target.value)}
            placeholder={labels.yesterdayPlaceholder}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.today}</label>
          <textarea
            value={today}
            onChange={e => setToday(e.target.value)}
            placeholder={labels.todayPlaceholder}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.blockers}</label>
          <textarea
            value={blockers}
            onChange={e => setBlockers(e.target.value)}
            placeholder={labels.blockersPlaceholder}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={generate}
            disabled={!canGenerate}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {labels.generateButton}
          </button>
          <button
            onClick={clear}
            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {labels.clearButton}
          </button>
        </div>

        {output && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 text-sm">{labels.outputHeading}</h3>
              <button
                onClick={copy}
                className="text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? labels.copiedButton : labels.copyButton}
              </button>
            </div>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}

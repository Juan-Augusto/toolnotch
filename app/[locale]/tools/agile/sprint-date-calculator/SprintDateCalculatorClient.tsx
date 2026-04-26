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

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

function getWeekdays(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const cur = new Date(start)
  while (cur <= end) {
    const dow = cur.getDay()
    if (dow !== 0 && dow !== 6) days.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

export default function SprintDateCalculatorClient({ title, description, faqs, labels, richContent }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(today)
  const [sprintWeeks, setSprintWeeks] = useState(2)
  const [result, setResult] = useState<null | {
    planning: Date
    review: Date
    retro: Date
    end: Date
    standups: Date[]
    copyText: string
  }>(null)
  const [copied, setCopied] = useState(false)

  function calculate() {
    const start = new Date(startDate + 'T00:00:00')
    const days = sprintWeeks * 7
    const end = addDays(start, days - 1)
    const planning = start
    const review = end
    const retro = end
    const standups = getWeekdays(addDays(start, 1), addDays(end, -1))

    const standupLines = standups.map(d => `  - ${formatDate(d)}`).join('\n')
    const copyText = [
      `${labels.sprintNumber} Dates (${sprintWeeks}-week sprint)`,
      `${labels.planningLabel}: ${formatDate(planning)}`,
      `${labels.sprintEndLabel}: ${formatDate(end)}`,
      `${labels.reviewLabel}: ${formatDate(review)}`,
      `${labels.retroLabel}: ${formatDate(retro)}`,
      `${labels.dailyStandupsLabel}:`,
      standupLines,
    ].join('\n')

    setResult({ planning, review, retro, end, standups, copyText })
    setCopied(false)
  }

  async function copy() {
    if (!result) return
    await navigator.clipboard.writeText(result.copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolWrapper title={title} description={description} breadcrumbLabel={title} faqs={faqs} adSlot="sprint-date-calculator" richContent={richContent}>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.startDateLabel}</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.sprintLengthLabel}</label>
            <select
              value={sprintWeeks}
              onChange={e => setSprintWeeks(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value={2}>{labels.twoWeeks}</option>
              <option value={3}>{labels.threeWeeks}</option>
              <option value={4}>{labels.fourWeeks}</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          {labels.calculateButton}
        </button>

        {result && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-violet-600 text-white px-4 py-3 flex items-center justify-between">
                <span className="font-semibold text-sm">{labels.sprintNumber} — {sprintWeeks}w</span>
                <button
                  onClick={copy}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  {copied ? labels.copiedButton : labels.copyButton}
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { label: labels.planningLabel, date: result.planning },
                  { label: labels.reviewLabel, date: result.review },
                  { label: labels.retroLabel, date: result.retro },
                  { label: labels.sprintEndLabel, date: result.end },
                ].map(({ label, date }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm text-gray-600 font-mono">{formatDate(date)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {labels.dailyStandupsLabel} <span className="text-gray-400">({labels.weekdaysOnlyNote})</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {result.standups.map(d => (
                  <span key={d.toISOString()} className="text-xs text-gray-600 bg-white border border-gray-200 rounded px-2 py-1 font-mono">
                    {formatDate(d)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}

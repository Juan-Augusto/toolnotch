'use client'

import { useState } from 'react'
import Button from '@/components/Button'

interface Props {
  tabs: Record<string, string>
  percentOf: Record<string, string>
  whatPercent: Record<string, string>
  percentChange: Record<string, string>
  calculate: string
  clear: string
}

type Tab = 'percentOf' | 'whatPercent' | 'percentChange'

export default function PercentageCalculatorClient({ tabs, percentOf, whatPercent, percentChange, calculate, clear }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('percentOf')

  // percentOf: what is X% of Y
  const [poPct, setPoPct] = useState('')
  const [poNum, setPoNum] = useState('')
  const [poResult, setPoResult] = useState<string | null>(null)

  // whatPercent: X is what % of Y
  const [wpX, setWpX] = useState('')
  const [wpY, setWpY] = useState('')
  const [wpResult, setWpResult] = useState<string | null>(null)

  // percentChange: from X to Y
  const [pcFrom, setPcFrom] = useState('')
  const [pcTo, setPcTo] = useState('')
  const [pcResult, setPcResult] = useState<string | null>(null)

  function calcPercentOf() {
    const p = parseFloat(poPct), n = parseFloat(poNum)
    if (!isNaN(p) && !isNaN(n)) setPoResult(String(parseFloat((n * p / 100).toFixed(10))))
  }

  function calcWhatPercent() {
    const x = parseFloat(wpX), y = parseFloat(wpY)
    if (!isNaN(x) && !isNaN(y) && y !== 0) setWpResult(parseFloat((x / y * 100).toFixed(10)) + '%')
  }

  function calcChange() {
    const from = parseFloat(pcFrom), to = parseFloat(pcTo)
    if (!isNaN(from) && !isNaN(to) && from !== 0) {
      const pct = (to - from) / from * 100
      const abs = Math.abs(parseFloat(pct.toFixed(10)))
      const dir = pct >= 0 ? percentChange.increase : percentChange.decrease
      setPcResult(`${abs}% ${dir}`)
    }
  }

  function clearAll() {
    setPoPct(''); setPoNum(''); setPoResult(null)
    setWpX(''); setWpY(''); setWpResult(null)
    setPcFrom(''); setPcTo(''); setPcResult(null)
  }

  const tabKeys: Tab[] = ['percentOf', 'whatPercent', 'percentChange']
  const tabLabels: Record<Tab, string> = {
    percentOf: tabs.percentOf,
    whatPercent: tabs.whatPercent,
    percentChange: tabs.percentChange,
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {tabKeys.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'percentOf' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 whitespace-nowrap">{percentOf.label1}</span>
            <input
              type="number"
              value={poPct}
              onChange={e => setPoPct(e.target.value)}
              placeholder="15"
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
            <span className="text-sm text-gray-600">%</span>
            <span className="text-sm text-gray-600 whitespace-nowrap">{percentOf.label2}</span>
            <input
              type="number"
              value={poNum}
              onChange={e => setPoNum(e.target.value)}
              placeholder="200"
              className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>
          {poResult !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-lg font-bold text-blue-700">
              {percentOf.resultPrefix} {poResult}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={calcPercentOf} className="flex-1">{calculate}</Button>
            <button onClick={clearAll} className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors">{clear}</button>
          </div>
        </div>
      )}

      {activeTab === 'whatPercent' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 whitespace-nowrap">{whatPercent.label1}</span>
            <input
              type="number"
              value={wpX}
              onChange={e => setWpX(e.target.value)}
              placeholder="30"
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">{whatPercent.label2}</span>
            <input
              type="number"
              value={wpY}
              onChange={e => setWpY(e.target.value)}
              placeholder="200"
              className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>
          {wpResult !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-lg font-bold text-blue-700">
              {whatPercent.resultPrefix} {wpResult}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={calcWhatPercent} className="flex-1">{calculate}</Button>
            <button onClick={clearAll} className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors">{clear}</button>
          </div>
        </div>
      )}

      {activeTab === 'percentChange' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 whitespace-nowrap">{percentChange.label1}</span>
            <input
              type="number"
              value={pcFrom}
              onChange={e => setPcFrom(e.target.value)}
              placeholder="100"
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">{percentChange.label2}</span>
            <input
              type="number"
              value={pcTo}
              onChange={e => setPcTo(e.target.value)}
              placeholder="150"
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>
          {pcResult !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-lg font-bold text-blue-700">
              {percentChange.resultPrefix} {pcResult}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={calcChange} className="flex-1">{calculate}</Button>
            <button onClick={clearAll} className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors">{clear}</button>
          </div>
        </div>
      )}
    </div>
  )
}

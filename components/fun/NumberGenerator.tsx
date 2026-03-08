'use client'
import { useState } from 'react'
import { randomInt } from '@/lib/random'

export default function NumberGenerator() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [sortResults, setSortResults] = useState(false)
  const [results, setResults] = useState<number[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const generate = () => {
    setError('')
    if (min >= max) { setError('Min must be less than max.'); return }
    if (count < 1 || count > 1000) { setError('Count must be between 1 and 1000.'); return }

    const range = max - min + 1
    if (!allowDuplicates && count > range) {
      setError(`Cannot generate ${count} unique numbers in range ${min}–${max}.`)
      return
    }

    let generated: number[]
    if (allowDuplicates) {
      generated = Array.from({ length: count }, () => randomInt(min, max))
    } else {
      const pool = Array.from({ length: range }, (_, i) => min + i)
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      generated = shuffled.slice(0, count)
    }

    if (sortResults) generated.sort((a, b) => a - b)
    setResults(generated)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(results.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min</label>
          <input type="number" value={min} onChange={e => setMin(parseInt(e.target.value))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max</label>
          <input type="number" value={max} onChange={e => setMax(parseInt(e.target.value))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
          <input type="number" min={1} max={1000} value={count} onChange={e => setCount(parseInt(e.target.value))}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={allowDuplicates} onChange={e => setAllowDuplicates(e.target.checked)} className="rounded" />
          <span className="text-gray-700">Allow duplicates</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={sortResults} onChange={e => setSortResults(e.target.checked)} className="rounded" />
          <span className="text-gray-700">Sort results</span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button onClick={generate} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        Generate
      </button>

      {results.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{results.length} number{results.length !== 1 ? 's' : ''} generated</span>
            <button onClick={copy} className="text-sm text-blue-600 hover:underline">
              {copied ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((n, i) => (
              <span key={i} className="bg-white border border-gray-200 rounded px-2 py-1 text-sm font-mono">{n}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

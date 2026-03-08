'use client'
import { useState, useRef } from 'react'
import confetti from 'canvas-confetti'
import { pickRandom } from '@/lib/random'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function NamePicker() {
  const [namesText, setNamesText] = useState('')
  const [winner, setWinner] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [remaining, setRemaining] = useState<string[] | null>(null)
  const [removeOnPick, setRemoveOnPick] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getNames = () => namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0)

  const pick = () => {
    if (isAnimating) return
    const pool = removeOnPick ? (remaining ?? getNames()) : getNames()
    if (pool.length === 0) return

    const [picked] = pickRandom(pool)

    if (prefersReducedMotion()) {
      setWinner(picked)
      setHistory(h => [picked, ...h].slice(0, 5))
      if (removeOnPick) setRemaining(pool.filter(n => n !== picked))
      return
    }

    setIsAnimating(true)
    let count = 0
    intervalRef.current = setInterval(() => {
      const [rand] = pickRandom(pool)
      setDisplayName(rand)
      count++
      if (count > 20) {
        clearInterval(intervalRef.current!)
        setDisplayName(picked)
        setWinner(picked)
        setHistory(h => [picked, ...h].slice(0, 5))
        if (removeOnPick) setRemaining(pool.filter(n => n !== picked))
        setIsAnimating(false)
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      }
    }, 60)
  }

  const reset = () => {
    setRemaining(null)
    setWinner(null)
    setHistory([])
    setDisplayName('')
  }

  const pool = removeOnPick ? (remaining ?? getNames()) : getNames()

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Names (one per line)</label>
        <textarea
          rows={5}
          value={namesText}
          onChange={e => { setNamesText(e.target.value); setRemaining(null) }}
          placeholder="Alice&#10;Bob&#10;Carol&#10;Dave"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={removeOnPick} onChange={e => { setRemoveOnPick(e.target.checked); setRemaining(null) }} className="rounded" />
        <span className="text-sm text-gray-700">Remove picked names (pick without replacement)</span>
      </label>

      {removeOnPick && (
        <p className="text-xs text-gray-500">{pool.length} name{pool.length !== 1 ? 's' : ''} remaining</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={pick}
          disabled={isAnimating || pool.length === 0}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isAnimating ? 'Picking...' : pool.length === 0 ? 'No names left' : 'Pick!'}
        </button>
        {removeOnPick && history.length > 0 && (
          <button onClick={reset} className="px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Reset</button>
        )}
      </div>

      {(winner || isAnimating) && (
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="text-xs text-gray-500 mb-1">Winner!</div>
          <div className="text-3xl font-bold text-blue-700">{isAnimating ? displayName : winner}</div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Recent picks:</p>
          <div className="flex flex-wrap gap-2">
            {history.map((name, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useAnimate } from 'framer-motion'
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
  const [reelNames, setReelNames] = useState<string[]>([])
  const [reelScope, animateReel] = useAnimate()

  const getNames = () => namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0)

  const pick = async () => {
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

    // Build reel sequence: random names cycling then landing on winner
    const all = getNames()
    const cycles = 18
    const sequence = Array.from({ length: cycles }, (_, i) => {
      if (i === cycles - 1) return picked
      return all[Math.floor(Math.random() * all.length)] || picked
    })
    setReelNames(sequence)
    setIsAnimating(true)
    setWinner(null)

    // Animate reel: scroll through names with decreasing speed
    const ITEM_HEIGHT = 64
    const total = sequence.length * ITEM_HEIGHT

    await animateReel(reelScope.current, { y: -total + ITEM_HEIGHT }, {
      duration: 1.6,
      ease: [0.25, 0.1, 0.05, 1], // custom ease-out: fast then very slow
    })

    setIsAnimating(false)
    setWinner(picked)
    setHistory(h => [picked, ...h].slice(0, 5))
    if (removeOnPick) setRemaining(pool.filter(n => n !== picked))

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })

    // Reset reel position instantly (hidden while not animating)
    if (reelScope.current) {
      reelScope.current.style.transform = 'translateY(0px)'
    }
  }

  const reset = () => {
    setRemaining(null)
    setWinner(null)
    setHistory([])
    setReelNames([])
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
          {isAnimating ? 'Picking…' : pool.length === 0 ? 'No names left' : 'Pick!'}
        </button>
        {removeOnPick && history.length > 0 && (
          <button onClick={reset} className="px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Reset</button>
        )}
      </div>

      {/* Slot machine reel */}
      {isAnimating && reelNames.length > 0 && (
        <div className="bg-slate-900 rounded-xl overflow-hidden" style={{ height: 64 }}>
          <div ref={reelScope} className="will-change-transform">
            {reelNames.map((name, i) => (
              <div
                key={i}
                className="flex items-center justify-center font-bold text-xl text-white"
                style={{ height: 64 }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner reveal */}
      <AnimatePresence>
        {winner && !isAnimating && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-blue-50 rounded-xl p-6 text-center"
          >
            <div className="text-xs text-gray-500 mb-1">Winner!</div>
            <div className="text-3xl font-bold text-blue-700">{winner}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Recent picks:</p>
          <div className="flex flex-wrap gap-2">
            {history.map((name, i) => (
              <motion.span
                key={`${name}-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

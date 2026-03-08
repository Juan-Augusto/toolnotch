'use client'
import { useState } from 'react'
import { parseDiceNotation, randomInt } from '@/lib/random'
import { DiceRoll } from '@/lib/randomTypes'

const PRESETS = ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100', '2d6', '3d6']

export default function DiceRoller() {
  const [notation, setNotation] = useState('1d6')
  const [rolls, setRolls] = useState<DiceRoll[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [error, setError] = useState('')

  const roll = () => {
    if (isRolling) return
    const parsed = parseDiceNotation(notation)
    if (!parsed) {
      setError('Invalid notation. Try "2d6" or "1d20+5".')
      return
    }
    setError('')
    setIsRolling(true)
    setTimeout(() => {
      const rollResults = Array.from({ length: parsed.count }, () => randomInt(1, parsed.sides))
      const sum = rollResults.reduce((a, b) => a + b, 0)
      const total = sum + parsed.modifier
      const newRoll: DiceRoll = { notation, rolls: rollResults, sum, total }
      setRolls(prev => [newRoll, ...prev].slice(0, 5))
      setIsRolling(false)
    }, 300)
  }

  const latest = rolls[0]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dice Notation</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={notation}
            onChange={(e) => setNotation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && roll()}
            placeholder="e.g. 2d6+3"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={roll}
            disabled={isRolling}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isRolling ? '...' : 'Roll'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => setNotation(p)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${notation === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
          >
            {p}
          </button>
        ))}
      </div>

      {latest && (
        <div className={`bg-blue-50 rounded-xl p-6 text-center transition-all ${isRolling ? 'opacity-50' : ''}`}>
          <div className="flex flex-wrap justify-center gap-3 mb-3">
            {latest.rolls.map((r, i) => (
              <div key={i} className="w-12 h-12 bg-white border-2 border-blue-300 rounded-lg flex items-center justify-center text-xl font-bold text-blue-700">
                {r}
              </div>
            ))}
          </div>
          <div className="text-3xl font-bold text-gray-900">{latest.total}</div>
          <div className="text-sm text-gray-500 mt-1">
            {latest.notation} = [{latest.rolls.join(' + ')}]{latest.total !== latest.sum ? ` + ${latest.total - latest.sum} = ${latest.total}` : ''}
          </div>
        </div>
      )}

      {rolls.length > 1 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Previous rolls:</p>
          <div className="space-y-1">
            {rolls.slice(1).map((r, i) => (
              <div key={i} className="flex justify-between text-sm text-gray-500 px-2">
                <span>{r.notation}</span>
                <span className="font-medium">{r.total} ({r.rolls.join(', ')})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

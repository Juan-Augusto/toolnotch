'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { shuffleArray } from '@/lib/random'

export default function TeamGenerator() {
  const [namesText, setNamesText] = useState('')
  const [teamCount, setTeamCount] = useState(2)
  const [teams, setTeams] = useState<string[][]>([])
  const [copied, setCopied] = useState(false)
  const [key, setKey] = useState(0)

  const generate = () => {
    const names = namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0)
    if (names.length < 2) return
    const shuffled = shuffleArray(names)
    const result: string[][] = Array.from({ length: teamCount }, () => [])
    shuffled.forEach((name, i) => result[i % teamCount].push(name))
    setTeams(result)
    setKey(k => k + 1) // retrigger animation on re-generate
  }

  const copy = async () => {
    const text = teams.map((t, i) => `Team ${i + 1}: ${t.join(', ')}`).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const COLORS = [
    'bg-blue-100 border-blue-200',
    'bg-green-100 border-green-200',
    'bg-purple-100 border-purple-200',
    'bg-orange-100 border-orange-200',
    'bg-pink-100 border-pink-200',
    'bg-teal-100 border-teal-200',
    'bg-red-100 border-red-200',
    'bg-yellow-100 border-yellow-200',
    'bg-indigo-100 border-indigo-200',
    'bg-gray-100 border-gray-200',
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
    exit: { opacity: 0, scale: 0.85, y: -12, transition: { duration: 0.15 } },
  }

  const nameVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Names (one per line)</label>
        <textarea
          rows={6}
          value={namesText}
          onChange={e => setNamesText(e.target.value)}
          placeholder="Alice&#10;Bob&#10;Carol&#10;Dave&#10;Eve&#10;Frank"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of teams</label>
          <input
            type="number"
            min={2}
            max={10}
            value={teamCount}
            onChange={e => setTeamCount(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)))}
            className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={generate}
          className="mt-5 px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Generate Teams
        </button>
      </div>

      <AnimatePresence mode="wait">
        {teams.length > 0 && (
          <motion.div key={key} initial="hidden" animate="visible" exit="exit" variants={containerVariants}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Results</h3>
              <button onClick={copy} className="text-sm text-blue-600 hover:underline">
                {copied ? 'Copied!' : 'Copy all'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((team, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  className={`rounded-lg border p-3 ${COLORS[i % COLORS.length]}`}
                >
                  <div className="font-semibold text-gray-800 mb-2">Team {i + 1}</div>
                  <motion.ul
                    variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                    className="space-y-1"
                  >
                    {team.map(name => (
                      <motion.li key={name} variants={nameVariants} className="text-sm text-gray-700">
                        {name}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

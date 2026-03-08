'use client'
import { TextStats, getFleschLabel, getFleschColor } from '@/lib/textTypes'

interface ReadabilityPanelProps {
  stats: TextStats
}

export default function ReadabilityPanel({ stats }: ReadabilityPanelProps) {
  const label = getFleschLabel(stats.fleschEase)
  const color = getFleschColor(stats.fleschEase)

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Readability Scores</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">Flesch Reading Ease</div>
          <div className={`text-2xl font-bold ${color}`}>{stats.fleschEase}</div>
          <div className={`text-sm font-medium mt-1 ${color}`}>{label}</div>
          <div className="text-xs text-gray-400 mt-1">Higher = easier to read</div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">Flesch-Kincaid Grade</div>
          <div className="text-2xl font-bold text-gray-800">{stats.fleschGrade}</div>
          <div className="text-sm text-gray-500 mt-1">Grade level</div>
          <div className="text-xs text-gray-400 mt-1">US school grade equivalent</div>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="text-xs text-gray-500 mb-1">Gunning Fog Index</div>
          <div className="text-2xl font-bold text-gray-800">{stats.gunningFog}</div>
          <div className="text-sm text-gray-500 mt-1">Years of education</div>
          <div className="text-xs text-gray-400 mt-1">Lower = more accessible</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        Syllable counting is a heuristic approximation. Scores may vary slightly from other tools.
      </div>
    </div>
  )
}

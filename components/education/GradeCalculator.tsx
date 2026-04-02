'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { calculateGradeNeeded } from '@/lib/gpaMath'

export default function GradeCalculator() {
  const t = useTranslations('gpaCalculator')

  const [currentGrade, setCurrentGrade] = useState('')
  const [earnedWeight, setEarnedWeight] = useState('')
  const [targetGrade, setTargetGrade] = useState('')

  const cg = parseFloat(currentGrade)
  const ew = parseFloat(earnedWeight)
  const tg = parseFloat(targetGrade)

  const ready = !isNaN(cg) && !isNaN(ew) && !isNaN(tg) && ew >= 0 && ew <= 100

  let needed: number | null = null
  let status: 'normal' | 'impossible' | 'achieved' = 'normal'

  if (ready) {
    const result = calculateGradeNeeded(cg, ew, tg)
    if (isNaN(result)) {
      status = 'impossible'
    } else if (result <= 0) {
      status = 'achieved'
    } else if (result > 100) {
      status = 'impossible'
    } else {
      needed = result
      status = 'normal'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('currentGrade')}
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={currentGrade}
            onChange={(e) => setCurrentGrade(e.target.value)}
            placeholder="0–100"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('earnedWeight')}
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={earnedWeight}
            onChange={(e) => setEarnedWeight(e.target.value)}
            placeholder="0–100"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('targetGrade')}
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={targetGrade}
            onChange={(e) => setTargetGrade(e.target.value)}
            placeholder="0–100"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {ready && (
        <div
          className={`rounded-xl p-5 border ${
            status === 'impossible'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
              : status === 'achieved'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
              : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700'
          }`}
        >
          {status === 'impossible' ? (
            <p className="text-lg font-semibold text-red-700 dark:text-red-300">
              {t('impossible')}
            </p>
          ) : status === 'achieved' ? (
            <p className="text-lg font-semibold text-green-700 dark:text-green-300">
              {t('alreadyAchieved')}
            </p>
          ) : (
            <>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                {t('gradeNeeded')}
              </p>
              <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                {needed}%
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

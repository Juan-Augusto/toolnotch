'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  calculateBmi,
  lbsToKg,
  kgToLbs,
  feetInchesToCm,
  cmToFeetInches,
  type BmiResult,
  type UnitSystem,
} from '@/lib/healthMath'

interface Props {
  locale: string
}

const CATEGORY_COLORS: Record<BmiResult['category'], string> = {
  underweight: 'text-blue-600 dark:text-blue-400',
  normal: 'text-green-600 dark:text-green-400',
  overweight: 'text-yellow-600 dark:text-yellow-400',
  obese: 'text-red-600 dark:text-red-400',
}

const CATEGORY_BAR_COLORS: Record<BmiResult['category'], string> = {
  underweight: 'bg-blue-500',
  normal: 'bg-green-500',
  overweight: 'bg-yellow-500',
  obese: 'bg-red-500',
}

/** Returns indicator position (%) on the 0–40 BMI range scale */
function bmiToPercent(bmi: number): number {
  return Math.min(Math.max((bmi / 40) * 100, 0), 100)
}

export default function BmiCalculator({ locale }: Props) {
  const t = useTranslations('healthCalculator')

  const defaultUnit: UnitSystem = locale === 'en' ? 'imperial' : 'metric'
  const [unit, setUnit] = useState<UnitSystem>(defaultUnit)

  // metric state
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')

  // imperial state
  const [weightLbs, setWeightLbs] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')

  // Derived from inputs — no need to sync via effect
  const result: BmiResult | null = (() => {
    let wKg: number
    let hCm: number

    if (unit === 'metric') {
      wKg = parseFloat(weightKg)
      hCm = parseFloat(heightCm)
    } else {
      wKg = lbsToKg(parseFloat(weightLbs))
      hCm = feetInchesToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0)
    }

    if (wKg > 0 && hCm > 0 && isFinite(wKg) && isFinite(hCm)) {
      return calculateBmi(wKg, hCm)
    }
    return null
  })()

  function switchUnit(newUnit: UnitSystem) {
    if (newUnit === unit) return
    if (newUnit === 'imperial') {
      // convert current metric values to imperial
      const kg = parseFloat(weightKg)
      const cm = parseFloat(heightCm)
      if (!isNaN(kg)) setWeightLbs(String(kgToLbs(kg)))
      if (!isNaN(cm)) {
        const { feet, inches } = cmToFeetInches(cm)
        setHeightFt(String(feet))
        setHeightIn(String(inches))
      }
    } else {
      // convert current imperial values to metric
      const lbs = parseFloat(weightLbs)
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      if (!isNaN(lbs)) setWeightKg(String(lbsToKg(lbs)))
      if (ft || inches) setHeightCm(String(feetInchesToCm(ft, inches)))
    }
    setUnit(newUnit)
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

  return (
    <div className="space-y-6">
      {/* Unit toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchUnit('metric')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            unit === 'metric'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t('metric')}
        </button>
        <button
          type="button"
          onClick={() => switchUnit('imperial')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            unit === 'imperial'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t('imperial')}
        </button>
      </div>

      {/* Inputs */}
      {unit === 'metric' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('weight')} (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.1"
              placeholder="70"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('height')} (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.1"
              placeholder="175"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t('weight')} (lbs)</label>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="0.1"
              placeholder="154"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('height')} ({t('feet')})</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="8"
              placeholder="5"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('height')} ({t('inches')})</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="11"
              placeholder="9"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 pt-2">
          {/* BMI number + category */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('yourBmi')}</p>
            <p className={`text-6xl font-bold ${CATEGORY_COLORS[result.category]}`}>
              {result.bmi}
            </p>
            <p className={`text-lg font-semibold mt-1 ${CATEGORY_COLORS[result.category]}`}>
              {t(result.category)}
            </p>
          </div>

          {/* Color-coded BMI bar */}
          <div className="space-y-1">
            <div className="flex rounded-full overflow-hidden h-4">
              <div className="bg-blue-500 flex-1" title="Underweight" />
              <div className="bg-green-500 flex-[1.3]" title="Normal" />
              <div className="bg-yellow-500 flex-1" title="Overweight" />
              <div className="bg-red-500 flex-1" title="Obese" />
            </div>
            {/* Indicator */}
            <div className="relative h-2">
              <div
                className={`absolute w-3 h-3 -top-3.5 rounded-full border-2 border-white dark:border-gray-800 ${CATEGORY_BAR_COLORS[result.category]} transition-all duration-300`}
                style={{ left: `calc(${bmiToPercent(result.bmi)}% - 6px)` }}
              />
            </div>
            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
              <span>{t('underweight')}</span>
              <span>{t('normal')}</span>
              <span>{t('overweight')}</span>
              <span>{t('obese')}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>{'<18.5'}</span>
              <span>18.5–24.9</span>
              <span>25–29.9</span>
              <span>{'≥30'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Medical disclaimer — always visible */}
      <p className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4">
        {t('disclaimer')}
      </p>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  calculateTdee,
  lbsToKg,
  kgToLbs,
  feetInchesToCm,
  cmToFeetInches,
  type TdeeResult,
  type Sex,
  type ActivityLevel,
  type UnitSystem,
} from '@/lib/healthMath'

interface Props {
  locale: string
  mode: 'maintain' | 'deficit'
}

type GoalKey = 'maintain' | 'lose_slow' | 'lose_fast' | 'gain_slow' | 'gain_fast'

const GOAL_LABEL_KEYS: Record<GoalKey, string> = {
  maintain:  'maintain',
  lose_slow: 'loseSlow',
  lose_fast: 'loseFast',
  gain_slow: 'gainSlow',
  gain_fast: 'gainFast',
}

const GOAL_ORDER: GoalKey[] = ['lose_fast', 'lose_slow', 'maintain', 'gain_slow', 'gain_fast']

const ACTIVITY_KEYS: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active']
const ACTIVITY_LABEL_MAP: Record<ActivityLevel, string> = {
  sedentary:   'sedentary',
  light:       'light',
  moderate:    'moderate',
  active:      'active',
  very_active: 'veryActive',
}

function highlightGoal(mode: 'maintain' | 'deficit', goal: GoalKey): boolean {
  if (mode === 'maintain') return goal === 'maintain'
  if (mode === 'deficit') return goal === 'lose_fast'
  return false
}

export default function TdeeCalculator({ locale, mode }: Props) {
  const t = useTranslations('healthCalculator')

  const defaultUnit: UnitSystem = locale === 'en' ? 'imperial' : 'metric'
  const [unit, setUnit] = useState<UnitSystem>(defaultUnit)

  const [age, setAge] = useState('')
  const [sex, setSex] = useState<Sex>('male')
  const [activity, setActivity] = useState<ActivityLevel>('moderate')

  // metric
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')

  // imperial
  const [weightLbs, setWeightLbs] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')

  // Derived from inputs — no need to sync via effect
  const result: TdeeResult | null = (() => {
    let wKg: number
    let hCm: number

    if (unit === 'metric') {
      wKg = parseFloat(weightKg)
      hCm = parseFloat(heightCm)
    } else {
      wKg = lbsToKg(parseFloat(weightLbs))
      hCm = feetInchesToCm(parseFloat(heightFt) || 0, parseFloat(heightIn) || 0)
    }

    const ageNum = parseFloat(age)

    if (
      wKg > 0 && hCm > 0 && ageNum > 0 &&
      isFinite(wKg) && isFinite(hCm) && isFinite(ageNum)
    ) {
      return calculateTdee(wKg, hCm, ageNum, sex, activity)
    }
    return null
  })()

  function switchUnit(newUnit: UnitSystem) {
    if (newUnit === unit) return
    if (newUnit === 'imperial') {
      const kg = parseFloat(weightKg)
      const cm = parseFloat(heightCm)
      if (!isNaN(kg)) setWeightLbs(String(kgToLbs(kg)))
      if (!isNaN(cm)) {
        const { feet, inches } = cmToFeetInches(cm)
        setHeightFt(String(feet))
        setHeightIn(String(inches))
      }
    } else {
      const lbs = parseFloat(weightLbs)
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      if (!isNaN(lbs)) setWeightKg(String(lbsToKg(lbs)))
      if (ft || inches) setHeightCm(String(feetInchesToCm(ft, inches)))
    }
    setUnit(newUnit)
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
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

      {/* Age + Sex */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('age')}</label>
          <input
            type="number"
            inputMode="numeric"
            min="10"
            max="120"
            placeholder="30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t('sex')}</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as Sex)}
            className={inputClass}
          >
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
          </select>
        </div>
      </div>

      {/* Weight + Height */}
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

      {/* Activity level */}
      <div>
        <label className={labelClass}>{t('activityLevel')}</label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          className={inputClass}
        >
          {ACTIVITY_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(ACTIVITY_LABEL_MAP[key])}
            </option>
          ))}
        </select>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 pt-2">
          {/* BMR + TDEE summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('yourBmr')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.bmr}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('calories')}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('yourTdee')}</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.tdee}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('calories')}</p>
            </div>
          </div>

          {/* Goals table */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {GOAL_ORDER.map((key) => {
                  const isHighlighted = highlightGoal(mode, key)
                  return (
                    <tr
                      key={key}
                      className={
                        isHighlighted
                          ? 'bg-blue-50 dark:bg-blue-900/30'
                          : 'bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-700/30'
                      }
                    >
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                        {t(GOAL_LABEL_KEYS[key])}
                        {isHighlighted && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                            ★
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${
                        isHighlighted
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {result.goals[key].toLocaleString()} {t('calories')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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

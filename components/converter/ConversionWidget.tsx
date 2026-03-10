'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { convert, formatResult } from '@/lib/units'
import { UnitCategory } from '@/lib/unitTypes'
import { UNITS, UNIT_LABELS } from '@/data/units'
import { TEMPERATURE_UNITS } from '@/lib/temperature'
import QuickReferenceTable from './QuickReferenceTable'

interface ConversionWidgetProps {
  category: UnitCategory
  defaultFrom?: string
  defaultTo?: string
}

function getUnitsForCategory(category: UnitCategory): string[] {
  if (category === 'temperature') return [...TEMPERATURE_UNITS]
  return Object.keys(UNITS[category] ?? {})
}

function getDefaultUnits(category: UnitCategory): [string, string] {
  const units = getUnitsForCategory(category)
  return [units[0], units[1] ?? units[0]]
}

export default function ConversionWidget({ category, defaultFrom, defaultTo }: ConversionWidgetProps) {
  const t = useTranslations('convert.shared')
  const units = getUnitsForCategory(category)
  const [defaults] = useState(() => getDefaultUnits(category))
  const [from, setFrom] = useState(defaultFrom ?? defaults[0])
  const [to, setTo] = useState(defaultTo ?? defaults[1])
  const [inputValue, setInputValue] = useState('1')

  const result = useMemo(() => {
    const num = parseFloat(inputValue)
    if (isNaN(num)) return ''
    return formatResult(convert(num, from, to, category))
  }, [inputValue, from, to, category])

  const swap = () => {
    setFrom(to)
    setTo(from)
    setInputValue(result || '1')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">{t('from')}</label>
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            {units.map(u => <option key={u} value={u}>{UNIT_LABELS[u] ?? u}</option>)}
          </select>
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('enterValue')}
          />
        </div>

        <button onClick={swap} className="mb-0 p-3 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors flex-shrink-0" title={t('swap')}>
          ⇄
        </button>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">{t('to')}</label>
          <select value={to} onChange={e => setTo(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            {units.map(u => <option key={u} value={u}>{UNIT_LABELS[u] ?? u}</option>)}
          </select>
          <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-lg font-mono font-semibold text-blue-800">
            {result || '—'}
          </div>
        </div>
      </div>

      {result && (
        <p className="text-sm text-gray-500 text-center">
          {inputValue} {UNIT_LABELS[from] ?? from} = <strong>{result} {UNIT_LABELS[to] ?? to}</strong>
        </p>
      )}

      <QuickReferenceTable fromUnit={from} toUnit={to} category={category} />
    </div>
  )
}

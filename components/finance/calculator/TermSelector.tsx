'use client'
import { useTranslations } from 'next-intl'

const PRESETS = [
  { label: '5yr', months: 60 },
  { label: '10yr', months: 120 },
  { label: '15yr', months: 180 },
  { label: '20yr', months: 240 },
  { label: '30yr', months: 360 },
]

interface TermSelectorProps {
  value: number
  onChange: (v: number) => void
}

export default function TermSelector({ value, onChange }: TermSelectorProps) {
  const t = useTranslations('finance.shared')
  const years = Math.floor(value / 12)
  const months = value % 12

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t('termMonths')}</label>
      <div className="flex gap-2 mb-2">
        {PRESETS.map((p) => (
          <button
            key={p.months}
            type="button"
            onClick={() => onChange(p.months)}
            className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${value === p.months ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="relative">
            <input
              type="number"
              min="0"
              max="50"
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={years}
              onChange={(e) => onChange(parseInt(e.target.value || '0') * 12 + months)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">yr</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <input
              type="number"
              min="0"
              max="11"
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={months}
              onChange={(e) => onChange(years * 12 + parseInt(e.target.value || '0'))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">mo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

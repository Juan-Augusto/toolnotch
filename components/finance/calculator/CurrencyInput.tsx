'use client'
import { useState, useEffect } from 'react'

interface CurrencyInputProps {
  value: number
  onChange: (v: number) => void
  label: string
  min?: number
  max?: number
  id?: string
}

export default function CurrencyInput({ value, onChange, label, min = 0, max, id }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    value > 0 ? value.toLocaleString('en-US') : ''
  )

  useEffect(() => {
    const formatted = value > 0 ? value.toLocaleString('en-US') : ''
    setDisplayValue(formatted)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setDisplayValue(raw ? Number(raw).toLocaleString('en-US') : '')
    const num = parseInt(raw, 10)
    if (!isNaN(num)) {
      const clamped = max ? Math.min(num, max) : num
      onChange(Math.max(min, clamped))
    } else if (raw === '') {
      onChange(0)
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={displayValue}
          onChange={handleChange}
          placeholder="0"
        />
      </div>
    </div>
  )
}

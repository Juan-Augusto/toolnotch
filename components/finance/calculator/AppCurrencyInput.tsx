'use client'
import { useState, useEffect } from 'react'
import { AppInput } from '@/components/ui'

interface CurrencyInputProps {
  value: number
  onChange: (v: number) => void
  label: string
  min?: number
  max?: number
  id?: string
}

export default function AppCurrencyInput({ value, onChange, label, min = 0, max, id }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    value > 0 ? value.toLocaleString('en-US') : ''
  )

  useEffect(() => {
    const formatted = value > 0 ? value.toLocaleString('en-US') : ''
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <AppInput
      id={id}
      label={label}
      labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
      variant="background"
      prefix={<span className="text-label font-mono font-bold text-xs sm:text-sm">$</span>}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      placeholder="0"
      className="font-mono text-xs sm:text-sm"
    />
  )
}

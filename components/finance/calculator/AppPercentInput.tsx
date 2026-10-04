'use client'
import { AppInput } from '@/components/ui'

interface PercentInputProps {
  value: number
  onChange: (v: number) => void
  label: string
  id?: string
}

export default function AppPercentInput({ value, onChange, label, id }: PercentInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      onChange(Math.min(30, Math.max(0.01, val)))
    }
  }

  return (
    <AppInput
      id={id}
      label={label}
      labelClassName="font-mono text-xs font-bold uppercase text-foreground mb-1.5"
      variant="background"
      suffix={<span className="text-label font-mono font-bold text-xs sm:text-sm">%</span>}
      type="number"
      step="0.125"
      min="0.01"
      max="30"
      value={value}
      onChange={handleChange}
      className="font-mono text-xs sm:text-sm"
    />
  )
}

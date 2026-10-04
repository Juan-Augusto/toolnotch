'use client'
import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { AppSegmentedControl, AppInput, type SegmentOption } from '@/components/ui'

interface TermSelectorProps {
  value: number
  onChange: (v: number) => void
  presets?: SegmentOption<number>[]
  label?: string
}

export default function AppTermSelector({
  value,
  onChange,
  presets,
  label,
}: TermSelectorProps) {
  const t = useTranslations('finance.shared')

  const defaultPresets: SegmentOption<number>[] = useMemo(() => [
    { label: t('presetYears', { years: 5 }), value: 60 },
    { label: t('presetYears', { years: 10 }), value: 120 },
    { label: t('presetYears', { years: 15 }), value: 180 },
    { label: t('presetYears', { years: 20 }), value: 240 },
    { label: t('presetYears', { years: 30 }), value: 360 },
  ], [t])

  const effectivePresets = presets || defaultPresets

  const [yearsStr, setYearsStr] = useState(() => String(Math.floor(value / 12)))
  const [monthsStr, setMonthsStr] = useState(() => String(value % 12))

  useEffect(() => {
    setYearsStr(String(Math.floor(value / 12)))
    setMonthsStr(String(value % 12))
  }, [value])

  const activePreset = effectivePresets.some((o) => o.value === value) ? value : undefined

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setYearsStr(raw)
    if (raw.trim() === '') return
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 50) {
      const currentMonths = parseInt(monthsStr, 10) || 0
      const total = parsed * 12 + currentMonths
      if (total > 0 && total !== value) {
        onChange(total)
      }
    }
  }

  const handleYearsBlur = () => {
    const parsed = parseInt(yearsStr, 10)
    if (isNaN(parsed) || parsed < 0) {
      setYearsStr(String(Math.floor(value / 12)))
    } else {
      const clamped = Math.min(50, parsed)
      setYearsStr(String(clamped))
      const currentMonths = parseInt(monthsStr, 10) || 0
      const total = Math.max(1, clamped * 12 + currentMonths)
      if (total !== value) onChange(total)
    }
  }

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setMonthsStr(raw)
    if (raw.trim() === '') return
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 11) {
      const currentYears = parseInt(yearsStr, 10) || 0
      const total = currentYears * 12 + parsed
      if (total > 0 && total !== value) {
        onChange(total)
      }
    }
  }

  const handleMonthsBlur = () => {
    const parsed = parseInt(monthsStr, 10)
    if (isNaN(parsed) || parsed < 0) {
      setMonthsStr(String(value % 12))
    } else {
      const clamped = Math.min(11, parsed)
      setMonthsStr(String(clamped))
      const currentYears = parseInt(yearsStr, 10) || 0
      const total = Math.max(1, currentYears * 12 + clamped)
      if (total !== value) onChange(total)
    }
  }

  return (
    <div className="w-full space-y-2.5">
      <div className="w-full">
        <label className="block font-mono text-xs font-bold uppercase text-foreground mb-1.5 select-none">
          {label || t('termMonths')}
        </label>
        <AppSegmentedControl<number>
          options={effectivePresets}
          value={activePreset}
          onChange={(val) => onChange(Number(val))}
          size="sm"
          color="secondary"
          withDashedBorder={false}
          bordered
          fontWeight="medium"
          className="font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono">
        <AppInput
          type="number"
          min="0"
          max="50"
          variant="background"
          suffix={<span className="text-label font-mono text-xs select-none">{t('yearUnit')}</span>}
          value={yearsStr}
          onChange={handleYearsChange}
          onBlur={handleYearsBlur}
          className="font-mono text-xs sm:text-sm"
        />
        <AppInput
          type="number"
          min="0"
          max="11"
          variant="background"
          suffix={<span className="text-label font-mono text-xs select-none">{t('monthUnit')}</span>}
          value={monthsStr}
          onChange={handleMonthsChange}
          onBlur={handleMonthsBlur}
          className="font-mono text-xs sm:text-sm"
        />
      </div>
    </div>
  )
}

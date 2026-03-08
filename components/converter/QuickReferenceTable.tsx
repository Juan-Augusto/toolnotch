'use client'
import { useMemo } from 'react'
import { convert, formatResult } from '@/lib/units'
import { UnitCategory } from '@/lib/unitTypes'
import { UNIT_LABELS } from '@/data/units'

const REFERENCE_VALUES = [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 500, 1000]

interface QuickReferenceTableProps {
  fromUnit: string
  toUnit: string
  category: UnitCategory
}

export default function QuickReferenceTable({ fromUnit, toUnit, category }: QuickReferenceTableProps) {
  const rows = useMemo(() => {
    return REFERENCE_VALUES.slice(0, 8).map(val => ({
      from: val,
      to: formatResult(convert(val, fromUnit, toUnit, category)),
    }))
  }, [fromUnit, toUnit, category])

  const fromLabel = UNIT_LABELS[fromUnit] ?? fromUnit
  const toLabel = UNIT_LABELS[toUnit] ?? toUnit

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Reference</h3>
      <div className="grid grid-cols-2 gap-x-4 text-sm">
        <div className="font-medium text-gray-600 pb-1 border-b border-gray-200">{fromLabel}</div>
        <div className="font-medium text-gray-600 pb-1 border-b border-gray-200">{toLabel}</div>
        {rows.map((row, i) => (
          <>
            <div key={`f${i}`} className="py-1 text-gray-500">{row.from}</div>
            <div key={`t${i}`} className="py-1 font-medium text-gray-800">{row.to}</div>
          </>
        ))}
      </div>
    </div>
  )
}

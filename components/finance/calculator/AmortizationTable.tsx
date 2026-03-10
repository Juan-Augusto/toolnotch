'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AmortizationRow } from '@/lib/loanTypes'
import { formatCurrency } from '@/lib/loanMath'

interface AmortizationTableProps {
  amortization: AmortizationRow[]
}

const PAGE_SIZE = 12

export default function AmortizationTable({ amortization }: AmortizationTableProps) {
  const t = useTranslations('finance.shared')
  const [page, setPage] = useState(0)
  const [showAll, setShowAll] = useState(false)

  if (amortization.length === 0) return null

  const rows = showAll ? amortization : amortization.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(amortization.length / PAGE_SIZE)

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{t('amortizationSchedule')}</h3>
        <button
          onClick={() => { setShowAll(!showAll); setPage(0) }}
          className="text-xs text-blue-600 hover:underline"
        >
          {showAll ? 'Show paginated' : `Show all ${amortization.length} rows`}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="py-2 px-3 text-left">{t('month')}</th>
              <th className="py-2 px-3 text-right">{t('payment')}</th>
              <th className="py-2 px-3 text-right">{t('principal_col')}</th>
              <th className="py-2 px-3 text-right">{t('interest')}</th>
              <th className="py-2 px-3 text-right">{t('balance')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-1.5 px-3 text-gray-500">{row.month}</td>
                <td className="py-1.5 px-3 text-right">{formatCurrency(row.payment)}</td>
                <td className="py-1.5 px-3 text-right text-blue-600">{formatCurrency(row.principal)}</td>
                <td className="py-1.5 px-3 text-right text-orange-500">{formatCurrency(row.interest)}</td>
                <td className="py-1.5 px-3 text-right">{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!showAll && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

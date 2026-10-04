'use client'
import { useState, memo } from 'react'
import { useTranslations } from 'next-intl'
import { AmortizationRow } from '@/lib/loanTypes'
import { formatCurrency } from '@/lib/loanMath'
import AppTable, {
  AppTableHeader,
  AppTableBody,
  AppTableRow,
  AppTableHead,
  AppTableCell,
} from '@/components/ui/AppTable'

interface AmortizationTableProps {
  amortization: AmortizationRow[]
}

const PAGE_SIZE = 12

function AppAmortizationTable({ amortization }: AmortizationTableProps) {
  const t = useTranslations('finance.shared')
  const [page, setPage] = useState(0)
  const [showAll, setShowAll] = useState(false)

  if (amortization.length === 0) return null

  const rows = showAll ? amortization : amortization.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(amortization.length / PAGE_SIZE)

  return (
    <div className="mt-6 bg-background border border-border rounded-[2px] font-mono overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-xs font-bold uppercase text-foreground tracking-wider">
          {t('amortizationSchedule')}
        </h3>
        <button
          type="button"
          onClick={() => { setShowAll(!showAll); setPage(0) }}
          className="text-sm text-primary hover:underline cursor-pointer"
        >
          {showAll ? t('showPaged') : t('showAllPayments', { count: amortization.length })}
        </button>
      </div>

      <div className="overflow-x-auto">
        <AppTable border={false} hoverable={true} aria-label={t('amortizationSchedule')}>
          <AppTableHeader>
            <AppTableRow hoverable={false}>
              <AppTableHead>{t('month')}</AppTableHead>
              <AppTableHead align="right">{t('payment')}</AppTableHead>
              <AppTableHead align="right">{t('principal_col')}</AppTableHead>
              <AppTableHead align="right">{t('interest')}</AppTableHead>
              <AppTableHead align="right">{t('balance')}</AppTableHead>
            </AppTableRow>
          </AppTableHeader>
          <AppTableBody>
            {rows.map((row) => (
              <AppTableRow key={row.month}>
                <AppTableCell className="font-mono text-label">{row.month}</AppTableCell>
                <AppTableCell align="right" className="font-mono font-medium text-foreground">
                  {formatCurrency(row.payment)}
                </AppTableCell>
                <AppTableCell align="right" className="font-mono font-medium text-blue-600 dark:text-blue-400">
                  {formatCurrency(row.principal)}
                </AppTableCell>
                <AppTableCell align="right" className="font-mono font-medium text-pink-600 dark:text-pink-400">
                  {formatCurrency(row.interest)}
                </AppTableCell>
                <AppTableCell align="right" className="font-mono text-label">
                  {formatCurrency(row.balance)}
                </AppTableCell>
              </AppTableRow>
            ))}
          </AppTableBody>
        </AppTable>
      </div>

      {!showAll && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 border-t border-border/60">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3.5 py-1.5 text-sm border border-border rounded-[2px] bg-tertiary hover:border-secondary disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {t('prev')}
          </button>
          <span className="text-sm text-label px-2">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3.5 py-1.5 text-sm border border-border rounded-[2px] bg-tertiary hover:border-secondary disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(AppAmortizationTable)

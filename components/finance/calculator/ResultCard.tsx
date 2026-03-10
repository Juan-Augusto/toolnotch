'use client'
import { useTranslations } from 'next-intl'
import { LoanResult } from '@/lib/loanTypes'
import { formatCurrency } from '@/lib/loanMath'

interface ResultCardProps {
  result: LoanResult | null
}

export default function ResultCard({ result }: ResultCardProps) {
  const t = useTranslations('finance.shared')

  if (!result || result.monthlyPayment === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center text-gray-400">
        {t('calculate')}
      </div>
    )
  }

  return (
    <div className="bg-blue-600 rounded-xl p-6 text-white">
      <div className="text-center mb-4">
        <div className="text-sm text-blue-200 mb-1">{t('monthlyPayment')}</div>
        <div className="text-4xl font-bold">{formatCurrency(result.monthlyPayment)}</div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-500">
        <div className="text-center">
          <div className="text-xs text-blue-200">{t('totalInterest')}</div>
          <div className="text-lg font-semibold mt-0.5">{formatCurrency(result.totalInterest)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-blue-200">{t('totalCost')}</div>
          <div className="text-lg font-semibold mt-0.5">{formatCurrency(result.totalPayment)}</div>
        </div>
      </div>
    </div>
  )
}

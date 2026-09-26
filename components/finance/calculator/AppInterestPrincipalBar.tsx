'use client'
import { useTranslations } from 'next-intl'
import { LoanResult } from '@/lib/loanTypes'
import { formatCurrency } from '@/lib/loanMath'

interface InterestPrincipalBarProps {
  result: LoanResult | null
  principal: number
}

export default function AppInterestPrincipalBar({ result, principal }: InterestPrincipalBarProps) {
  const t = useTranslations('finance.shared')

  if (!result || result.monthlyPayment === 0) return null

  const total = result.totalPayment
  const principalPct = (principal / total) * 100
  const interestPct = (result.totalInterest / total) * 100

  return (
    <div className="mt-4 font-mono">
      <div className="flex justify-between text-xs text-foreground mb-1.5 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span>{t('principal_col')} ({principalPct.toFixed(0)}%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
          <span>{t('interest')} ({interestPct.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="flex rounded-[2px] overflow-hidden h-3 bg-tertiary border border-border">
        <div
          className="bg-blue-500 transition-all duration-300"
          style={{ width: `${principalPct}%` }}
        />
        <div
          className="bg-pink-500 transition-all duration-300"
          style={{ width: `${interestPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1.5">
        <span className="text-blue-600 dark:text-blue-400 font-bold">{formatCurrency(principal)}</span>
        <span className="text-pink-600 dark:text-pink-400 font-bold">{formatCurrency(result.totalInterest)}</span>
      </div>
    </div>
  )
}

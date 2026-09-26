'use client'
import { useTranslations } from 'next-intl'
import { LoanResult } from '@/lib/loanTypes'
import { formatCurrency } from '@/lib/loanMath'

interface ResultCardProps {
  result: LoanResult | null
}

export default function AppResultCard({ result }: ResultCardProps) {
  const t = useTranslations('finance.shared')

  if (!result || result.monthlyPayment === 0) {
    return (
      <div className="bg-background rounded-[2px] border border-dashed border-border p-6 text-center text-label font-mono text-xs">
        {t('calculate')}
      </div>
    )
  }

  return (
    <div className="bg-background rounded-[2px] border border-border p-5 sm:p-6 font-mono shadow-xs">
      <div className="text-center mb-5 pb-5 border-b border-border/80">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {formatCurrency(result.monthlyPayment)}
        </div>
        <div className="text-xs font-mono uppercase font-medium tracking-wider text-foreground mt-1">
          {t('monthlyPayment')}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="text-center p-3 bg-tertiary rounded-[2px] border border-border/60">
          <div className="text-base sm:text-lg font-bold text-foreground">
            {formatCurrency(result.totalInterest)}
          </div>
          <div className="text-xs font-mono uppercase font-medium tracking-wider text-foreground mt-1">
            {t('totalInterest')}
          </div>
        </div>
        <div className="text-center p-3 bg-tertiary rounded-[2px] border border-border/60">
          <div className="text-base sm:text-lg font-bold text-foreground">
            {formatCurrency(result.totalPayment)}
          </div>
          <div className="text-xs font-mono uppercase font-medium tracking-wider text-foreground mt-1">
            {t('totalCost')}
          </div>
        </div>
      </div>
    </div>
  )
}

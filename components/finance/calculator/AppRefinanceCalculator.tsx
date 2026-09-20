'use client'

import { useState, useMemo, useDeferredValue } from 'react'
import { useTranslations } from 'next-intl'
import { calculateRefinance, formatCurrency } from '@/lib/loanMath'
import { AppCard, AppBadge } from '@/components/ui'
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import AppCurrencyInput from './AppCurrencyInput'
import AppPercentInput from './AppPercentInput'
import AppTermSelector from './AppTermSelector'
import AppAffiliatePanel from './AppAffiliatePanel'

export default function AppRefinanceCalculator() {
  const t = useTranslations('finance.refinance')
  const sharedT = useTranslations('finance.shared')

  // Current loan state
  const [currentBalance, setCurrentBalance] = useState(250000)
  const [currentRate, setCurrentRate] = useState(6.5)
  const [currentTermMonths, setCurrentTermMonths] = useState(300)

  // New loan state
  const [newRate, setNewRate] = useState(5.0)
  const [newTermMonths, setNewTermMonths] = useState(300)
  const [closingCosts, setClosingCosts] = useState(4000)

  const result = useMemo(() => {
    return calculateRefinance({
      currentBalance,
      currentRate,
      currentTermMonths,
      newRate,
      newTermMonths,
      closingCosts,
    })
  }, [currentBalance, currentRate, currentTermMonths, newRate, newTermMonths, closingCosts])

  const deferredResult = useDeferredValue(result)
  const isWorthIt = deferredResult.monthlySavings > 0 && deferredResult.lifetimeSavings > 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Loan Panel */}
        <div className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <span className="font-mono text-xs sm:text-sm font-bold uppercase text-foreground">
              {t('currentSection')}
            </span>
          </div>

          <AppCurrencyInput
            id="currentBalance"
            label={t('currentBalance')}
            value={currentBalance}
            onChange={setCurrentBalance}
            min={1}
          />

          <AppPercentInput
            id="currentRate"
            label={t('currentRate')}
            value={currentRate}
            onChange={setCurrentRate}
          />

          <AppTermSelector
            value={currentTermMonths}
            onChange={setCurrentTermMonths}
            label={t('currentTerm')}
          />
        </div>

        {/* New Loan Panel */}
        <div className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <span className="font-mono text-xs sm:text-sm font-bold uppercase text-foreground">
              {t('newSection')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppPercentInput
              id="newRate"
              label={t('newRate')}
              value={newRate}
              onChange={setNewRate}
            />

            <AppCurrencyInput
              id="closingCosts"
              label={t('closingCosts')}
              value={closingCosts}
              onChange={setClosingCosts}
              min={0}
            />
          </div>

          <AppTermSelector
            value={newTermMonths}
            onChange={setNewTermMonths}
            label={t('newTerm')}
          />
        </div>
      </div>

      {/* Hero Results Card */}
      <AppCard
        border
        cornerAccents={false}
        className="p-5 sm:p-6 bg-tertiary border-border rounded-[2px] font-mono space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-bold text-label block mb-1">
              {t('monthlySavings')}
            </span>
            <div className={`text-3xl sm:text-4xl font-bold tracking-tight ${deferredResult.monthlySavings > 0 ? 'text-primary' : 'text-foreground'}`}>
              {deferredResult.monthlySavings > 0
                ? `${formatCurrency(deferredResult.monthlySavings)} / ${sharedT('month').toLowerCase()}`
                : formatCurrency(0)}
            </div>
          </div>

          <div>
            <AppBadge
              variant="subtle"
              size="md"
              className={`font-mono text-xs font-bold uppercase flex items-center gap-1.5 ${
                isWorthIt
                  ? 'text-primary border-primary/40 bg-primary/10'
                  : 'text-amber-500 border-amber-500/40 bg-amber-500/10'
              }`}
            >
              {isWorthIt ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('worthIt')}</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t('notWorthIt')}</span>
                </>
              )}
            </AppBadge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60">
          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('breakEven')}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {deferredResult.breakEvenMonths
                ? t('breakEvenMonths', { months: deferredResult.breakEvenMonths })
                : t('breakEvenNever')}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('lifetimeSavings')}
            </span>
            <span className={`text-sm sm:text-base font-bold ${deferredResult.lifetimeSavings > 0 ? 'text-primary' : 'text-foreground'}`}>
              {formatCurrency(deferredResult.lifetimeSavings)}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase text-label block">
              {sharedT('payment')} ({t('currentPayment')} → {t('newPayment')})
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground inline-flex items-center gap-1.5">
              <span>{formatCurrency(deferredResult.currentMonthlyPayment)}</span>
              <ArrowRight className="w-3.5 h-3.5 text-label" />
              <span className="text-primary">{formatCurrency(deferredResult.newMonthlyPayment)}</span>
            </span>
          </div>
        </div>
      </AppCard>

      <AppAffiliatePanel loanType="mortgage" />
    </div>
  )
}

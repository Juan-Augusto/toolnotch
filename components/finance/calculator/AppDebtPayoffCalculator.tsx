'use client'

import { useState, useMemo, useDeferredValue } from 'react'
import { useTranslations } from 'next-intl'
import { calculateDebtPayoff, formatCurrency } from '@/lib/loanMath'
import { AppCard, AppBadge } from '@/components/ui'
import { Zap, CheckCircle2 } from 'lucide-react'
import AppCurrencyInput from './AppCurrencyInput'
import AppPercentInput from './AppPercentInput'
import AppAffiliatePanel from './AppAffiliatePanel'

export default function AppDebtPayoffCalculator() {
  const t = useTranslations('finance.debtPayoff')
  const sharedT = useTranslations('finance.shared')

  const formatMonthsToYears = (totalMonths: number): string => {
    if (totalMonths <= 0) return sharedT('presetMonthsShort', { months: 0 })
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12
    if (years === 0) return sharedT('presetMonths', { months })
    if (months === 0) return sharedT('presetYears', { years })
    return t('yearsMonths', { years, months })
  }

  const [balance, setBalance] = useState(15000)
  const [annualRate, setAnnualRate] = useState(18.0)
  const [monthlyPayment, setMonthlyPayment] = useState(380)
  const [extraPayment, setExtraPayment] = useState(100)

  const result = useMemo(() => {
    return calculateDebtPayoff({
      balance,
      annualRate,
      monthlyPayment,
      extraPayment,
    })
  }, [balance, annualRate, monthlyPayment, extraPayment])

  const deferredResult = useDeferredValue(result)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppCurrencyInput
          id="balance"
          label={t('balance')}
          value={balance}
          onChange={setBalance}
          min={1}
        />
        <AppPercentInput
          id="rate"
          label={t('rate')}
          value={annualRate}
          onChange={setAnnualRate}
        />
        <AppCurrencyInput
          id="monthlyPayment"
          label={t('monthlyPayment')}
          value={monthlyPayment}
          onChange={setMonthlyPayment}
          min={1}
        />
        <AppCurrencyInput
          id="extraPayment"
          label={t('extraPayment')}
          value={extraPayment}
          onChange={setExtraPayment}
          min={0}
        />
      </div>

      {/* Hero Result Card */}
      <AppCard
        border
        cornerAccents={false}
        className="p-5 sm:p-6 bg-tertiary border-border rounded-[2px] font-mono space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase font-bold text-label block mb-1">
              {t('interestSaved')}
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              {formatCurrency(deferredResult.interestSaved)}
            </div>
          </div>

          {deferredResult.monthsSaved > 0 && (
            <div>
              <AppBadge
                className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 text-primary border border-primary/40 bg-primary/10"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t('monthsFaster', { months: deferredResult.monthsSaved })}</span>
              </AppBadge>
            </div>
          )}
        </div>

        {/* Side-by-side Plan Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/60">
          {/* Standard Plan */}
          <div className="p-3.5 sm:p-4 rounded-[2px] bg-background/50 border border-border space-y-2">
            <span className="text-xs font-bold uppercase text-label block">
              {t('standardPlan')}
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-label">{t('debtFreeIn')}:</span>
                <span className="font-bold text-foreground">
                  {formatMonthsToYears(deferredResult.standardMonths)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-label">{t('totalInterest')}:</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(deferredResult.standardTotalInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-label">{sharedT('payment')}:</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(monthlyPayment)} / {sharedT('month').toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Accelerated Plan */}
          <div className="p-3.5 sm:p-4 rounded-[2px] bg-background border border-primary/50 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-primary block">
                {t('acceleratedPlan')}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-label">{t('debtFreeIn')}:</span>
                <span className="font-bold text-primary">
                  {formatMonthsToYears(deferredResult.acceleratedMonths)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-label">{t('totalInterest')}:</span>
                <span className="font-bold text-primary">
                  {formatCurrency(deferredResult.acceleratedTotalInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-label">{sharedT('payment')}:</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(monthlyPayment + extraPayment)} / {sharedT('month').toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AppCard>

      <AppAffiliatePanel loanType="personal" />
    </div>
  )
}

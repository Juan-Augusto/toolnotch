'use client'

import { useState, useMemo, useDeferredValue } from 'react'
import { useTranslations } from 'next-intl'
import { calculateAffordability, formatCurrency } from '@/lib/loanMath'
import { AppCard } from '@/components/ui'
import { Scale, CheckCircle2, AlertCircle } from 'lucide-react'
import AppCurrencyInput from './AppCurrencyInput'
import AppPercentInput from './AppPercentInput'
import AppTermSelector from './AppTermSelector'
import AppAffiliatePanel from './AppAffiliatePanel'

export default function AppAffordabilityCalculator() {
  const t = useTranslations('finance.affordability')
  const sharedT = useTranslations('finance.shared')

  const [income, setIncome] = useState(8000)
  const [debts, setDebts] = useState(500)
  const [downPayment, setDownPayment] = useState(50000)
  const [annualRate, setAnnualRate] = useState(6.5)
  const [termMonths, setTermMonths] = useState(360)

  const result = useMemo(() => {
    return calculateAffordability({
      grossMonthlyIncome: income,
      monthlyDebts: debts,
      annualRate,
      termMonths,
      downPayment,
    })
  }, [income, debts, annualRate, termMonths, downPayment])

  const deferredResult = useDeferredValue(result)

  const maxHousing = income * 0.28
  const maxWithDebts = Math.max(0, income * 0.36 - debts)
  const isDebtConstrained = maxWithDebts < maxHousing

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AppCurrencyInput
          id="income"
          label={t('incomeLabel')}
          value={income}
          onChange={setIncome}
          min={0}
        />
        <AppCurrencyInput
          id="debts"
          label={t('debtsLabel')}
          value={debts}
          onChange={setDebts}
          min={0}
        />
        <AppCurrencyInput
          id="downPayment"
          label={t('downPaymentLabel')}
          value={downPayment}
          onChange={setDownPayment}
          min={0}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppPercentInput
          id="rate"
          label={t('annualRateLabel')}
          value={annualRate}
          onChange={setAnnualRate}
        />
        <AppTermSelector
          value={termMonths}
          onChange={setTermMonths}
          label={t('termLabel')}
        />
      </div>

      {/* Main Result Card */}
      <AppCard
        border
        cornerAccents={false}
        className="p-5 sm:p-6 bg-tertiary border-border rounded-[2px] font-mono space-y-5"
      >
        <div>
          <span className="text-xs uppercase font-bold text-label block mb-1">
            {t('maxHomePrice')}
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            {formatCurrency(deferredResult.maxHomePrice)}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/60">
          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('maxLoan')}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {formatCurrency(deferredResult.maxLoanAmount)}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('monthlyPayment')}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {formatCurrency(deferredResult.monthlyPayment)}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('downPaymentLabel')}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {formatCurrency(downPayment)}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('ltvLabel')}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {deferredResult.loanToValue.toFixed(1)}%
            </span>
          </div>
        </div>
      </AppCard>

      {/* 28/36 Rule Analysis Card */}
      <AppCard
        border
        cornerAccents={false}
        className="p-4 sm:p-5 bg-tertiary border-border rounded-[2px] font-mono space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Scale className="w-4 h-4 text-primary" />
          <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground">
            {t('rule2836Title')}
          </h3>
        </div>

        <p className="text-xs text-label leading-relaxed">
          {t('rule2836Desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`p-3 rounded-[2px] border ${!isDebtConstrained ? 'bg-background border-primary/50' : 'bg-background/50 border-border'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-foreground">
                {t('frontEndLabel')}
              </span>
              {!isDebtConstrained && (
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(maxHousing)} / {sharedT('month').toLowerCase()}
            </span>
            <span className="text-[10px] text-label block mt-0.5">
              {t('frontEndCalculation', { income: formatCurrency(income) })}
            </span>
          </div>

          <div className={`p-3 rounded-[2px] border ${isDebtConstrained ? 'bg-background border-amber-500/50' : 'bg-background/50 border-border'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-foreground">
                {t('backEndLabel')}
              </span>
              {isDebtConstrained && (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(maxWithDebts)} / {sharedT('month').toLowerCase()}
            </span>
            <span className="text-[10px] text-label block mt-0.5">
              {t('backEndCalculation', { income: formatCurrency(income), debts: formatCurrency(debts) })}
            </span>
          </div>
        </div>

        {isDebtConstrained && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-[2px] text-xs text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {t('debtConstrainedWarning', { amount: formatCurrency(debts) })}
            </span>
          </div>
        )}
      </AppCard>

      <AppAffiliatePanel loanType="affordability" />
    </div>
  )
}

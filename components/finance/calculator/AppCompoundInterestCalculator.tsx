'use client'

import { useState, useMemo, useDeferredValue } from 'react'
import { useTranslations } from 'next-intl'
import { calculateCompoundInterest, formatCurrency } from '@/lib/loanMath'
import { AppCard, AppSegmentedControl, AppInput, type SegmentOption } from '@/components/ui'
import { TrendingUp } from 'lucide-react'
import AppCurrencyInput from './AppCurrencyInput'
import AppPercentInput from './AppPercentInput'
import AppAffiliatePanel from './AppAffiliatePanel'

export default function AppCompoundInterestCalculator() {
  const t = useTranslations('finance.compound')
  const sharedT = useTranslations('finance.shared')

  const yearOptions: SegmentOption<number>[] = useMemo(() => [
    { label: sharedT('presetYears', { years: 5 }), value: 5 },
    { label: sharedT('presetYears', { years: 10 }), value: 10 },
    { label: sharedT('presetYears', { years: 15 }), value: 15 },
    { label: sharedT('presetYears', { years: 20 }), value: 20 },
    { label: sharedT('presetYears', { years: 30 }), value: 30 },
  ], [sharedT])

  const [initialDeposit, setInitialDeposit] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(200)
  const [annualRate, setAnnualRate] = useState(7.0)
  const [years, setYears] = useState(10)

  const result = useMemo(() => {
    return calculateCompoundInterest({
      initialDeposit,
      monthlyContribution,
      annualRate,
      years,
    })
  }, [initialDeposit, monthlyContribution, annualRate, years])

  const deferredResult = useDeferredValue(result)

  const totalPrincipal = Math.max(0, initialDeposit) + deferredResult.totalContributions
  const principalPercent = deferredResult.endingBalance > 0
    ? (totalPrincipal / deferredResult.endingBalance) * 100
    : 100
  const interestPercent = Math.max(0, 100 - principalPercent)

  const activeYearPreset = yearOptions.some((o) => o.value === years) ? years : undefined

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AppCurrencyInput
          id="initialDeposit"
          label={t('initialDeposit')}
          value={initialDeposit}
          onChange={setInitialDeposit}
          min={0}
        />
        <AppCurrencyInput
          id="monthlyContribution"
          label={t('monthlyContribution')}
          value={monthlyContribution}
          onChange={setMonthlyContribution}
          min={0}
        />
        <AppPercentInput
          id="rate"
          label={t('annualRate')}
          value={annualRate}
          onChange={setAnnualRate}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-mono text-xs font-bold uppercase text-foreground select-none">
          {t('years')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-3">
            <AppSegmentedControl<number>
              options={yearOptions}
              value={activeYearPreset}
              onChange={(val) => setYears(Number(val))}
              size="sm"
              color="secondary"
              withDashedBorder={false}
              bordered
              fontWeight="medium"
              className="font-mono text-xs"
            />
          </div>
          <div>
            <AppInput
              type="number"
              min="1"
              max="50"
              variant="background"
              suffix={<span className="text-label font-mono text-xs select-none">{sharedT('yearUnit')}</span>}
              value={String(years)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                if (!isNaN(val) && val >= 1 && val <= 50) setYears(val)
              }}
              className="font-mono text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Hero Result Card */}
      <AppCard
        border
        cornerAccents={false}
        className="p-5 sm:p-6 bg-tertiary border-border rounded-[2px] font-mono space-y-5"
      >
        <div>
          <span className="text-xs uppercase font-bold text-label block mb-1">
            {t('endingBalance')}
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            {formatCurrency(deferredResult.endingBalance)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60">
          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('totalPrincipal')}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {formatCurrency(totalPrincipal)}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('totalInterest')}
            </span>
            <span className="text-sm sm:text-base font-bold text-primary">
              {formatCurrency(deferredResult.totalInterest)}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase text-label block">
              {t('totalContributionsLabel')}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {formatCurrency(deferredResult.totalContributions)}
            </span>
          </div>
        </div>

        {/* Visual Proportional Bar */}
        <div className="pt-2 space-y-1.5">
          <div className="flex justify-between text-[11px] text-label">
            <span>{sharedT('principal_col')}: {principalPercent.toFixed(1)}%</span>
            <span className="text-primary font-bold">{sharedT('interest')}: {interestPercent.toFixed(1)}%</span>
          </div>
          <div className="h-3 w-full bg-border rounded-[2px] overflow-hidden flex">
            <div
              style={{ width: `${principalPercent}%` }}
              className="bg-foreground/40 transition-all duration-300"
            />
            <div
              style={{ width: `${interestPercent}%` }}
              className="bg-primary transition-all duration-300"
            />
          </div>
        </div>
      </AppCard>

      {/* Annual Breakdown Table */}
      {deferredResult.annualBreakdown.length > 0 && (
        <div className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] font-mono space-y-3">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground">
              {t('breakdownTitle')}
            </h3>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase text-label bg-background/50 sticky top-0 border-b border-border">
                <tr>
                  <th className="py-2 px-3">{t('year')}</th>
                  <th className="py-2 px-3">{t('principalInvested')}</th>
                  <th className="py-2 px-3">{t('interestEarned')}</th>
                  <th className="py-2 px-3 text-right">{t('totalBalance')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {deferredResult.annualBreakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-background/30 transition-colors">
                    <td className="py-2 px-3 font-bold text-foreground">{t('yearPrefix', { year: row.year })}</td>
                    <td className="py-2 px-3 text-label">{formatCurrency(row.principalInvested)}</td>
                    <td className="py-2 px-3 text-primary font-semibold">{formatCurrency(row.interestEarned)}</td>
                    <td className="py-2 px-3 text-right font-bold text-foreground">{formatCurrency(row.totalBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AppAffiliatePanel loanType="interest" />
    </div>
  )
}

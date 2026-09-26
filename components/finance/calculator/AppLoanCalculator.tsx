'use client'
import { useState, useEffect, useMemo, useDeferredValue } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { calculateLoan, formatCurrency } from '@/lib/loanMath'
import { LoanResult } from '@/lib/loanTypes'
import { CalculatorVariant } from '@/data/calculatorVariants'
import { ArrowRight } from 'lucide-react'
import AppCurrencyInput from './AppCurrencyInput'
import AppPercentInput from './AppPercentInput'
import AppTermSelector from './AppTermSelector'
import AppResultCard from './AppResultCard'
import AppInterestPrincipalBar from './AppInterestPrincipalBar'
import AppAmortizationChart from './AppAmortizationChart'
import AppAmortizationTable from './AppAmortizationTable'
import AppAffiliatePanel from './AppAffiliatePanel'

interface LoanCalculatorProps {
  variant: CalculatorVariant
}

export default function AppLoanCalculator({ variant }: LoanCalculatorProps) {
  const t = useTranslations('finance.shared')
  const carT = useTranslations('finance.car')
  const compT = useTranslations('finance.comparison')
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [principal, setPrincipal] = useState(() => {
    const p = searchParams.get('amount')
    return p ? parseFloat(p) : variant.defaults.principal
  })
  const [annualRate, setAnnualRate] = useState(() => {
    const r = searchParams.get('rate')
    return r ? parseFloat(r) : variant.defaults.annualRate
  })
  const [termMonths, setTermMonths] = useState(() => {
    const t = searchParams.get('term')
    return t ? parseInt(t, 10) : variant.defaults.termMonths
  })

  // Sync URL params smoothly with debounce to prevent Next.js UI freezes
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      params.set('amount', String(principal))
      params.set('rate', String(annualRate))
      params.set('term', String(termMonths))
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `${pathname}?${params.toString()}`)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [principal, annualRate, termMonths, pathname])

  const result: LoanResult | null = useMemo(() => {
    if (principal > 0 && annualRate > 0 && termMonths > 0) {
      return calculateLoan({ principal, annualRate, termMonths })
    }
    return null
  }, [principal, annualRate, termMonths])

  const deferredResult = useDeferredValue(result)

  const termPresets = useMemo(() => {
    if (variant.loanType === 'car') {
      return [
        { label: t('presetMonths', { months: 24 }), value: 24 },
        { label: t('presetMonths', { months: 36 }), value: 36 },
        { label: t('presetMonths', { months: 48 }), value: 48 },
        { label: t('presetMonths', { months: 60 }), value: 60 },
        { label: t('presetMonths', { months: 72 }), value: 72 },
        { label: t('presetMonths', { months: 84 }), value: 84 },
      ]
    }
    if (variant.loanType === 'personal') {
      return [
        { label: t('presetMonths', { months: 12 }), value: 12 },
        { label: t('presetMonths', { months: 24 }), value: 24 },
        { label: t('presetMonths', { months: 36 }), value: 36 },
        { label: t('presetMonths', { months: 48 }), value: 48 },
        { label: t('presetMonths', { months: 60 }), value: 60 },
      ]
    }
    return undefined
  }, [variant.loanType, t])

  const principalLabel =
    variant.loanType === 'car' ? carT('vehiclePrice') : t('principal')

  // Mortgage cross-comparison (15-year vs 30-year)
  const isMortgage15 = variant.slug === '15-year-mortgage-calculator'
  const isMortgage30 = variant.slug === '30-year-mortgage-calculator'
  const showComparison = isMortgage15 || isMortgage30

  const comparisonData = useMemo(() => {
    if (!showComparison || principal <= 0) return null
    const rate15 = isMortgage15 ? annualRate : Math.max(0.1, annualRate - 0.75)
    const rate30 = isMortgage30 ? annualRate : annualRate + 0.75

    const calc15 = calculateLoan({ principal, annualRate: rate15, termMonths: 180 })
    const calc30 = calculateLoan({ principal, annualRate: rate30, termMonths: 360 })

    const interestDiff = Math.max(0, calc30.totalInterest - calc15.totalInterest)
    const paymentDiff = Math.abs(calc15.monthlyPayment - calc30.monthlyPayment)

    return {
      calc15,
      calc30,
      interestDiff,
      paymentDiff,
    }
  }, [showComparison, principal, annualRate, isMortgage15, isMortgage30])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppCurrencyInput
          id="principal"
          label={principalLabel}
          value={principal}
          onChange={setPrincipal}
          min={1}
          max={100000000}
        />
        <AppPercentInput
          id="rate"
          label={t('annualRate')}
          value={annualRate}
          onChange={setAnnualRate}
        />
      </div>

      <AppTermSelector
        value={termMonths}
        onChange={setTermMonths}
        presets={termPresets}
      />

      <AppResultCard result={result} />
      <AppInterestPrincipalBar result={result} principal={principal} />

      {/* 15 vs 30 Year Mortgage Comparison Card */}
      {showComparison && comparisonData && (
        <div className="p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] font-mono space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/60 pb-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground">
                {compT('title')}
              </h3>
              <p className="text-xs text-label leading-relaxed mt-0.5">
                {compT('subtitle')}
              </p>
            </div>
            <span className="text-xs text-primary font-bold whitespace-nowrap">
              {compT('savingsBadge', { amount: formatCurrency(comparisonData.interestDiff) })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-[2px] border ${
                isMortgage15
                  ? 'bg-background border-primary/50'
                  : 'bg-background/40 border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-foreground">
                  {compT('term15Title')}
                </span>
                {isMortgage15 && (
                  <span className="text-[10px] font-bold uppercase text-primary">{compT('currentLabel')}</span>
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-label">{compT('monthlyPayment')}:</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(comparisonData.calc15.monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-label">{compT('totalInterest')}:</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(comparisonData.calc15.totalInterest)}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`p-3 rounded-[2px] border ${
                isMortgage30
                  ? 'bg-background border-primary/50'
                  : 'bg-background/40 border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-foreground">
                  {compT('term30Title')}
                </span>
                {isMortgage30 && (
                  <span className="text-[10px] font-bold uppercase text-primary">{compT('currentLabel')}</span>
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-label">{compT('monthlyPayment')}:</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(comparisonData.calc30.monthlyPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-label">{compT('totalInterest')}:</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(comparisonData.calc30.totalInterest)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <Link
              href={
                isMortgage15
                  ? `/tools/finance/30-year-mortgage-calculator?amount=${principal}`
                  : `/tools/finance/15-year-mortgage-calculator?amount=${principal}`
              }
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span>{isMortgage15 ? compT('switchTo30') : compT('switchTo15')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {deferredResult && deferredResult.amortization.length > 0 && (
        <>
          <AppAmortizationChart amortization={deferredResult.amortization} />
          <AppAmortizationTable amortization={deferredResult.amortization} />
        </>
      )}
      <AppAffiliatePanel loanType={variant.loanType} />
    </div>
  )
}

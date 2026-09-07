'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { calculateLoan } from '@/lib/loanMath'
import { LoanResult } from '@/lib/loanTypes'
import { CalculatorVariant } from '@/data/calculatorVariants'
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
  const searchParams = useSearchParams()
  const router = useRouter()
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
    return t ? parseInt(t) : variant.defaults.termMonths
  })

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('amount', String(principal))
    params.set('rate', String(annualRate))
    params.set('term', String(termMonths))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [principal, annualRate, termMonths, router, pathname])

  const result: LoanResult | null = useMemo(() => {
    if (principal > 0 && annualRate > 0 && termMonths > 0) {
      return calculateLoan({ principal, annualRate, termMonths })
    }
    return null
  }, [principal, annualRate, termMonths])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <AppCurrencyInput
          id="principal"
          label={t('principal')}
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
        <AppTermSelector value={termMonths} onChange={setTermMonths} />
      </div>

      <AppResultCard result={result} />
      <AppInterestPrincipalBar result={result} principal={principal} />
      {result && result.amortization.length > 0 && (
        <>
          <AppAmortizationChart amortization={result.amortization} />
          <AppAmortizationTable amortization={result.amortization} />
        </>
      )}
      <AppAffiliatePanel loanType={variant.loanType} />
    </div>
  )
}

'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { calculateLoan } from '@/lib/loanMath'
import { LoanResult } from '@/lib/loanTypes'
import { CalculatorVariant } from '@/data/calculatorVariants'
import CurrencyInput from './CurrencyInput'
import PercentInput from './PercentInput'
import TermSelector from './TermSelector'
import ResultCard from './ResultCard'
import InterestPrincipalBar from './InterestPrincipalBar'
import AmortizationChart from './AmortizationChart'
import AmortizationTable from './AmortizationTable'
import AffiliatePanel from './AffiliatePanel'

interface LoanCalculatorProps {
  variant: CalculatorVariant
}

export default function LoanCalculator({ variant }: LoanCalculatorProps) {
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
        <CurrencyInput
          id="principal"
          label="Loan Amount"
          value={principal}
          onChange={setPrincipal}
          min={1}
          max={100000000}
        />
        <PercentInput
          id="rate"
          label="Annual Interest Rate"
          value={annualRate}
          onChange={setAnnualRate}
        />
        <TermSelector value={termMonths} onChange={setTermMonths} />
      </div>

      <ResultCard result={result} />
      <InterestPrincipalBar result={result} principal={principal} />
      {result && result.amortization.length > 0 && (
        <>
          <AmortizationChart amortization={result.amortization} />
          <AmortizationTable amortization={result.amortization} />
        </>
      )}
      <AffiliatePanel loanType={variant.loanType} />
    </div>
  )
}

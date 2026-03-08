'use client'
import { LoanResult } from '@/lib/loanTypes'
import { formatCurrency } from '@/lib/loanMath'

interface InterestPrincipalBarProps {
  result: LoanResult | null
  principal: number
}

export default function InterestPrincipalBar({ result, principal }: InterestPrincipalBarProps) {
  if (!result || result.monthlyPayment === 0) return null

  const total = result.totalPayment
  const principalPct = (principal / total) * 100
  const interestPct = (result.totalInterest / total) * 100

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Principal ({principalPct.toFixed(0)}%)</span>
        <span>Interest ({interestPct.toFixed(0)}%)</span>
      </div>
      <div className="flex rounded-full overflow-hidden h-4">
        <div
          className="bg-blue-500 transition-all duration-300"
          style={{ width: `${principalPct}%` }}
        />
        <div
          className="bg-orange-400 transition-all duration-300"
          style={{ width: `${interestPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span className="text-blue-600">{formatCurrency(principal)}</span>
        <span className="text-orange-500">{formatCurrency(result.totalInterest)}</span>
      </div>
    </div>
  )
}

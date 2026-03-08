'use client'
import { AmortizationRow } from '@/lib/loanTypes'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/loanMath'

interface AmortizationChartProps {
  amortization: AmortizationRow[]
}

export default function AmortizationChart({ amortization }: AmortizationChartProps) {
  if (amortization.length === 0) return null

  // Build cumulative annual data
  const annualData: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = []
  let cumulativePrincipal = 0
  let cumulativeInterest = 0

  for (let i = 0; i < amortization.length; i++) {
    cumulativePrincipal += amortization[i].principal
    cumulativeInterest += amortization[i].interest
    if ((i + 1) % 12 === 0 || i === amortization.length - 1) {
      annualData.push({
        year: Math.ceil((i + 1) / 12),
        principalPaid: Math.round(cumulativePrincipal),
        interestPaid: Math.round(cumulativeInterest),
        balance: Math.round(amortization[i].balance),
      })
    }
  }

  const fmt = (v: number) => formatCurrency(v)

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Amortization Over Time</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={annualData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tickFormatter={(v) => `Yr ${v}`} tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmt(Number(v))} labelFormatter={(l) => `Year ${l}`} />
          <Legend />
          <Area type="monotone" dataKey="principalPaid" name="Principal Paid" stroke="#3b82f6" fill="url(#principalGrad)" stackId="1" />
          <Area type="monotone" dataKey="interestPaid" name="Interest Paid" stroke="#f97316" fill="url(#interestGrad)" stackId="1" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

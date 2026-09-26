'use client'
import { useMemo, memo } from 'react'
import { useTranslations } from 'next-intl'
import { AmortizationRow } from '@/lib/loanTypes'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/loanMath'

interface AmortizationChartProps {
  amortization: AmortizationRow[]
}

function AppAmortizationChart({ amortization }: AmortizationChartProps) {
  const t = useTranslations('finance.shared')

  const annualData = useMemo(() => {
    if (amortization.length === 0) return []
    const data: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = []
    let cumulativePrincipal = 0
    let cumulativeInterest = 0

    for (let i = 0; i < amortization.length; i++) {
      cumulativePrincipal += amortization[i].principal
      cumulativeInterest += amortization[i].interest
      if ((i + 1) % 12 === 0 || i === amortization.length - 1) {
        data.push({
          year: Math.ceil((i + 1) / 12),
          principalPaid: Math.round(cumulativePrincipal),
          interestPaid: Math.round(cumulativeInterest),
          balance: Math.round(amortization[i].balance),
        })
      }
    }
    return data
  }, [amortization])

  if (amortization.length === 0) return null

  const fmt = (v: number) => formatCurrency(v)

  return (
    <div className="mt-6 p-4 bg-background border border-border rounded-[2px] font-mono">
      <h3 className="text-xs font-bold uppercase text-foreground mb-3 tracking-wider">
        {t('amortizationChartTitle')}
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={annualData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
          <XAxis
            dataKey="year"
            tickFormatter={(v) => String(v)}
            tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
          />
          <Tooltip
            formatter={(v) => fmt(Number(v))}
            labelFormatter={(l) => t('yearPrefix', { year: l })}
            contentStyle={{
              backgroundColor: '#181a1b',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '2px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#ffffff',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              fontFamily: 'monospace',
              paddingTop: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="principalPaid"
            name={t('principalPaid')}
            stroke="#3b82f6"
            strokeWidth={1.5}
            fill="url(#principalGrad)"
            stackId="1"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="interestPaid"
            name={t('interestPaid')}
            stroke="#ec4899"
            strokeWidth={1.5}
            fill="url(#interestGrad)"
            stackId="1"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default memo(AppAmortizationChart)

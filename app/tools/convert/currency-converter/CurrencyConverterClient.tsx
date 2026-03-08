'use client'
import { useState, useEffect, useMemo } from 'react'
import { getRates } from '@/lib/currency'
import { CURRENCIES } from '@/data/currencies'

export default function CurrencyConverterClient() {
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [amount, setAmount] = useState('1')
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [stale, setStale] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    getRates(from).then(({ rates: r, stale: s }) => {
      if (Object.keys(r).length > 0) {
        setRates(r)
        setStale(s)
        setError(false)
      } else {
        setError(true)
      }
      setLoading(false)
    })
  }, [from])

  const result = useMemo(() => {
    const num = parseFloat(amount)
    if (isNaN(num) || !rates[to]) return null
    return num * rates[to]
  }, [amount, rates, to])

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="space-y-4">
      {stale && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-3 py-2 rounded-lg">
          ⚠️ Showing cached rates — unable to fetch latest rates. Rates may be stale.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          Unable to fetch exchange rates. Please check your connection and try again.
        </div>
      )}

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
          </select>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
          />
        </div>

        <button onClick={swap} className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors flex-shrink-0" title="Swap">⇄</button>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <select value={to} onChange={e => setTo(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
          </select>
          <div className={`w-full px-4 py-3 rounded-lg text-lg font-mono font-semibold border ${loading ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
            {loading ? 'Loading...' : result !== null ? result.toFixed(4) : '—'}
          </div>
        </div>
      </div>

      {result !== null && !loading && (
        <p className="text-sm text-gray-500 text-center">
          {amount} {from} = <strong>{result.toFixed(4)} {to}</strong>
        </p>
      )}

      <p className="text-xs text-gray-400 text-center">
        Rates from open.er-api.com · Cached for 1 hour · For reference only
      </p>
    </div>
  )
}

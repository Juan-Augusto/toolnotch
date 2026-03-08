const CACHE_TTL = 3600000 // 1 hour

interface CacheEntry {
  rates: Record<string, number>
  ts: number
  base: string
}

function getCacheKey(base: string) {
  return `fx_rates_${base}`
}

export async function getRates(baseCurrency: string): Promise<{ rates: Record<string, number>; stale: boolean }> {
  if (typeof window === 'undefined') {
    return { rates: {}, stale: false }
  }

  // Check cache
  try {
    const raw = localStorage.getItem(getCacheKey(baseCurrency))
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw)
      if (Date.now() - entry.ts < CACHE_TTL && entry.base === baseCurrency) {
        return { rates: entry.rates, stale: false }
      }
    }
  } catch { /* ignore */ }

  // Fetch fresh rates
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)
    if (!res.ok) throw new Error('Fetch failed')
    const data = await res.json()
    if (data.result !== 'success') throw new Error('API error')

    const entry: CacheEntry = { rates: data.rates, ts: Date.now(), base: baseCurrency }
    localStorage.setItem(getCacheKey(baseCurrency), JSON.stringify(entry))
    return { rates: data.rates, stale: false }
  } catch {
    // Return cached rates as stale if available
    try {
      const raw = localStorage.getItem(getCacheKey(baseCurrency))
      if (raw) {
        const entry: CacheEntry = JSON.parse(raw)
        return { rates: entry.rates, stale: true }
      }
    } catch { /* ignore */ }
    return { rates: {}, stale: true }
  }
}

export function clearRatesCache(baseCurrency: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getCacheKey(baseCurrency))
  }
}

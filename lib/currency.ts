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

  // Fetch fresh rates — primary CDN, fallback to Cloudflare Pages mirror
  const base = baseCurrency.toLowerCase()
  const urls = [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.min.json`,
    `https://latest.currency-api.pages.dev/v1/currencies/${base}.min.json`,
  ]

  try {
    let data: Record<string, unknown> | null = null
    for (const url of urls) {
      try {
        const res = await fetch(url)
        if (res.ok) { data = await res.json(); break }
      } catch { /* try next */ }
    }
    if (!data) throw new Error('All sources failed')

    const raw = data[base] as Record<string, number>
    if (!raw) throw new Error('Unexpected response shape')

    // Normalise keys to uppercase to match the rest of the app
    const rates: Record<string, number> = {}
    for (const [k, v] of Object.entries(raw)) rates[k.toUpperCase()] = v

    const entry: CacheEntry = { rates, ts: Date.now(), base: baseCurrency }
    localStorage.setItem(getCacheKey(baseCurrency), JSON.stringify(entry))
    return { rates, stale: false }
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

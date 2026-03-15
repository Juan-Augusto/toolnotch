import { getRates, clearRatesCache } from '@/lib/currency'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE = 'USD'
const CACHE_KEY = `fx_rates_${BASE}`
const ONE_HOUR = 3600000

/** Build a valid cache entry and write it to localStorage. */
function seedCache(overrides: { ts?: number; rates?: Record<string, number>; base?: string } = {}) {
  const entry = {
    rates: { EUR: 0.92, GBP: 0.79, JPY: 149.5, ...overrides.rates },
    ts: overrides.ts ?? Date.now(),
    base: overrides.base ?? BASE,
  }
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  return entry
}

/** Build a minimal mock Response. */
function makeOkResponse(body: object): Response {
  return {
    ok: true,
    json: () => Promise.resolve(body),
  } as unknown as Response
}

function makeFailResponse(): Response {
  return { ok: false } as unknown as Response
}

// ---------------------------------------------------------------------------
// Cache-hit: fresh cache (ts < 1 hour ago)
// ---------------------------------------------------------------------------

describe('getRates() — fresh cache', () => {
  it('returns cached rates without fetching when ts is within 1 hour', async () => {
    const { rates } = seedCache()
    const fetchMock = jest.fn()
    global.fetch = fetchMock

    const result = await getRates(BASE)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.stale).toBe(false)
    expect(result.rates['EUR']).toBe(rates['EUR'])
  })

  it('returns stale=false for a fresh cache hit', async () => {
    seedCache()
    global.fetch = jest.fn()

    const result = await getRates(BASE)
    expect(result.stale).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Cache-miss / stale: ts > 1 hour ago — should fetch
// ---------------------------------------------------------------------------

describe('getRates() — stale cache triggers re-fetch', () => {
  it('calls fetch when the cached timestamp is older than 1 hour', async () => {
    seedCache({ ts: Date.now() - ONE_HOUR - 1000 })

    const freshRates = { eur: 0.91, gbp: 0.78 }
    global.fetch = jest.fn().mockResolvedValueOnce(makeOkResponse({ usd: freshRates }))

    await getRates(BASE)

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('normalises fetched rate keys to uppercase', async () => {
    seedCache({ ts: Date.now() - ONE_HOUR - 1000 })

    global.fetch = jest.fn().mockResolvedValueOnce(
      makeOkResponse({ usd: { eur: 0.91, gbp: 0.78 } })
    )

    const result = await getRates(BASE)

    expect(result.rates['EUR']).toBe(0.91)
    expect(result.rates['GBP']).toBe(0.78)
    expect(result.stale).toBe(false)
  })

  it('persists fresh rates to localStorage after a successful fetch', async () => {
    seedCache({ ts: Date.now() - ONE_HOUR - 1000 })

    global.fetch = jest.fn().mockResolvedValueOnce(
      makeOkResponse({ usd: { eur: 0.91 } })
    )

    await getRates(BASE)

    const stored = JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}')
    expect(stored.rates['EUR']).toBe(0.91)
    expect(stored.base).toBe(BASE)
    expect(typeof stored.ts).toBe('number')
  })
})

// ---------------------------------------------------------------------------
// Primary URL fails, fallback URL succeeds
// ---------------------------------------------------------------------------

describe('getRates() — fallback URL', () => {
  it('tries the fallback CDN when the primary request fails', async () => {
    // No cache → both URLs attempted
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(makeOkResponse({ usd: { eur: 0.90 } }))

    const result = await getRates(BASE)

    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(result.rates['EUR']).toBe(0.90)
    expect(result.stale).toBe(false)
  })

  it('tries the fallback CDN when the primary returns a non-ok status', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(makeFailResponse())
      .mockResolvedValueOnce(makeOkResponse({ usd: { eur: 0.90 } }))

    const result = await getRates(BASE)

    expect(result.rates['EUR']).toBe(0.90)
  })
})

// ---------------------------------------------------------------------------
// Both URLs fail — stale cache fallback
// ---------------------------------------------------------------------------

describe('getRates() — all sources fail', () => {
  it('returns stale cached rates when all fetch attempts fail', async () => {
    const staleRates = { EUR: 0.88, GBP: 0.75 }
    seedCache({ ts: Date.now() - ONE_HOUR - 1000, rates: staleRates })

    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network error'))

    const result = await getRates(BASE)

    expect(result.stale).toBe(true)
    expect(result.rates['EUR']).toBe(staleRates['EUR'])
  })

  it('returns empty rates with stale=true when no cache and all fetches fail', async () => {
    // localStorage is already clear (beforeEach in setup.ts)
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network error'))

    const result = await getRates(BASE)

    expect(result.stale).toBe(true)
    expect(result.rates).toEqual({})
  })
})

// ---------------------------------------------------------------------------
// Server-side environment (window === undefined)
// ---------------------------------------------------------------------------

describe('getRates() — SSR (window undefined)', () => {
  let originalWindow: (Window & typeof globalThis) | undefined

  beforeEach(() => {
    originalWindow = global.window
    // @ts-expect-error intentionally removing window for SSR simulation
    delete global.window
  })

  afterEach(() => {
    global.window = originalWindow as Window & typeof globalThis
  })

  it('returns empty rates and stale=false when window is undefined', async () => {
    const result = await getRates(BASE)
    expect(result.rates).toEqual({})
    expect(result.stale).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// clearRatesCache()
// ---------------------------------------------------------------------------

describe('clearRatesCache()', () => {
  it('removes the localStorage entry for the given base currency', () => {
    seedCache()
    expect(localStorage.getItem(CACHE_KEY)).not.toBeNull()

    clearRatesCache(BASE)

    expect(localStorage.getItem(CACHE_KEY)).toBeNull()
  })
})

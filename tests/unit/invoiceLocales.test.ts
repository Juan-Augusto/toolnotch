/**
 * invoiceLocales tests.
 *
 * LOCALE_CONFIGS is a plain const object (data/invoiceLocales.ts).
 * Each key maps to { currency, taxLabel, taxRate }.
 *
 * Supported locales: 'uk' | 'canada' | 'australia' | 'us'
 */

import { LOCALE_CONFIGS, type LocaleKey } from '@/data/invoiceLocales'

// ---------------------------------------------------------------------------
// Shape sanity
// ---------------------------------------------------------------------------

describe('LOCALE_CONFIGS structure', () => {
  it('exports an object with exactly the four expected locale keys', () => {
    const keys = Object.keys(LOCALE_CONFIGS)
    expect(keys).toEqual(expect.arrayContaining(['uk', 'canada', 'australia', 'us']))
    expect(keys).toHaveLength(4)
  })

  it('every locale entry has the required fields: currency, taxLabel, taxRate', () => {
    ;(Object.keys(LOCALE_CONFIGS) as LocaleKey[]).forEach(key => {
      const config = LOCALE_CONFIGS[key]
      expect(config).toHaveProperty('currency')
      expect(config).toHaveProperty('taxLabel')
      expect(config).toHaveProperty('taxRate')
    })
  })
})

// ---------------------------------------------------------------------------
// UK
// ---------------------------------------------------------------------------

describe('LOCALE_CONFIGS.uk', () => {
  const config = LOCALE_CONFIGS.uk

  it('uses GBP as the currency', () => {
    expect(config.currency).toBe('GBP')
  })

  it('labels the tax as VAT', () => {
    expect(config.taxLabel).toBe('VAT')
  })

  it('sets the default tax rate to 20%', () => {
    expect(config.taxRate).toBe(20)
  })
})

// ---------------------------------------------------------------------------
// Canada
// ---------------------------------------------------------------------------

describe('LOCALE_CONFIGS.canada', () => {
  const config = LOCALE_CONFIGS.canada

  it('uses CAD as the currency', () => {
    expect(config.currency).toBe('CAD')
  })

  it('labels the tax as GST', () => {
    expect(config.taxLabel).toBe('GST')
  })

  it('sets the default tax rate to 5%', () => {
    expect(config.taxRate).toBe(5)
  })
})

// ---------------------------------------------------------------------------
// Australia
// ---------------------------------------------------------------------------

describe('LOCALE_CONFIGS.australia', () => {
  const config = LOCALE_CONFIGS.australia

  it('uses AUD as the currency', () => {
    expect(config.currency).toBe('AUD')
  })

  it('labels the tax as GST', () => {
    expect(config.taxLabel).toBe('GST')
  })

  it('sets the default tax rate to 10%', () => {
    expect(config.taxRate).toBe(10)
  })
})

// ---------------------------------------------------------------------------
// US
// ---------------------------------------------------------------------------

describe('LOCALE_CONFIGS.us', () => {
  const config = LOCALE_CONFIGS.us

  it('uses USD as the currency', () => {
    expect(config.currency).toBe('USD')
  })

  it('labels the tax as Sales Tax', () => {
    expect(config.taxLabel).toBe('Sales Tax')
  })

  it('sets the default tax rate to 0% (no standard national rate)', () => {
    expect(config.taxRate).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Cross-locale
// ---------------------------------------------------------------------------

describe('LOCALE_CONFIGS cross-locale invariants', () => {
  it('all taxRate values are non-negative numbers', () => {
    ;(Object.keys(LOCALE_CONFIGS) as LocaleKey[]).forEach(key => {
      expect(LOCALE_CONFIGS[key].taxRate).toBeGreaterThanOrEqual(0)
    })
  })

  it('all currency codes are 3-character ISO 4217 strings', () => {
    ;(Object.keys(LOCALE_CONFIGS) as LocaleKey[]).forEach(key => {
      expect(LOCALE_CONFIGS[key].currency).toMatch(/^[A-Z]{3}$/)
    })
  })

  it('all taxLabel values are non-empty strings', () => {
    ;(Object.keys(LOCALE_CONFIGS) as LocaleKey[]).forEach(key => {
      expect(typeof LOCALE_CONFIGS[key].taxLabel).toBe('string')
      expect(LOCALE_CONFIGS[key].taxLabel.length).toBeGreaterThan(0)
    })
  })

  it('Canada and Australia share the same taxLabel (GST) but have different rates', () => {
    expect(LOCALE_CONFIGS.canada.taxLabel).toBe(LOCALE_CONFIGS.australia.taxLabel)
    expect(LOCALE_CONFIGS.canada.taxRate).not.toBe(LOCALE_CONFIGS.australia.taxRate)
  })
})

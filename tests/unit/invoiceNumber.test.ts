/**
 * Invoice number generation tests.
 *
 * Two functions are involved:
 *   - getNextInvoiceNumber(lastNumber: string): string  — in lib/invoiceCalc.ts
 *     Parses a string of the form "PREFIX-NNN" or "PREFIXNNN", increments the
 *     numeric suffix, and pads back to the same digit-width as the input.
 *
 *   - getNextNumber(): string  — in lib/invoiceStorage.ts
 *     Reads the raw numeric string stored under NUMBER_KEY in localStorage,
 *     pads it to 3 digits, prepends "INV-", then delegates to
 *     getNextInvoiceNumber(). Returns "INV-001" when localStorage is empty.
 */

import { getNextInvoiceNumber } from '@/lib/invoiceCalc'
import { getNextNumber, saveToHistory } from '@/lib/invoiceStorage'
import type { InvoiceData } from '@/lib/invoiceTypes'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeInvoice(number: string): InvoiceData {
  return {
    id: `id-${number}`,
    number,
    date: '2026-01-01',
    dueDate: '2026-02-01',
    currency: 'USD',
    status: 'draft',
    from: { name: 'Seller', email: 's@s.com', address: '1 St' },
    to: { name: 'Buyer', email: 'b@b.com', address: '2 Ave' },
    lineItems: [],
    tax: 0,
    discount: 0,
    notes: '',
    terms: '',
  }
}

// ---------------------------------------------------------------------------
// getNextInvoiceNumber — format and increment rules
// ---------------------------------------------------------------------------

describe('getNextInvoiceNumber', () => {
  it('returns INV-002 from INV-001', () => {
    expect(getNextInvoiceNumber('INV-001')).toBe('INV-002')
  })

  it('zero-pads the result to match the digit width of the input', () => {
    // 3-digit input → 3-digit output (with leading zeros where needed)
    expect(getNextInvoiceNumber('INV-009')).toBe('INV-010')
    expect(getNextInvoiceNumber('INV-099')).toBe('INV-100')
  })

  it('does NOT truncate when incrementing past the input digit width', () => {
    // "INV-999" has 3 digits; next is 1000 which is 4 digits — no truncation
    expect(getNextInvoiceNumber('INV-999')).toBe('INV-1000')
  })

  it('increments from a mid-range number', () => {
    expect(getNextInvoiceNumber('INV-042')).toBe('INV-043')
    expect(getNextInvoiceNumber('INV-100')).toBe('INV-101')
  })

  it('works without a hyphen between prefix and digits', () => {
    expect(getNextInvoiceNumber('INV001')).toBe('INV002')
    expect(getNextInvoiceNumber('INV009')).toBe('INV010')
  })

  it('works with a custom alphabetic prefix', () => {
    expect(getNextInvoiceNumber('ACME-005')).toBe('ACME-006')
  })

  it('falls back to "INV-002" when the input does not match the expected pattern', () => {
    expect(getNextInvoiceNumber('not-a-number')).toBe('INV-002')
    expect(getNextInvoiceNumber('')).toBe('INV-002')
    expect(getNextInvoiceNumber('123')).toBe('INV-002') // no alphabetic prefix
  })
})

// ---------------------------------------------------------------------------
// getNextNumber — localStorage-backed sequence
// (localStorage is cleared before each test by tests/setup.ts)
// ---------------------------------------------------------------------------

describe('getNextNumber', () => {
  it('returns "INV-001" when localStorage has no stored number', () => {
    // localStorage is empty (cleared by setup.ts beforeEach)
    expect(getNextNumber()).toBe('INV-001')
  })

  it('returns "INV-002" after one invoice has been saved to history', () => {
    // saveToHistory writes the numeric part of invoice.number to NUMBER_KEY
    saveToHistory(makeInvoice('INV-001'))
    expect(getNextNumber()).toBe('INV-002')
  })

  it('increments correctly through a sequence of saved invoices', () => {
    saveToHistory(makeInvoice('INV-001'))
    expect(getNextNumber()).toBe('INV-002')

    saveToHistory(makeInvoice('INV-002'))
    expect(getNextNumber()).toBe('INV-003')

    saveToHistory(makeInvoice('INV-009'))
    expect(getNextNumber()).toBe('INV-010')
  })

  it('pads the stored number to 3 digits before passing it to getNextInvoiceNumber', () => {
    // If NUMBER_KEY stores "1" it must be treated as "001" → next is "002"
    saveToHistory(makeInvoice('INV-001'))
    // NUMBER_KEY will contain "1" (all non-digit chars stripped from "INV-001")
    expect(getNextNumber()).toBe('INV-002')
  })
})

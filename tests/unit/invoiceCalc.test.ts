import { calculateTotals, formatAmount, getNextInvoiceNumber } from '@/lib/invoiceCalc'
import type { InvoiceData, InvoiceLineItem } from '@/lib/invoiceTypes'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeItem(
  qty: number,
  rate: number,
  overrideAmount?: number
): InvoiceLineItem {
  return {
    id: Math.random().toString(36).slice(2),
    description: 'Test item',
    quantity: qty,
    rate,
    // calculateTotals reads item.amount directly; the UI is responsible for
    // computing amount = quantity * rate before passing data to this function.
    amount: overrideAmount !== undefined ? overrideAmount : qty * rate,
  }
}

function makeInvoice(
  lineItems: InvoiceLineItem[],
  discount: number,
  tax: number
): InvoiceData {
  return {
    id: 'test-id',
    number: 'INV-001',
    date: '2026-01-01',
    dueDate: '2026-02-01',
    currency: 'USD',
    status: 'draft',
    from: { name: 'Acme', email: 'a@acme.com', address: '1 Main St' },
    to: { name: 'Client', email: 'c@client.com', address: '2 Other St' },
    lineItems,
    tax,
    discount,
    notes: '',
    terms: '',
  }
}

// ---------------------------------------------------------------------------
// calculateTotals
// ---------------------------------------------------------------------------

describe('calculateTotals', () => {
  it('applies discount then tax in the correct order', () => {
    // Items: [{qty:2, rate:500}, {qty:1, rate:250}]
    // subtotal = 1000 + 250 = 1250
    // discountAmount = 1250 * 0.10 = 125
    // taxableAmount = 1250 - 125 = 1125
    // taxAmount = 1125 * 0.20 = 225
    // total = 1125 + 225 = 1350
    const invoice = makeInvoice(
      [makeItem(2, 500), makeItem(1, 250)],
      10,
      20
    )

    const totals = calculateTotals(invoice)

    expect(totals.subtotal).toBe(1250)
    expect(totals.discountAmount).toBe(125)
    expect(totals.taxableAmount).toBe(1125)
    expect(totals.taxAmount).toBe(225)
    expect(totals.total).toBe(1350)
  })

  it('returns total === subtotal when discount and tax are both 0', () => {
    const invoice = makeInvoice([makeItem(3, 100), makeItem(2, 50)], 0, 0)

    const totals = calculateTotals(invoice)

    expect(totals.subtotal).toBe(400)
    expect(totals.discountAmount).toBe(0)
    expect(totals.taxableAmount).toBe(400)
    expect(totals.taxAmount).toBe(0)
    expect(totals.total).toBe(400)
    expect(totals.total).toBe(totals.subtotal)
  })

  it('returns taxableAmount=0 and total=0 when discount is 100%', () => {
    const invoice = makeInvoice([makeItem(2, 500), makeItem(1, 250)], 100, 20)

    const totals = calculateTotals(invoice)

    expect(totals.subtotal).toBe(1250)
    expect(totals.discountAmount).toBe(1250)
    expect(totals.taxableAmount).toBe(0)
    expect(totals.taxAmount).toBe(0)
    expect(totals.total).toBe(0)
  })

  it('handles an empty line-items array', () => {
    const invoice = makeInvoice([], 10, 20)

    const totals = calculateTotals(invoice)

    expect(totals.subtotal).toBe(0)
    expect(totals.discountAmount).toBe(0)
    expect(totals.taxableAmount).toBe(0)
    expect(totals.taxAmount).toBe(0)
    expect(totals.total).toBe(0)
  })

  it('handles a single line item with no discount or tax', () => {
    const invoice = makeInvoice([makeItem(1, 999.99)], 0, 0)

    const totals = calculateTotals(invoice)

    expect(totals.subtotal).toBeCloseTo(999.99, 2)
    expect(totals.total).toBeCloseTo(999.99, 2)
  })
})

// ---------------------------------------------------------------------------
// formatAmount
// ---------------------------------------------------------------------------

describe('formatAmount', () => {
  it('formats USD amounts with a dollar sign and two decimal places', () => {
    expect(formatAmount(1350, 'USD')).toBe('$1,350.00')
  })

  it('formats GBP amounts correctly', () => {
    expect(formatAmount(99.5, 'GBP')).toBe('£99.50')
  })

  it('formats zero as the currency zero value', () => {
    expect(formatAmount(0, 'USD')).toBe('$0.00')
  })
})

// ---------------------------------------------------------------------------
// getNextInvoiceNumber
// ---------------------------------------------------------------------------

describe('getNextInvoiceNumber', () => {
  it('increments the numeric part and preserves zero-padding width', () => {
    expect(getNextInvoiceNumber('INV-001')).toBe('INV-002')
    expect(getNextInvoiceNumber('INV-009')).toBe('INV-010')
    expect(getNextInvoiceNumber('INV-099')).toBe('INV-100')
    expect(getNextInvoiceNumber('INV-999')).toBe('INV-1000')
  })

  it('works with a prefix that has no trailing hyphen (e.g. "INV001")', () => {
    // Regex captures prefix as "INV" and digits as "001"
    expect(getNextInvoiceNumber('INV001')).toBe('INV002')
  })

  it('falls back to "INV-002" when the input does not match the pattern', () => {
    expect(getNextInvoiceNumber('not-a-number')).toBe('INV-002')
    expect(getNextInvoiceNumber('')).toBe('INV-002')
  })
})

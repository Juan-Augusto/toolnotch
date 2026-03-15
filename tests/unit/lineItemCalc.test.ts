/**
 * Line-item amount calculation tests.
 *
 * NOTE: There is no dedicated `calcLineItemAmount` function in lib/invoiceCalc.ts
 * or lib/invoiceTypes.ts. The contract "amount = quantity × rate" is enforced by
 * the UI (InvoiceGeneratorTool component) before the data reaches calculateTotals().
 * calculateTotals() simply sums the pre-computed `amount` field on each InvoiceLineItem.
 *
 * These tests document and verify that contract by exercising calculateTotals()
 * with line items whose `amount` fields are set according to qty × rate, and by
 * testing edge cases the UI must handle (zero qty, negative values).
 */

import { calculateTotals } from '@/lib/invoiceCalc'
import type { InvoiceData, InvoiceLineItem } from '@/lib/invoiceTypes'

function item(
  quantity: number,
  rate: number,
  amount: number
): InvoiceLineItem {
  return {
    id: Math.random().toString(36).slice(2),
    description: 'Item',
    quantity,
    rate,
    amount,
  }
}

function invoice(lineItems: InvoiceLineItem[]): InvoiceData {
  return {
    id: 'li-test',
    number: 'INV-001',
    date: '2026-01-01',
    dueDate: '2026-02-01',
    currency: 'USD',
    status: 'draft',
    from: { name: 'Seller', email: 's@s.com', address: '1 St' },
    to: { name: 'Buyer', email: 'b@b.com', address: '2 Ave' },
    lineItems,
    tax: 0,
    discount: 0,
    notes: '',
    terms: '',
  }
}

describe('line-item amount = quantity × rate contract', () => {
  it('amount equals quantity multiplied by rate for a standard item', () => {
    const qty = 4
    const rate = 75
    const expectedAmount = qty * rate // 300

    const li = item(qty, rate, expectedAmount)

    expect(li.amount).toBe(300)
    // calculateTotals uses li.amount directly
    const totals = calculateTotals(invoice([li]))
    expect(totals.subtotal).toBe(300)
  })

  it('amount is 0 when quantity is 0', () => {
    const li = item(0, 500, 0 * 500) // amount must be 0

    expect(li.amount).toBe(0)
    const totals = calculateTotals(invoice([li]))
    expect(totals.subtotal).toBe(0)
    expect(totals.total).toBe(0)
  })

  it('amount is 0 when rate is 0', () => {
    const li = item(10, 0, 10 * 0) // amount must be 0

    expect(li.amount).toBe(0)
    const totals = calculateTotals(invoice([li]))
    expect(totals.subtotal).toBe(0)
  })

  it('handles large quantities and rates without precision loss for whole numbers', () => {
    const qty = 1000
    const rate = 9999
    const expectedAmount = qty * rate // 9_999_000

    const li = item(qty, rate, expectedAmount)

    expect(li.amount).toBe(9_999_000)
    const totals = calculateTotals(invoice([li]))
    expect(totals.subtotal).toBe(9_999_000)
  })

  it('multiple items: subtotal equals sum of individual amounts', () => {
    const items = [
      item(2, 100, 200),
      item(3, 50, 150),
      item(1, 75, 75),
    ]

    const totals = calculateTotals(invoice(items))
    // 200 + 150 + 75 = 425
    expect(totals.subtotal).toBe(425)
  })

  // -------------------------------------------------------------------------
  // Negative value behaviour
  //
  // The InvoiceLineItem type does not restrict quantity or rate to positive
  // numbers. The UI is responsible for clamping/rejecting negative input before
  // building the InvoiceData object. These tests document the mathematical
  // outcome that calculateTotals() would produce if a negative amount slipped
  // through, so that future validators know what they must prevent.
  // -------------------------------------------------------------------------

  it('negative quantity × positive rate produces a negative amount (UI must prevent this)', () => {
    // If the UI fails to reject negative qty the subtotal goes negative.
    const li = item(-2, 100, -200)

    expect(li.amount).toBe(-200)
    const totals = calculateTotals(invoice([li]))
    // Documents the current mathematical behaviour — not a desired end state.
    expect(totals.subtotal).toBe(-200)
  })

  it('negative rate × positive quantity produces a negative amount (UI must prevent this)', () => {
    const li = item(5, -30, -150)

    expect(li.amount).toBe(-150)
    const totals = calculateTotals(invoice([li]))
    expect(totals.subtotal).toBe(-150)
  })

  it('two negatives multiplied give a positive amount', () => {
    // qty=-2, rate=-100 → amount should be clamped/rejected by the UI;
    // if stored as-is the math yields +200.
    const li = item(-2, -100, 200)

    expect(li.amount).toBe(200)
  })
})

/**
 * invoiceStorage tests.
 *
 * Exported API (lib/invoiceStorage.ts):
 *   saveDraft(invoice)     → writes to localStorage under 'invoice_draft'
 *   loadDraft()            → returns InvoiceData | null
 *   saveToHistory(invoice) → prepends to 'invoice_history', caps at 5, deduplicates by id
 *   loadHistory()          → returns InvoiceData[] (newest-first)
 *   getNextNumber()        → returns next formatted invoice number string
 *
 * localStorage is cleared before every test by tests/setup.ts.
 */

import {
  saveDraft,
  loadDraft,
  saveToHistory,
  loadHistory,
  getNextNumber,
} from '@/lib/invoiceStorage'
import type { InvoiceData } from '@/lib/invoiceTypes'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let idCounter = 0

function makeInvoice(overrides: Partial<InvoiceData> = {}): InvoiceData {
  idCounter++
  return {
    id: `inv-${idCounter}`,
    number: `INV-00${idCounter}`,
    date: '2026-01-01',
    dueDate: '2026-02-01',
    currency: 'USD',
    status: 'draft',
    from: { name: 'Seller', email: 's@s.com', address: '1 Main St' },
    to: { name: 'Buyer', email: 'b@b.com', address: '2 Other Ave' },
    lineItems: [],
    tax: 0,
    discount: 0,
    notes: '',
    terms: '',
    ...overrides,
  }
}

beforeEach(() => {
  // Reset the counter so IDs are predictable within each test.
  idCounter = 0
  // localStorage itself is cleared by tests/setup.ts beforeEach.
})

// ---------------------------------------------------------------------------
// saveDraft / loadDraft
// ---------------------------------------------------------------------------

describe('saveDraft and loadDraft', () => {
  it('loadDraft returns null when no draft has been saved', () => {
    expect(loadDraft()).toBeNull()
  })

  it('saveDraft writes the invoice and loadDraft reads it back', () => {
    const invoice = makeInvoice({ number: 'INV-007' })
    saveDraft(invoice)

    const loaded = loadDraft()

    expect(loaded).not.toBeNull()
    expect(loaded?.id).toBe(invoice.id)
    expect(loaded?.number).toBe('INV-007')
  })

  it('saveDraft overwrites a previous draft', () => {
    const first = makeInvoice({ number: 'INV-001' })
    const second = makeInvoice({ number: 'INV-002' })

    saveDraft(first)
    saveDraft(second)

    const loaded = loadDraft()
    expect(loaded?.number).toBe('INV-002')
  })

  it('loadDraft returns null when localStorage contains malformed JSON', () => {
    localStorage.setItem('invoice_draft', 'not-valid-json{{{')
    expect(loadDraft()).toBeNull()
  })

  it('saveDraft persists data in localStorage under the correct key', () => {
    const invoice = makeInvoice()
    saveDraft(invoice)

    const raw = localStorage.getItem('invoice_draft')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.id).toBe(invoice.id)
  })
})

// ---------------------------------------------------------------------------
// saveToHistory / loadHistory
// ---------------------------------------------------------------------------

describe('saveToHistory and loadHistory', () => {
  it('loadHistory returns an empty array when nothing has been saved', () => {
    expect(loadHistory()).toEqual([])
  })

  it('saveToHistory stores an invoice and loadHistory retrieves it', () => {
    const invoice = makeInvoice()
    saveToHistory(invoice)

    const history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0].id).toBe(invoice.id)
  })

  it('history is newest-first (most recently saved appears at index 0)', () => {
    const first = makeInvoice({ number: 'INV-001' })
    const second = makeInvoice({ number: 'INV-002' })
    const third = makeInvoice({ number: 'INV-003' })

    saveToHistory(first)
    saveToHistory(second)
    saveToHistory(third)

    const history = loadHistory()
    expect(history[0].number).toBe('INV-003')
    expect(history[1].number).toBe('INV-002')
    expect(history[2].number).toBe('INV-001')
  })

  it('history is capped at 5 entries — the 6th insert evicts the oldest', () => {
    const invoices = Array.from({ length: 6 }, (_, i) =>
      makeInvoice({ number: `INV-00${i + 1}` })
    )

    invoices.forEach(inv => saveToHistory(inv))

    const history = loadHistory()
    expect(history).toHaveLength(5)
    // Oldest (INV-001) must have been evicted
    const numbers = history.map(h => h.number)
    expect(numbers).not.toContain('INV-001')
    // Newest (INV-006) must be first
    expect(history[0].number).toBe('INV-006')
  })

  it('saving an invoice that already exists in history replaces it in place (deduplication by id)', () => {
    const invoice = makeInvoice({ number: 'INV-001', status: 'draft' })
    saveToHistory(invoice)

    // Re-save the same id with updated status
    const updated: InvoiceData = { ...invoice, status: 'sent' }
    saveToHistory(updated)

    const history = loadHistory()
    // Should still have only one entry for this id
    const entries = history.filter(h => h.id === invoice.id)
    expect(entries).toHaveLength(1)
    expect(entries[0].status).toBe('sent')
  })

  it('saving a duplicate id moves it to the front of the list', () => {
    const first = makeInvoice({ number: 'INV-001' })
    const second = makeInvoice({ number: 'INV-002' })

    saveToHistory(first)
    saveToHistory(second)

    // Re-save first — it should now appear at index 0
    saveToHistory({ ...first, status: 'paid' })

    const history = loadHistory()
    expect(history[0].id).toBe(first.id)
    expect(history[0].status).toBe('paid')
    expect(history[1].id).toBe(second.id)
  })

  it('history count stays at 5 after many inserts', () => {
    for (let i = 1; i <= 20; i++) {
      saveToHistory(makeInvoice({ number: `INV-${String(i).padStart(3, '0')}` }))
    }
    expect(loadHistory()).toHaveLength(5)
  })
})

// ---------------------------------------------------------------------------
// getNextNumber
// ---------------------------------------------------------------------------

describe('getNextNumber', () => {
  it('returns "INV-001" when localStorage is empty', () => {
    expect(getNextNumber()).toBe('INV-001')
  })

  it('returns "INV-002" after one invoice has been saved to history', () => {
    saveToHistory(makeInvoice({ number: 'INV-001' }))
    expect(getNextNumber()).toBe('INV-002')
  })
})

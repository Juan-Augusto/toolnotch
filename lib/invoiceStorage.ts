'use client'
import { InvoiceData } from './invoiceTypes'
import { getNextInvoiceNumber } from './invoiceCalc'

const DRAFT_KEY = 'invoice_draft'
const HISTORY_KEY = 'invoice_history'
const NUMBER_KEY = 'invoice_last_number'
const MAX_HISTORY = 5

function isBrowser() {
  return typeof window !== 'undefined'
}

export function saveDraft(invoice: InvoiceData): void {
  if (!isBrowser()) return
  localStorage.setItem(DRAFT_KEY, JSON.stringify(invoice))
}

export function loadDraft(): InvoiceData | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveToHistory(invoice: InvoiceData): void {
  if (!isBrowser()) return
  const history = loadHistory()
  const updated = [invoice, ...history.filter(h => h.id !== invoice.id)].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  localStorage.setItem(NUMBER_KEY, invoice.number.replace(/\D/g, '') || '1')
}

export function loadHistory(): InvoiceData[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function getNextNumber(): string {
  if (!isBrowser()) return 'INV-001'
  const last = localStorage.getItem(NUMBER_KEY)
  if (!last) return 'INV-001'
  return getNextInvoiceNumber(`INV-${last.padStart(3, '0')}`)
}

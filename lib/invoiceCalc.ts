import { InvoiceData, InvoiceTotals } from './invoiceTypes'

export function calculateTotals(invoice: InvoiceData): InvoiceTotals {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0)
  const discountAmount = subtotal * (invoice.discount / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (invoice.tax / 100)
  const total = taxableAmount + taxAmount
  return { subtotal, discountAmount, taxableAmount, taxAmount, total }
}

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getNextInvoiceNumber(lastNumber: string): string {
  const match = lastNumber.match(/^([A-Z]+-?)(\d+)$/)
  if (match) {
    const prefix = match[1]
    const num = parseInt(match[2]) + 1
    const padded = String(num).padStart(match[2].length, '0')
    return `${prefix}${padded}`
  }
  return 'INV-002'
}

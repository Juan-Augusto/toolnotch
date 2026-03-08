export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface InvoiceData {
  id: string
  number: string
  date: string
  dueDate: string
  currency: string
  status: 'draft' | 'sent' | 'paid'
  from: {
    name: string
    email: string
    address: string
    phone?: string
    taxId?: string
  }
  to: {
    name: string
    email: string
    address: string
    company?: string
  }
  lineItems: InvoiceLineItem[]
  tax: number
  discount: number
  notes: string
  terms: string
  logo?: string
}

export interface InvoiceTotals {
  subtotal: number
  discountAmount: number
  taxableAmount: number
  taxAmount: number
  total: number
}

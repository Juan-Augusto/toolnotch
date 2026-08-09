'use client'
import { useState, useEffect, useCallback } from 'react'
import { InvoiceData, InvoiceTotals } from '@/lib/invoiceTypes'
import { calculateTotals, formatAmount } from '@/lib/invoiceCalc'
import { saveDraft, loadDraft, getNextNumber } from '@/lib/invoiceStorage'
import { INVOICE_CURRENCIES } from '@/data/invoiceCurrencies'
import { LOCALE_CONFIGS, LocaleKey } from '@/data/invoiceLocales'
import Button from '@/components/Button'

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function createEmpty(locale?: LocaleKey): InvoiceData {
  const localeConfig = locale ? LOCALE_CONFIGS[locale] : LOCALE_CONFIGS.us
  return {
    id: generateId(),
    number: 'INV-001',
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    currency: localeConfig.currency,
    status: 'draft',
    from: { name: '', email: '', address: '' },
    to: { name: '', email: '', address: '' },
    lineItems: [{ id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 }],
    tax: localeConfig.taxRate,
    discount: 0,
    notes: '',
    terms: 'Payment due within 30 days.',
    logo: undefined,
  }
}

interface InvoiceBuilderProps {
  locale?: LocaleKey
}

export default function InvoiceBuilder({ locale }: InvoiceBuilderProps) {
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    const draft = loadDraft()
    return draft && !locale ? draft : createEmpty(locale)
  })
  const [totals, setTotals] = useState<InvoiceTotals>(() => calculateTotals(createEmpty(locale)))

  useEffect(() => { setTotals(calculateTotals(invoice)) }, [invoice])

  const update = useCallback(<K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    setInvoice(inv => {
      const next = { ...inv, [field]: value }
      saveDraft(next)
      return next
    })
  }, [])

  const updateLineItem = (id: string, field: string, value: string | number) => {
    setInvoice(inv => {
      const lineItems = inv.lineItems.map(item => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        updated.amount = updated.quantity * updated.rate
        return updated
      })
      const next = { ...inv, lineItems }
      saveDraft(next)
      return next
    })
  }

  const addLineItem = () => {
    update('lineItems', [...invoice.lineItems, { id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 }])
  }

  const removeLineItem = (id: string) => {
    if (invoice.lineItems.length <= 1) return
    update('lineItems', invoice.lineItems.filter(item => item.id !== id))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('logo', reader.result as string)
    reader.readAsDataURL(file)
  }

  const handlePrint = () => {
    window.print()
  }

  const fmt = (amount: number) => formatAmount(amount, invoice.currency)
  const taxLabel = locale ? LOCALE_CONFIGS[locale].taxLabel : 'Tax'

  return (
    <>
      <style>{`@media print { body > * { display: none !important; } .invoice-preview { display: block !important; position: absolute; top: 0; left: 0; width: 100%; } }`}</style>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Panel */}
        <div className="space-y-5 no-print">
          {/* From */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-2">From</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input placeholder="Your Name / Company" value={invoice.from.name} onChange={e => update('from', { ...invoice.from, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-500 cursor-pointer hover:bg-gray-50">Logo</label>
              </div>
              <input placeholder="Email" type="email" value={invoice.from.email} onChange={e => update('from', { ...invoice.from, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Address" rows={2} value={invoice.from.address} onChange={e => update('from', { ...invoice.from, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </section>

          {/* To */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-2">Bill To</h3>
            <div className="space-y-2">
              <input placeholder="Client Name" value={invoice.to.name} onChange={e => update('to', { ...invoice.to, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input placeholder="Client Email" type="email" value={invoice.to.email} onChange={e => update('to', { ...invoice.to, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Client Address" rows={2} value={invoice.to.address} onChange={e => update('to', { ...invoice.to, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </section>

          {/* Meta */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-2">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-0.5 block">Invoice #</label>
                <input value={invoice.number} onChange={e => update('number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-0.5 block">Currency</label>
                <select value={invoice.currency} onChange={e => update('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:bg-card dark:border-gray-600 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {INVOICE_CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-0.5 block">Date</label>
                <input type="date" value={invoice.date} onChange={e => update('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-0.5 block">Due Date</label>
                <input type="date" value={invoice.dueDate} onChange={e => update('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* Line Items */}
          <section>
            <h3 className="font-semibold text-gray-700 mb-2">Line Items</h3>
            <div className="space-y-2">
              {invoice.lineItems.map(item => (
                <div key={item.id} className="flex gap-1.5 items-start">
                  <input placeholder="Description" value={item.description} onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="number" min={0} step={1} value={item.quantity} onChange={e => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="number" min={0} step={0.01} value={item.rate} onChange={e => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <div className="w-20 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-right text-gray-600">{fmt(item.amount)}</div>
                  <button onClick={() => removeLineItem(item.id)} className="text-red-400 hover:text-red-600 px-1">×</button>
                </div>
              ))}
              <button onClick={addLineItem} className="text-sm text-blue-600 hover:underline">+ Add item</button>
            </div>
          </section>

          {/* Totals */}
          <section>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-0.5 block">Discount %</label>
                <input type="number" min={0} max={100} step={0.5} value={invoice.discount} onChange={e => update('discount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-0.5 block">{taxLabel} %</label>
                <input type="number" min={0} max={100} step={0.5} value={invoice.tax} onChange={e => update('tax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <textarea placeholder="Notes (optional)" rows={2} value={invoice.notes} onChange={e => update('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <textarea placeholder="Payment terms" rows={2} value={invoice.terms} onChange={e => update('terms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mt-2" />
          </section>

          <Button onClick={handlePrint}>Download / Print PDF</Button>
        </div>

        {/* Preview */}
        <div>
          <div className="invoice-preview bg-card border border-gray-200 rounded-xl p-8 text-sm shadow-sm">
            {invoice.logo && <img src={invoice.logo} alt="Logo" className="h-16 mb-4 object-contain" />}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="font-bold text-xl text-gray-900">INVOICE</div>
                <div className="text-gray-500 text-xs mt-1">#{invoice.number}</div>
              </div>
              <div className="text-right text-xs text-gray-600 space-y-0.5">
                <div>Date: {invoice.date}</div>
                <div>Due: {invoice.dueDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div>
                <div className="font-semibold text-gray-500 mb-1 uppercase tracking-wide">From</div>
                <div className="font-medium text-gray-900">{invoice.from.name || 'Your Name'}</div>
                <div className="text-gray-600">{invoice.from.email}</div>
                <div className="text-gray-600 whitespace-pre-wrap">{invoice.from.address}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-500 mb-1 uppercase tracking-wide">Bill To</div>
                <div className="font-medium text-gray-900">{invoice.to.name || 'Client Name'}</div>
                <div className="text-gray-600">{invoice.to.email}</div>
                <div className="text-gray-600 whitespace-pre-wrap">{invoice.to.address}</div>
              </div>
            </div>

            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2 w-12">Qty</th>
                  <th className="text-right py-2 w-20">Rate</th>
                  <th className="text-right py-2 w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">{item.description || '—'}</td>
                    <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-600">{fmt(item.rate)}</td>
                    <td className="py-2 text-right font-medium">{fmt(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto w-48 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{fmt(totals.subtotal)}</span></div>
              {totals.discountAmount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-red-500">-{fmt(totals.discountAmount)}</span></div>}
              {totals.taxAmount > 0 && <div className="flex justify-between"><span className="text-gray-500">{taxLabel}</span><span>{fmt(totals.taxAmount)}</span></div>}
              <div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-1"><span>Total</span><span>{fmt(totals.total)}</span></div>
            </div>

            {invoice.notes && <div className="mt-6 text-xs text-gray-600"><span className="font-medium">Notes: </span>{invoice.notes}</div>}
            {invoice.terms && <div className="mt-2 text-xs text-gray-500">{invoice.terms}</div>}
          </div>
        </div>
      </div>
    </>
  )
}

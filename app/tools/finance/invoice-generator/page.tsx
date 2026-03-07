import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Invoice Generator — Create & Download PDF Invoices',
  description: 'Create professional invoices for free. Add line items, tax, logo, and download as PDF. Supports 30+ currencies. No sign-up.',
}

export default function InvoiceGeneratorPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Generator</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}

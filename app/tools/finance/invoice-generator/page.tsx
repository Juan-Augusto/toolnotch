import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import InvoiceBuilder from './InvoiceBuilder'

export const metadata: Metadata = {
  title: 'Free Invoice Generator — Create & Download PDF Invoices | ToolNotch',
  description: 'Create professional invoices for free. Add line items, tax, logo, and download as PDF. Supports 30+ currencies. No sign-up required. Data stays in your browser.',
}

const faqs = [
  { question: 'Is my invoice data stored on your servers?', answer: 'No. Everything is 100% client-side. Your invoice data is stored only in your browser\'s localStorage and never sent to any server.' },
  { question: 'How do I download the invoice as a PDF?', answer: 'Click "Download / Print PDF" to open the print dialog. Choose "Save as PDF" in the destination dropdown to save it as a PDF file.' },
  { question: 'Can I add my logo?', answer: 'Yes — click the "Logo" button in the From section to upload an image. It will appear at the top of the invoice preview.' },
  { question: 'How do I change the currency?', answer: 'Select your currency from the dropdown in the Invoice Details section. The invoice preview updates instantly.' },
  { question: 'Are my invoices saved automatically?', answer: 'Yes — your current invoice draft is automatically saved to your browser\'s localStorage as you type. It will be there when you return.' },
  { question: 'How do I number my invoices?', answer: 'Edit the Invoice # field directly. Use any format you like — INV-001, 2024-001, or any custom system that works for you.' },
  { question: 'What currencies are supported?', answer: 'Over 30 currencies are supported, including USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, and more.' },
  { question: 'Can I use this for VAT invoices?', answer: 'Yes — use the Tax % field for VAT. For UK-specific invoices with VAT pre-configured, try our Invoice Generator UK tool.' },
]

export default function InvoiceGeneratorPage() {
  return (
    <ToolWrapper
      title="Free Invoice Generator"
      description="Create professional invoices instantly. No sign-up. No watermarks. Data stays in your browser."
      breadcrumbLabel="Invoice Generator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <InvoiceBuilder />
    </ToolWrapper>
  )
}

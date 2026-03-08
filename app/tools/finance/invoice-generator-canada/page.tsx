import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import InvoiceBuilder from '../invoice-generator/InvoiceBuilder'

export const metadata: Metadata = {
  title: 'Canadian Invoice Generator — Free GST Invoice Template | ToolNotch',
  description: 'Free Canadian invoice generator with GST pre-configured at 5%. Create professional CAD invoices. Download as PDF. No sign-up required.',
}

const faqs = [
  { question: 'Is GST pre-configured?', answer: 'Yes — the Canadian template pre-sets 5% GST and CAD currency.' },
  { question: 'Should I charge HST or GST?', answer: 'It depends on your province. Ontario, New Brunswick, and others use HST. Alberta and BC use separate GST/PST. Adjust the tax rate accordingly.' },
  { question: 'Do I need a GST/HST registration number?', answer: 'If your annual revenues exceed $30,000 CAD, you must register for GST/HST. Add your number in the Tax ID field.' },
]

export default function InvoiceGeneratorCanadaPage() {
  return (
    <ToolWrapper
      title="Canadian Invoice Generator"
      description="Free Canadian invoice generator with GST pre-configured. CAD currency, 5% GST. Download as PDF."
      breadcrumbLabel="Canadian Invoice Generator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <InvoiceBuilder locale="canada" />
    </ToolWrapper>
  )
}

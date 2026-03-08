import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import InvoiceBuilder from '../invoice-generator/InvoiceBuilder'

export const metadata: Metadata = {
  title: 'Australian Invoice Generator — Free GST Invoice Template | ToolNotch',
  description: 'Free Australian invoice generator with GST pre-configured at 10%. Create professional AUD invoices. Download as PDF. No sign-up required.',
}

const faqs = [
  { question: 'Is GST pre-configured for Australia?', answer: 'Yes — the Australian template pre-sets 10% GST and AUD currency.' },
  { question: 'Who needs to register for GST in Australia?', answer: 'Businesses with annual turnover of $75,000 AUD or more (or $150,000 for non-profit organizations) must register for GST.' },
  { question: 'What should an Australian tax invoice include?', answer: 'ATO-compliant invoices should include: the words "Tax Invoice", your ABN, date, description of goods/services, price, and GST amount.' },
]

export default function InvoiceGeneratorAustraliaPage() {
  return (
    <ToolWrapper
      title="Australian Invoice Generator"
      description="Free Australian invoice generator with GST pre-configured. AUD currency, 10% GST. Download as PDF."
      breadcrumbLabel="Australian Invoice Generator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <InvoiceBuilder locale="australia" />
    </ToolWrapper>
  )
}

import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import InvoiceBuilder from '../invoice-generator/InvoiceBuilder'

export const metadata: Metadata = {
  title: 'Invoice Generator for Freelancers — Free Professional Invoice | ToolNotch',
  description: 'Free invoice generator designed for freelancers. Create professional invoices, download as PDF, track payments. No watermarks, no subscriptions.',
}

const faqs = [
  { question: 'Is this free for freelancers?', answer: 'Yes — completely free. No subscription, no watermark, no account required.' },
  { question: 'How do I track which invoices have been paid?', answer: 'Use the Status field (draft/sent/paid) on each invoice. Your browser saves your draft automatically.' },
  { question: 'What should I include on a freelance invoice?', answer: 'Include your name, client name, invoice number, date, due date, detailed line items, payment terms, and preferred payment method.' },
  { question: 'How do I get paid faster?', answer: 'Include your payment terms clearly, offer multiple payment options, and follow up politely if payment is overdue. Net 14 terms often result in faster payment than Net 30.' },
]

export default function InvoiceGeneratorForFreelancersPage() {
  return (
    <ToolWrapper
      title="Invoice Generator for Freelancers"
      description="Create professional freelance invoices for free. No watermarks, no subscriptions. Download as PDF instantly."
      breadcrumbLabel="Freelancer Invoice Generator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <InvoiceBuilder />
    </ToolWrapper>
  )
}

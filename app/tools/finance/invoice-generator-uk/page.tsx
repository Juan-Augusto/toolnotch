import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import InvoiceBuilder from '../invoice-generator/InvoiceBuilder'

export const metadata: Metadata = {
  title: 'UK Invoice Generator — Free VAT Invoice Template | ToolNotch',
  description: 'Free UK invoice generator with VAT pre-configured at 20%. Create professional GBP invoices with VAT. Download as PDF. No sign-up required.',
}

const faqs = [
  { question: 'Is VAT pre-configured for UK invoices?', answer: 'Yes — the UK template pre-sets 20% VAT and GBP currency automatically.' },
  { question: 'Do I need a VAT number on my invoice?', answer: 'If you are VAT-registered, yes. Add your VAT registration number in the "Tax ID" field in the From section.' },
  { question: 'Is this suitable for Making Tax Digital (MTD)?', answer: 'This tool generates PDF invoices only. For full MTD compliance, you\'ll need compatible accounting software.' },
  { question: 'Can I change the VAT rate?', answer: 'Yes — edit the Tax % field. The standard UK VAT rate is 20%, but reduced rates (5%, 0%) apply to some goods and services.' },
]

export default function InvoiceGeneratorUkPage() {
  return (
    <ToolWrapper
      title="UK Invoice Generator"
      description="Free UK invoice generator with VAT pre-configured. GBP currency, 20% VAT. Download as PDF."
      breadcrumbLabel="UK Invoice Generator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <InvoiceBuilder locale="uk" />
    </ToolWrapper>
  )
}

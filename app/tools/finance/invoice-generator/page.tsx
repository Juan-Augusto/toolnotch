import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import InvoiceBuilder from './InvoiceBuilder'
import { buildJsonLd, webAppSchema, faqSchema, howToSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Free Invoice Generator — Create & Download PDF Invoices | ToolNotch',
  description: 'Create professional invoices for free. Add line items, tax, logo, and download as PDF. Supports 30+ currencies. No sign-up required. Data stays in your browser.',
  alternates: { canonical: '/tools/finance/invoice-generator' },
  openGraph: { title: 'Free Invoice Generator — No Signup, No Watermark | ToolNotch', url: '/tools/finance/invoice-generator' },
}

const faqs = [
  { question: 'Is my invoice data stored on your servers?', answer: 'No. Everything is 100% client-side. Your invoice data is stored only in your browser\'s localStorage and never sent to any server.' },
  { question: 'How do I download the invoice as a PDF?', answer: 'Click "Download / Print PDF" to open the print dialog. Choose "Save as PDF" in the destination dropdown to save it as a PDF file.' },
  { question: 'Can I add my logo?', answer: 'Yes — click the "Logo" button in the From section to upload an image. It will appear at the top of the invoice preview.' },
  { question: 'How do I change the currency?', answer: 'Select your currency from the dropdown in the Invoice Details section. The invoice preview updates instantly.' },
  { question: 'Are my invoices saved automatically?', answer: 'Yes — your current invoice draft is automatically saved to your browser\'s localStorage as you type. It will be there when you return.' },
  { question: 'What currencies are supported?', answer: 'Over 30 currencies including USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, and more.' },
  { question: 'Can I use this for VAT invoices?', answer: 'Yes — use the Tax % field for VAT. For UK-specific invoices with VAT pre-configured, try our Invoice Generator UK tool.' },
  { question: 'Is there a watermark on the invoice?', answer: 'No watermark, ever. This is a completely free tool with no hidden fees, no signup, and no watermarks on your invoices.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Free Invoice Generator', '/tools/finance/invoice-generator', 'Create professional invoices for free. Add line items, tax, logo, and download as PDF. 30+ currencies. No sign-up, no watermark.', 'BusinessApplication'),
  faqSchema(faqs),
  howToSchema('How to create a free invoice', [
    'Enter your business name and contact details in the "From" section.',
    'Fill in your client\'s name and address in the "Bill To" section.',
    'Add your line items with description, quantity, and rate. The amount calculates automatically.',
    'Set the tax rate, invoice date, and due date.',
    'Click "Download / Print PDF" and choose "Save as PDF" to download your invoice.',
  ]),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Finance Tools', url: '/tools/finance' }, { name: 'Invoice Generator', url: '/tools/finance/invoice-generator' }]),
)

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Free Invoice Generator"
        description="Create professional invoices instantly. No sign-up. No watermarks. Data stays in your browser."
        breadcrumbLabel="Invoice Generator"
        faqs={faqs}
        adSlot="1234567890"
      >
        <InvoiceBuilder />
      </ToolWrapper>
    </>
  )
}

import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import InvoiceBuilder from '../invoice-generator/InvoiceBuilder'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Free Receipt Generator — Create & Download PDF Receipts | ToolNotch',
  description: 'Generate professional receipts for free. Add items, tax, and download as PDF. No signup required. Data stays in your browser.',
  alternates: { canonical: '/tools/finance/receipt-generator' },
  openGraph: { title: 'Free Receipt Generator — No Signup | ToolNotch', url: '/tools/finance/receipt-generator' },
}

const faqs = [
  { question: 'What is the difference between a receipt and an invoice?', answer: 'An invoice is sent before payment as a request for payment. A receipt is issued after payment as proof that payment was received.' },
  { question: 'Is my receipt data stored on your servers?', answer: 'No. All receipt data is stored only in your browser\'s localStorage. Nothing is sent to any server.' },
  { question: 'How do I download the receipt as a PDF?', answer: 'Click "Download / Print PDF" and choose "Save as PDF" in your browser\'s print dialog.' },
  { question: 'Can I add my business logo?', answer: 'Yes — click the Logo button to upload your business logo. It appears at the top of the receipt.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Receipt Generator', '/tools/finance/receipt-generator', 'Generate professional receipts for free. Add items, tax, and download as PDF. No signup required.', 'BusinessApplication'),
  faqSchema(faqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Finance Tools', url: '/tools/finance' }, { name: 'Receipt Generator', url: '/tools/finance/receipt-generator' }]),
)

export default function ReceiptGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Free Receipt Generator"
        description="Create professional receipts instantly. Download as PDF. No signup, no watermarks."
        breadcrumbLabel="Receipt Generator"
        faqs={faqs}
        adSlot="1234567890"
      >
        <InvoiceBuilder />
      </ToolWrapper>
    </>
  )
}

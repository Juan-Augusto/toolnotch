import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  return {
    title: 'Free Finance Tools — Loan Calculator, Invoice Generator & More | ToolNotch',
    description: 'Free online finance tools: loan calculator, mortgage calculator, invoice generator, and more. No signup required. Calculate payments and create invoices instantly.',
    alternates: buildAlternates('/tools/finance'),
  }
}

const CALCULATORS = [
  { href: '/tools/finance/loan-calculator', label: 'Loan Calculator', desc: 'Monthly payment & full amortization schedule for any loan.' },
  { href: '/tools/finance/mortgage-calculator', label: 'Mortgage Calculator', desc: 'Calculate your mortgage payment, total interest, and payoff timeline.' },
  { href: '/tools/finance/car-loan-calculator', label: 'Car Loan Calculator', desc: 'Calculate auto loan monthly payments and total cost.' },
  { href: '/tools/finance/personal-loan-calculator', label: 'Personal Loan Calculator', desc: 'Personal loan payments and debt consolidation calculator.' },
  { href: '/tools/finance/amortization-calculator', label: 'Amortization Calculator', desc: 'Full payment schedule showing principal, interest, and balance.' },
  { href: '/tools/finance/home-affordability-calculator', label: 'Home Affordability', desc: 'How much house can you afford? Uses the 28/36 rule.' },
  { href: '/tools/finance/30-year-mortgage-calculator', label: '30-Year Mortgage', desc: 'Calculate your 30-year fixed-rate mortgage payment.' },
  { href: '/tools/finance/15-year-mortgage-calculator', label: '15-Year Mortgage', desc: 'Compare 15-year vs 30-year mortgage payments.' },
  { href: '/tools/finance/refinance-calculator', label: 'Refinance Calculator', desc: 'Calculate if refinancing makes sense and your break-even point.' },
  { href: '/tools/finance/student-loan-calculator', label: 'Student Loan Calculator', desc: 'Student loan repayment calculator and payoff timeline.' },
  { href: '/tools/finance/debt-payoff-calculator', label: 'Debt Payoff Calculator', desc: 'Calculate how long to pay off debt and total interest paid.' },
  { href: '/tools/finance/fha-loan-calculator', label: 'FHA Loan Calculator', desc: 'FHA loan payments including MIP mortgage insurance.' },
  { href: '/tools/finance/va-loan-calculator', label: 'VA Loan Calculator', desc: 'VA loan payments for eligible veterans and military.' },
]

const INVOICES = [
  { href: '/tools/finance/invoice-generator', label: 'Invoice Generator', desc: 'Free professional invoices — no watermark, no signup. Download as PDF.' },
  { href: '/tools/finance/invoice-generator-uk', label: 'UK Invoice Generator', desc: 'GBP invoices with VAT pre-configured at 20%.' },
  { href: '/tools/finance/invoice-generator-canada', label: 'Canadian Invoice Generator', desc: 'CAD invoices with GST pre-configured at 5%.' },
  { href: '/tools/finance/invoice-generator-australia', label: 'Australian Invoice Generator', desc: 'AUD invoices with GST pre-configured at 10%.' },
  { href: '/tools/finance/invoice-generator-for-freelancers', label: 'Freelancer Invoice', desc: 'Invoice template designed for freelancers and self-employed.' },
]

export default async function FinanceToolsHubPage({ params }: Props) {
  // locale is available via params if needed for dynamic content
  await params
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Free Finance Tools</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Loan calculators, mortgage calculators, and invoice generators. All free, no signup required.
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Loan & Mortgage Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {CALCULATORS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-green-600 mb-1 text-sm">{tool.label}</h2>
              <p className="text-xs text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Generator</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INVOICES.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-green-600 mb-1 text-sm">{tool.label}</h2>
              <p className="text-xs text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

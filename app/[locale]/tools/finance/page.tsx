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

        {/* Intro section */}
        <div className="bg-card rounded-2xl border border-gray-200 p-8 mb-10 space-y-4 text-gray-700 leading-relaxed">
          <p>
            Financial calculators are essential tools for anyone facing a major money decision. Whether you are a
            homebuyer trying to figure out how much house you can afford, a car shopper comparing loan offers, a
            student planning to repay debt after graduation, or a small business owner deciding whether to finance
            new equipment, a good calculator turns confusing numbers into a clear monthly payment and a realistic
            total cost. These tools put the same math that banks use directly in your hands — for free.
          </p>
          <p>
            Using a calculator before you commit to a loan can save you thousands of dollars and prevent
            unpleasant surprises. A difference of even one percentage point in interest rate, or an extra two
            years on a loan term, can add up to hundreds or thousands of dollars in additional interest. Running
            the numbers first lets you compare scenarios side-by-side, negotiate from an informed position, and
            choose the option that fits your budget rather than the one a lender happens to offer first.
          </p>
          <p>
            ToolNotch offers a full suite of free finance calculators. The loan and mortgage calculators cover
            standard personal loans, auto loans, home mortgages, FHA and VA government-backed loans, refinancing,
            student loans, and debt payoff planning. The invoice tools are built for freelancers and small
            businesses that need professional, print-ready invoices without paying for accounting software — with
            variants pre-configured for US, UK, Canadian, and Australian tax rates.
          </p>
          <p>
            To get the most accurate results from any loan calculator, gather a few key numbers before you start:
            your estimated credit score (which strongly influences your interest rate), the loan amount or home
            price you have in mind, the down payment you plan to make, and the loan term in years or months. For
            mortgages, also note whether you will need to pay PMI (required when your down payment is below 20%).
            Having these details ready lets the calculator give you a payment estimate that closely matches what a
            real lender will quote you.
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Loan & Mortgage Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {CALCULATORS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-card rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-green-600 mb-1 text-sm">{tool.label}</h2>
              <p className="text-xs text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Generator</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {INVOICES.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-card rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-green-600 mb-1 text-sm">{tool.label}</h2>
              <p className="text-xs text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        {/* Understanding Loan Terminology */}
        <div className="bg-card rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Loan Terminology</h2>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Principal</h3>
              <p>
                The principal is the original amount of money you borrow, before any interest is added. For a
                car loan it is the vehicle price minus your down payment; for a mortgage it is the home price
                minus your down payment. All interest charges are calculated as a percentage of the outstanding
                principal balance, so a larger principal means you pay more interest even if the rate stays the
                same.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Interest Rate vs. APR</h3>
              <p>
                The interest rate is the annual cost of borrowing the principal, expressed as a percentage. The
                Annual Percentage Rate (APR) is a broader measure that includes the interest rate plus most
                lender fees and closing costs, spread over the loan term. APR gives you a more complete picture
                of the true cost of a loan, which is why it is the number you should compare when shopping
                between lenders.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Loan Term</h3>
              <p>
                The loan term is the length of time you have to repay the loan, usually expressed in months or
                years. A longer term spreads payments out, reducing your monthly obligation but significantly
                increasing the total interest you pay. A shorter term means higher monthly payments but far less
                interest overall. For example, a 15-year mortgage typically costs tens of thousands of dollars
                less in total interest than a 30-year mortgage at the same rate.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Amortization</h3>
              <p>
                Amortization is how a fixed monthly payment is split between interest and principal over the
                life of a loan. In the early months, the vast majority of each payment goes toward interest
                because the outstanding balance is high. As you make payments and reduce the balance, the
                interest portion shrinks and the principal portion grows. By the final payments, almost all of
                your money goes to principal. An amortization schedule is a table showing this breakdown for
                every single payment.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Down Payment</h3>
              <p>
                A down payment is the upfront cash you pay toward a purchase, reducing the amount you need to
                finance. A larger down payment lowers your principal, which reduces both your monthly payment
                and the total interest you will pay over the life of the loan. For home loans, putting down 20%
                or more also lets you avoid Private Mortgage Insurance (PMI), an extra monthly cost that
                protects the lender — not you — if you default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

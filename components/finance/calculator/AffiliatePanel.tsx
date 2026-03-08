'use client'

interface AffiliatePanelProps {
  loanType: string
}

export default function AffiliatePanel({ loanType }: AffiliatePanelProps) {
  const isMortgage = loanType === 'mortgage' || loanType === 'affordability'
  const isCar = loanType === 'car'

  return (
    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-xs text-amber-700 font-semibold mb-2">Compare Current Rates</p>
      <p className="text-xs text-amber-600 mb-3">
        Rates shown are for illustration. Compare real offers from lenders to find your best rate.
      </p>
      <div className="flex flex-wrap gap-2">
        {isMortgage && (
          <>
            <a
              href="https://www.lendingtree.com/home/mortgage/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
            >
              Compare mortgage rates at LendingTree →
            </a>
            <a
              href="https://www.bankrate.com/mortgages/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
            >
              Compare rates at Bankrate →
            </a>
          </>
        )}
        {isCar && (
          <a
            href="https://www.lendingtree.com/auto/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
          >
            Compare auto loan rates at LendingTree →
          </a>
        )}
        {!isMortgage && !isCar && (
          <a
            href="https://www.lendingtree.com/personal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
          >
            Compare personal loan rates at LendingTree →
          </a>
        )}
      </div>
    </div>
  )
}

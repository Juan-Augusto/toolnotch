'use client'

import { useTranslations } from 'next-intl'

interface AffiliatePanelProps {
  loanType: string
}

export default function AppAffiliatePanel({ loanType }: AffiliatePanelProps) {
  const t = useTranslations('finance.affiliate')
  const isMortgage = loanType === 'mortgage' || loanType === 'affordability'
  const isCar = loanType === 'car'

  return (
    <div className="mt-6 p-4 bg-background border border-border rounded-[2px]">
      <p className="text-sm font-bold uppercase text-foreground mb-1">
        {t('compareRates')}
      </p>
      <p className="text-sm text-label mb-3">
        {t('disclaimer')}
      </p>
      <div className="flex flex-wrap gap-2">
        {isMortgage && (
          <>
            <a
              href="https://www.lendingtree.com/home/mortgage/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-tertiary border border-border hover:border-primary text-foreground px-3.5 py-2 rounded-[2px] transition-colors"
            >
              {t('lendingTreeMortgage')}
            </a>
            <a
              href="https://www.bankrate.com/mortgages/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-tertiary border border-border hover:border-primary text-foreground px-3.5 py-2 rounded-[2px] transition-colors"
            >
              {t('bankrateMortgage')}
            </a>
          </>
        )}
        {isCar && (
          <a
            href="https://www.lendingtree.com/auto/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-tertiary border border-border hover:border-primary text-foreground px-3.5 py-2 rounded-[2px] transition-colors"
          >
            {t('lendingTreeAuto')}
          </a>
        )}
        {!isMortgage && !isCar && (
          <a
            href="https://www.lendingtree.com/personal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-tertiary border border-border hover:border-primary text-foreground px-3.5 py-2 rounded-[2px] transition-colors"
          >
            {t('lendingTreePersonal')}
          </a>
        )}
      </div>
    </div>
  )
}

export const LOCALE_CONFIGS = {
  uk:        { currency: 'GBP', taxLabel: 'VAT',        taxRate: 20 },
  canada:    { currency: 'CAD', taxLabel: 'GST',        taxRate: 5  },
  australia: { currency: 'AUD', taxLabel: 'GST',        taxRate: 10 },
  us:        { currency: 'USD', taxLabel: 'Sales Tax',  taxRate: 0  },
} as const

export type LocaleKey = keyof typeof LOCALE_CONFIGS

export type CurrencyCode = 'XOF' | 'XAF' | 'GNF' | 'EUR' | 'USD'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  name: string
  rateFromXOF: number
  decimals: number
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  XOF: { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA (UEMOA)', rateFromXOF: 1, decimals: 0 },
  XAF: { code: 'XAF', symbol: 'FCFA', name: 'Franc CFA (CEMAC)', rateFromXOF: 1, decimals: 0 },
  GNF: { code: 'GNF', symbol: 'GNF', name: 'Franc Guinéen', rateFromXOF: 14.2, decimals: 0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateFromXOF: 0.001524, decimals: 2 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromXOF: 0.00165, decimals: 2 },
}

export function formatPrice(amountInXOF: number, targetCurrency: CurrencyCode = 'XOF'): string {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.XOF
  const converted = amountInXOF * config.rateFromXOF

  if (config.decimals === 0) {
    return `${Math.round(converted).toLocaleString('fr-FR')} ${config.symbol}`
  }

  return `${converted.toLocaleString('fr-FR', { minimumFractionDigits: config.decimals, maximumFractionDigits: config.decimals })} ${config.symbol}`
}

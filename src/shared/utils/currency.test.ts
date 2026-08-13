import { describe, it, expect } from 'vitest'
import { formatPrice } from './currency'

describe('Currency Utility', () => {
  it('formats amount in XOF correctly', () => {
    const formatted = formatPrice(15000, 'XOF')
    expect(formatted).toContain('FCFA')
    expect(formatted).toContain('15')
  })

  it('converts amount to EUR with 2 decimals', () => {
    const formatted = formatPrice(655957, 'EUR')
    expect(formatted).toContain('€')
    expect(formatted).toContain('999')
  })

  it('converts amount to GNF', () => {
    const formatted = formatPrice(1000, 'GNF')
    expect(formatted).toContain('GNF')
    expect(formatted).toContain('14')
  })

  it('defaults to XOF for invalid currency code', () => {
    // @ts-expect-error testing fallback
    const formatted = formatPrice(5000, 'INVALID')
    expect(formatted).toContain('FCFA')
  })
})

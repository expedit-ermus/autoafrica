import { describe, it, expect, vi, afterEach } from 'vitest'
import { PaymentMethod } from '@/generated/prisma/client'
import { paymentProviders } from './registry'
import { OrangeMoneyAdapter } from './orange-money.adapter'
import { MtnMomoAdapter } from './mtn-momo.adapter'
import { MoovMoneyAdapter } from './moov-money.adapter'

describe('paymentProviders registry', () => {
  it('registers Orange Money, MTN MoMo and Moov Money', () => {
    const ids = paymentProviders.list().map(p => p.id)
    expect(ids).toContain(PaymentMethod.ORANGE_MONEY)
    expect(ids).toContain(PaymentMethod.MTN_MOMO)
    expect(ids).toContain(PaymentMethod.MOOV_MONEY)
  })

  it('rejects unsupported methods', () => {
    expect(paymentProviders.isSupported('BITCOIN')).toBe(false)
    expect(() => paymentProviders.get('BITCOIN')).toThrow()
  })

  it('returns the same adapter for a supported method', () => {
    expect(paymentProviders.get(PaymentMethod.ORANGE_MONEY)).toBeInstanceOf(OrangeMoneyAdapter)
    expect(paymentProviders.get(PaymentMethod.MTN_MOMO)).toBeInstanceOf(MtnMomoAdapter)
    expect(paymentProviders.get(PaymentMethod.MOOV_MONEY)).toBeInstanceOf(MoovMoneyAdapter)
  })
})

describe('Mobile Money adapters', () => {
  const adapters = [new OrangeMoneyAdapter(), new MtnMomoAdapter(), new MoovMoneyAdapter()]

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(adapters.map(a => [a.name, a]))('exposes the Ivorian market config (%s)', (_name, adapter) => {
    expect(adapter.countries).toContain('CI')
    expect(adapter.limits.min).toBeGreaterThan(0)
    expect(adapter.limits.max).toBeGreaterThan(adapter.limits.min)
    expect(adapter.fees.percent).toBeGreaterThan(0)
  })

  it.each(adapters.map(a => [a.name, a]))('completes a valid payment (%s)', async (_name, adapter) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const result = await adapter.initiate({
      phone: '+22507080910',
      amount: 150000,
      currency: 'XOF',
      reference: 'test-ref',
      description: 'Order TEST-001',
    })
    expect(result.success).toBe(true)
    expect(result.transactionId).toBeTruthy()
    expect(result.status).toBe('completed')
  })

  it.each(adapters.map(a => [a.name, a]))('rejects an amount below the minimum (%s)', async (_name, adapter) => {
    await expect(
      adapter.initiate({
        phone: '+22507080910',
        amount: 1,
        currency: 'XOF',
        reference: 'test-ref',
      }),
    ).rejects.toThrow(/Montant hors limites/)
  })
})

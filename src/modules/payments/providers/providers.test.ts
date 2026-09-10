import { describe, it, expect, vi, afterEach } from 'vitest'
import { PaymentMethod } from '@/generated/prisma/client'
import { paymentProviders } from './registry'
import { OrangeMoneyAdapter } from './orange-money.adapter'
import { MtnMomoAdapter } from './mtn-momo.adapter'
import { MoovMoneyAdapter } from './moov-money.adapter'
import { WaveAdapter } from './wave.adapter'

describe('paymentProviders registry', () => {
  it('registers Orange Money, MTN MoMo, Wave and Moov Money', () => {
    const ids = paymentProviders.list().map(p => p.id)
    expect(ids).toContain(PaymentMethod.ORANGE_MONEY)
    expect(ids).toContain(PaymentMethod.MTN_MOMO)
    expect(ids).toContain(PaymentMethod.WAVE)
    expect(ids).toContain(PaymentMethod.MOOV_MONEY)
  })

  it('rejects unsupported methods', () => {
    expect(paymentProviders.isSupported('BITCOIN')).toBe(false)
    expect(() => paymentProviders.get('BITCOIN')).toThrow()
  })

  it('returns the same adapter for a supported method', () => {
    expect(paymentProviders.get(PaymentMethod.ORANGE_MONEY)).toBeInstanceOf(OrangeMoneyAdapter)
    expect(paymentProviders.get(PaymentMethod.MTN_MOMO)).toBeInstanceOf(MtnMomoAdapter)
    expect(paymentProviders.get(PaymentMethod.WAVE)).toBeInstanceOf(WaveAdapter)
    expect(paymentProviders.get(PaymentMethod.MOOV_MONEY)).toBeInstanceOf(MoovMoneyAdapter)
  })
})

describe('Mobile Money adapters', () => {
  const adapters = [new OrangeMoneyAdapter(), new MtnMomoAdapter(), new WaveAdapter(), new MoovMoneyAdapter()]

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

  /**
   * Sans simulation explicite, l'adaptateur ne doit jamais annoncer un succes :
   * il renvoyait « Paiement effectue avec succes » apres un simple tirage
   * aleatoire, sans aucun appel a un operateur, et la commande passait a PAID
   * sans qu'aucun argent ne bouge (D65). La production n'active pas ce drapeau.
   */
  it.each(adapters.map(a => [a.name, a]))(
    'refuse de fabriquer un succes hors simulation (%s)',
    async (_name, adapter) => {
      const precedent = process.env.PAYMENTS_SIMULATOR
      delete process.env.PAYMENTS_SIMULATOR
      try {
        const result = await adapter.initiate({
          phone: '+22507080910',
          amount: 150000,
          currency: 'XOF',
          reference: 'test-ref',
          description: 'Order TEST-001',
        })
        expect(result.success).toBe(false)
        expect(result.error).toBe('PROVIDER_NOT_CONFIGURED')
        expect(result.transactionId).toBeUndefined()
      } finally {
        if (precedent !== undefined) process.env.PAYMENTS_SIMULATOR = precedent
      }
    },
  )

  /**
   * Chemin reel : quand les identifiants marchands sont poses, l'adaptateur
   * ouvre une transaction chez CinetPay et renvoie une page de paiement.
   *
   * Le statut doit valoir `pending`, jamais `completed` : `payments.service`
   * marque la commande PAID sur un `completed`, et l'acheteur n'a a ce stade
   * meme pas saisi son code. Un `completed` ici encaisserait dans le vide.
   */
  it.each(adapters.map(a => [a.name, a]))(
    'ouvre une transaction sans jamais annoncer un encaissement (%s)',
    async (_name, adapter) => {
      const precedent = { ...process.env }
      process.env.CINETPAY_API_KEY = 'cle-api'
      process.env.CINETPAY_SITE_ID = '445566'
      process.env.NEXT_PUBLIC_APP_URL = 'https://autoafrique-saas.vercel.app'

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          code: '201',
          data: { payment_token: 'tok-1', payment_url: 'https://checkout.cinetpay.com/tok-1' },
        }),
      } as Response)
      vi.stubGlobal('fetch', fetchMock)

      try {
        const result = await adapter.initiate({
          phone: '+22507080910',
          amount: 150000,
          currency: 'XOF',
          reference: 'pay-ref-1',
          description: 'Order TEST-001',
        })

        expect(result.success).toBe(true)
        expect(result.status, 'une ouverture n est pas un encaissement').toBe('pending')
        expect(result.status).not.toBe('completed')
        expect(result.redirectUrl).toBe('https://checkout.cinetpay.com/tok-1')
        // Le code secret se saisit chez l operateur, jamais sur AutoAfrique.
        expect(result.pinRequired).toBe(false)
      } finally {
        process.env = precedent
        vi.unstubAllGlobals()
      }
    },
  )

  it.each(adapters.map(a => [a.name, a]))(
    'n annonce pas de reglement quand CinetPay refuse l ouverture (%s)',
    async (_name, adapter) => {
      const precedent = { ...process.env }
      process.env.CINETPAY_API_KEY = 'cle-api'
      process.env.CINETPAY_SITE_ID = '445566'
      process.env.NEXT_PUBLIC_APP_URL = 'https://autoafrique-saas.vercel.app'

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => ({ code: '609', description: 'Cle invalide' }),
        } as Response),
      )

      try {
        const result = await adapter.initiate({
          phone: '+22507080910',
          amount: 150000,
          currency: 'XOF',
          reference: 'pay-ref-1',
          description: 'Order TEST-001',
        })

        expect(result.success).toBe(false)
        expect(result.status).toBe('failed')
        expect(result.error).toBe('PROVIDER_INITIATION_FAILED')
      } finally {
        process.env = precedent
        vi.unstubAllGlobals()
      }
    },
  )

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

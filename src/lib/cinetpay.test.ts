import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import crypto from 'crypto'
import {
  verifyCinetPayToken,
  checkCinetPayTransaction,
  initiateCinetPayPayment,
  cinetPayConfigured,
} from './cinetpay'

const SECRET = 'cle-secrete-cinetpay'

/** Notification type, dans l'ordre où CinetPay sérialise ses champs. */
function notification(): [string, string][] {
  return [
    ['cpm_site_id', '445566'],
    ['cpm_trans_id', 'pay_abc123'],
    ['cpm_trans_date', '2026-09-05 03:12:44'],
    ['cpm_amount', '15000'],
    ['cpm_currency', 'XOF'],
    ['signature', 'sig-cinetpay'],
    ['payment_method', 'OM'],
    ['cel_phone_num', '0707070707'],
    ['cpm_phone_prefixe', '225'],
    ['cpm_language', 'fr'],
    ['cpm_version', 'V4'],
    ['cpm_payment_config', 'SINGLE'],
    ['cpm_page_action', 'PAYMENT'],
    ['cpm_custom', 'order_42'],
    ['cpm_designation', 'Commande AutoAfrique'],
    ['cpm_error_message', ''],
  ]
}

function sign(fields: [string, string][], secret = SECRET): string {
  const concatenated = fields.map(([, value]) => value).join('')
  return crypto.createHmac('sha256', secret).update(concatenated, 'utf8').digest('hex')
}

function headersWith(token: string): Headers {
  return new Headers({ 'x-token': token })
}

describe('verifyCinetPayToken', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.CINETPAY_SECRET_KEY = SECRET
    vi.stubEnv('NODE_ENV', 'production')
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.unstubAllEnvs()
  })

  it('accepte une notification correctement signée', () => {
    const fields = notification()
    const result = verifyCinetPayToken(headersWith(sign(fields)), fields)

    expect(result).toMatchObject({ ok: true, reason: 'verified', transactionId: 'pay_abc123' })
  })

  it('concatène les valeurs sans séparateur', () => {
    // Vérification du point le plus facile à se tromper : CinetPay ne place ni
    // point, ni esperluette, ni nom de champ dans la chaîne signée.
    const fields = notification()
    const avecPoints = crypto
      .createHmac('sha256', SECRET)
      .update(fields.map(([, v]) => v).join('.'), 'utf8')
      .digest('hex')

    const result = verifyCinetPayToken(headersWith(avecPoints), fields)
    expect(result).toMatchObject({ ok: false, status: 401 })
  })

  it('rejette un montant modifié après signature', () => {
    const fields = notification()
    const token = sign(fields)

    const falsifie = fields.map(
      ([key, value]) => [key, key === 'cpm_amount' ? '1' : value] as [string, string],
    )

    const result = verifyCinetPayToken(headersWith(token), falsifie)
    expect(result).toMatchObject({ ok: false, status: 401, reason: 'Jeton x-token invalide' })
  })

  it('rejette une signature calculée avec une autre clé', () => {
    const fields = notification()
    const result = verifyCinetPayToken(headersWith(sign(fields, 'mauvaise-cle')), fields)

    expect(result).toMatchObject({ ok: false, status: 401 })
  })

  it("rejette l'absence de jeton", () => {
    const result = verifyCinetPayToken(new Headers(), notification())
    expect(result).toMatchObject({ ok: false, status: 401, reason: 'Jeton x-token absent' })
  })

  it('accepte le repli sur l\'ordre documenté si les champs sont réordonnés', () => {
    const fields = notification()
    const token = sign(fields) // signé dans l'ordre documenté

    const reordonne = [...fields].reverse()
    const result = verifyCinetPayToken(headersWith(token), reordonne)

    expect(result).toMatchObject({ ok: true, reason: 'verified' })
  })

  it('refuse la notification en production quand la clé manque', () => {
    delete process.env.CINETPAY_SECRET_KEY

    const fields = notification()
    const result = verifyCinetPayToken(headersWith(sign(fields)), fields)

    expect(result).toMatchObject({ ok: false, status: 503 })
  })

  it('ignore la vérification hors production quand la clé manque', () => {
    delete process.env.CINETPAY_SECRET_KEY
    vi.stubEnv('NODE_ENV', 'development')

    const result = verifyCinetPayToken(new Headers(), notification())
    expect(result).toMatchObject({ ok: true, reason: 'skipped-dev', transactionId: 'pay_abc123' })
  })
})

describe('checkCinetPayTransaction', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.CINETPAY_API_KEY = 'apikey'
    process.env.CINETPAY_SITE_ID = '445566'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.unstubAllGlobals()
  })

  it('renvoie la transaction quand CinetPay répond code 00', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          code: '00',
          message: 'SUCCES',
          data: { status: 'ACCEPTED', amount: '15000', currency: 'XOF', payment_method: 'OM' },
        }),
      }),
    )

    const result = await checkCinetPayTransaction('pay_abc123')
    expect(result).toEqual({
      ok: true,
      transaction: {
        status: 'ACCEPTED',
        amount: 15000,
        currency: 'XOF',
        paymentMethod: 'OM',
        operatorId: undefined,
      },
    })
  })

  it('échoue quand CinetPay renvoie un code différent de 00', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: '627', message: 'TRANSACTION NOT FOUND' }),
      }),
    )

    const result = await checkCinetPayTransaction('inconnue')
    expect(result.ok).toBe(false)
  })

  it("échoue proprement quand l'API est injoignable", async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')))

    const result = await checkCinetPayTransaction('pay_abc123')
    expect(result.ok).toBe(false)
  })

  it('échoue quand les identifiants ne sont pas configurés', async () => {
    delete process.env.CINETPAY_API_KEY

    const result = await checkCinetPayTransaction('pay_abc123')
    expect(result).toMatchObject({ ok: false })
  })
})


describe('initiateCinetPayPayment', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.CINETPAY_API_KEY = 'cle-api'
    process.env.CINETPAY_SITE_ID = '445566'
    process.env.NEXT_PUBLIC_APP_URL = 'https://autoafrique-saas.vercel.app'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.restoreAllMocks()
  })

  function reponse(corps: unknown, ok = true, status = 200) {
    return { ok, status, json: async () => corps } as Response
  }

  it('ouvre une transaction et renvoie l URL de paiement', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      reponse({ code: '201', data: { payment_token: 'tok-1', payment_url: 'https://checkout.cinetpay.com/tok-1' } }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_abc123',
      amount: 15000,
      currency: 'XOF',
      description: 'Commande AA-1',
    })

    expect(res).toEqual({ ok: true, paymentUrl: 'https://checkout.cinetpay.com/tok-1', paymentToken: 'tok-1' })

    const corps = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(corps.transaction_id, 'notre identifiant de Payment doit voyager').toBe('pay_abc123')
    expect(corps.amount).toBe(15000)
    expect(corps.notify_url, 'CinetPay doit notifier notre webhook').toBe(
      'https://autoafrique-saas.vercel.app/api/v1/payments/webhook',
    )
    expect(corps.return_url).toContain('/paiement/retour?paiement=pay_abc123')
  })

  // Le montant doit etre un multiple de 5 en XOF. Arrondir changerait la somme
  // reellement debitee : la demande est refusee, jamais corrigee en silence.
  it('refuse un montant XOF non multiple de 5 sans l arrondir', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_x',
      amount: 15003,
      currency: 'XOF',
      description: 'Commande',
    })

    expect(res.ok).toBe(false)
    expect(fetchMock, 'aucun appel ne doit partir').not.toHaveBeenCalled()
    if (!res.ok) expect(res.reason).toContain('multiples de 5')
  })

  it('refuse d ouvrir une transaction sans identifiants marchands', async () => {
    delete process.env.CINETPAY_API_KEY
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_x',
      amount: 15000,
      currency: 'XOF',
      description: 'Commande',
    })

    expect(res.ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // Sans URL publique, CinetPay ne saurait ou notifier : la transaction serait
  // payee sans que la commande passe jamais a PAID.
  it('refuse d ouvrir une transaction sans URL publique de notification', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_x',
      amount: 15000,
      currency: 'XOF',
      description: 'Commande',
    })

    expect(res.ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('ne prend pas une reponse sans URL pour une reussite', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reponse({ code: '201', data: {} })))

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_x',
      amount: 15000,
      currency: 'XOF',
      description: 'Commande',
    })

    expect(res.ok).toBe(false)
  })

  it('signale un refus de CinetPay', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(reponse({ code: '609', message: 'AUTH_NOT_FOUND', description: 'Cle invalide' })),
    )

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_x',
      amount: 15000,
      currency: 'XOF',
      description: 'Commande',
    })

    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.reason).toContain('609')
  })

  // Sans URL, ce test passerait meme si le code de retour n'etait plus verifie :
  // il faut donc un refus accompagne d'une URL pour isoler le controle du code.
  it('refuse un code autre que 201 meme si une URL est renvoyee', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        reponse({
          code: '600',
          description: 'Transaction refusee',
          data: { payment_token: 'tok-x', payment_url: 'https://checkout.cinetpay.com/tok-x' },
        }),
      ),
    )

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_x',
      amount: 15000,
      currency: 'XOF',
      description: 'Commande',
    })

    expect(res.ok, 'seul le code 201 vaut ouverture').toBe(false)
  })

  it('survit a une panne reseau sans lever', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNRESET')))

    const res = await initiateCinetPayPayment({
      transactionId: 'pay_x',
      amount: 15000,
      currency: 'XOF',
      description: 'Commande',
    })

    expect(res.ok).toBe(false)
  })
})

describe('cinetPayConfigured', () => {
  const originalEnv = { ...process.env }
  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('exige les trois variables', () => {
    process.env.CINETPAY_API_KEY = 'a'
    process.env.CINETPAY_SITE_ID = 'b'
    process.env.NEXT_PUBLIC_APP_URL = 'https://exemple.test'
    expect(cinetPayConfigured()).toBe(true)

    delete process.env.CINETPAY_SITE_ID
    expect(cinetPayConfigured()).toBe(false)
  })
})

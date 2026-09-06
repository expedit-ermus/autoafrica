import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import crypto from 'crypto'
import { verifyCinetPayToken, checkCinetPayTransaction } from './cinetpay'

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

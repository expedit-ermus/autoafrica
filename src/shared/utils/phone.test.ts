import { describe, it, expect } from 'vitest'
import {
  toNationalNumber,
  isValidPhone,
  toE164,
  detectOperator,
  availableOperators,
  formatNationalNumber,
} from './phone'

describe('toNationalNumber', () => {
  it('accepte les séparateurs de saisie courants', () => {
    expect(toNationalNumber('07 12 34 56 78', 'CI')).toBe('0712345678')
    expect(toNationalNumber('07-12-34-56-78', 'CI')).toBe('0712345678')
    expect(toNationalNumber('(07) 12.34.56.78', 'CI')).toBe('0712345678')
  })

  it('retire le préfixe international sous ses deux formes', () => {
    expect(toNationalNumber('+225 07 12 34 56 78', 'CI')).toBe('0712345678')
    expect(toNationalNumber('00225 0712345678', 'CI')).toBe('0712345678')
  })

  it('ne confond pas un indicatif avec le début du numéro national', () => {
    // 2250000 fait 7 chiffres : trop court pour contenir l'indicatif + un numéro.
    expect(toNationalNumber('2250000', 'CI')).toBe('2250000')
  })
})

describe('isValidPhone', () => {
  it('valide la longueur nationale du pays', () => {
    expect(isValidPhone('0712345678', 'CI')).toBe(true)
    expect(isValidPhone('071234567', 'CI')).toBe(false)
    expect(isValidPhone('77 123 45 67', 'SN')).toBe(true)
  })

  it('reste permissif pour un pays hors référentiel', () => {
    expect(isValidPhone('12345678', 'ZZ')).toBe(true)
    expect(isValidPhone('123', 'ZZ')).toBe(false)
  })
})

describe('toE164', () => {
  it('produit la forme internationale canonique', () => {
    expect(toE164('07 12 34 56 78', 'CI')).toBe('+2250712345678')
    expect(toE164('+225 07 12 34 56 78', 'CI')).toBe('+2250712345678')
  })

  it('renvoie null sur un numéro invalide', () => {
    expect(toE164('0712', 'CI')).toBeNull()
  })
})

describe('detectOperator', () => {
  it('reconnaît les préfixes ivoiriens', () => {
    expect(detectOperator('0712345678', 'CI')).toBe('ORANGE_MONEY')
    expect(detectOperator('0512345678', 'CI')).toBe('MTN_MOMO')
    expect(detectOperator('0112345678', 'CI')).toBe('MOOV_MONEY')
  })

  it('reconnaît les préfixes Orange sénégalais', () => {
    expect(detectOperator('771234567', 'SN')).toBe('ORANGE_MONEY')
    expect(detectOperator('781234567', 'SN')).toBe('ORANGE_MONEY')
  })

  it('ne devine pas quand le découpage opérateur n’est pas fiable', () => {
    expect(detectOperator('12345678', 'BF')).toBeNull()
    expect(detectOperator('12345678', 'ML')).toBeNull()
  })

  it('ne devine pas sur un numéro incomplet', () => {
    expect(detectOperator('071234', 'CI')).toBeNull()
  })
})

describe('availableOperators', () => {
  it('propose l’opérateur détecté puis les portefeuilles indépendants', () => {
    expect(availableOperators('0712345678', 'CI')).toEqual(['ORANGE_MONEY', 'WAVE'])
  })

  it('propose Wave seul quand l’opérateur est indéterminé', () => {
    expect(availableOperators('021234567', 'SN')).toEqual(['WAVE'])
  })

  it('ne propose rien pour un pays inconnu', () => {
    expect(availableOperators('12345678', 'ZZ')).toEqual([])
  })
})

describe('formatNationalNumber', () => {
  it('groupe les chiffres par deux', () => {
    expect(formatNationalNumber('0712345678', 'CI')).toBe('07 12 34 56 78')
  })
})

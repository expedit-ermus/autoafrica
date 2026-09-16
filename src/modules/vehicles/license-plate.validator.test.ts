import { describe, it, expect } from 'vitest'
import {
  validateLicensePlate,
  checkUsedPartSafetyCompliance,
} from './license-plate.validator'

describe('LicensePlateValidator', () => {
  it('validates Ivoirian plates (Quipux DIGIMMAT format)', () => {
    const valid = validateLicensePlate('1234 AB 01', 'CI')
    expect(valid.isValid).toBe(true)
    expect(valid.officialSystem).toContain('Quipux')

    const invalid = validateLicensePlate('INVALID_PLATE', 'CI')
    expect(invalid.isValid).toBe(false)
  })

  /**
   * La Cote d'Ivoire a change de norme le 1er juin 2023 : `AA-123-AA`, sur le
   * modele francais, remplace le `4 chiffres + 2 lettres + 2 chiffres` en
   * usage depuis 1997. Les anciennes plaques restent valides et circulent.
   *
   * Le code ne connaissait qu'une norme a la fois, et les trois copies du
   * format n'etaient pas d'accord entre elles : selon le chemin emprunte, un
   * automobiliste se voyait refuser une plaque parfaitement legale.
   */
  it('accepte la norme ivoirienne en vigueur depuis juin 2023', () => {
    const r = validateLicensePlate('AB-123-CD', 'CI')

    expect(r.isValid).toBe(true)
    expect(r.isLegacy).toBe(false)
    expect(r.matchedNorm).toContain('2023')
  })

  it('accepte encore l ancienne norme et la signale comme telle', () => {
    const r = validateLicensePlate('4550 EG 01', 'CI')

    expect(r.isValid).toBe(true)
    expect(r.isLegacy).toBe(true)
    expect(r.matchedNorm).toContain('1997')
  })

  it('tolere les separateurs de la nouvelle norme', () => {
    for (const saisie of ['AB-123-CD', 'AB 123 CD', 'ab123cd']) {
      expect(validateLicensePlate(saisie, 'CI').isValid, saisie).toBe(true)
    }
  })

  // Le placeholder et le message d'erreur doivent montrer la norme en vigueur,
  // pas celle qu'on remplace.
  it('presente la norme en vigueur comme format de reference', () => {
    const r = validateLicensePlate('', 'CI')

    expect(r.formatDescription).toContain('AB-123-CD')
    expect(r.acceptedFormats).toHaveLength(2)
    expect(r.acceptedFormats[0].legacy).toBeUndefined()
    expect(r.acceptedFormats[1].legacy).toBe(true)
  })

  it('refuse une plaque qui ne releve d aucune norme connue', () => {
    const r = validateLicensePlate('AB-12-CD', 'CI')

    expect(r.isValid).toBe(false)
    expect(r.matchedNorm).toBeUndefined()
    expect(r.isLegacy).toBe(false)
  })

  it('validates Senegalese plates (Capp Karangë format)', () => {
    const valid = validateLicensePlate('1234 DK 01', 'SN')
    expect(valid.isValid).toBe(true)
    expect(valid.countryName).toBe('Sénégal')
  })

  it('validates Nigerian plates (FRSC NVIS format)', () => {
    const valid = validateLicensePlate('KJA-123AA', 'NG')
    expect(valid.isValid).toBe(true)
    expect(valid.officialSystem).toContain('FRSC')
  })

  it('validates Ghanaian plates (DVLA format)', () => {
    const valid = validateLicensePlate('GR-1234-24', 'GH')
    expect(valid.isValid).toBe(true)
    expect(valid.countryName).toBe('Ghana')
  })

  it('checks safety compliance for used parts according to road safety laws', () => {
    const airbagCheck = checkUsedPartSafetyCompliance('Airbag volant', 'USED_INSPECTED')
    expect(airbagCheck.isPermitted).toBe(false)
    expect(airbagCheck.reason).toContain('interdite')

    const engineCheck = checkUsedPartSafetyCompliance('Bloc Moteur complet', 'USED_INSPECTED')
    expect(engineCheck.isPermitted).toBe(true)
    expect(engineCheck.requiresVinTraceability).toBe(true)

    const newPartsCheck = checkUsedPartSafetyCompliance('Airbag volant', 'NEW')
    expect(newPartsCheck.isPermitted).toBe(true)
  })
})

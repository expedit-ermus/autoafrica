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

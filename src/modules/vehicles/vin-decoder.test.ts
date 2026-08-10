import { describe, it, expect } from 'vitest'
import { decodeVin } from './vin-decoder'

describe('VIN Decoder Module', () => {
  it('decodes a valid Toyota VIN correctly', () => {
    const vin = 'JT2BF18V9M1234567'
    const result = decodeVin(vin)

    expect(result.valid).toBe(true)
    expect(result.brand).toBe('Toyota')
    expect(result.countryOfOrigin).toBe('Japon')
    expect(result.modelYear).toBe(2021)
    expect(result.wmi).toBe('JT2')
  })

  it('decodes a valid Peugeot VIN correctly', () => {
    const vin = 'VF3DV6180P4567890'
    const result = decodeVin(vin)

    expect(result.valid).toBe(true)
    expect(result.brand).toBe('Peugeot')
    expect(result.countryOfOrigin).toBe('France')
    expect(result.modelYear).toBe(2023)
  })

  it('rejects an invalid VIN length', () => {
    const vin = 'TOO_SHORT'
    const result = decodeVin(vin)

    expect(result.valid).toBe(false)
    expect(result.brand).toBe('Inconnue')
  })
})

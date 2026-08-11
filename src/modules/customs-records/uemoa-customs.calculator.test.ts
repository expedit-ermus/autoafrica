import { describe, it, expect } from 'vitest'
import { UemoaCustomsCalculator } from './uemoa-customs.calculator'

describe('UemoaCustomsCalculator', () => {
  const calculator = new UemoaCustomsCalculator()

  it('calculates DDP customs duties for engine parts (10% DD + RS + PCS + TVA 18%)', () => {
    const result = calculator.calculateDuties(1000000, 'ENGINE_PARTS', 'DDP')

    expect(result.cifValueXof).toBe(1000000)
    expect(result.hsCode).toBe('8409.91.00')
    expect(result.droitDeDouane).toBe(100000)
    expect(result.redevanceStatistique).toBe(10000)
    expect(result.prelevementUemoaCedeao).toBe(15000)
    // baseTva = 1000000 + 100000 + 10000 + 15000 = 1125000
    // tva = 1125000 * 0.18 = 202500
    expect(result.tvaXof).toBe(202500)
    expect(result.totalCustomsDuties).toBe(327500)
    expect(result.totalDdpCost).toBe(1327500)
  })

  it('calculates DDU duties (excluding taxes from totalDdpCost)', () => {
    const result = calculator.calculateDuties(500000, 'ELECTRONICS', 'DDU')

    expect(result.dutyRatePercent).toBe(5)
    expect(result.totalCustomsDuties).toBeGreaterThan(0)
    expect(result.totalDdpCost).toBe(500000)
  })

  it('throws error when CIF value is zero or negative', () => {
    expect(() => calculator.calculateDuties(0, 'TIRES')).toThrow('La valeur CAF (CIF) doit être supérieure à zéro')
  })
})

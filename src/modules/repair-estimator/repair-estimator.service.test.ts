import { describe, it, expect, vi, beforeEach } from 'vitest'
import { repairEstimatorService } from './repair-estimator.service'

vi.mock('@/modules/crm/crm.service', () => ({
  crmService: {
    createLead: vi.fn().mockImplementation(async (data) => ({
      id: 'lead-test-123',
      name: data.name,
      phone: data.phone,
      source: data.source,
      value: data.value,
      notes: data.notes,
      createdAt: new Date(),
    })),
  },
}))

describe('RepairEstimatorService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns breakdown options and affiliated garages', () => {
    const options = repairEstimatorService.getOptions()
    const garages = repairEstimatorService.getGarages()

    expect(options.length).toBeGreaterThanOrEqual(6)
    expect(garages.length).toBe(3)
    expect(options[0].id).toBe('suspension')
  })

  it('calculates estimate correctly for Venant vs Neuf parts', () => {
    const venantEstimate = repairEstimatorService.calculateEstimate('suspension', 'venant')
    const neufEstimate = repairEstimatorService.calculateEstimate('suspension', 'neuf')

    expect(venantEstimate.laborFee).toBe(15000)
    expect(venantEstimate.minTotal).toBe(35000 + 15000) // 50 000
    expect(venantEstimate.maxTotal).toBe(55000 + 15000) // 70 000

    expect(neufEstimate.minTotal).toBe(70000 + 15000) // 85 000
    expect(neufEstimate.maxTotal).toBe(110000 + 15000) // 125 000
  })

  it('captures repair lead data in CRM and returns confirmation payload', async () => {
    const result = await repairEstimatorService.captureRepairLead({
      customerName: 'Kouassi Jean',
      customerPhone: '+225 0707070707',
      vehicleInfo: 'Toyota Corolla 2014',
      locationCity: 'Yopougon, Abidjan',
      issueId: 'suspension',
      partCondition: 'venant',
      selectedGarageId: 'g-diallo',
      paymentMethod: 'Paiement sur place / Mobile Money',
    })

    expect(result.leadId).toBe('lead-test-123')
    expect(result.status).toBe('CONFIRMED')
    expect(result.customerName).toBe('Kouassi Jean')
    expect(result.garage.name).toBe('Maître Garage Diallo')
  })
})

import { describe, it, expect } from 'vitest'
import { ContainerTrackingService } from './container-tracking.service'

describe('ContainerTrackingService', () => {
  const service = new ContainerTrackingService()

  it('tracks a CMA CGM maritime container', async () => {
    const info = await service.trackContainer('CMAU9876543')

    expect(info.containerNumber).toBe('CMAU9876543')
    expect(info.carrier).toBe('CMA CGM')
    expect(info.destinationPort).toContain('Abidjan')
    expect(info.currentStatus).toBe('IN_TRANSIT')
    expect(info.events.length).toBeGreaterThan(0)
  })

  it('tracks a Maersk maritime container', async () => {
    const info = await service.trackContainer('MSKU1234567')

    expect(info.containerNumber).toBe('MSKU1234567')
    expect(info.carrier).toBe('MAERSK')
  })

  it('throws error for empty container number', async () => {
    await expect(service.trackContainer('')).rejects.toThrow('Numéro de conteneur requis')
  })
})

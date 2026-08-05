// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { trackGAEvent, setGAConsent } from './gtag'

describe('gtag helpers', () => {
  const gtagMock = vi.fn()

  beforeEach(() => {
    gtagMock.mockClear()
    Object.defineProperty(window, 'gtag', { value: gtagMock, writable: true, configurable: true })
  })

  afterEach(() => {
    delete (window as Window & { gtag?: unknown }).gtag
  })

  it('trackGAEvent pushes an event with name and params', () => {
    trackGAEvent('search_product', { query: 'toyota' })
    expect(gtagMock).toHaveBeenCalledWith('event', 'search_product', { query: 'toyota' })
  })

  it('trackGAEvent is a safe no-op when gtag is not loaded', () => {
    delete (window as Window & { gtag?: unknown }).gtag
    expect(() => trackGAEvent('login', { method: 'email' })).not.toThrow()
    expect(gtagMock).not.toHaveBeenCalled()
  })

  it('setGAConsent defaults ad_storage to denied', () => {
    setGAConsent({ analytics_storage: 'granted' })
    expect(gtagMock).toHaveBeenCalledWith(
      'consent',
      'default',
      expect.objectContaining({ ad_storage: 'denied', analytics_storage: 'granted', wait_for_update: 500 }),
    )
  })
})

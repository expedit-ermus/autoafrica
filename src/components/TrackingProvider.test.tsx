// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cleanup, render, act } from '@testing-library/react'

let currentPath = '/'

vi.mock('next/navigation', () => ({
  usePathname: () => currentPath,
}))

vi.mock('@/lib/tracking', () => ({
  track: vi.fn(),
  trackPageView: vi.fn(),
  getSessionId: vi.fn(() => 'sess-test'),
}))

import { track, trackPageView } from '@/lib/tracking'
import TrackingProvider from './TrackingProvider'

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('TrackingProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentPath = '/'
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('fires page_view on mount', async () => {
    render(<TrackingProvider />)
    await flush()
    expect(trackPageView).toHaveBeenCalledTimes(1)
  })

  it('fires scroll_depth when scrolled past 25%', async () => {
    currentPath = '/dashboard/marketplace'
    render(<TrackingProvider />)
    await flush()
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(track).toHaveBeenCalledWith('scroll_depth', { page: '/dashboard/marketplace', depth: '25' })
  })

  it('tracks time_on_page with duration when the route changes', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const { rerender } = render(<TrackingProvider />)
    await flush()
    now.mockReturnValue(1_002_000)
    currentPath = '/dashboard'
    await act(async () => {
      rerender(<TrackingProvider />)
    })
    await flush()
    expect(track).toHaveBeenCalledWith('time_on_page', { page: '/', duration: 2 })
  })
})
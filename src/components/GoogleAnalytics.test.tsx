// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cleanup, render, act } from '@testing-library/react'

let currentPath = '/'
let currentSearch = ''

vi.mock('next/navigation', () => ({
  usePathname: () => currentPath,
  useSearchParams: () => new URLSearchParams(currentSearch),
}))

vi.mock('next/script', () => ({
  default: () => null,
}))

import GoogleAnalytics from './GoogleAnalytics'

const gtagMock = vi.fn()
const flush = () => new Promise((r) => setTimeout(r, 0))

describe('GoogleAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentPath = '/'
    currentSearch = ''
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST-123')
    Object.defineProperty(window, 'gtag', { value: gtagMock, writable: true, configurable: true })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllEnvs()
  })

  it('does not re-send config on the initial mount (init script handles it)', async () => {
    render(<GoogleAnalytics />)
    await flush()
    const configCalls = gtagMock.mock.calls.filter((c) => c[0] === 'config')
    expect(configCalls).toHaveLength(0)
  })

  it('sends config again when the route changes', async () => {
    const { rerender } = render(<GoogleAnalytics />)
    await flush()
    currentPath = '/dashboard/marketplace'
    currentSearch = 'brand=Toyota'
    await act(async () => {
      rerender(<GoogleAnalytics />)
    })
    await flush()
    expect(gtagMock).toHaveBeenCalledWith(
      'config',
      'G-TEST-123',
      expect.objectContaining({ page_path: '/dashboard/marketplace?brand=Toyota' }),
    )
  })

  it('renders nothing when the measurement id is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '')
    const { container } = render(<GoogleAnalytics />)
    expect(container.firstChild).toBeNull()
  })
})

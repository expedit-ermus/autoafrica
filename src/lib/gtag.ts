type GtagArgs = unknown[]

function getGtag(): ((...args: GtagArgs) => void) | undefined {
  if (typeof window === 'undefined') return undefined
  const gtag = (window as Window & { gtag?: (...args: GtagArgs) => void }).gtag
  return typeof gtag === 'function' ? gtag : undefined
}

export function trackGAEvent(name: string, params?: Record<string, unknown>) {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', name, params)
}

export function setGAConsent(consent: { analytics_storage?: 'granted' | 'denied'; ad_storage?: 'granted' | 'denied' }) {
  const gtag = getGtag()
  if (!gtag) return
  gtag('consent', 'default', {
    ad_storage: consent.ad_storage ?? 'denied',
    analytics_storage: consent.analytics_storage ?? 'granted',
    wait_for_update: 500,
  })
}

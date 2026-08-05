import { trackGAEvent } from './gtag'

let cachedSessionId: string | null = null

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  if (cachedSessionId) return cachedSessionId
  const existing = window.localStorage.getItem('aa_session')
  if (existing) {
    cachedSessionId = existing
    return existing
  }
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36)
  window.localStorage.setItem('aa_session', id)
  cachedSessionId = id
  return id
}

const GA4_EXCLUDED = new Set(['page_view'])

export function track(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!GA4_EXCLUDED.has(name)) trackGAEvent(name, props)
  const body = {
    event: name,
    sessionId: getSessionId(),
    properties: props || undefined,
    entity: props?.entity ? String(props.entity) : undefined,
    entityId: props?.entityId ? String(props.entityId) : undefined,
    country: props?.country ? String(props.country) : undefined,
    city: props?.city ? String(props.city) : undefined,
  }
  fetch('/api/v1/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {})
}

export function trackPageView() {
  if (typeof window === 'undefined') return
  track('page_view', {
    page: window.location.pathname,
    title: document.title,
    url: window.location.href,
  })
}

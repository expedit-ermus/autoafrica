import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { consume, clientIp, enforceRateLimit, resetRateLimits, RATE_LIMITS } from './rate-limit'
import type { NextRequest } from 'next/server'

function fakeRequest(headers: Record<string, string> = {}): NextRequest {
  return { headers: new Headers(headers) } as unknown as NextRequest
}

describe('consume', () => {
  beforeEach(() => resetRateLimits())

  it('autorise jusqu’au plafond puis refuse', () => {
    const rule = { limit: 3, windowSeconds: 60 }

    expect(consume('k', rule).allowed).toBe(true)
    expect(consume('k', rule).allowed).toBe(true)
    expect(consume('k', rule).allowed).toBe(true)

    const blocked = consume('k', rule)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })

  it('décompte les tentatives restantes', () => {
    const rule = { limit: 3, windowSeconds: 60 }
    expect(consume('k', rule).remaining).toBe(2)
    expect(consume('k', rule).remaining).toBe(1)
    expect(consume('k', rule).remaining).toBe(0)
  })

  it('cloisonne les compteurs par clé', () => {
    const rule = { limit: 1, windowSeconds: 60 }
    expect(consume('a', rule).allowed).toBe(true)
    expect(consume('b', rule).allowed).toBe(true)
    expect(consume('a', rule).allowed).toBe(false)
  })

  it('rouvre après la fenêtre', () => {
    vi.useFakeTimers()
    const rule = { limit: 1, windowSeconds: 60 }

    expect(consume('k', rule).allowed).toBe(true)
    expect(consume('k', rule).allowed).toBe(false)

    vi.advanceTimersByTime(61_000)
    expect(consume('k', rule).allowed).toBe(true)

    vi.useRealTimers()
  })
})

describe('clientIp', () => {
  it('retient le premier maillon de x-forwarded-for', () => {
    expect(clientIp(fakeRequest({ 'x-forwarded-for': '41.207.1.5, 10.0.0.1' }))).toBe('41.207.1.5')
  })

  it('se rabat sur x-real-ip puis sur unknown', () => {
    expect(clientIp(fakeRequest({ 'x-real-ip': '41.207.1.9' }))).toBe('41.207.1.9')
    expect(clientIp(fakeRequest())).toBe('unknown')
  })
})

describe('enforceRateLimit', () => {
  beforeEach(() => resetRateLimits())
  afterEach(() => resetRateLimits())

  it('laisse passer sous le plafond', () => {
    const request = fakeRequest({ 'x-forwarded-for': '41.207.1.5' })
    expect(enforceRateLimit(request, 'login', 'a@b.ci')).toBeNull()
  })

  it('renvoie 429 avec Retry-After au-delà du plafond', () => {
    const request = fakeRequest({ 'x-forwarded-for': '41.207.1.5' })

    for (let i = 0; i < RATE_LIMITS.login.limit; i++) {
      expect(enforceRateLimit(request, 'login', 'a@b.ci')).toBeNull()
    }

    const blocked = enforceRateLimit(request, 'login', 'a@b.ci')
    expect(blocked?.status).toBe(429)
    expect(Number(blocked?.headers.get('Retry-After'))).toBeGreaterThan(0)
  })

  it('suit le compte visé même si l’attaquant change d’adresse IP', () => {
    for (let i = 0; i < RATE_LIMITS.login.limit; i++) {
      enforceRateLimit(fakeRequest({ 'x-forwarded-for': '41.207.1.5' }), 'login', 'cible@b.ci')
    }

    // Une autre IP repart de zéro : le compteur est bien cloisonné par IP…
    expect(
      enforceRateLimit(fakeRequest({ 'x-forwarded-for': '41.207.1.6' }), 'login', 'cible@b.ci'),
    ).toBeNull()

    // …mais l’IP d’origine reste bloquée sur ce compte.
    expect(
      enforceRateLimit(fakeRequest({ 'x-forwarded-for': '41.207.1.5' }), 'login', 'cible@b.ci')?.status,
    ).toBe(429)
  })

  it('ne mélange pas les compteurs de deux actions différentes', () => {
    const request = fakeRequest({ 'x-forwarded-for': '41.207.1.5' })

    for (let i = 0; i < RATE_LIMITS.register.limit; i++) {
      expect(enforceRateLimit(request, 'register')).toBeNull()
    }
    expect(enforceRateLimit(request, 'register')?.status).toBe(429)
    expect(enforceRateLimit(request, 'login', 'a@b.ci')).toBeNull()
  })
})

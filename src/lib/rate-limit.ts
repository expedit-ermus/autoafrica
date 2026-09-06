import { NextRequest, NextResponse } from 'next/server'

/**
 * Limitation de débit pour les points d'entrée sensibles (connexion, inscription,
 * webhooks). Sans elle, un mot de passe peut être deviné par essais successifs
 * sans aucune contrainte.
 *
 * Implémentation en mémoire, volontairement simple : sur Vercel, chaque instance
 * a son propre compteur, donc le plafond réel est multiplié par le nombre
 * d'instances actives. C'est un ralentisseur efficace contre le bourrage
 * automatisé, pas une garantie stricte. Pour un plafond exact partagé, brancher
 * `consume()` sur un magasin externe (Upstash Redis, Vercel KV) — la signature
 * de la fonction est prévue pour ce remplacement.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Purge opportuniste : évite que la table grossisse indéfiniment. */
function sweep(now: number) {
  if (buckets.size < 5_000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export interface RateLimitRule {
  /** Nombre de requêtes autorisées par fenêtre. */
  limit: number
  /** Durée de la fenêtre, en secondes. */
  windowSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  /** Secondes avant la réouverture, pour l'en-tête Retry-After. */
  retryAfter: number
}

/** Plafonds par type d'action. Volontairement stricts sur l'authentification. */
export const RATE_LIMITS = {
  /** Connexion : 8 tentatives par quart d'heure et par IP+identifiant. */
  login: { limit: 8, windowSeconds: 900 },
  /** Création de compte : limite les inscriptions automatisées. */
  register: { limit: 5, windowSeconds: 3600 },
  /** Webhook de paiement : large, mais borne un émetteur devenu fou. */
  webhook: { limit: 120, windowSeconds: 60 },
} as const satisfies Record<string, RateLimitRule>

export function consume(key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowSeconds * 1000 })
    return { allowed: true, remaining: rule.limit - 1, retryAfter: 0 }
  }

  existing.count += 1
  const retryAfter = Math.ceil((existing.resetAt - now) / 1000)

  if (existing.count > rule.limit) {
    return { allowed: false, remaining: 0, retryAfter }
  }

  return { allowed: true, remaining: rule.limit - existing.count, retryAfter }
}

/**
 * Adresse de l'appelant. Derrière le proxy Vercel, `x-forwarded-for` porte la
 * chaîne des relais : la première entrée est le client réel.
 */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Applique une règle et renvoie une réponse 429 prête à retourner si le plafond
 * est atteint, sinon `null`.
 *
 * @param scope    nom de l'action, pour cloisonner les compteurs entre routes
 * @param identity discriminant supplémentaire (e-mail saisi, par exemple) afin
 *                 qu'un attaquant changeant d'IP reste freiné sur un même compte
 */
export function enforceRateLimit(
  request: NextRequest,
  scope: keyof typeof RATE_LIMITS,
  identity?: string,
): NextResponse | null {
  const rule = RATE_LIMITS[scope]
  const key = [scope, clientIp(request), identity?.toLowerCase() ?? ''].join('|')
  const result = consume(key, rule)

  if (result.allowed) return null

  return NextResponse.json(
    {
      success: false,
      error: 'Trop de tentatives. Réessayez dans quelques minutes.',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfter),
        'Cache-Control': 'no-store',
      },
    },
  )
}

/** Réservé aux tests : remet les compteurs à zéro. */
export function resetRateLimits() {
  buckets.clear()
}

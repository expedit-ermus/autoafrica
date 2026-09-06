import { NextRequest } from 'next/server'
import { verifyToken, type AuthPayload } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UnauthorizedError, ForbiddenError } from '@/shared/errors'

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) throw new UnauthorizedError('Authentication required')

  const payload = verifyToken(token)
  if (!payload) throw new UnauthorizedError('Invalid token')

  return payload
}

export async function requireRole(request: NextRequest, roles: string[]) {
  const auth = await requireAuth(request)
  if (!roles.includes(auth.role || '')) {
    throw new ForbiddenError(`Required role: ${roles.join(' or ')}`)
  }
  return auth
}

export async function requireActiveSeller(request: NextRequest) {
  const auth = await requireAuth(request)

  if (auth.status === 'PENDING_VERIFICATION') {
    throw new ForbiddenError('Votre compte vendeur est en cours de vérification par un administrateur. Vous ne pouvez pas encore publier d\'annonces.')
  }

  if (auth.status === 'SUSPENDED' || auth.status === 'BANNED') {
    throw new ForbiddenError('Votre compte vendeur est suspendu ou banni. Publication refusée.')
  }

  const allowedRoles = ['SELLER', 'SUPER_ADMIN', 'TENANT_ADMIN']
  if (!allowedRoles.includes(auth.role || '')) {
    throw new ForbiddenError('Rôle Vendeur requis pour cette action.')
  }

  return auth
}

export async function optionalAuth(request: NextRequest) {

  const token = request.cookies.get('token')?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload
}

/** Rôles ayant une vue transverse sur toute la plateforme (multi-locataire). */
export const PLATFORM_ADMIN_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN']

export function isPlatformAdmin(auth: { role?: string | null }) {
  return PLATFORM_ADMIN_ROLES.includes(auth.role || '')
}

/**
 * Autorise l'accès à une ressource si l'utilisateur en est propriétaire
 * (acheteur, vendeur, titulaire…) ou s'il est administrateur plateforme.
 * `ownerIds` accepte plusieurs propriétaires légitimes (ex. acheteur ET vendeur d'une facture).
 */
export function requireOwnershipOrAdmin(
  auth: { userId: string; role?: string | null },
  ownerIds: (string | null | undefined)[],
  message = 'Accès non autorisé à cette ressource',
) {
  if (isPlatformAdmin(auth)) return
  if (ownerIds.some((id) => id && id === auth.userId)) return
  throw new ForbiddenError(message)
}

/**
 * Renvoie le locataire de l'utilisateur connecte, en le lisant d'abord dans le jeton.
 * Repli en base pour les jetons emis avant que le tenantId n'y soit ajoute : ils
 * restent valides jusqu'a leur expiration (24 h) ou leur prochain rafraichissement.
 *
 * A utiliser partout ou une route etait scopee par un `tenantId` recu du client :
 * le perimetre locataire doit venir de la session, sinon n'importe qui peut lire
 * les donnees d'un autre locataire en changeant un parametre d'URL.
 */
export async function resolveTenantId(auth: AuthPayload): Promise<string | null> {
  if (auth.tenantId !== undefined) return auth.tenantId

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { tenantId: true },
  })
  return user?.tenantId ?? null
}

/** Variante stricte : echoue si l'utilisateur n'est rattache a aucun locataire. */
export async function requireTenantId(auth: AuthPayload): Promise<string> {
  const tenantId = await resolveTenantId(auth)
  if (!tenantId) {
    throw new ForbiddenError("Aucune organisation n'est rattachee a ce compte.")
  }
  return tenantId
}

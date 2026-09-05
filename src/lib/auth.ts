import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.')
  }
  return secret
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/** Charge utile du jeton de session. */
export type AuthPayload = {
  userId: string
  role?: string
  status?: string
  /**
   * Locataire (tenant) auquel l'utilisateur appartient. Porte par le jeton pour que
   * le cloisonnement multi-locataire vienne de la session, jamais d'un parametre client.
   * Optionnel : les jetons emis avant cette evolution ne le contiennent pas.
   */
  tenantId?: string | null
}

export function generateToken(
  userId: string,
  role?: string,
  status?: string,
  tenantId?: string | null,
): string {
  const secret = getJwtSecret()
  return jwt.sign({ userId, role, status, tenantId }, secret, { algorithm: 'HS256', expiresIn: '24h' })
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const secret = getJwtSecret()
    return jwt.verify(token, secret, { algorithms: ['HS256'] }) as AuthPayload
  } catch {
    return null
  }
}

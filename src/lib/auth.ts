import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing. Define JWT_SECRET in your environment (see .env.example).')
  }
  return secret
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, role?: string, status?: string): string {
  const secret = getJwtSecret()
  return jwt.sign({ userId, role, status }, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string; role?: string; status?: string } | null {
  try {
    const secret = getJwtSecret()
    return jwt.verify(token, secret) as { userId: string; role?: string; status?: string }
  } catch {
    return null
  }
}

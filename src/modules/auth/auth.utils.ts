import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString()
}

export function generateQrCodeData(secret: string, email: string): string {
  return `otpauth://totp/AutoAfrique:${email}?secret=${secret}&issuer=AutoAfrique`
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(40).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: { userId, token, expiresAt },
  })

  return token
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `AAF-${timestamp}-${random}`
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = crypto.randomBytes(2).toString('hex').toUpperCase()
  return `INV-${timestamp}-${random}`
}

export function generatePoNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = crypto.randomBytes(2).toString('hex').toUpperCase()
  return `PO-${timestamp}-${random}`
}

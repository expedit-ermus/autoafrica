/**
 * scripts/seed-admin.ts
 * ──────────────────────────────────────────────────────────
 * Creates the first SUPER_ADMIN account securely via CLI.
 * NEVER expose admin creation through the public web interface.
 *
 * Usage:
 *   npx ts-node --esm scripts/seed-admin.ts \
 *     --email admin@autoafrique.com \
 *     --password "S3cur3P@ss!" \
 *     --firstName "Super" \
 *     --lastName "Admin"
 * ──────────────────────────────────────────────────────────
 */

import { PrismaClient } from '../src/generated/prisma/client'

import bcrypt from 'bcryptjs'
import { parseArgs } from 'node:util'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'dev.db')}`
const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })


async function main() {
  const { values } = parseArgs({
    options: {
      email:     { type: 'string' },
      password:  { type: 'string' },
      firstName: { type: 'string' },
      lastName:  { type: 'string' },
    },
    strict: true,
  })

  const { email, password, firstName, lastName } = values

  if (!email || !password || !firstName || !lastName) {
    console.error('❌ Usage: seed-admin --email X --password X --firstName X --lastName X')
    process.exit(1)
  }

  // Check if a SUPER_ADMIN already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  })

  if (existingAdmin) {
    console.warn('⚠️  A SUPER_ADMIN account already exists:', existingAdmin.email)
    console.warn('   To create an additional admin, use the invitation system in the admin dashboard.')
    process.exit(0)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.error(`❌ Email ${email} is already registered as a ${existing.role}. Aborting.`)
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
      country: 'CI',
    },
    select: { id: true, email: true, role: true, status: true },
  })

  console.log('✅ SUPER_ADMIN created successfully:')
  console.log('   ID:    ', admin.id)
  console.log('   Email: ', admin.email)
  console.log('   Role:  ', admin.role)
  console.log('   Status:', admin.status)
  console.log('')
  console.log('🔐 IMPORTANT: Store the password in a secure vault. This script will reject future calls.')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())

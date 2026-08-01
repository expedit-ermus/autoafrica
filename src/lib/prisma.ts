import { PrismaClient } from '../generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean
}

function ensureDatabaseInitialized(url: string) {
  if (globalForPrisma.dbInitialized) return
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Skipping DB init during build phase')
    globalForPrisma.dbInitialized = true
    return
  }
  const dbPath = url.replace('file:', '')
  const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql')
  if (!fs.existsSync(schemaPath)) {
    console.warn('Schema SQL not found at', schemaPath)
    globalForPrisma.dbInitialized = true
    return
  }
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8')
  try {
    const db = new Database(dbPath)
    const statements = schemaSql.split(';').filter(s => s.trim())
    for (const stmt of statements) {
      const trimmed = stmt.trim()
      if (trimmed) {
        try {
          db.exec(trimmed)
        } catch (e) {
          if (!(e instanceof Error && e.message.includes('already exists'))) {
            console.warn('SQL exec warning:', e instanceof Error ? e.message : e, 'Statement:', trimmed.substring(0, 100))
          }
        }
      }
    }
    db.close()
    console.log('Database schema initialized at runtime')
  } catch (e) {
    console.error('Failed to initialize database:', e)
  }
  globalForPrisma.dbInitialized = true
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'dev.db')}`
  if (process.env.NODE_ENV === 'production') {
    ensureDatabaseInitialized(url)
  }
  const adapter = new PrismaLibSql({ url })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

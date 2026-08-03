import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const url = process.env.DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !url.startsWith('libsql://')) {
  console.error('DATABASE_URL must be a remote libsql:// URL to push the schema.')
  process.exit(1)
}
if (!authToken) {
  console.error('TURSO_AUTH_TOKEN is required to push the schema to a remote database.')
  process.exit(1)
}

const client = createClient({ url, authToken })

const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'schema.sql')
const schemaSql = fs.readFileSync(schemaPath, 'utf-8')
const statements = schemaSql.split(';').filter(s => s.trim())

let applied = 0
for (const stmt of statements) {
  const trimmed = stmt.trim()
  if (!trimmed) continue
  try {
    await client.execute({ sql: trimmed })
    applied++
  } catch (e) {
    if (e instanceof Error && e.message.includes('already exists')) continue
    console.error('SQL exec failed:', e instanceof Error ? e.message : e)
    console.error('Statement:', trimmed.substring(0, 200))
    await client.close()
    process.exit(1)
  }
}

console.log(`Schema pushed to remote database: ${applied} statements applied`)
await client.close()

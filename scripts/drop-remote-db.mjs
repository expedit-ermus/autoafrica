import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error('DATABASE_URL and TURSO_AUTH_TOKEN are required.')
  process.exit(1)
}

const client = createClient({ url, authToken })

await client.execute('PRAGMA foreign_keys=OFF')

const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
const tables = res.rows.map(r => r.name)

for (const t of tables) {
  try {
    await client.execute({ sql: `DROP TABLE IF EXISTS "${t}"` })
  } catch (e) {
    console.warn(`Could not drop ${t}:`, e instanceof Error ? e.message : e)
  }
}

await client.execute('PRAGMA foreign_keys=ON')

console.log(`Dropped ${tables.length} tables`)
await client.close()

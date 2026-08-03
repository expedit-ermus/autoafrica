import { createClient } from '@libsql/client'

const url = process.env.DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

const client = createClient({ url, authToken })

for (const table of ['User', 'Brand', 'Category', 'Product', 'Order', 'Vehicle', 'Supplier']) {
  const r = await client.execute(`SELECT COUNT(*) as n FROM "${table}"`)
  console.log(`${table}: ${r.rows[0].n}`)
}

await client.close()

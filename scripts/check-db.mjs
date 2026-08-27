import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.production.local' });

const url = process.env.DATABASE_URL || 'libsql://autoafrica-expedit-ermus.aws-eu-west-1.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4MTkzNjkxMDksImlhdCI6MTc4NzgzMzEwOSwiaWQiOiIwMTlmYzg4Yi1kYjAxLTdmNjYtYjVmMy0wMmU4MzMzNDI3NTYiLCJraWQiOiJXMmhuQ3FjVWZBdG5XZEY3RmwzVzd6VXUyU21MU09DMHo5UlRKQm9tWldFIiwicmlkIjoiYWE0YWE1NjUtODc1YS00OTQzLTllYTEtYTE2YzVmOTBkNzg0In0.AN1woYi66vJBN9vgkO4CDzcb3-f2sDumAEdxCRdxoU1TwfZlmS762ap1ofAuQoHo2-dF8v6nzeGOkeJWDkMVCA';

const client = createClient({ url, authToken });

async function check() {
  const r = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log(`Total tables in Turso: ${r.rows.length}`);
  console.log('Sample tables:', r.rows.slice(0, 15).map(x => x.name).join(', '));
  
  for (const table of ['User', 'Product', 'Tenant', 'Warehouse', 'Order']) {
    try {
      const countRes = await client.execute(`SELECT COUNT(*) as count FROM "${table}"`);
      console.log(`- ${table}: ${countRes.rows[0].count} enregistrements`);
    } catch (e) {
      console.log(`- ${table}: erreur (${e.message})`);
    }
  }
  
  await client.close();
}

check().catch(console.error);

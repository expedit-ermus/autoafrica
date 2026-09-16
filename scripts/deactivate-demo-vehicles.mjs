/**
 * Desactive les annonces de vehicules issues du seed de demonstration.
 *
 * Les dix vehicules presents en production sont les fixtures de
 * `prisma/seed.mjs` : memes noms, memes prix, memes villes, memes
 * descriptions, aucune image, et un unique vendeur `moussa@example.com`.
 * Ce sont des offres commerciales fabriquees ; la vitrine publique ne doit
 * pas les indexer (meme motif qu'en D61 pour les notes et les avis).
 *
 * Le script pose `active = 0` plutot que de supprimer : le geste est
 * reversible et `/dashboard/vehicles` continue de les montrer.
 *
 * Sans `--apply`, rien n'est ecrit : la selection est seulement affichee.
 *
 *   node scripts/deactivate-demo-vehicles.mjs            # simulation
 *   node scripts/deactivate-demo-vehicles.mjs --apply    # ecriture
 *   node scripts/deactivate-demo-vehicles.mjs --revert --apply
 */
import { createClient } from '@libsql/client'

const apply = process.argv.includes('--apply')
const revert = process.argv.includes('--revert')

const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!url) {
  console.error('TURSO_DATABASE_URL (ou DATABASE_URL) est requis.')
  process.exit(1)
}
if (url.startsWith('libsql://') && !authToken) {
  console.error('TURSO_AUTH_TOKEN est requis pour une base distante.')
  process.exit(1)
}

/**
 * Les dix noms du seed. La selection les exige *et* un vendeur en
 * `@example.com` : une vraie annonce qui porterait par hasard le meme nom
 * appartiendrait a un vendeur reel et ne serait donc pas touchee.
 */
const SEED_NAMES = [
  'Toyota Corolla 2021',
  'Toyota RAV4 2020',
  'Peugeot 3008 2022',
  'Hyundai Tucson 2021',
  'Kia Sportage 2020',
  'Mercedes C180 2019',
  'Renault Duster 2021',
  'Nissan Qashqai 2020',
  'Volkswagen Tiguan 2021',
  'Toyota Hilux 2022',
]

const client = createClient({ url, authToken })

const placeholders = SEED_NAMES.map(() => '?').join(', ')
const selection = `
  SELECT DISTINCT v.id, v.name, v.slug, v.active
  FROM Vehicle v
  JOIN VehicleListing l ON l.vehicleId = v.id
  JOIN User u ON u.id = l.sellerId
  WHERE v.name IN (${placeholders})
    AND u.email LIKE '%@example.com'
  ORDER BY v.name
`

const found = await client.execute({ sql: selection, args: SEED_NAMES })

console.log(`Base    : ${url}`)
console.log(`Mode    : ${revert ? 'reactivation' : 'desactivation'}${apply ? ' (ECRITURE)' : ' (simulation)'}`)
console.log(`Trouves : ${found.rows.length} vehicule(s) de demonstration\n`)

for (const r of found.rows) {
  console.log(`  [${r.active ? 'actif  ' : 'inactif'}] ${r.name}  (${r.slug})`)
}

const target = revert ? 1 : 0
const toChange = found.rows.filter((r) => r.active !== target)

console.log(`\n${toChange.length} ligne(s) a modifier (active -> ${target}).`)

if (!apply) {
  console.log('\nSimulation : aucune ecriture. Relancer avec --apply pour appliquer.')
  await client.close()
  process.exit(0)
}

if (toChange.length === 0) {
  console.log('Rien a faire.')
  await client.close()
  process.exit(0)
}

const now = new Date().toISOString()
for (const r of toChange) {
  await client.execute({
    sql: 'UPDATE Vehicle SET active = ?, updatedAt = ? WHERE id = ?',
    args: [target, now, r.id],
  })
}

const after = await client.execute('SELECT COUNT(*) n FROM Vehicle WHERE active = 1')
console.log(`\n${toChange.length} vehicule(s) mis a jour.`)
console.log(`Vehicules actifs restants : ${after.rows[0].n}`)

await client.close()

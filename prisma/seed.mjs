import Database from 'better-sqlite3'
import bcryptjs from 'bcryptjs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dev.db')
const db = new Database(dbPath)

function cuid() {
  return 'c' + crypto.randomBytes(12).toString('hex')
}

async function main() {
  console.log('Seeding database with 50+ products...')

  const password = await bcryptjs.hash('password123', 12)

  const users = [
    { id: cuid(), email: 'moussa@example.com', password, firstName: 'Moussa', lastName: 'Koulibaly', phone: '+22507080910', country: 'CI', city: 'Yopougon', shopName: 'Garage Moussa Pièces', specialties: '["Toyota","Peugeot"]', role: 'seller', plan: 'starter', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: cuid(), email: 'abdoulaye@example.com', password, firstName: 'Abdoulaye', lastName: 'Ndiaye', phone: '+221771234567', country: 'SN', city: 'Pikine', shopName: 'Casse Auto Pikine', specialties: '["Hyundai","Kia"]', role: 'seller', plan: 'pro', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: cuid(), email: 'fatima@example.com', password, firstName: 'Fatima', lastName: 'Camara', phone: '+22376543210', country: 'ML', city: 'Bamako', shopName: 'Garage Bamako Express', specialties: '["Renault","Mercedes"]', role: 'buyer', plan: 'starter', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]

  const insertUser = db.prepare(`INSERT INTO User (id, email, password, firstName, lastName, phone, country, city, shopName, specialties, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  for (const u of users) {
    insertUser.run(u.id, u.email, u.password, u.firstName, u.lastName, u.phone, u.country, u.city, u.shopName, u.specialties, u.role, u.createdAt, u.updatedAt)
  }

  const brands = [
    { id: cuid(), name: 'Toyota', slug: 'toyota', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Peugeot', slug: 'peugeot', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Hyundai', slug: 'hyundai', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Kia', slug: 'kia', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Mercedes', slug: 'mercedes', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Renault', slug: 'renault', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Nissan', slug: 'nissan', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Volkswagen', slug: 'volkswagen', active: 1, createdAt: new Date().toISOString() },
  ]

  const insertBrand = db.prepare(`INSERT INTO Brand (id, name, slug, active, createdAt) VALUES (?, ?, ?, ?, ?)`)
  for (const b of brands) {
    insertBrand.run(b.id, b.name, b.slug, b.active, b.createdAt)
  }

  const categories = [
    { id: cuid(), name: 'Moteur', slug: 'moteur', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Frein', slug: 'frein', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Suspension', slug: 'suspension', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Carrosserie', slug: 'carrosserie', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Électrique', slug: 'electrique', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Transmission', slug: 'transmission', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Échappement', slug: 'echappement', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Pneumatique', slug: 'pneumatique', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Refroidissement', slug: 'refroidissement', active: 1, createdAt: new Date().toISOString() },
    { id: cuid(), name: 'Direction', slug: 'direction', active: 1, createdAt: new Date().toISOString() },
  ]

  const insertCategory = db.prepare(`INSERT INTO Category (id, name, slug, active, createdAt) VALUES (?, ?, ?, ?, ?)`)
  for (const c of categories) {
    insertCategory.run(c.id, c.name, c.slug, c.active, c.createdAt)
  }

  const now = new Date().toISOString()

  const products = [
    // Toyota
    { title: 'Filtre à huile Toyota Hilux 2.4/2.8', description: 'Filtre à huile d\'origine pour Toyota Hilux 2.4 D-4D et 2.8 D-4D.', reference: '04152-YZZA1', brand: 'Toyota', category: 'Moteur', price: 8500, stock: 45, condition: 'new' },
    { title: 'Filtre à air Toyota Corolla 1.6', description: 'Filtre à air haut débit pour Toyota Corolla 1.6 VVT-i.', reference: '17801-21050', brand: 'Toyota', category: 'Moteur', price: 6500, stock: 30, condition: 'new' },
    { title: 'Kit distribution Toyota Land Cruiser 4.2', description: 'Kit distribution complet pour Land Cruiser 4.2 D-4D.', reference: '13568-17011', brand: 'Toyota', category: 'Moteur', price: 120000, stock: 3, condition: 'new' },
    { title: 'Plaquettes frein avant Toyota Hilux', description: 'Plaquettes de frein avant pour Toyota Hilux 2016-2024.', reference: '04465-0K070', brand: 'Toyota', category: 'Frein', price: 18000, stock: 25, condition: 'new' },
    { title: 'Disques frein avant Toyota Corolla', description: 'Disques de frein avant ventilés pour Corolla 2013-2018.', reference: '43512-12080', brand: 'Toyota', category: 'Frein', price: 32000, stock: 10, condition: 'new' },
    { title: 'Amortisseur avant Toyota RAV4', description: 'Amortisseur avant gauche pour RAV4 2013-2018.', reference: '48520-42100', brand: 'Toyota', category: 'Suspension', price: 42000, stock: 8, condition: 'used' },
    { title: 'Alternateur Toyota Hilux 2.4', description: 'Alternateur reconditionné pour Hilux 2.4 D-4D.', reference: '27060-0C020', brand: 'Toyota', category: 'Électrique', price: 65000, stock: 4, condition: 'refurbished' },
    { title: 'Démarreur Toyota Corolla 1.8', description: 'Démarreur neuf pour Corolla 1.8 VVT-i.', reference: '28100-12100', brand: 'Toyota', category: 'Électrique', price: 55000, stock: 6, condition: 'new' },
    { title: 'Pompe à eau Toyota Land Cruiser', description: 'Pompe à eau pour Land Cruiser 4.5 V8.', reference: '16100-17040', brand: 'Toyota', category: 'Refroidissement', price: 38000, stock: 5, condition: 'new' },
    { title: 'Turbo Toyota Hilux 2.8', description: 'Turbo reconditionné pour Hilux 2.8 D-4D.', reference: '17201-30090', brand: 'Toyota', category: 'Moteur', price: 180000, stock: 2, condition: 'refurbished' },

    // Peugeot
    { title: 'Disques frein avant Peugeot 307/408', description: 'Jeu de 2 disques de frein avant ventilés 283mm.', reference: '410604', brand: 'Peugeot', category: 'Frein', price: 25000, stock: 12, condition: 'new' },
    { title: 'Filtre à huile Peugeot 308 1.6 HDi', description: 'Filtre à huile pour 308 1.6 BlueHDi.', reference: '98049834', brand: 'Peugeot', category: 'Moteur', price: 7500, stock: 35, condition: 'new' },
    { title: 'Kit embrayage Peugeot 207/208', description: 'Kit embrayage complet disque + mécanisme + butée.', reference: '420906', brand: 'Peugeot', category: 'Transmission', price: 85000, stock: 7, condition: 'new' },
    { title: 'Rétroviseur gauche Peugeot 308', description: 'Rétroviseur avec régulation électrique.', reference: '8153HR', brand: 'Peugeot', category: 'Carrosserie', price: 28000, stock: 4, condition: 'used' },
    { title: 'Courroie accessoire Peugeot 307 1.6', description: 'Courroie trapézoïdale pour 307 1.6 16V.', reference: '5750Q2', brand: 'Peugeot', category: 'Moteur', price: 8500, stock: 20, condition: 'new' },
    { title: 'Support moteur Peugeot 208', description: 'Support moteur supérieur pour 208 1.4 HDi.', reference: '161980', brand: 'Peugeot', category: 'Moteur', price: 15000, stock: 9, condition: 'new' },
    { title: 'Filtre habitacle Peugeot 2008', description: 'Filtre à pollens pour 2008 1.6 BlueHDi.', reference: '98109814', brand: 'Peugeot', category: 'Moteur', price: 5500, stock: 40, condition: 'new' },
    { title: 'Pompe à eau Peugeot 407 2.0 HDi', description: 'Pompe à eau pour 407 2.0 HDi 16V.', reference: '161153', brand: 'Peugeot', category: 'Refroidissement', price: 32000, stock: 6, condition: 'new' },

    // Hyundai
    { title: 'Amortisseur arrière Hyundai Tucson III', description: 'Amortisseur arrière gauche pour Tucson III (TL).', reference: '55300-2V500', brand: 'Hyundai', category: 'Suspension', price: 35000, stock: 8, condition: 'used' },
    { title: 'Filtre à huile Hyundai Tucson 2.0 CRDi', description: 'Filtre à huile pour Tucson 2.0 CRDi.', reference: '26300-35530', brand: 'Hyundai', category: 'Moteur', price: 7000, stock: 28, condition: 'new' },
    { title: 'Pompe à eau Hyundai Elantra 1.6', description: 'Pompe à eau pour Elantra 1.6 CRDi.', reference: '25100-2E000', brand: 'Hyundai', category: 'Moteur', price: 28000, stock: 7, condition: 'new' },
    { title: 'Alternateur Hyundai i30 1.6', description: 'Alternateur reconditionné pour i30 1.6 CRDi.', reference: '37300-2B500', brand: 'Hyundai', category: 'Électrique', price: 52000, stock: 5, condition: 'refurbished' },
    { title: 'Kit distribution Hyundai Tucson 2.0', description: 'Kit distribution pour Tucson 2.0 CRDi 16V.', reference: '21410-2B250', brand: 'Hyundai', category: 'Moteur', price: 95000, stock: 4, condition: 'new' },
    { title: 'Disques frein arrière Hyundai Accent', description: 'Disques frein arrière pour Accent 1.5 CRDi.', reference: '58110-1Y200', brand: 'Hyundai', category: 'Frein', price: 22000, stock: 11, condition: 'new' },
    { title: 'Démarreur Hyundai Santa Fe 2.2', description: 'Démarreur neuf pour Santa Fe 2.2 CRDi.', reference: '36100-2B100', brand: 'Hyundai', category: 'Électrique', price: 48000, stock: 3, condition: 'new' },
    { title: 'Radiateur Hyundai Tucson 1.6 T-GDi', description: 'Radiateur de refroidissement pour Tucson 1.6 T-GDi.', reference: '25310-2B500', brand: 'Hyundai', category: 'Refroidissement', price: 65000, stock: 4, condition: 'new' },

    // Kia
    { title: 'Plaquettes frein arrière Kia Sportage IV', description: 'Plaquettes de frein arrière pour Sportage IV.', reference: 'UK581-18000', brand: 'Kia', category: 'Frein', price: 15000, stock: 20, condition: 'new' },
    { title: 'Filtre à huile Kia Sportage 2.0 CRDi', description: 'Filtre à huile pour Sportage 2.0 CRDi.', reference: '26300-35530', brand: 'Kia', category: 'Moteur', price: 6500, stock: 30, condition: 'new' },
    { title: 'Support moteur Kia Rio III', description: 'Support moteur supérieur pour Rio III 1.4 CRDi.', reference: '21960-1K000', brand: 'Kia', category: 'Moteur', price: 18000, stock: 10, condition: 'new' },
    { title: 'Kit embrayage Kia Sportage 2.0', description: 'Kit embrayage complet pour Sportage 2.0 CRDi.', reference: '42000-2B100', brand: 'Kia', category: 'Transmission', price: 92000, stock: 5, condition: 'new' },
    { title: 'Amortisseur avant Kia Rio IV', description: 'Amortisseur avant gauche pour Rio IV 1.4.', reference: '54650-1K100', brand: 'Kia', category: 'Suspension', price: 32000, stock: 7, condition: 'new' },
    { title: 'Alternateur Kia Sportage 1.6', description: 'Alternateur pour Sportage 1.6 T-GDi.', reference: '37300-2B100', brand: 'Kia', category: 'Électrique', price: 58000, stock: 4, condition: 'new' },
    { title: 'Turbo Kia Sportage 1.6 T-GDi', description: 'Turbo reconditionné pour Sportage 1.6 T-GDi.', reference: '28101-2B100', brand: 'Kia', category: 'Moteur', price: 165000, stock: 2, condition: 'refurbished' },

    // Mercedes
    { title: 'Courroie distribution Mercedes C180', description: 'Kit courroie de distribution complet C180 W204.', reference: 'A0009970092', brand: 'Mercedes', category: 'Moteur', price: 85000, stock: 5, condition: 'new' },
    { title: 'Filtre à huile Mercedes C200 CDI', description: 'Filtre à huile pour C200 CDI W204.', reference: 'A6511800009', brand: 'Mercedes', category: 'Moteur', price: 12000, stock: 15, condition: 'new' },
    { title: 'Plaquettes frein avant Mercedes C-Class', description: 'Plaquettes avant pour C180/C200 W204.', reference: 'A0084200820', brand: 'Mercedes', category: 'Frein', price: 22000, stock: 12, condition: 'new' },
    { title: 'Amortisseur avant Mercedes E-Class', description: 'Amortisseur avant pour E220 CDI W212.', reference: 'A2123230113', brand: 'Mercedes', category: 'Suspension', price: 55000, stock: 3, condition: 'used' },
    { title: 'Alternateur Mercedes Sprinter', description: 'Alternateur reconditionné pour Sprinter 316 CDI.', reference: 'A0039012702', brand: 'Mercedes', category: 'Électrique', price: 75000, stock: 4, condition: 'refurbished' },
    { title: 'Radiateur Mercedes C200', description: 'Radiateur de refroidissement pour C200 CGI.', reference: 'A2045000590', brand: 'Mercedes', category: 'Refroidissement', price: 85000, stock: 3, condition: 'new' },

    // Renault
    { title: 'Rétroviseur droit Renault Symbol', description: 'Rétroviseur droit avec régulation électrique.', reference: '8200326135', brand: 'Renault', category: 'Carrosserie', price: 22000, stock: 3, condition: 'used' },
    { title: 'Filtre à huile Renault Clio 4 1.5 dCi', description: 'Filtre à huile pour Clio 4 1.5 dCi.', reference: '7700274183', brand: 'Renault', category: 'Moteur', price: 6000, stock: 40, condition: 'new' },
    { title: 'Plaquettes frein avant Renault Duster', description: 'Plaquettes de frein avant pour Duster 1.5 dCi.', reference: '7701208256', brand: 'Renault', category: 'Frein', price: 14000, stock: 18, condition: 'new' },
    { title: 'Kit distribution Renault Megane 3', description: 'Kit distribution pour Megane 3 1.5 dCi.', reference: '8200890853', brand: 'Renault', category: 'Moteur', price: 78000, stock: 6, condition: 'new' },
    { title: 'Démarreur Renault Duster 1.5', description: 'Démarreur neuf pour Duster 1.5 dCi.', reference: '8200284836', brand: 'Renault', category: 'Électrique', price: 45000, stock: 5, condition: 'new' },
    { title: 'Pompe à eau Renault Scenic 3', description: 'Pompe à eau pour Scenic 3 1.5 dCi.', reference: '7700108193', brand: 'Renault', category: 'Refroidissement', price: 25000, stock: 8, condition: 'new' },

    // Nissan
    { title: 'Filtre à huile Nissan Qashqai 1.5 dCi', description: 'Filtre à huile pour Qashqai 1.5 dCi.', reference: '15208-4M500', brand: 'Nissan', category: 'Moteur', price: 7500, stock: 22, condition: 'new' },
    { title: 'Amortisseur arrière Nissan X-Trail', description: 'Amortisseur arrière pour X-Trail T31 2.0 dCi.', reference: '56210-4M500', brand: 'Nissan', category: 'Suspension', price: 38000, stock: 5, condition: 'used' },
    { title: 'Plaquettes frein Nissan Juke', description: 'Plaquettes de frein avant pour Juke 1.5 dCi.', reference: 'D4060-1KA0A', brand: 'Nissan', category: 'Frein', price: 16000, stock: 14, condition: 'new' },

    // Volkswagen
    { title: 'Filtre à huile VW Golf 6 1.6 TDI', description: 'Filtre à huile pour Golf 6 1.6 TDI.', reference: '03N115561', brand: 'Volkswagen', category: 'Moteur', price: 8000, stock: 25, condition: 'new' },
    { title: 'Disques frein avant VW Polo', description: 'Disques de frein avant ventilés pour Polo 6 1.4 TDI.', reference: '6R0615301', brand: 'Volkswagen', category: 'Frein', price: 28000, stock: 9, condition: 'new' },
    { title: 'Alternateur VW Tiguan 2.0 TDI', description: 'Alternateur reconditionné pour Tiguan 2.0 TDI.', reference: '03N903023H', brand: 'Volkswagen', category: 'Électrique', price: 62000, stock: 3, condition: 'refurbished' },
  ]

  const brandMap = {}
  for (const b of brands) {
    brandMap[b.name] = b.id
  }

  const catMap = {}
  for (const c of categories) {
    catMap[c.name] = c.id
  }

  const insertProduct = db.prepare(`INSERT INTO Product (id, title, slug, description, reference, brandId, categoryId, price, currency, stock, condition, sellerId, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  for (const p of products) {
    const sellerId = Math.random() > 0.5 ? users[0].id : users[1].id
    const brandId = brandMap[p.brand] || null
    const categoryId = catMap[p.category] || null
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + crypto.randomBytes(3).toString('hex')
    insertProduct.run(cuid(), p.title, slug, p.description, p.reference, brandId, categoryId, p.price, 'XOF', p.stock, p.condition, sellerId, 1, now, now)
  }

  console.log(`Seeded: ${users.length} users, ${brands.length} brands, ${categories.length} categories, ${products.length} products`)
  db.close()
}

main().catch(console.error)

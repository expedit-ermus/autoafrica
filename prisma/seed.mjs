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

  const productIds = []
  for (const p of products) {
    const pid = cuid()
    productIds.push(pid)
    const sellerId = Math.random() > 0.5 ? users[0].id : users[1].id
    const brandId = brandMap[p.brand] || null
    const categoryId = catMap[p.category] || null
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + crypto.randomBytes(3).toString('hex')
    insertProduct.run(pid, p.title, slug, p.description, p.reference, brandId, categoryId, p.price, 'XOF', p.stock, p.condition, sellerId, 1, now, now)
  }

  console.log(`Seeded: ${users.length} users, ${brands.length} brands, ${categories.length} categories, ${products.length} products`)

  const vehicles = [
    { name: 'Toyota Corolla 2021', brand: 'Toyota', year: 2021, price: 11500000, mileage: 62000, fuel: 'GASOLINE', gearbox: 'AUTOMATIC', condition: 'USED', bodyType: 'Berline', color: 'Gris métal', city: 'Abidjan', description: 'Corolla 2021, entretien suivi, clim, Bluetooth, radar de recul.' },
    { name: 'Toyota RAV4 2020', brand: 'Toyota', year: 2020, price: 18500000, mileage: 85000, fuel: 'GASOLINE', gearbox: 'AUTOMATIC', condition: 'USED', bodyType: 'SUV', color: 'Blanc', city: 'Yopougon', description: 'RAV4 2020 essence, 4x4, toit ouvrant, sièges cuir, carnet complet.' },
    { name: 'Peugeot 3008 2022', brand: 'Peugeot', year: 2022, price: 16800000, mileage: 40000, fuel: 'DIESEL', gearbox: 'AUTOMATIC', condition: 'USED', bodyType: 'SUV', color: 'Noir', city: 'Bouaké', description: '3008 2022 BlueHDi 130, caméra 360, écran tactile, très bon état.' },
    { name: 'Hyundai Tucson 2021', brand: 'Hyundai', year: 2021, price: 14200000, mileage: 58000, fuel: 'DIESEL', gearbox: 'AUTOMATIC', condition: 'USED', bodyType: 'SUV', color: 'Bleu nuit', city: 'Cocody', description: 'Tucson 2.0 CRDi, pack confort, régulateur, GPS, non accidenté.' },
    { name: 'Kia Sportage 2020', brand: 'Kia', year: 2020, price: 13500000, mileage: 70000, fuel: 'DIESEL', gearbox: 'AUTOMATIC', condition: 'USED', bodyType: 'SUV', color: 'Rouge', city: 'Abidjan', description: 'Sportage IV 2.0 CRDi, entretien en concession, climatisation bi-zone.' },
    { name: 'Mercedes C180 2019', brand: 'Mercedes', year: 2019, price: 19500000, mileage: 96000, fuel: 'GASOLINE', gearbox: 'AUTOMATIC', condition: 'CERTIFIED', bodyType: 'Berline', color: 'Argent', city: 'Abidjan', description: 'C180 W205, certifié, carnet Mercedes, toit ouvrant, sièges électriques.' },
    { name: 'Renault Duster 2021', brand: 'Renault', year: 2021, price: 8800000, mileage: 54000, fuel: 'DIESEL', gearbox: 'MANUAL', condition: 'USED', bodyType: 'SUV', color: 'Blanc', city: 'San-Pédro', description: 'Duster 1.5 dCi 110, barre de toit, Bluetooth, véhicule de particulier.' },
    { name: 'Nissan Qashqai 2020', brand: 'Nissan', year: 2020, price: 13900000, mileage: 64000, fuel: 'DIESEL', gearbox: 'MANUAL', condition: 'USED', bodyType: 'SUV', color: 'Gris', city: 'Yamoussoukro', description: 'Qashqai 1.5 dCi, caméra de recul, capteurs, entretien régulier.' },
    { name: 'Volkswagen Tiguan 2021', brand: 'Volkswagen', year: 2021, price: 17200000, mileage: 47000, fuel: 'DIESEL', gearbox: 'AUTOMATIC', condition: 'USED', bodyType: 'SUV', color: 'Noir', city: 'Abidjan', description: 'Tiguan 2.0 TDI, 4MOTION, écran 9,2", hayon électrique.' },
    { name: 'Toyota Hilux 2022', brand: 'Toyota', year: 2022, price: 24000000, mileage: 38000, fuel: 'DIESEL', gearbox: 'AUTOMATIC', condition: 'USED', bodyType: 'Pickup', color: 'Blanc', city: 'Korhogo', description: 'Hilux 2.8 D-4D double cabine, traction 4x4, coffre bâché.' },
  ]

  const insertVehicle = db.prepare(`INSERT INTO Vehicle (id, brandId, name, slug, year, price, currency, mileage, fuel, gearbox, condition, bodyType, color, city, country, description, active, featured, views, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 'XOF', ?, ?, ?, ?, ?, ?, ?, 'CI', ?, 1, 0, 0, ?, ?)`)

  const insertListing = db.prepare(`INSERT INTO VehicleListing (id, vehicleId, sellerId, status, price, currency, createdAt, updatedAt) VALUES (?, ?, ?, 'ACTIVE', ?, 'XOF', ?, ?)`)

  for (const v of vehicles) {
    const id = cuid()
    const brandId = brandMap[v.brand]
    if (!brandId) continue
    const slug = v.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + crypto.randomBytes(3).toString('hex')
    const sellerId = users[0].id
    const ts = new Date().toISOString()
    insertVehicle.run(id, brandId, v.name, slug, v.year, v.price, v.mileage, v.fuel, v.gearbox, v.condition, v.bodyType, v.color, v.city, v.description, ts, ts)
    insertListing.run(cuid(), id, sellerId, v.price, ts, ts)
  }

  console.log(`Seeded: ${vehicles.length} vehicles + active listings`)

  const suppliers = [
    { name: 'Guangzhou Auto Parts Co.', companyName: '广州汽车配件有限公司', country: 'CN', city: 'Guangzhou', contactPerson: 'Wei Zhang', email: 'wei@guangzhouparts.cn', phone: '+8613800001234', whatsapp: '+8613800001234', website: 'www.guangzhouparts.cn', rating: 4.8, leadTimeDays: 45, paymentTerms: 'LC', moq: 100, verified: true },
    { name: 'Yiwu Spare Parts Trading', country: 'CN', city: 'Yiwu', contactPerson: 'Chen Li', email: 'chen@yiwuparts.cn', phone: '+8613800005678', leadTimeDays: 30, paymentTerms: 'TT', moq: 50, verified: true },
    { name: 'Taipei Auto Components', country: 'TW', city: 'Taipei', contactPerson: 'Huang Ming', email: 'sales@taipeiauto.tw', phone: '+886900000000', leadTimeDays: 35, paymentTerms: 'TT', moq: 200, verified: true },
    { name: 'Osaka Jidosha Bihin', country: 'JP', city: 'Osaka', contactPerson: 'Tanaka Hiroshi', email: 'info@osakajidosha.jp', phone: '+818000000000', website: 'www.osakajidosha.jp', rating: 4.5, leadTimeDays: 60, paymentTerms: 'LC', moq: 50, verified: false },
    { name: 'Frankfurt KFZ Teile GmbH', companyName: 'Frankfurt KFZ Teile GmbH', country: 'DE', city: 'Frankfurt', contactPerson: 'Klaus Weber', email: 'kontakt@frankfurtkfz.de', phone: '+496900000000', leadTimeDays: 20, paymentTerms: 'NET30', moq: 10, verified: true },
    { name: 'Dubai Auto Trading LLC', country: 'AE', city: 'Dubai', contactPerson: 'Omar Al Farsi', email: 'omar@dubaiauto.ae', phone: '+971500000000', whatsapp: '+971500000000', website: 'www.dubaiauto.ae', rating: 4.2, leadTimeDays: 25, paymentTerms: 'NET60', moq: 20, verified: false },
    { name: 'Casablanca Pièces Auto', country: 'MA', city: 'Casablanca', contactPerson: 'Youssef Benali', email: 'contact@casablancapieces.ma', phone: '+212600000000', leadTimeDays: 15, paymentTerms: 'COD', moq: 5, verified: true },
  ]

  const insertSupplier = db.prepare(`INSERT INTO Supplier (id, name, companyName, country, city, address, contactPerson, email, phone, whatsapp, website, rating, leadTimeDays, paymentTerms, moq, verified, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  const supplierIds = []
  for (const s of suppliers) {
    const id = cuid()
    supplierIds.push(id)
    const ts = new Date().toISOString()
    insertSupplier.run(id, s.name, s.companyName || null, s.country, s.city || null, s.contactPerson || null, s.email || null, s.phone || null, s.whatsapp || null, s.website || null, s.rating || 0, s.leadTimeDays || null, s.paymentTerms || null, s.moq || null, s.verified ? 1 : 0, ts, ts)
  }

  console.log(`Seeded: ${suppliers.length} suppliers`)

  const purchaseOrders = [
    { supplierIndex: 0, status: 'ORDERED', currency: 'USD', paymentTerms: 'LC', shippingMethod: 'sea', items: [{ productName: 'Filtre a huile Toyota Hilux', reference: '04152-YZZA1', quantity: 200, unitPrice: 4 }, { productName: 'Plaquettes frein Toyota Hilux', reference: '04465-0K070', quantity: 100, unitPrice: 9 }] },
    { supplierIndex: 1, status: 'SHIPPED', currency: 'USD', paymentTerms: 'TT', shippingMethod: 'sea', trackingNumber: 'CGTX7788990011', items: [{ productName: 'Courroie accessoire Peugeot 307', reference: '5750Q2', quantity: 150, unitPrice: 3 }, { productName: 'Kit embrayage Peugeot 208', reference: '420906', quantity: 60, unitPrice: 38 }] },
    { supplierIndex: 2, status: 'IN_TRANSIT', currency: 'USD', paymentTerms: 'TT', shippingMethod: 'air', trackingNumber: 'TAEC2211005566', items: [{ productName: 'Alternateur Hyundai i30', reference: '37300-2B500', quantity: 80, unitPrice: 22 }] },
    { supplierIndex: 4, status: 'CUSTOMS', currency: 'EUR', paymentTerms: 'NET30', shippingMethod: 'sea', trackingNumber: 'HLCFRANK123456', items: [{ productName: 'Disques frein avant Peugeot 307', reference: '410604', quantity: 120, unitPrice: 12 }, { productName: 'Support moteur Peugeot 208', reference: '161980', quantity: 90, unitPrice: 6 }] },
    { supplierIndex: 6, status: 'DELIVERED', currency: 'XOF', paymentTerms: 'COD', shippingMethod: 'road', items: [{ productName: 'Filtre a huile Renault Clio 4', reference: '7700274183', quantity: 300, unitPrice: 1500 }] },
    { supplierIndex: 0, status: 'COMPLETED', currency: 'USD', paymentTerms: 'LC', shippingMethod: 'sea', items: [{ productName: 'Turbo Toyota Hilux 2.8', reference: '17201-30090', quantity: 40, unitPrice: 85 }] },
  ]

  const insertPO = db.prepare(`INSERT INTO PurchaseOrder (id, poNumber, supplierId, status, totalAmount, currency, paymentTerms, expectedDate, shippingMethod, trackingNumber, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const insertPOItem = db.prepare(`INSERT INTO PurchaseOrderItem (id, purchaseOrderId, productName, reference, quantity, unitPrice, totalPrice, receivedQty) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`)
  const nowIso = () => new Date().toISOString()
  const addDays = (n) => new Date(Date.now() + n * 86400000).toISOString()

  const poIds = []
  for (const po of purchaseOrders) {
    const id = cuid()
    poIds.push(id)
    const ts = nowIso()
    const supplierId = supplierIds[po.supplierIndex]
    const totalAmount = po.items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0)
    const poNumber = 'PO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    insertPO.run(id, poNumber, supplierId, po.status, totalAmount, po.currency, po.paymentTerms, addDays(30), po.shippingMethod, po.trackingNumber || null, users[0].id, ts, ts)
    for (const item of po.items) {
      insertPOItem.run(cuid(), id, item.productName, item.reference, item.quantity, item.unitPrice, item.quantity * item.unitPrice)
    }
  }

  console.log(`Seeded: ${purchaseOrders.length} purchase orders`)

  const containers = [
    { poIndex: 1, containerNumber: 'MSKU9876543', size: '40hq', status: 'SHIPPED', originPort: 'Yiwu', destinationPort: 'Abidjan', shippingLine: 'CMA CGM', vesselName: 'CMA CGM IVORY COAST', etaOrigin: -10, etaDestination: 28 },
    { poIndex: 2, containerNumber: 'TCLU5566778', size: '20ft', status: 'IN_TRANSIT', originPort: 'Taipei', destinationPort: 'Abidjan', shippingLine: 'MSC', vesselName: 'MSC OLIVIA', etaOrigin: -5, etaDestination: 20 },
    { poIndex: 3, containerNumber: 'HLXU1122334', size: '40ft', status: 'ARRIVED_PORT', originPort: 'Hamburg', destinationPort: 'Abidjan', shippingLine: 'Hapag-Lloyd', vesselName: 'HAMBURG EXPRESS', etaOrigin: -15, etaDestination: 12 },
    { poIndex: 4, containerNumber: 'CMAU4455667', size: '40hq', status: 'CUSTOMS_PROCESSING', originPort: 'Casablanca', destinationPort: 'Abidjan', shippingLine: 'CMA CGM', vesselName: 'CASABLANCA STAR', etaOrigin: -8, etaDestination: 5 },
  ]

  const insertContainer = db.prepare(`INSERT INTO Container (id, containerNumber, purchaseOrderId, size, status, originPort, destinationPort, shippingLine, vesselName, etaOrigin, etaDestination, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  const containerIds = []
  for (const c of containers) {
    const id = cuid()
    containerIds.push(id)
    const ts = nowIso()
    insertContainer.run(id, c.containerNumber, poIds[c.poIndex], c.size, c.status, c.originPort, c.destinationPort, c.shippingLine || null, c.vesselName || null, addDays(c.etaOrigin), addDays(c.etaDestination), ts, ts)
  }

  console.log(`Seeded: ${containers.length} containers`)

  const customsRecords = [
    { containerIndex: 3, declarationNumber: 'D2024-0113', hsCode: '8708', cifValue: 15000000, duties: 1500000, taxes: 900000, fees: 250000, totalDuty: 2650000, status: 'UNDER_REVIEW', broker: 'SGS Cote d\'Ivoire', brokerContact: '+2252722000000' },
    { containerIndex: 0, declarationNumber: 'D2024-0114', hsCode: '8708', cifValue: 40000000, duties: 4000000, taxes: 2400000, fees: 400000, totalDuty: 6800000, status: 'DUTY_ASSESSED', broker: 'Bollore Logistics', brokerContact: '+2252721000000' },
    { containerIndex: 2, declarationNumber: 'D2024-0115', hsCode: '8483', cifValue: 22000000, duties: 2200000, taxes: 1320000, fees: 350000, totalDuty: 3870000, status: 'PENDING', broker: 'SGS Cote d\'Ivoire', brokerContact: '+2252722000000' },
  ]

  const insertCustoms = db.prepare(`INSERT INTO CustomsRecord (id, containerId, declarationNumber, hsCode, cifValue, duties, taxes, fees, totalDuty, status, broker, brokerContact, releasedAt, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)`)

  for (const r of customsRecords) {
    const ts = nowIso()
    insertCustoms.run(cuid(), containerIds[r.containerIndex], r.declarationNumber, r.hsCode, r.cifValue, r.duties, r.taxes, r.fees, r.totalDuty, r.status, r.broker, r.brokerContact, ts, ts)
  }

  console.log(`Seeded: ${customsRecords.length} customs records`)

  const warehouses = [
    { name: 'Depot Principal Abidjan', code: 'ABJ-01', type: 'STANDARD', country: 'CI', city: 'Abidjan', address: 'Zone Industrielle de Yopougon', capacity: 5000, active: 1 },
    { name: 'Depot Portuaire Abidjan', code: 'ABJ-PORT', type: 'CROSS_DOCK', country: 'CI', city: 'Abidjan', address: 'Port Autonome d\'Abidjan, Terminal', capacity: 2000, active: 1 },
    { name: 'Depot Bouake', code: 'BKE-01', type: 'STANDARD', country: 'CI', city: 'Bouake', address: 'Zone industrielle de Bouake', capacity: 1500, active: 1 },
  ]

  const insertWarehouse = db.prepare(`INSERT INTO Warehouse (id, name, code, type, country, city, address, capacity, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  const warehouseIds = []
  for (const w of warehouses) {
    const id = cuid()
    warehouseIds.push(id)
    const ts = nowIso()
    insertWarehouse.run(id, w.name, w.code, w.type, w.country, w.city, w.address, w.capacity, w.active, ts, ts)
  }

  console.log(`Seeded: ${warehouses.length} warehouses`)

  const insertInventory = db.prepare(`INSERT INTO Inventory (id, productId, warehouseId, quantity, reserved, available, binLocation, lotNumber, costBasis, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const insertMovement = db.prepare(`INSERT INTO StockMovement (id, productId, fromWarehouseId, toWarehouseId, inventoryId, type, quantity, reference, notes, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

  const stockLines = [
    { productIndex: 0, warehouseIndex: 0, quantity: 45, reserved: 3, binLocation: 'A-01-01', lotNumber: 'LOT-A1', costBasis: 5000 },
    { productIndex: 1, warehouseIndex: 0, quantity: 30, reserved: 2, binLocation: 'A-01-02', lotNumber: 'LOT-A2', costBasis: 3800 },
    { productIndex: 3, warehouseIndex: 0, quantity: 25, reserved: 0, binLocation: 'B-02-01', lotNumber: 'LOT-B1', costBasis: 11000 },
    { productIndex: 4, warehouseIndex: 0, quantity: 10, reserved: 4, binLocation: 'B-02-02', lotNumber: 'LOT-B2', costBasis: 21000 },
    { productIndex: 9, warehouseIndex: 0, quantity: 2, reserved: 1, binLocation: 'C-03-01', lotNumber: 'LOT-C1', costBasis: 120000 },
    { productIndex: 0, warehouseIndex: 1, quantity: 20, reserved: 1, binLocation: 'D-01-01', lotNumber: 'LOT-A1', costBasis: 5000 },
    { productIndex: 2, warehouseIndex: 1, quantity: 3, reserved: 0, binLocation: 'D-01-02', lotNumber: 'LOT-D1', costBasis: 80000 },
    { productIndex: 5, warehouseIndex: 2, quantity: 8, reserved: 2, binLocation: 'E-01-01', lotNumber: 'LOT-E1', costBasis: 28000 },
  ]

  for (const line of stockLines) {
    const id = cuid()
    const ts = nowIso()
    const productId = productIds[line.productIndex]
    const warehouseId = warehouseIds[line.warehouseIndex]
    const available = line.quantity - line.reserved
    insertInventory.run(id, productId, warehouseId, line.quantity, line.reserved, available, line.binLocation, line.lotNumber, line.costBasis, ts)
    insertMovement.run(cuid(), productId, null, null, id, 'RECEIVED', line.quantity, 'PO-SEED', `Reception initiale — lot ${line.lotNumber}`, users[0].id, ts)
  }

  console.log(`Seeded: ${stockLines.length} inventory lines + movements`)

  const accounts = [
    { code: 'C01', name: 'Caisse', type: 'asset', balance: 2500000 },
    { code: 'C02', name: 'Banque SDCI', type: 'asset', balance: 18500000 },
    { code: 'C03', name: 'Créances clients', type: 'asset', balance: 4200000 },
    { code: 'P01', name: 'Dettes fournisseurs', type: 'liability', balance: -7300000 },
    { code: 'R01', name: 'Ventes pièces détachées', type: 'revenue', balance: 24000000 },
    { code: 'R02', name: 'Ventes véhicules', type: 'revenue', balance: 52000000 },
    { code: 'E01', name: 'Achats marchandises', type: 'expense', balance: -15000000 },
    { code: 'E02', name: 'Frais logistiques', type: 'expense', balance: -3200000 },
    { code: 'E03', name: 'Droits de douane', type: 'expense', balance: -6800000 },
  ]

  const insertAccount = db.prepare(`INSERT INTO Account (id, code, name, type, parentId, balance, currency, tenantId, active, createdAt) VALUES (?, ?, ?, ?, NULL, ?, 'XOF', NULL, 1, ?)`)

  const accountIds = []
  for (const a of accounts) {
    const id = cuid()
    accountIds.push(id)
    insertAccount.run(id, a.code, a.name, a.type, a.balance, nowIso())
  }

  console.log(`Seeded: ${accounts.length} accounts`)

  const ledgerEntries = [
    { accountIndex: 4, type: 'credit', amount: 1200000, description: 'Vente pièces détachées — facture FAC-2026-001', reference: 'INV-001' },
    { accountIndex: 5, type: 'credit', amount: 8000000, description: 'Vente véhicule Toyota Corolla 2021', reference: 'INV-002' },
    { accountIndex: 3, type: 'debit', amount: 4500000, description: 'Paiement fournisseur Guangzhou Auto Parts', reference: 'PO-2026-001' },
    { accountIndex: 1, type: 'debit', amount: 9200000, description: 'Encaissement vente véhicule', reference: 'INV-002' },
  ]

  const insertTransaction = db.prepare(`INSERT INTO "Transaction" (id, accountId, type, amount, balance, description, reference, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)

  for (const e of ledgerEntries) {
    const account = accounts[e.accountIndex]
    const newBalance = account.balance + (e.type === 'debit' ? e.amount : -e.amount)
    accounts[e.accountIndex] = { ...account, balance: newBalance }
    insertTransaction.run(cuid(), accountIds[e.accountIndex], e.type, e.amount, newBalance, e.description, e.reference, nowIso())
  }

  console.log(`Seeded: ${ledgerEntries.length} ledger transactions`)

  const invoices = [
    { buyerId: users[2].id, sellerId: users[0].id, subtotal: 1016949, taxRate: 18, taxAmount: 183051, totalAmount: 1200000, status: 'PAID' },
    { buyerId: users[2].id, sellerId: users[0].id, subtotal: 6779661, taxRate: 18, taxAmount: 1220339, totalAmount: 8000000, status: 'PAID' },
    { buyerId: users[1].id, sellerId: users[0].id, subtotal: 847458, taxRate: 18, taxAmount: 152542, totalAmount: 1000000, status: 'SENT' },
    { buyerId: users[1].id, sellerId: users[0].id, subtotal: 2033898, taxRate: 18, taxAmount: 366102, totalAmount: 2400000, status: 'PARTIALLY_PAID' },
  ]

  const insertInvoice = db.prepare(`INSERT INTO Invoice (id, invoiceNumber, orderId, tenantId, sellerId, buyerId, status, subtotal, taxRate, taxAmount, totalAmount, currency, dueDate, paidAt, notes, createdAt, updatedAt) VALUES (?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, 'XOF', ?, ?, NULL, ?, ?)`)

  for (let i = 0; i < invoices.length; i++) {
    const inv = invoices[i]
    const ts = nowIso()
    const dueDate = addDays(30)
    const paidAt = inv.status === 'PAID' ? ts : null
    insertInvoice.run(cuid(), `FAC-2026-00${i + 1}`, inv.sellerId, inv.buyerId, inv.status, inv.subtotal, inv.taxRate, inv.taxAmount, inv.totalAmount, dueDate, paidAt, ts, ts)
  }

  console.log(`Seeded: ${invoices.length} invoices`)

  db.close()
}

main().catch(console.error)

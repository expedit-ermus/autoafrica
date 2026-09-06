/**
 * prisma/seed.ts
 * ──────────────────────────────────────────────────────────
 * Seed complet pour AutoAfrique SaaS Platform.
 *
 * Génère 20 utilisateurs réalistes avec leurs profils et statuts :
 * - 1 Super Admin & 2 Admins/Modérateurs
 * - 6 Vendeurs Certifiés (ACTIVE) avec SellerProfile & Mobile Money
 * - 6 Vendeurs en Attente de Vérification (PENDING_VERIFICATION)
 * - 5 Acheteurs (BUYER) avec profils et adresses
 *
 * Usage:
 *   npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
 * ──────────────────────────────────────────────────────────
 */

import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import path from 'path'
import type { PayoutMethod } from '../src/generated/prisma/client'

const dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'dev.db')}`
const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Démarrage du Seeding complet d\'AutoAfrique SaaS...')

  const defaultPassword = await bcrypt.hash('Password123!', 10)
  const adminPassword = await bcrypt.hash('Admin123!', 12)

  // ── 1. Tenant Principal ───────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'autoafrique-main' },
    create: {
      name: 'AutoAfrique West Africa',
      slug: 'autoafrique-main',
      country: 'CI',
      currency: 'XOF',
      plan: 'ENTERPRISE',
      active: true,
      timezone: 'Africa/Abidjan',
    },
    update: {},
  })

  console.log(`✅ Tenant principal : ${tenant.name} (${tenant.id})`)

  // ── 2. Super Admin & Staff ────────────────────────────────────────────────
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@autoafrique.com' },
    create: {
      email: 'admin@autoafrique.com',
      password: adminPassword,
      firstName: 'Kouassi',
      lastName: 'Emmanuel',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      country: 'CI',
      city: 'Abidjan',
      tenantId: tenant.id,
      emailVerified: true,
      phoneVerified: true,
    },
    update: {},
  })

  const moderator = await prisma.user.upsert({
    where: { email: 'moderateur@autoafrique.com' },
    create: {
      email: 'moderateur@autoafrique.com',
      password: defaultPassword,
      firstName: 'Awa',
      lastName: 'Diallo',
      role: 'MODERATOR',
      status: 'ACTIVE',
      country: 'SN',
      city: 'Dakar',
      tenantId: tenant.id,
    },
    update: {},
  })

  const support = await prisma.user.upsert({
    where: { email: 'support@autoafrique.com' },
    create: {
      email: 'support@autoafrique.com',
      password: defaultPassword,
      firstName: 'Ibrahim',
      lastName: 'Traoré',
      role: 'SUPPORT',
      status: 'ACTIVE',
      country: 'CI',
      city: 'Abidjan',
      tenantId: tenant.id,
    },
    update: {},
  })

  console.log(`✅ Admins créés : ${superAdmin.email}, ${moderator.email}, ${support.email}`)

  // ── 3. Vendeurs Certifiés (ACTIVE) ─────────────────────────────────────────
  const activeSellersData = [
    {
      email: 'vendeur.abidjan@autoafrique.com',
      firstName: 'Koffi',
      lastName: 'N\'Guessan',
      country: 'CI',
      city: 'Abidjan',
      shopName: 'Garage Ivoirien Pièces Auto',
      businessName: 'SARL GIPA Auto',
      displayName: 'GIPA Auto Treichville',
      phone: '+2250708091011',
      payoutMethod: 'ORANGE_MONEY',
      payoutNumber: '+2250708091011',
      sales: 142,
      revenue: 4250000,
      rating: 4.8,
    },
    {
      email: 'vendeur.dakar@autoafrique.com',
      firstName: 'Moussa',
      lastName: 'Sow',
      country: 'SN',
      city: 'Dakar',
      shopName: 'Dakar Express Auto Parts',
      businessName: 'Dakar Express SARL',
      displayName: 'Dakar Express Colobane',
      phone: '+221776543210',
      payoutMethod: 'WAVE',
      payoutNumber: '+221776543210',
      sales: 98,
      revenue: 3100000,
      rating: 4.7,
    },
    {
      email: 'vendeur.bamako@autoafrique.com',
      firstName: 'Oumar',
      lastName: 'Keita',
      country: 'ML',
      city: 'Bamako',
      shopName: 'Mali Casse Automobile',
      businessName: 'Mali Casse keita',
      displayName: 'Mali Casse Badalabougou',
      phone: '+22366554433',
      payoutMethod: 'ORANGE_MONEY',
      payoutNumber: '+22366554433',
      sales: 64,
      revenue: 1950000,
      rating: 4.6,
    },
    {
      email: 'vendeur.ouaga@autoafrique.com',
      firstName: 'Adama',
      lastName: 'Compaoré',
      country: 'BF',
      city: 'Ouagadougou',
      shopName: 'Burkina Freinage & Moteur',
      businessName: 'BFM Auto Ouaga',
      displayName: 'BFM Auto Zogona',
      phone: '+22670112233',
      payoutMethod: 'ORANGE_MONEY',
      payoutNumber: '+22670112233',
      sales: 51,
      revenue: 1420000,
      rating: 4.5,
    },
    {
      email: 'vendeur.sanpedro@autoafrique.com',
      firstName: 'Yao',
      lastName: 'Kouamé',
      country: 'CI',
      city: 'San Pedro',
      shopName: 'San Pedro Injections & Turbo',
      businessName: 'SP Injections SARL',
      displayName: 'San Pedro Auto',
      phone: '+2250504030201',
      payoutMethod: 'WAVE',
      payoutNumber: '+2250504030201',
      sales: 83,
      revenue: 2890000,
      rating: 4.9,
    },
    {
      email: 'vendeur.lome@autoafrique.com',
      firstName: 'Kofi',
      lastName: 'Mensah',
      country: 'TG',
      city: 'Lomé',
      shopName: 'Togo Pièces d\'Origine',
      businessName: 'Togo Parts SA',
      displayName: 'Togo Parts Grand Marché',
      phone: '+22890123456',
      payoutMethod: 'WAVE',
      payoutNumber: '+22890123456',

      sales: 37,
      revenue: 980000,
      rating: 4.4,
    },
  ]

  for (const s of activeSellersData) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      create: {
        email: s.email,
        password: defaultPassword,
        firstName: s.firstName,
        lastName: s.lastName,
        phone: s.phone,
        country: s.country,
        city: s.city,
        shopName: s.shopName,
        role: 'SELLER',
        status: 'ACTIVE',
        sellerEnabled: true,
        tenantId: tenant.id,
        emailVerified: true,
      },
      update: {},
    })

    await prisma.sellerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        businessName: s.businessName,
        displayName: s.displayName,
        city: s.city,
        phoneForOrders: s.phone,
        payoutMethod: s.payoutMethod as PayoutMethod,
        payoutNumber: s.payoutNumber,
        verified: true,
        rating: s.rating,
        totalSales: s.sales,
        totalRevenue: s.revenue,
      },
      update: {},
    })
  }

  console.log(`✅ 6 Vendeurs actifs et certifiés créés.`)

  // ── 4. Vendeurs en Attente de Vérification (PENDING_VERIFICATION) ────────
  const pendingSellersData = [
    { email: 'pending.marcory@autoafrique.com', firstName: 'Jean-Baptiste', lastName: 'Akré', shopName: 'Auto Casse Marcory Zone 4', country: 'CI', city: 'Abidjan', phone: '+2250102030405' },
    { email: 'pending.yopougon@autoafrique.com', firstName: 'Ange', lastName: 'Bamba', shopName: 'Pièces Japonaise Yopougon', country: 'CI', city: 'Abidjan', phone: '+2250777889900' },
    { email: 'pending.pikine@autoafrique.com', firstName: 'Cheikh', lastName: 'Diop', shopName: 'Pikine Moteurs Import SN', country: 'SN', city: 'Dakar', phone: '+221781112233' },
    { email: 'pending.sikasso@autoafrique.com', firstName: 'Bakary', lastName: 'Coulibaly', shopName: 'Sikasso Garages & Amortisseurs', country: 'ML', city: 'Sikasso', phone: '+22376123456' },
    { email: 'pending.bobo@autoafrique.com', firstName: 'Salif', lastName: 'Sawadogo', shopName: 'Bobo Dioulasso Pièces Occasion', country: 'BF', city: 'Bobo-Dioulasso', phone: '+22676543210' },
    { email: 'pending.niamey@autoafrique.com', firstName: 'Mahamadou', lastName: 'Issoufou', shopName: 'Niamey Turbo & Injecteurs', country: 'NE', city: 'Niamey', phone: '+22790112233' },
  ]

  for (const ps of pendingSellersData) {
    const user = await prisma.user.upsert({
      where: { email: ps.email },
      create: {
        email: ps.email,
        password: defaultPassword,
        firstName: ps.firstName,
        lastName: ps.lastName,
        phone: ps.phone,
        country: ps.country,
        city: ps.city,
        shopName: ps.shopName,
        role: 'SELLER',
        status: 'PENDING_VERIFICATION',
        sellerEnabled: false,
        tenantId: tenant.id,
      },
      update: {},
    })

    await prisma.sellerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        businessName: ps.shopName,
        displayName: ps.shopName,
        city: ps.city,
        phoneForOrders: ps.phone,
        verified: false,
      },
      update: {},
    })
  }

  console.log(`✅ 6 Vendeurs PENDING_VERIFICATION créés.`)

  // ── 5. Acheteurs (BUYER) ──────────────────────────────────────────────────
  const buyersData = [
    { email: 'acheteur.koffi@gmail.com', firstName: 'Koffi', lastName: 'Konan', country: 'CI', city: 'Abidjan', phone: '+2250505050505' },
    { email: 'acheteur.fatou@gmail.com', firstName: 'Fatou', lastName: 'Ndiaye', country: 'SN', city: 'Dakar', phone: '+221770001122' },
    { email: 'acheteur.amadou@yahoo.fr', firstName: 'Amadou', lastName: 'Traoré', country: 'ML', city: 'Bamako', phone: '+22365001122' },
    { email: 'acheteur.serge@hotmail.com', firstName: 'Serge', lastName: 'Zongo', country: 'BF', city: 'Ouagadougou', phone: '+22670998877' },
    { email: 'acheteur.yao@gmail.com', firstName: 'Yao', lastName: 'Kouassi', country: 'CI', city: 'Bouaké', phone: '+2250707070707' },
  ]

  for (const b of buyersData) {
    const buyerUser = await prisma.user.upsert({
      where: { email: b.email },
      create: {
        email: b.email,
        password: defaultPassword,
        firstName: b.firstName,
        lastName: b.lastName,
        phone: b.phone,
        country: b.country,
        city: b.city,
        role: 'BUYER',
        status: 'ACTIVE',
        tenantId: tenant.id,
        emailVerified: true,
      },
      update: {},
    })

    await prisma.buyerProfile.upsert({
      where: { userId: buyerUser.id },
      create: {
        userId: buyerUser.id,
        companyName: `${b.lastName} Auto Import`,
        totalOrders: Math.floor(Math.random() * 5),
        totalSpent: Math.floor(Math.random() * 250000),
      },
      update: {},
    })

  }

  console.log(`✅ 5 Acheteurs créés avec leurs profils.`)
  console.log('🎉 Seeding complet terminé avec succès ! 20 utilisateurs réalistes injectés.')
}

main()
  .catch((e) => {
    console.error('❌ Erreur durant le seeding:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

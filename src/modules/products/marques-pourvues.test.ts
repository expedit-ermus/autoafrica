import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockPrisma = vi.hoisted(() => ({
  brand: { findMany: vi.fn() },
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

import { marquesPourvues } from './marques-pourvues'

const SRC_ROOT = path.resolve(process.cwd(), 'src')

/**
 * Troisieme occurrence d'une taxonomie ecrite en dur qui derive de la base,
 * apres les categories (D62) et les marques du sitemap (D66).
 *
 * `VehiclePartsSearch` portait `VEHICLE_DB` : Suzuki, Dacia et Mitsubishi y
 * etaient proposees — zero piece en stock, et les deux dernieres absentes de
 * la table `Brand` — tandis que Kia, Mercedes et Volkswagen en etaient
 * absentes alors qu'elles portent seize des cinquante et une pieces. Un
 * acheteur avec une Kia ne pouvait pas selectionner sa voiture.
 */
describe('marquesPourvues', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('applique le meme filtre que les pages marque et le sitemap', async () => {
    mockPrisma.brand.findMany.mockResolvedValue([])

    await marquesPourvues()

    expect(mockPrisma.brand.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { products: { some: { active: true } } },
      }),
    )
  })

  it('classe les marques les mieux pourvues en premier', async () => {
    mockPrisma.brand.findMany.mockResolvedValue([])

    await marquesPourvues()

    expect(mockPrisma.brand.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { products: { _count: 'desc' } },
      }),
    )
  })

  it('ne renvoie que les noms, dans l ordre de la requete', async () => {
    mockPrisma.brand.findMany.mockResolvedValue([
      { name: 'Toyota' },
      { name: 'Kia' },
      { name: 'Mercedes' },
    ])

    expect(await marquesPourvues()).toEqual(['Toyota', 'Kia', 'Mercedes'])
  })

  // Une marque sans stock ne doit pas etre completee par une liste de repli :
  // proposer un choix qui ne mene a rien est le defaut corrige ici.
  it('renvoie une liste vide quand aucune marque n a de stock', async () => {
    mockPrisma.brand.findMany.mockResolvedValue([])

    expect(await marquesPourvues()).toEqual([])
  })
})

describe('le formulaire ne porte plus de taxonomie ecrite en dur', () => {
  const composant = readFileSync(
    path.join(SRC_ROOT, 'components', 'VehiclePartsSearch.tsx'),
    'utf8',
  )

  it('a perdu sa base de vehicules en dur', () => {
    expect(composant).not.toMatch(/const VEHICLE_DB\s*[:=]/)
  })

  it('ne nomme aucune marque en dur', () => {
    // Les marques citees en exemple dans un placeholder resteraient acceptables ;
    // une marque declaree comme option de selection, non.
    for (const marque of ['Suzuki', 'Dacia', 'Mitsubishi', 'Toyota', 'Peugeot']) {
      expect(composant, `${marque} ne doit pas etre ecrite en dur`).not.toMatch(
        new RegExp(`brand:\\s*'${marque}'`),
      )
    }
  })

  it('recoit ses marques en propriete', () => {
    expect(composant).toMatch(/marques:\s*string\[\]/)
  })
})

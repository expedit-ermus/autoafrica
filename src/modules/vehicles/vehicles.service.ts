import { prisma } from '@/lib/prisma'
import { Prisma, VehicleCondition, VehicleFuel, VehicleGearbox } from '@/generated/prisma/client'
import { NotFoundError, ForbiddenError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface CreateVehicleInput {
  brand: string
  model?: string
  name: string
  year: number
  price: number
  currency?: string
  mileage?: number
  fuel?: string
  gearbox?: string
  condition?: string
  bodyType?: string
  color?: string
  city?: string
  country?: string
  description?: string
  images?: string[]
}

interface VehicleFilters {
  brand?: string
  model?: string
  country?: string
  city?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  fuel?: string
  gearbox?: string
  condition?: string
  minYear?: number
  maxYear?: number
  sellerId?: string
}

interface VehicleListWhere extends Prisma.VehicleWhereInput {
  carModel?: { name?: { contains: string } }
  city?: { contains: string }
}

/**
 * Statuts sous lesquels une annonce est reellement offerte au public.
 * RESERVED reste visible : le vehicule existe et l'acheteur doit pouvoir voir
 * qu'il est reserve. `buildVehicleSchema` traduit ce statut en
 * `LimitedAvailability`, DRAFT et CANCELLED n'ont pas a etre publies.
 */
const LIVE_LISTING_STATUSES = ['ACTIVE', 'RESERVED'] as const

export interface PublicVehicleFilters {
  slug?: string
  brand?: string
  city?: string
  fuel?: string
  gearbox?: string
  condition?: string
  bodyType?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  search?: string
}

/**
 * Le vendeur est reduit a ce qu'une page indexee peut porter : l'enseigne et
 * la ville. Ni telephone ni nom personnel — les fiches pieces font deja passer
 * la prise de contact par le numero de la plateforme, publier le numero
 * personnel d'un vendeur sur une page indexee serait un autre choix, qui n'a
 * pas ete fait ici.
 */
const PUBLIC_INCLUDE = {
  brand: { select: { name: true, slug: true } },
  carModel: { select: { name: true, bodyType: true, engine: true } },
  listings: {
    where: { status: { in: [...LIVE_LISTING_STATUSES] } },
    select: {
      id: true,
      status: true,
      price: true,
      currency: true,
      seller: { select: { shopName: true, city: true } },
    },
    orderBy: { updatedAt: 'desc' as const },
    take: 1,
  },
} satisfies Prisma.VehicleInclude

type PublicVehicleRow = Prisma.VehicleGetPayload<{ include: typeof PUBLIC_INCLUDE }>

function buildPublicWhere(filters: PublicVehicleFilters): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {
    active: true,
    listings: { some: { status: { in: [...LIVE_LISTING_STATUSES] } } },
  }

  if (filters.slug) where.slug = filters.slug
  if (filters.brand) where.brand = { name: filters.brand }
  if (filters.city) where.city = filters.city
  if (filters.fuel) where.fuel = filters.fuel as VehicleFuel
  if (filters.gearbox) where.gearbox = filters.gearbox as VehicleGearbox
  if (filters.condition) where.condition = filters.condition as VehicleCondition
  if (filters.bodyType) where.bodyType = filters.bodyType

  if (filters.minYear || filters.maxYear) {
    const yearFilter: Prisma.IntFilter = {}
    if (filters.minYear) yearFilter.gte = filters.minYear
    if (filters.maxYear) yearFilter.lte = filters.maxYear
    where.year = yearFilter
  }
  if (filters.minPrice || filters.maxPrice) {
    const priceFilter: Prisma.IntFilter = {}
    if (filters.minPrice) priceFilter.gte = filters.minPrice
    if (filters.maxPrice) priceFilter.lte = filters.maxPrice
    where.price = priceFilter
  }
  if (filters.search) {
    const searchFilter = { contains: filters.search }
    where.OR = [{ name: searchFilter }, { description: searchFilter }, { color: searchFilter }]
  }

  return where
}

/**
 * `Vehicle.images` est une colonne JSON ecrite par `JSON.stringify` : selon le
 * chemin d'ecriture elle vaut une chaine, un tableau deja decode, ou NULL.
 * Un contenu illisible donne une liste vide — jamais une image inventee ni
 * empruntee a un autre vehicule (D66).
 */
export function parseVehicleImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((i): i is string => typeof i === 'string' && i.length > 0)
  if (typeof raw !== 'string' || raw.trim() === '') return []
  try {
    return parseVehicleImages(JSON.parse(raw))
  } catch {
    return []
  }
}

/**
 * Forme publique d'un vehicule. Aucune valeur de repli : un champ absent en
 * base reste absent ici, charge a la vue de ne pas l'afficher plutot que de
 * l'inventer (D61).
 */
function toPublicVehicle(vehicle: PublicVehicleRow) {
  const listing = vehicle.listings[0]

  return {
    id: vehicle.id,
    slug: vehicle.slug,
    name: vehicle.name,
    year: vehicle.year,
    // Le prix qui fait foi est celui de l'annonce : `update()` ecrit les deux,
    // mais l'annonce est ce que le vendeur offre reellement.
    price: listing?.price ?? vehicle.price,
    currency: listing?.currency ?? vehicle.currency,
    mileage: vehicle.mileage ?? undefined,
    fuel: vehicle.fuel ?? undefined,
    gearbox: vehicle.gearbox ?? undefined,
    condition: vehicle.condition,
    bodyType: vehicle.bodyType ?? vehicle.carModel?.bodyType ?? undefined,
    color: vehicle.color ?? undefined,
    city: vehicle.city ?? undefined,
    country: vehicle.country,
    description: vehicle.description ?? undefined,
    images: parseVehicleImages(vehicle.images),
    brand: vehicle.brand?.name,
    brandSlug: vehicle.brand?.slug,
    model: vehicle.carModel?.name ?? undefined,
    engine: vehicle.carModel?.engine ?? undefined,
    listingStatus: listing?.status,
    sellerShopName: listing?.seller?.shopName ?? undefined,
    sellerCity: listing?.seller?.city ?? undefined,
    updatedAt: vehicle.updatedAt,
  }
}

export type PublicVehicle = ReturnType<typeof toPublicVehicle>

export class VehiclesService {
  async list(filters: VehicleFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.VehicleWhereInput = { active: true }
    if (filters.brand) where.brand = { name: filters.brand }
    if (filters.model) {
      const searchFilter = { contains: filters.model }
      ;(where as VehicleListWhere).carModel = { name: searchFilter }
    }
    if (filters.country) where.country = filters.country
    if (filters.city) {
      const searchFilter = { contains: filters.city }
      ;(where as VehicleListWhere).city = searchFilter
    }
    if (filters.fuel) where.fuel = filters.fuel as VehicleFuel
    if (filters.gearbox) where.gearbox = filters.gearbox as VehicleGearbox
    if (filters.condition) where.condition = filters.condition as VehicleCondition
    if (filters.minYear || filters.maxYear) {
      const yearFilter: Prisma.IntFilter = {}
      if (filters.minYear) yearFilter.gte = filters.minYear
      if (filters.maxYear) yearFilter.lte = filters.maxYear
      where.year = yearFilter
    }
    if (filters.minPrice || filters.maxPrice) {
      const priceFilter: Prisma.IntFilter = {}
      if (filters.minPrice) priceFilter.gte = filters.minPrice
      if (filters.maxPrice) priceFilter.lte = filters.maxPrice
      where.price = priceFilter
    }
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.OR = [
        { name: searchFilter },
        { description: searchFilter },
        { color: searchFilter },
      ]
    }
    if (filters.sellerId) {
      where.listings = { some: { sellerId: filters.sellerId } }
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          brand: { select: { name: true, slug: true } },
          carModel: { select: { name: true, bodyType: true } },
          listings: {
            where: { status: { in: ['ACTIVE', 'RESERVED'] } },
            select: { id: true, status: true, price: true, seller: { select: { id: true, firstName: true, lastName: true, shopName: true, phone: true, city: true } } },
          },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.vehicle.count({ where }),
    ])

    return buildPaginatedResponse(vehicles, total, page, pageSize)
  }

  async getById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        brand: { select: { name: true, slug: true } },
        carModel: { select: { name: true, bodyType: true, engine: true } },
        listings: {
          where: { status: { in: ['ACTIVE', 'RESERVED'] } },
          select: { id: true, status: true, price: true, seller: { select: { id: true, firstName: true, lastName: true, shopName: true, phone: true, city: true, country: true } } },
        },
      },
    })
    if (!vehicle) throw new NotFoundError('Vehicle', id)

    await prisma.vehicle.update({ where: { id }, data: { views: { increment: 1 } } })

    return { ...vehicle, images: vehicle.images || [] }
  }

  async create(data: CreateVehicleInput, sellerId: string) {
    if (!data.name || !data.brand || !data.year || !data.price) {
      throw new ValidationError('Nom, marque, année et prix sont requis')
    }
    if (data.price <= 0) throw new ValidationError('Le prix doit être positif')

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

    const brand = await prisma.brand.findUnique({ where: { name: data.brand } })
    if (!brand) throw new ValidationError(`Marque inconnue : ${data.brand}`)

    let carModelId: string | undefined
    if (data.model) {
      const carModel = await prisma.carModel.findFirst({ where: { brandId: brand.id, name: data.model } })
      carModelId = carModel?.id
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        brandId: brand.id,
        carModelId,
        name: data.name,
        slug,
        year: data.year,
        price: data.price,
        currency: data.currency || 'XOF',
        mileage: data.mileage,
        fuel: data.fuel ? (data.fuel as VehicleFuel) : undefined,
        gearbox: data.gearbox ? (data.gearbox as VehicleGearbox) : undefined,
        condition: (data.condition as VehicleCondition) || 'USED',
        bodyType: data.bodyType,
        color: data.color,
        city: data.city || 'Abidjan',
        country: data.country || 'CI',
        description: data.description,
        images: data.images && data.images.length ? JSON.stringify(data.images) : Prisma.DbNull,
      } satisfies Prisma.VehicleUncheckedCreateInput,
    })

    await prisma.vehicleListing.create({
      data: {
        vehicleId: vehicle.id,
        sellerId,
        status: 'ACTIVE',
        price: data.price,
        currency: data.currency || 'XOF',
      },
    })

    return vehicle
  }

  async update(id: string, data: Partial<CreateVehicleInput>, userId: string) {
    const listing = await prisma.vehicleListing.findFirst({ where: { vehicleId: id } })
    if (!listing) throw new NotFoundError('Vehicle', id)
    if (listing.sellerId !== userId) throw new ForbiddenError('Not your vehicle listing')

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        name: data.name,
        year: data.year,
        price: data.price,
        currency: data.currency,
        mileage: data.mileage,
        fuel: data.fuel ? (data.fuel as VehicleFuel) : undefined,
        gearbox: data.gearbox ? (data.gearbox as VehicleGearbox) : undefined,
        condition: data.condition ? (data.condition as VehicleCondition) : undefined,
        bodyType: data.bodyType,
        color: data.color,
        city: data.city,
        country: data.country,
        description: data.description,
        images: data.images ? JSON.stringify(data.images) : undefined,
      },
    })

    if (data.price) {
      await prisma.vehicleListing.update({
        where: { id: listing.id },
        data: { price: data.price, currency: data.currency || 'XOF' },
      })
    }

    return updated
  }

  async delete(id: string, userId: string) {
    const listing = await prisma.vehicleListing.findFirst({ where: { vehicleId: id } })
    if (!listing) throw new NotFoundError('Vehicle', id)
    if (listing.sellerId !== userId) throw new ForbiddenError('Not your vehicle listing')

    await prisma.vehicle.update({ where: { id }, data: { active: false } })
    await prisma.vehicleListing.update({ where: { id: listing.id }, data: { status: 'CANCELLED' } })
    return { success: true }
  }

  async setStatus(id: string, status: 'DRAFT' | 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CANCELLED', userId: string) {
    const listing = await prisma.vehicleListing.findFirst({ where: { vehicleId: id } })
    if (!listing) throw new NotFoundError('Vehicle', id)
    if (listing.sellerId !== userId) throw new ForbiddenError('Not your vehicle listing')

    await prisma.vehicleListing.update({ where: { id: listing.id }, data: { status } })
    if (status === 'SOLD') {
      await prisma.vehicle.update({ where: { id }, data: { active: false } })
    }
    return { success: true, status }
  }
  /**
   * Annonces reellement offertes a la vente, pour la vitrine publique.
   *
   * `list()` ne sert pas ici. Elle filtre `active: true` mais n'exige pas
   * qu'une annonce vivante existe : un vehicule dont toutes les `listings`
   * sont DRAFT ou CANCELLED en ressort avec un tableau `listings` vide, et la
   * vitrine afficherait une offre que personne ne porte. La presence d'une
   * annonce ACTIVE ou RESERVED est donc exigee en base, pas verifiee apres
   * coup : le comptage de la pagination doit voir le meme filtre que la
   * requete, sinon le total ment.
   */
  async listPublic(filters: PublicVehicleFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where = buildPublicWhere(filters)

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: PUBLIC_INCLUDE,
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.vehicle.count({ where }),
    ])

    return buildPaginatedResponse(vehicles.map(toPublicVehicle), total, page, pageSize)
  }

  /**
   * Fiche publique par slug.
   *
   * Deux choses que `getById` ne fait pas, et qui comptent ici.
   *
   * Elle ne filtre pas `active` : une annonce retiree resterait servie a son
   * URL directe. Desactiver un vehicule ne le sortirait alors que des listes,
   * pas du web — la page resterait indexee et joignable.
   *
   * Elle incremente `views` a chaque appel. Sur une page publique rendue par
   * le serveur, `generateMetadata` et le composant appellent tous deux le
   * chargement : le compteur doublerait, et une ecriture pendant le rendu
   * n'a rien a faire dans un segment revalide. La lecture publique ne compte
   * donc aucune vue.
   */
  async getPublicBySlug(slug: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: buildPublicWhere({ slug }),
      include: PUBLIC_INCLUDE,
    })

    return vehicle ? toPublicVehicle(vehicle) : null
  }

  /**
   * Facettes de la vitrine, deduites des annonces publiables.
   *
   * Meme motif que le sitemap en D66 : les valeurs proposees au filtrage
   * sortent de ce qui est reellement offert. Une liste ecrite en dur
   * proposerait « Electrique » ou « Bouake » sans une seule annonce derriere,
   * et le filtre ne renverrait rien.
   */
  async publicFacets() {
    const vehicles = await prisma.vehicle.findMany({
      where: buildPublicWhere({}),
      select: {
        year: true,
        price: true,
        city: true,
        fuel: true,
        gearbox: true,
        condition: true,
        bodyType: true,
        brand: { select: { name: true } },
      },
    })

    const distinct = <T>(valeurs: (T | null | undefined)[]) =>
      [...new Set(valeurs.filter((v): v is T => v !== null && v !== undefined && v !== ''))]

    return {
      total: vehicles.length,
      brands: distinct(vehicles.map((v) => v.brand?.name)).sort(),
      cities: distinct(vehicles.map((v) => v.city)).sort(),
      fuels: distinct(vehicles.map((v) => v.fuel)),
      gearboxes: distinct(vehicles.map((v) => v.gearbox)),
      conditions: distinct(vehicles.map((v) => v.condition)),
      bodyTypes: distinct(vehicles.map((v) => v.bodyType)).sort(),
      // `undefined` plutot que 0 sur une vitrine vide : un plancher de prix a
      // zero et une annee a zero sont des bornes fausses, pas des bornes
      // neutres. L'appelant doit pouvoir distinguer « aucune donnee ».
      minPrice: vehicles.length ? Math.min(...vehicles.map((v) => v.price)) : undefined,
      maxPrice: vehicles.length ? Math.max(...vehicles.map((v) => v.price)) : undefined,
      minYear: vehicles.length ? Math.min(...vehicles.map((v) => v.year)) : undefined,
      maxYear: vehicles.length ? Math.max(...vehicles.map((v) => v.year)) : undefined,
    }
  }

}

export const vehiclesService = new VehiclesService()

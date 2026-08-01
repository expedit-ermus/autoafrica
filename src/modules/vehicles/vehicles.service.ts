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
  carModel?: { name?: { contains: string; mode: 'insensitive' } }
  city?: { contains: string; mode: 'insensitive' }
}

export class VehiclesService {
  async list(filters: VehicleFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.VehicleWhereInput = { active: true }
    if (filters.brand) where.brand = { name: filters.brand }
    if (filters.model) {
      const searchFilter = { contains: filters.model, mode: 'insensitive' as const }
      ;(where as VehicleListWhere).carModel = { name: searchFilter }
    }
    if (filters.country) where.country = filters.country
    if (filters.city) {
      const searchFilter = { contains: filters.city, mode: 'insensitive' as const }
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
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
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
}

export const vehiclesService = new VehiclesService()

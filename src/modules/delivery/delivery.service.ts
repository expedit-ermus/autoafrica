import { prisma } from '@/lib/prisma'
import { Prisma, ShipmentStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

const VEHICLE_TYPES = ['moto', 'voiture', 'camion', 'van']

interface CreateShipmentInput {
  orderId: string
  trackingNumber?: string
  carrier?: string
  method?: string
  status?: string
  currentLocation?: string
  latitude?: number
  longitude?: number
  estimatedDelivery?: string
  actualDelivery?: string
  signedBy?: string
  signatureUrl?: string
}

interface ShipmentFilters {
  search?: string
  status?: string
  carrier?: string
  method?: string
}

interface CreateRouteInput {
  name: string
  driverId?: string
  vehicleId?: string
  country: string
  city?: string
  date: string
  status?: string
  stops?: Record<string, unknown>
  distance?: number
  duration?: number
}

interface RouteFilters {
  search?: string
  status?: string
  country?: string
}

interface CreateVehicleInput {
  plateNumber: string
  type: string
  brand?: string
  model?: string
  year?: number
  capacity?: number
  driverId?: string
  status?: string
}

interface VehicleFilters {
  search?: string
  status?: string
  type?: string
}

export class DeliveryService {
  // ==================== SHIPMENTS ====================

  async listShipments(filters: ShipmentFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.ShipmentWhereInput = {}
    if (filters.status) where.status = filters.status as ShipmentStatus
    if (filters.carrier) where.carrier = filters.carrier
    if (filters.method) where.method = filters.method
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { trackingNumber: searchFilter },
        { currentLocation: searchFilter },
        { carrier: searchFilter },
        { order: { orderNumber: searchFilter } },
      ]
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: {
          order: { select: { id: true, orderNumber: true, totalAmount: true, currency: true, status: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.shipment.count({ where }),
    ])

    return buildPaginatedResponse(shipments, total, page, pageSize)
  }

  async getShipmentById(id: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: { order: true },
    })
    if (!shipment) throw new NotFoundError('Shipment', id)
    return shipment
  }

  async createShipment(data: CreateShipmentInput) {
    if (!data.orderId) {
      throw new ValidationError('La commande est requise')
    }

    const order = await prisma.order.findUnique({ where: { id: data.orderId } })
    if (!order) throw new NotFoundError('Order', data.orderId)

    if (data.trackingNumber) {
      const dup = await prisma.shipment.findUnique({ where: { trackingNumber: data.trackingNumber } })
      if (dup) throw new ValidationError('Un envoi avec ce numero de suivi existe deja')
    }

    return prisma.shipment.create({
      data: {
        orderId: data.orderId,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        method: data.method,
        status: (data.status as ShipmentStatus) || 'PENDING',
        currentLocation: data.currentLocation,
        latitude: data.latitude,
        longitude: data.longitude,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
        actualDelivery: data.actualDelivery ? new Date(data.actualDelivery) : undefined,
        signedBy: data.signedBy,
        signatureUrl: data.signatureUrl,
      },
      include: { order: { select: { id: true, orderNumber: true } } },
    })
  }

  async updateShipmentStatus(id: string, status: string) {
    const existing = await prisma.shipment.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Shipment', id)

    const data: Prisma.ShipmentUpdateInput = { status: status as ShipmentStatus }
    if (status === 'DELIVERED' && !existing.actualDelivery) data.actualDelivery = new Date()

    return prisma.shipment.update({ where: { id }, data })
  }

  async updateShipment(id: string, data: Partial<CreateShipmentInput>) {
    const existing = await prisma.shipment.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Shipment', id)

    if (data.orderId) {
      const order = await prisma.order.findUnique({ where: { id: data.orderId } })
      if (!order) throw new NotFoundError('Order', data.orderId)
    }

    if (data.trackingNumber) {
      const dup = await prisma.shipment.findFirst({ where: { trackingNumber: data.trackingNumber, id: { not: id } } })
      if (dup) throw new ValidationError('Un envoi avec ce numero de suivi existe deja')
    }

    return prisma.shipment.update({
      where: { id },
      data: {
        orderId: data.orderId,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        method: data.method,
        status: data.status ? (data.status as ShipmentStatus) : undefined,
        currentLocation: data.currentLocation,
        latitude: data.latitude,
        longitude: data.longitude,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
        actualDelivery: data.actualDelivery ? new Date(data.actualDelivery) : undefined,
        signedBy: data.signedBy,
        signatureUrl: data.signatureUrl,
      },
    })
  }

  async removeShipment(id: string) {
    const existing = await prisma.shipment.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Shipment', id)
    await prisma.shipment.delete({ where: { id } })
    return { success: true }
  }

  // ==================== DELIVERY ROUTES ====================

  async listRoutes(filters: RouteFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.DeliveryRouteWhereInput = {}
    if (filters.status) where.status = filters.status
    if (filters.country) where.country = filters.country
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { name: searchFilter },
        { city: searchFilter },
        { country: searchFilter },
      ]
    }

    const [routes, total] = await Promise.all([
      prisma.deliveryRoute.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.deliveryRoute.count({ where }),
    ])

    return buildPaginatedResponse(routes, total, page, pageSize)
  }

  async getRouteById(id: string) {
    const route = await prisma.deliveryRoute.findUnique({ where: { id } })
    if (!route) throw new NotFoundError('DeliveryRoute', id)
    return route
  }

  async createRoute(data: CreateRouteInput) {
    if (!data.name || !data.country || !data.date) {
      throw new ValidationError('Nom, pays et date sont requis')
    }

    return prisma.deliveryRoute.create({
      data: {
        name: data.name,
        driverId: data.driverId,
        vehicleId: data.vehicleId,
        country: data.country,
        city: data.city,
        date: new Date(data.date),
        status: data.status || 'planned',
        stops: data.stops ? JSON.stringify(data.stops) : undefined,
        distance: data.distance,
        duration: data.duration,
      },
    })
  }

  async updateRouteStatus(id: string, status: string) {
    const existing = await prisma.deliveryRoute.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('DeliveryRoute', id)

    const data: Prisma.DeliveryRouteUpdateInput = { status }
    if (status === 'completed' && !existing.completedAt) data.completedAt = new Date()

    return prisma.deliveryRoute.update({ where: { id }, data })
  }

  async updateRoute(id: string, data: Partial<CreateRouteInput>) {
    const existing = await prisma.deliveryRoute.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('DeliveryRoute', id)

    return prisma.deliveryRoute.update({
      where: { id },
      data: {
        name: data.name,
        driverId: data.driverId,
        vehicleId: data.vehicleId,
        country: data.country,
        city: data.city,
        date: data.date ? new Date(data.date) : undefined,
        status: data.status,
        stops: data.stops ? JSON.stringify(data.stops) : undefined,
        distance: data.distance,
        duration: data.duration,
      },
    })
  }

  async removeRoute(id: string) {
    const existing = await prisma.deliveryRoute.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('DeliveryRoute', id)
    await prisma.deliveryRoute.delete({ where: { id } })
    return { success: true }
  }

  // ==================== FLEET VEHICLES ====================

  async listVehicles(filters: VehicleFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.FleetVehicleWhereInput = {}
    if (filters.status) where.status = filters.status
    if (filters.type) where.type = filters.type
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { plateNumber: searchFilter },
        { brand: searchFilter },
        { model: searchFilter },
      ]
    }

    const [vehicles, total] = await Promise.all([
      prisma.fleetVehicle.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.fleetVehicle.count({ where }),
    ])

    return buildPaginatedResponse(vehicles, total, page, pageSize)
  }

  async getVehicleById(id: string) {
    const vehicle = await prisma.fleetVehicle.findUnique({ where: { id } })
    if (!vehicle) throw new NotFoundError('FleetVehicle', id)
    return vehicle
  }

  async createVehicle(data: CreateVehicleInput) {
    if (!data.plateNumber || !data.type) {
      throw new ValidationError('Plaque d\'immatriculation et type sont requis')
    }
    if (!VEHICLE_TYPES.includes(data.type)) {
      throw new ValidationError('Type de vehicule invalide (moto, voiture, camion, van)')
    }

    const existing = await prisma.fleetVehicle.findUnique({ where: { plateNumber: data.plateNumber } })
    if (existing) throw new ValidationError('Un vehicule avec cette plaque existe deja')

    return prisma.fleetVehicle.create({
      data: {
        plateNumber: data.plateNumber,
        type: data.type,
        brand: data.brand,
        model: data.model,
        year: data.year,
        capacity: data.capacity,
        driverId: data.driverId,
        status: data.status || 'active',
      },
    })
  }

  async updateVehicle(id: string, data: Partial<CreateVehicleInput>) {
    const existing = await prisma.fleetVehicle.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('FleetVehicle', id)

    if (data.plateNumber) {
      const dup = await prisma.fleetVehicle.findFirst({ where: { plateNumber: data.plateNumber, id: { not: id } } })
      if (dup) throw new ValidationError('Un vehicule avec cette plaque existe deja')
    }
    if (data.type && !VEHICLE_TYPES.includes(data.type)) {
      throw new ValidationError('Type de vehicule invalide (moto, voiture, camion, van)')
    }

    return prisma.fleetVehicle.update({
      where: { id },
      data: {
        plateNumber: data.plateNumber,
        type: data.type,
        brand: data.brand,
        model: data.model,
        year: data.year,
        capacity: data.capacity,
        driverId: data.driverId,
        status: data.status,
      },
    })
  }

  async removeVehicle(id: string) {
    const existing = await prisma.fleetVehicle.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('FleetVehicle', id)
    await prisma.fleetVehicle.delete({ where: { id } })
    return { success: true }
  }
}

export const deliveryService = new DeliveryService()

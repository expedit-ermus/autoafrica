import { prisma } from '@/lib/prisma'
import { Prisma } from '../../generated/prisma/client'
import { NotFoundError, ValidationError, ForbiddenError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface CreateProductInput {
  title: string
  description?: string
  reference?: string
  brand: string
  model?: string
  category: string
  price: number
  currency?: string
  stock?: number
  condition?: string
  quality?: string
  images?: string[]
  compatible?: any[]
  yearStart?: number
  yearEnd?: number
}

interface ProductFilters {
  brand?: string
  model?: string
  category?: string
  country?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  sellerId?: string
}

export class ProductsService {
  async list(filters: ProductFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: any = { active: true }
    if (filters.brand) where.brand = { name: filters.brand }
    if (filters.model) where.model = { contains: filters.model, mode: 'insensitive' }
    if (filters.category) where.category = { slug: filters.category }
    if (filters.sellerId) where.sellerId = filters.sellerId
    if (filters.condition) where.condition = filters.condition
    if (filters.country) where.seller = { country: filters.country }
    if (filters.minPrice) where.price = { ...where.price, gte: filters.minPrice }
    if (filters.maxPrice) where.price = { ...where.price, lte: filters.maxPrice }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { reference: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: { select: { id: true, firstName: true, lastName: true, shopName: true, country: true } },
          brand: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    return buildPaginatedResponse(products, total, page, pageSize)
  }

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, firstName: true, lastName: true, shopName: true, country: true, city: true } },
        brand: true,
        category: true,
        compatible: true,
        reviews: { where: { active: true }, take: 5 },
      },
    })
    if (!product) throw new NotFoundError('Product', id)

    await prisma.product.update({ where: { id }, data: { views: { increment: 1 } } })

    return {
      ...product,
      images: product.images || [],
      compatible: product.compatible || [],
    }
  }

  async create(data: CreateProductInput, sellerId: string) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

    let brandId: string | undefined
    if (data.brand) {
      const brand = await prisma.brand.findUnique({ where: { name: data.brand } })
      brandId = brand?.id
    }

    let categoryId: string | undefined
    if (data.category) {
      const category = await prisma.category.findUnique({ where: { slug: data.category } })
      categoryId = category?.id
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        reference: data.reference,
        brandId,
        categoryId,
        price: data.price,
        currency: data.currency || 'XOF',
        stock: data.stock || 0,
        condition: (data.condition as any) || 'USED',
        quality: data.quality,
        images: data.images ? JSON.stringify(data.images) : Prisma.DbNull,
        sellerId,
        yearStart: data.yearStart,
        yearEnd: data.yearEnd,
      } as any,
    })

    return product
  }

  async update(id: string, data: Partial<CreateProductInput>, userId: string) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundError('Product', id)
    if (product.sellerId !== userId) throw new ForbiddenError('Not your product')

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        images: data.images ? JSON.stringify(data.images) : undefined,
      } as any,
    })

    return updated
  }

  async delete(id: string, userId: string) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new NotFoundError('Product', id)
    if (product.sellerId !== userId) throw new ForbiddenError('Not your product')

    await prisma.product.update({ where: { id }, data: { active: false } })
    return { success: true }
  }

  async getBrands() {
    return prisma.brand.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
  }

  async getCategories() {
    return prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
  }

  async search(query: string, filters?: ProductFilters) {
    return this.list({ ...filters, search: query }, { page: 1, pageSize: 20 })
  }
}

export const productsService = new ProductsService()

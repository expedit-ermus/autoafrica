import { prisma } from '@/lib/prisma'
import { Prisma, ProductCondition } from '@/generated/prisma/client'
import { NotFoundError, ForbiddenError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface CompatInput {
  carModelId?: string
  yearStart?: number
  yearEnd?: number
  engine?: string
  trim?: string
  note?: string
}

interface ProductListWhere extends Prisma.ProductWhereInput {
  model?: { contains: string; mode: 'insensitive' }
}

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
  compatible?: CompatInput[]
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

    const where: Prisma.ProductWhereInput = { active: true }
    if (filters.brand) where.brand = { name: filters.brand }
    if (filters.model) {
      const searchFilter = { contains: filters.model, mode: 'insensitive' as const }
      ;(where as ProductListWhere).model = searchFilter
    }
    if (filters.category) where.category = { slug: filters.category }
    if (filters.sellerId) where.sellerId = filters.sellerId
    if (filters.condition) where.condition = filters.condition as ProductCondition
    if (filters.country) where.seller = { country: filters.country }
    if (filters.minPrice || filters.maxPrice) {
      const priceFilter: Prisma.IntFilter = {}
      if (filters.minPrice) priceFilter.gte = filters.minPrice
      if (filters.maxPrice) priceFilter.lte = filters.maxPrice
      where.price = priceFilter
    }
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { title: searchFilter },
        { reference: searchFilter },
        { description: searchFilter },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: { select: { id: true, firstName: true, lastName: true, shopName: true, country: true } },
          brand: { select: { name: true, slug: true } },
          category: { select: { name: true, slug: true } },
          reviews: { where: { active: true }, select: { rating: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    const withRatings = products.map(p => {
      const { reviews } = p as { reviews?: { rating: number }[] }
      const list = reviews || []
      const _avgRating = list.length > 0
        ? Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10
        : null
      const rest = { ...p }
      delete (rest as { reviews?: unknown }).reviews
      return { ...rest, _avgRating, _reviewCount: list.length }
    })

    return buildPaginatedResponse(withRatings, total, page, pageSize)
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
        condition: (data.condition as ProductCondition) || 'USED',
        quality: data.quality,
        images: data.images ? JSON.stringify(data.images) : Prisma.DbNull,
        sellerId,
      } satisfies Prisma.ProductUncheckedCreateInput,
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
        title: data.title,
        description: data.description,
        reference: data.reference,
        price: data.price,
        currency: data.currency,
        stock: data.stock,
        condition: data.condition ? (data.condition as ProductCondition) : undefined,
        quality: data.quality,
        images: data.images ? JSON.stringify(data.images) : undefined,
      },
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

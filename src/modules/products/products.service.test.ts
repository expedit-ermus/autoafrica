import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productsService } from '@/modules/products/products.service';
import { NotFoundError, ForbiddenError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  product: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  brand: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  category: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('ProductsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('lists active products filtered by brand and category', async () => {
      mockPrisma.product.findMany.mockResolvedValue([{ id: 'p1' }]);
      mockPrisma.product.count.mockResolvedValue(1);

      const result = await productsService.list({ brand: 'Toyota', category: 'moteur' }, { page: 1, pageSize: 20 });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            active: true,
            brand: { name: 'Toyota' },
            category: { slug: 'moteur' },
          }),
        }),
      );
      expect((result.data as unknown as { id: string }[])[0].id).toBe('p1');
    });

    it('searches title, reference and description', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await productsService.list({ search: 'filtre' }, { page: 1, pageSize: 20 });

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: expect.objectContaining({ contains: 'filtre' }) },
              { reference: expect.objectContaining({ contains: 'filtre' }) },
              { description: expect.objectContaining({ contains: 'filtre' }) },
            ],
          }),
        }),
      );
    });
  });

  describe('getById', () => {
    it('throws NotFoundError for a missing product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(productsService.getById('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('increments the views counter and returns images and compatibility', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', images: null, compatible: null, title: 'Filtre' });

      const result = await productsService.getById('p1');

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { views: { increment: 1 } },
      });
      expect(result.images).toEqual([]);
      expect(result.compatible).toEqual([]);
    });
  });

  describe('create', () => {
    it('creates a product with a generated slug and resolved brand', async () => {
      mockPrisma.brand.findUnique.mockResolvedValue({ id: 'b1' });
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat1' });
      mockPrisma.product.create.mockResolvedValue({ id: 'p1' });

      const result = await productsService.create(
        { title: 'Filtre à huile Toyota', brand: 'Toyota', category: 'moteur', price: 5000, stock: 10 },
        'seller-1',
      );

      expect(mockPrisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: expect.stringMatching(/^filtre-huile-toyota-/),
            brandId: 'b1',
            categoryId: 'cat1',
            price: 5000,
            currency: 'XOF',
            condition: 'USED',
            sellerId: 'seller-1',
          }),
        }),
      );
      expect(result.id).toBe('p1');
    });
  });

  describe('update', () => {
    it('throws NotFoundError for a missing product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(productsService.update('missing', { title: 'X' }, 'user-1')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('forbids updating another seller product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', sellerId: 'other' });

      await expect(productsService.update('p1', { title: 'X' }, 'user-1')).rejects.toBeInstanceOf(ForbiddenError);
    });

    it('updates an owned product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', sellerId: 'user-1' });
      mockPrisma.product.update.mockResolvedValue({ id: 'p1', title: 'Nouveau' });

      const result = await productsService.update('p1', { title: 'Nouveau' }, 'user-1');

      expect(mockPrisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ title: 'Nouveau' }) }),
      );
      expect(result.title).toBe('Nouveau');
    });
  });

  describe('delete', () => {
    it('throws NotFoundError for a missing product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(productsService.delete('missing', 'user-1')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('forbids deleting another seller product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', sellerId: 'other' });

      await expect(productsService.delete('p1', 'user-1')).rejects.toBeInstanceOf(ForbiddenError);
    });

    it('soft-deletes an owned product', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', sellerId: 'user-1' });

      const result = await productsService.delete('p1', 'user-1');

      expect(mockPrisma.product.update).toHaveBeenCalledWith({ where: { id: 'p1' }, data: { active: false } });
      expect(result.success).toBe(true);
    });
  });

  describe('catalog helpers', () => {
    it('lists active brands sorted by name', async () => {
      mockPrisma.brand.findMany.mockResolvedValue([{ name: 'Toyota' }]);

      const result = await productsService.getBrands();

      expect(mockPrisma.brand.findMany).toHaveBeenCalledWith({ where: { active: true }, orderBy: { name: 'asc' } });
      expect(result[0].name).toBe('Toyota');
    });

    it('lists active categories sorted by sortOrder', async () => {
      mockPrisma.category.findMany.mockResolvedValue([{ name: 'Moteur' }]);

      const result = await productsService.getCategories();

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: { sortOrder: 'asc' },
      });
      expect(result[0].name).toBe('Moteur');
    });

    it('search delegates to list with the query', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await productsService.search('filtre');

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
          skip: 0,
          take: 20,
        }),
      );
    });
  });
});

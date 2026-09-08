import { describe, it, expect, vi, beforeEach } from 'vitest';
import { suppliersService } from '@/modules/suppliers/suppliers.service';
import { NotFoundError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  supplier: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('SuppliersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a supplier with verified defaulting to false', async () => {
    mockPrisma.supplier.create.mockResolvedValue({ id: 's1', name: 'Guangzhou Parts', country: 'CN' });

    const result = await suppliersService.create({ name: 'Guangzhou Parts', country: 'CN' });

    expect(mockPrisma.supplier.create).toHaveBeenCalledWith({
      data: { name: 'Guangzhou Parts', country: 'CN', verified: false },
    });
    expect(result.id).toBe('s1');
  });

  it('rejects a supplier without name or country', async () => {
    await expect(suppliersService.create({ name: '' } as never)).rejects.toBeInstanceOf(ValidationError);
    await expect(suppliersService.create({ country: 'CN' } as never)).rejects.toBeInstanceOf(ValidationError);
  });

  it('lists suppliers with counts and pagination', async () => {
    mockPrisma.supplier.findMany.mockResolvedValue([{ id: 's1', name: 'Toyota Supplier', _count: { purchaseOrders: 2, products: 5 } }]);
    mockPrisma.supplier.count.mockResolvedValue(1);

    const result = await suppliersService.list({ country: 'CN' }, { page: 1, pageSize: 20 });

    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(mockPrisma.supplier.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ country: 'CN' }),
        include: { _count: { select: { purchaseOrders: true, products: true } } },
      }),
    );
  });

  it('filters by search across name, contact and email', async () => {
    mockPrisma.supplier.findMany.mockResolvedValue([]);
    mockPrisma.supplier.count.mockResolvedValue(0);

    await suppliersService.list({ search: 'ahmed' }, { page: 1, pageSize: 20 });

    const where = mockPrisma.supplier.findMany.mock.calls[0][0].where;
    expect(where.OR).toHaveLength(5);
    // Pas de `mode: 'insensitive'` : le connecteur SQLite/libSQL le rejette et
    // `contains` y est deja insensible a la casse pour l ASCII.
    expect(where.OR[0]).toEqual({ name: { contains: 'ahmed' } });
  });

  it('throws NotFoundError for a missing supplier in getById', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue(null);

    await expect(suppliersService.getById('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('returns a supplier with products and purchase orders in getById', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue({ id: 's1', name: 'Parts Co', products: [], purchaseOrders: [] });

    const result = await suppliersService.getById('s1');

    expect(result.id).toBe('s1');
    expect(mockPrisma.supplier.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 's1' }, include: expect.objectContaining({ products: expect.any(Object) }) }),
    );
  });

  it('updates an existing supplier', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue({ id: 's1', name: 'Parts Co' });
    mockPrisma.supplier.update.mockResolvedValue({ id: 's1', name: 'Parts Co Ltd' });

    const result = await suppliersService.update('s1', { name: 'Parts Co Ltd' });

    expect(mockPrisma.supplier.update).toHaveBeenCalledWith({ where: { id: 's1' }, data: { name: 'Parts Co Ltd' } });
    expect(result.name).toBe('Parts Co Ltd');
  });

  it('throws NotFoundError when updating a missing supplier', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue(null);

    await expect(suppliersService.update('missing', { name: 'X' })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deletes an existing supplier', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue({ id: 's1', name: 'Parts Co' });
    mockPrisma.supplier.delete.mockResolvedValue({});

    const result = await suppliersService.remove('s1');

    expect(result.success).toBe(true);
    expect(mockPrisma.supplier.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
  });
});

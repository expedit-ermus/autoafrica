import { describe, it, expect, vi, beforeEach } from 'vitest';
import { purchaseOrdersService } from '@/modules/purchase-orders/purchase-orders.service';
import { NotFoundError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  purchaseOrder: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  supplier: {
    findUnique: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('PurchaseOrdersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a purchase order with items and computed total', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue({ id: 'sup-1', name: 'Guangzhou', paymentTerms: 'LC' });
    mockPrisma.purchaseOrder.create.mockResolvedValue({ id: 'po-1', poNumber: 'PO-ABC-123', items: [] });

    const result = await purchaseOrdersService.create(
      {
        supplierId: 'sup-1',
        items: [
          { productName: 'Filtre a huile', quantity: 100, unitPrice: 5 },
          { productName: 'Plaquettes', quantity: 50, unitPrice: 20 },
        ],
      },
      'user-1',
    );

    expect(mockPrisma.supplier.findUnique).toHaveBeenCalledWith({ where: { id: 'sup-1' } });
    const createCall = mockPrisma.purchaseOrder.create.mock.calls[0][0];
    expect(createCall.data.totalAmount).toBe(100 * 5 + 50 * 20);
    expect(createCall.data.poNumber).toMatch(/^PO-/);
    expect(createCall.data.items.create).toHaveLength(2);
    expect(createCall.data.items.create[0].totalPrice).toBe(500);
    expect(createCall.data.createdBy).toBe('user-1');
    expect(result.id).toBe('po-1');
  });

  it('rejects a purchase order without supplier or items', async () => {
    await expect(purchaseOrdersService.create({ supplierId: 'sup-1', items: [] }, 'user-1')).rejects.toBeInstanceOf(ValidationError);
    await expect(purchaseOrdersService.create({} as never, 'user-1')).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects an item with invalid quantity or unit price', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue({ id: 'sup-1' });

    await expect(
      purchaseOrdersService.create({ supplierId: 'sup-1', items: [{ productName: 'X', quantity: 0, unitPrice: 5 }] }, 'user-1'),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      purchaseOrdersService.create({ supplierId: 'sup-1', items: [{ productName: 'X', quantity: 2, unitPrice: -1 }] }, 'user-1'),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws NotFoundError when the supplier does not exist', async () => {
    mockPrisma.supplier.findUnique.mockResolvedValue(null);

    await expect(
      purchaseOrdersService.create({ supplierId: 'missing', items: [{ productName: 'X', quantity: 1, unitPrice: 1 }] }, 'user-1'),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('lists purchase orders with supplier and count', async () => {
    mockPrisma.purchaseOrder.findMany.mockResolvedValue([{ id: 'po-1', poNumber: 'PO-1', _count: { items: 3 } }]);
    mockPrisma.purchaseOrder.count.mockResolvedValue(1);

    const result = await purchaseOrdersService.list({ status: 'SHIPPED' }, { page: 1, pageSize: 20 });

    expect(result.total).toBe(1);
    expect(mockPrisma.purchaseOrder.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: 'SHIPPED' }), include: expect.objectContaining({ supplier: expect.any(Object) }) }),
    );
  });

  it('throws NotFoundError for a missing order in getById', async () => {
    mockPrisma.purchaseOrder.findUnique.mockResolvedValue(null);

    await expect(purchaseOrdersService.getById('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('approves a purchase order and stamps approvedBy/approvedAt', async () => {
    mockPrisma.purchaseOrder.findUnique.mockResolvedValue({ id: 'po-1', approvedAt: null });
    mockPrisma.purchaseOrder.update.mockResolvedValue({ id: 'po-1', status: 'APPROVED' });

    const result = await purchaseOrdersService.updateStatus('po-1', 'APPROVED', 'user-1');

    expect(result.status).toBe('APPROVED');
    expect(mockPrisma.purchaseOrder.update).toHaveBeenCalledWith({
      where: { id: 'po-1' },
      data: { status: 'APPROVED', approvedBy: 'user-1', approvedAt: expect.any(Date) },
    });
  });

  it('sets actualDate when completing an order', async () => {
    mockPrisma.purchaseOrder.findUnique.mockResolvedValue({ id: 'po-1', approvedAt: null });
    mockPrisma.purchaseOrder.update.mockResolvedValue({ id: 'po-1', status: 'COMPLETED' });

    await purchaseOrdersService.updateStatus('po-1', 'COMPLETED', 'user-1');

    expect(mockPrisma.purchaseOrder.update).toHaveBeenCalledWith({
      where: { id: 'po-1' },
      data: { status: 'COMPLETED', actualDate: expect.any(Date) },
    });
  });

  it('deletes an existing purchase order', async () => {
    mockPrisma.purchaseOrder.findUnique.mockResolvedValue({ id: 'po-1' });
    mockPrisma.purchaseOrder.delete.mockResolvedValue({});

    const result = await purchaseOrdersService.remove('po-1');

    expect(result.success).toBe(true);
    expect(mockPrisma.purchaseOrder.delete).toHaveBeenCalledWith({ where: { id: 'po-1' } });
  });
});

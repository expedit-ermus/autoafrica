import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ordersService } from '@/modules/orders/orders.service';
import { NotFoundError, ValidationError, ForbiddenError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  order: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  orderItem: {
    findMany: vi.fn(),
  },
  orderTimeline: {
    create: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('OrdersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('lists orders filtered by seller via items', async () => {
      mockPrisma.order.findMany.mockResolvedValue([{ id: 'o1' }]);
      mockPrisma.order.count.mockResolvedValue(1);

      const result = await ordersService.list({ sellerId: 'seller-1' }, { page: 1, pageSize: 20 });

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ items: { some: { sellerId: 'seller-1' } } }) }),
      );
      expect(result.data[0].id).toBe('o1');
    });

    it('filters by date range', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      mockPrisma.order.count.mockResolvedValue(0);

      await ordersService.list({ dateFrom: '2026-01-01', dateTo: '2026-01-31' }, { page: 1, pageSize: 20 });

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ createdAt: { gte: expect.any(Date), lte: expect.any(Date) } }),
        }),
      );
    });
  });

  describe('getById', () => {
    it('throws NotFoundError for a missing order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(ordersService.getById('missing')).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('create', () => {
    it('throws NotFoundError when a product does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(
        ordersService.create({ items: [{ productId: 'p1', quantity: 1 }] }, 'buyer-1'),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects when stock is insufficient', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', title: 'Filtre', stock: 0, price: 1000 });

      await expect(
        ordersService.create({ items: [{ productId: 'p1', quantity: 2 }] }, 'buyer-1'),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('creates an order with 18% tax and decrements stock', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', title: 'Filtre', stock: 10, price: 1000, sellerId: 's1' });
      mockPrisma.order.create.mockResolvedValue({ id: 'o1', items: [] });

      const result = await ordersService.create({ items: [{ productId: 'p1', quantity: 2 }] }, 'buyer-1');

      expect(mockPrisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subtotal: 2000,
            taxAmount: 360,
            totalAmount: 2360,
            orderNumber: expect.stringMatching(/^AAF-/),
          }),
        }),
      );
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { stock: { decrement: 2 }, salesCount: { increment: 2 } },
      });
      expect(result.id).toBe('o1');
    });
  });

  describe('updateStatus', () => {
    it('throws NotFoundError for a missing order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(ordersService.updateStatus('missing', 'SHIPPED', 'user-1')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('updates the order and records a timeline entry', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1' });
      mockPrisma.order.update.mockResolvedValue({ id: 'o1', status: 'SHIPPED' });

      await ordersService.updateStatus('o1', 'SHIPPED', 'user-1');

      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: { status: 'SHIPPED' },
        include: { items: true },
      });
      expect(mockPrisma.orderTimeline.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ orderId: 'o1', actor: 'user-1' }) }),
      );
    });
  });

  describe('cancel', () => {
    it('throws NotFoundError for a missing order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(ordersService.cancel('missing', 'user-1', 'reason')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('forbids cancelling another user order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'other', status: 'PENDING' });

      await expect(ordersService.cancel('o1', 'user-1', 'reason')).rejects.toBeInstanceOf(ForbiddenError);
    });

    it('rejects cancelling an order in a non-cancellable state', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'user-1', status: 'SHIPPED' });

      await expect(ordersService.cancel('o1', 'user-1', 'reason')).rejects.toBeInstanceOf(ValidationError);
    });

    it('cancels the order and restores stock', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'user-1', status: 'PENDING' });
      mockPrisma.orderItem.findMany.mockResolvedValue([{ productId: 'p1', quantity: 2 }]);

      const result = await ordersService.cancel('o1', 'user-1', 'Client annulé');

      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: { status: 'CANCELLED', cancelledAt: expect.any(Date), cancelReason: 'Client annulé' },
      });
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: 'p1' },
        data: { stock: { increment: 2 } },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('delegation', () => {
    it('lists seller orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      mockPrisma.order.count.mockResolvedValue(0);

      await ordersService.getSellerOrders('seller-1', { page: 1, pageSize: 20 });

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ items: { some: { sellerId: 'seller-1' } } }) }),
      );
    });

    it('lists buyer orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      mockPrisma.order.count.mockResolvedValue(0);

      await ordersService.getBuyerOrders('buyer-1', { page: 1, pageSize: 20 });

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ buyerId: 'buyer-1' }) }),
      );
    });
  });
});

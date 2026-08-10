import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentsService } from '@/modules/payments/payments.service';
import { NotFoundError, ValidationError, PaymentError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  order: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  payment: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  },
  orderTimeline: {
    create: vi.fn(),
  },
  refund: {
    create: vi.fn(),
  },
  notification: {
    create: vi.fn(),
  },
}));

const mockProviders = vi.hoisted(() => ({
  isSupported: vi.fn(),
  get: vi.fn(),
  list: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));
vi.mock('@/modules/payments/providers/registry', () => ({ paymentProviders: mockProviders }));

function makeProvider(overrides: Partial<{ success: boolean; transactionId: string; message: string; ussdCode: string; status: string; error: string }> = {}) {
  return {
    id: 'orange_money',
    name: 'Orange Money',
    shortCode: 'OM',
    initiate: vi.fn().mockResolvedValue({
      success: true,
      transactionId: 'txn-1',
      status: 'completed',
      message: 'OK',
      ussdCode: '#144#',
      pinRequired: false,
      ...overrides,
    }),
  };
}

describe('PaymentsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('process', () => {
    it('throws NotFoundError when the order does not exist', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(
        paymentsService.process({ orderId: 'o1', method: 'orange_money', phone: '+225', amount: 1000 }, 'user-1'),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects paying another user order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'other', status: 'PENDING', currency: 'XOF' });

      await expect(
        paymentsService.process({ orderId: 'o1', method: 'orange_money', phone: '+225', amount: 1000 }, 'user-1'),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects an already paid order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'user-1', status: 'PAID', currency: 'XOF' });

      await expect(
        paymentsService.process({ orderId: 'o1', method: 'orange_money', phone: '+225', amount: 1000 }, 'user-1'),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects an unsupported payment method', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'user-1', status: 'PENDING', currency: 'XOF' });
      mockProviders.isSupported.mockReturnValue(false);

      await expect(
        paymentsService.process({ orderId: 'o1', method: 'cash', phone: '+225', amount: 1000 }, 'user-1'),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('completes a payment and marks the order as paid', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'user-1', status: 'PENDING', currency: 'XOF', orderNumber: 'AAF-1' });
      mockProviders.isSupported.mockReturnValue(true);
      const provider = makeProvider();
      mockProviders.get.mockReturnValue(provider);
      mockPrisma.payment.create.mockResolvedValue({ id: 'pay-1', amount: 1000 });

      const result = await paymentsService.process({ orderId: 'o1', method: 'orange_money', phone: '+225', amount: 1000 }, 'user-1');

      expect(mockPrisma.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ orderId: 'o1', status: 'PENDING' }) }),
      );
      expect(mockPrisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'COMPLETED', transactionId: 'txn-1' }) }),
      );
      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: { status: 'PAID', paymentStatus: 'PAID' },
      });
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('txn-1');
    });

    it('marks the payment failed and throws PaymentError when the provider rejects', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'o1', buyerId: 'user-1', status: 'PENDING', currency: 'XOF', orderNumber: 'AAF-1' });
      mockProviders.isSupported.mockReturnValue(true);
      mockProviders.get.mockReturnValue(makeProvider({ success: false, error: 'Solde insuffisant', message: 'Insufficient balance' }));
      mockPrisma.payment.create.mockResolvedValue({ id: 'pay-1' });

      await expect(
        paymentsService.process({ orderId: 'o1', method: 'orange_money', phone: '+225', amount: 1000 }, 'user-1'),
      ).rejects.toBeInstanceOf(PaymentError);

      expect(mockPrisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'FAILED' }) }),
      );
    });
  });

  describe('cancel', () => {
    it('throws NotFoundError for a missing payment', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue(null);

      await expect(paymentsService.cancel('missing', 'user-1')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects cancelling another user payment', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', userId: 'other', status: 'PENDING' });

      await expect(paymentsService.cancel('pay-1', 'user-1')).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects cancelling a completed payment', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', userId: 'user-1', status: 'COMPLETED' });

      await expect(paymentsService.cancel('pay-1', 'user-1')).rejects.toBeInstanceOf(ValidationError);
    });

    it('cancels a pending payment', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', userId: 'user-1', status: 'PROCESSING' });

      const result = await paymentsService.cancel('pay-1', 'user-1', 'Client cancel');

      expect(mockPrisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'CANCELLED', failureReason: 'Client cancel' }) }),
      );
      expect(result.status).toBe('CANCELLED');
    });
  });

  describe('getStatus and list', () => {
    it('throws NotFoundError for a missing payment in getStatus', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue(null);

      await expect(paymentsService.getStatus('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('returns the payment with its order', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', order: { id: 'o1' } });

      const result = await paymentsService.getStatus('pay-1');

      expect(result.order.id).toBe('o1');
    });

    it('lists the payments of the user', async () => {
      mockPrisma.payment.findMany.mockResolvedValue([{ id: 'pay-1' }]);

      const result = await paymentsService.list('user-1');

      expect(mockPrisma.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('refund', () => {
    it('throws NotFoundError for a missing payment', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue(null);

      await expect(paymentsService.refund('missing', 'reason')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects refunding a non-completed payment', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', status: 'PENDING' });

      await expect(paymentsService.refund('pay-1', 'reason')).rejects.toBeInstanceOf(ValidationError);
    });

    it('refunds a completed payment and marks the order refunded', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', status: 'COMPLETED', amount: 5000, orderId: 'o1' });
      mockPrisma.refund.create.mockResolvedValue({});

      const result = await paymentsService.refund('pay-1', 'Produit retourné');

      expect(mockPrisma.refund.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ paymentId: 'pay-1', reason: 'Produit retourné' }) }),
      );
      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: { status: 'REFUNDED', paymentStatus: 'REFUNDED' },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('handleWebhook', () => {
    it('throws NotFoundError when the payment reference does not exist', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue(null);

      await expect(
        paymentsService.handleWebhook({ paymentId: 'missing', status: 'COMPLETED' }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('processes a COMPLETED webhook callback, updates order status and creates a notification', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({
        id: 'pay-1',
        orderId: 'o1',
        userId: 'user-1',
        amount: 15000,
        currency: 'XOF',
        providerRef: 'WAVE',
        transactionId: 'wave-txn-1',
        metadata: {},
      });
      mockPrisma.payment.update.mockResolvedValue({ id: 'pay-1', status: 'COMPLETED' });

      const result = await paymentsService.handleWebhook({
        paymentId: 'pay-1',
        status: 'COMPLETED',
        transactionId: 'wave-txn-999',
        rawPayload: { wave_id: '123' },
      });

      expect(mockPrisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'COMPLETED', transactionId: 'wave-txn-999' }),
        }),
      );
      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: { status: 'PAID', paymentStatus: 'PAID' },
      });
      expect(mockPrisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: 'user-1', type: 'payment' }),
        }),
      );
      expect(result.success).toBe(true);
    });

    it('processes a FAILED webhook callback and updates payment status', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', orderId: 'o1', userId: 'user-1', metadata: {} });
      mockPrisma.payment.update.mockResolvedValue({ id: 'pay-1', status: 'FAILED' });

      const result = await paymentsService.handleWebhook({
        paymentId: 'pay-1',
        status: 'FAILED',
        failureReason: 'Solde insuffisant sur compte Mobile Money',
      });

      expect(mockPrisma.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED', failureReason: 'Solde insuffisant sur compte Mobile Money' }),
        }),
      );
      expect(result.success).toBe(false);
    });
  });
});

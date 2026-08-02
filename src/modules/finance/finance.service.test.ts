import { describe, it, expect, vi, beforeEach } from 'vitest';
import { financeService } from '@/modules/finance/finance.service';
import { NotFoundError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  invoice: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  order: {
    findUnique: vi.fn(),
  },
  account: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  transaction: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('FinanceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('invoices', () => {
    it('creates an invoice with computed totals', async () => {
      mockPrisma.invoice.create.mockResolvedValue({ id: 'inv-1', invoiceNumber: 'INV-XXX' });

      const result = await financeService.createInvoice({
        sellerId: 'seller-1',
        buyerId: 'buyer-1',
        subtotal: 10000,
        taxRate: 18,
      });

      expect(mockPrisma.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subtotal: 10000,
            taxRate: 18,
            taxAmount: 1800,
            totalAmount: 11800,
            status: 'DRAFT',
          }),
        }),
      );
      expect(result.id).toBe('inv-1');
    });

    it('rejects an invoice without required fields', async () => {
      await expect(
        financeService.createInvoice({ sellerId: '', buyerId: 'buyer-1', subtotal: 10000 }),
      ).rejects.toBeInstanceOf(ValidationError);
      await expect(
        financeService.createInvoice({ sellerId: 'seller-1', buyerId: '', subtotal: 10000 }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('throws NotFoundError when the linked order does not exist', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(
        financeService.createInvoice({
          sellerId: 'seller-1',
          buyerId: 'buyer-1',
          orderId: 'missing',
          subtotal: 5000,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('lists invoices with filters and count', async () => {
      mockPrisma.invoice.findMany.mockResolvedValue([{ id: 'inv-1' }]);
      mockPrisma.invoice.count.mockResolvedValue(1);

      const result = await financeService.listInvoices({ status: 'PAID', search: 'INV' }, { page: 1, pageSize: 20 });

      expect(result.total).toBe(1);
      expect(mockPrisma.invoice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'PAID' }) }),
      );
    });

    it('throws NotFoundError for a missing invoice in getById', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue(null);

      await expect(financeService.getInvoiceById('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('stamps paidAt when transitioning to PAID', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue({ id: 'inv-1', paidAt: null });
      mockPrisma.invoice.update.mockResolvedValue({ id: 'inv-1', status: 'PAID' });

      await financeService.updateInvoiceStatus('inv-1', 'PAID');

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: { status: 'PAID', paidAt: expect.any(Date) },
      });
    });

    it('clears paidAt when leaving PAID', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue({ id: 'inv-1', paidAt: new Date() });

      await financeService.updateInvoiceStatus('inv-1', 'DRAFT');

      expect(mockPrisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: { status: 'DRAFT', paidAt: null },
      });
    });

    it('deletes an existing invoice', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue({ id: 'inv-1' });
      mockPrisma.invoice.delete.mockResolvedValue({});

      const result = await financeService.removeInvoice('inv-1');

      expect(result.success).toBe(true);
      expect(mockPrisma.invoice.delete).toHaveBeenCalledWith({ where: { id: 'inv-1' } });
    });

    it('rejects a negative subtotal', async () => {
      await expect(
        financeService.createInvoice({ sellerId: 's', buyerId: 'b', subtotal: -5 }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('creates an invoice when the linked order exists', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order-1' });
      mockPrisma.invoice.create.mockResolvedValue({ id: 'inv-1' });

      const result = await financeService.createInvoice({
        sellerId: 's',
        buyerId: 'b',
        subtotal: 1000,
        orderId: 'order-1',
        dueDate: '2026-01-01',
        invoiceNumber: 'INV-CUSTOM',
        status: 'PENDING',
        currency: 'XOF',
      });

      expect(result.id).toBe('inv-1');
      expect(mockPrisma.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            invoiceNumber: 'INV-CUSTOM',
            orderId: 'order-1',
            status: 'PENDING',
          }),
        }),
      );
    });

    it('throws NotFoundError when updating a missing invoice', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue(null);

      await expect(financeService.updateInvoice('missing', { status: 'PAID' })).rejects.toBeInstanceOf(NotFoundError);
    });

    it('updates an invoice with recomputed totals', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue({
        id: 'inv-1',
        subtotal: 1000,
        taxRate: 18,
        taxAmount: 180,
        totalAmount: 1180,
      });
      mockPrisma.invoice.update.mockResolvedValue({ id: 'inv-1' });

      const result = await financeService.updateInvoice('inv-1', { subtotal: 2000 });

      expect(result.id).toBe('inv-1');
      expect(mockPrisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ subtotal: 2000, taxAmount: 360, totalAmount: 2360 }),
        }),
      );
    });

    it('throws NotFoundError for a missing invoice in updateInvoiceStatus', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue(null);

      await expect(financeService.updateInvoiceStatus('missing', 'PAID')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('throws NotFoundError when removing a missing invoice', async () => {
      mockPrisma.invoice.findUnique.mockResolvedValue(null);

      await expect(financeService.removeInvoice('missing')).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('accounts', () => {
    it('creates an account with defaults', async () => {
      mockPrisma.account.create.mockResolvedValue({ id: 'acc-1', code: 'A1' });

      const result = await financeService.createAccount({ code: 'A1', name: 'Caisse', type: 'asset' });

      expect(mockPrisma.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ code: 'A1', balance: 0, active: true, currency: 'XOF' }),
        }),
      );
      expect(result.id).toBe('acc-1');
    });

    it('rejects an account with an invalid type', async () => {
      await expect(
        financeService.createAccount({ code: 'A1', name: 'Caisse', type: 'invalid' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects a duplicate account code', async () => {
      mockPrisma.account.findFirst.mockResolvedValue({ id: 'acc-1' });

      await expect(
        financeService.createAccount({ code: 'A1', name: 'Caisse', type: 'asset' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('lists accounts with filters and count', async () => {
      mockPrisma.account.findMany.mockResolvedValue([{ id: 'acc-1' }]);
      mockPrisma.account.count.mockResolvedValue(1);

      const result = await financeService.listAccounts({ type: 'asset' }, { page: 1, pageSize: 20 });

      expect(result.total).toBe(1);
      expect(mockPrisma.account.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ type: 'asset' }) }),
      );
    });

    it('throws NotFoundError for a missing account in getById', async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null);

      await expect(financeService.getAccountById('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects removing an account with transactions', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1' });
      mockPrisma.account.count.mockResolvedValue(0);
      mockPrisma.transaction.count.mockResolvedValue(3);

      await expect(financeService.removeAccount('acc-1')).rejects.toBeInstanceOf(ValidationError);
    });

    it('deletes an account without children or transactions', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1' });
      mockPrisma.account.count.mockResolvedValue(0);
      mockPrisma.transaction.count.mockResolvedValue(0);
      mockPrisma.account.delete.mockResolvedValue({});

      const result = await financeService.removeAccount('acc-1');

      expect(result.success).toBe(true);
      expect(mockPrisma.account.delete).toHaveBeenCalledWith({ where: { id: 'acc-1' } });
    });

    it('returns an account with parent and children', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1', parent: null, children: [] });

      const account = await financeService.getAccountById('acc-1');

      expect(account.id).toBe('acc-1');
    });

    it('lists accounts filtering by active state', async () => {
      mockPrisma.account.findMany.mockResolvedValue([{ id: 'acc-1' }]);
      mockPrisma.account.count.mockResolvedValue(1);

      const result = await financeService.listAccounts({ active: 'true' }, { page: 1, pageSize: 10 });

      expect(result.total).toBe(1);
      expect(mockPrisma.account.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ active: true }) }),
      );
    });

    it('throws NotFoundError when the account parent does not exist', async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);
      mockPrisma.account.findUnique.mockResolvedValue(null);

      await expect(
        financeService.createAccount({ code: 'A1', name: 'Caisse', type: 'asset', parentId: 'missing' }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects updating an account with a duplicate code', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1' });
      mockPrisma.account.findFirst.mockResolvedValue({ id: 'acc-2' });

      await expect(financeService.updateAccount('acc-1', { code: 'X1' })).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects updating an account to be its own parent', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1' });

      await expect(financeService.updateAccount('acc-1', { parentId: 'acc-1' })).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects updating an account with an invalid type', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1' });

      await expect(financeService.updateAccount('acc-1', { type: 'nope' })).rejects.toBeInstanceOf(ValidationError);
    });

    it('updates an account successfully', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1' });
      mockPrisma.account.update.mockResolvedValue({ id: 'acc-1' });

      const result = await financeService.updateAccount('acc-1', { name: 'Caisse XOF', active: false });

      expect(result.id).toBe('acc-1');
    });

    it('throws NotFoundError for a missing account in updateAccount', async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null);

      await expect(financeService.updateAccount('missing', { name: 'x' })).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects removing an account that has children', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1' });
      mockPrisma.account.count.mockResolvedValue(2);

      await expect(financeService.removeAccount('acc-1')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe('transactions', () => {
    it('records a debit transaction and updates the balance', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1', balance: 0 });
      mockPrisma.$transaction.mockResolvedValue([
        { id: 'txn-1', accountId: 'acc-1', type: 'debit', amount: 5000, balance: 5000 },
        { id: 'acc-1', balance: 5000 },
      ]);

      const result = await financeService.recordTransaction({
        accountId: 'acc-1',
        type: 'debit',
        amount: 5000,
        description: 'Depot initial',
      });

      expect(mockPrisma.account.findUnique).toHaveBeenCalledWith({ where: { id: 'acc-1' } });
      expect(mockPrisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ balance: 5000 }) }),
      );
      expect(mockPrisma.account.update).toHaveBeenCalledWith({
        where: { id: 'acc-1' },
        data: { balance: 5000 },
      });
      expect(result.id).toBe('txn-1');
    });

    it('rejects a transaction with an invalid type', async () => {
      await expect(
        financeService.recordTransaction({ accountId: 'acc-1', type: 'transfer', amount: 1000 }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects a non-positive amount', async () => {
      await expect(
        financeService.recordTransaction({ accountId: 'acc-1', type: 'debit', amount: 0 }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('throws NotFoundError when the account does not exist', async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null);

      await expect(
        financeService.recordTransaction({ accountId: 'missing', type: 'debit', amount: 1000 }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('lists transactions with filters and count', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([{ id: 'txn-1' }]);
      mockPrisma.transaction.count.mockResolvedValue(1);

      const result = await financeService.listTransactions({ accountId: 'acc-1' }, { page: 1, pageSize: 20 });

      expect(result.total).toBe(1);
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ accountId: 'acc-1' }) }),
      );
    });

    it('records a credit transaction with a lower balance', async () => {
      mockPrisma.account.findUnique.mockResolvedValue({ id: 'acc-1', balance: 10000 });
      mockPrisma.$transaction.mockResolvedValue([{ id: 'txn-2', balance: 8000 }]);

      const result = await financeService.recordTransaction({ accountId: 'acc-1', type: 'credit', amount: 2000 });

      expect(result.balance).toBe(8000);
    });

    it('lists transactions with sort and search filters', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([{ id: 'txn-1' }]);
      mockPrisma.transaction.count.mockResolvedValue(1);

      const result = await financeService.listTransactions(
        { search: 'depot', type: 'debit' },
        { page: 1, pageSize: 10, sortBy: 'date', sortOrder: 'asc' },
      );

      expect(result.total).toBe(1);
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { date: 'asc' } }),
      );
    });
  });
});

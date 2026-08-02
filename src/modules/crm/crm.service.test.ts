import { describe, it, expect, vi, beforeEach } from 'vitest';
import { crmService } from '@/modules/crm/crm.service';
import { NotFoundError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  customer: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  customerInteraction: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
  lead: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('CrmService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('customers', () => {
    it('lists customers with filters and pagination', async () => {
      mockPrisma.customer.findMany.mockResolvedValue([{ id: 'c1', name: 'Kouame' }]);
      mockPrisma.customer.count.mockResolvedValue(1);

      const result = await crmService.listCustomers({ search: 'kouame', type: 'wholesale' }, { page: 1, pageSize: 20 });

      expect(mockPrisma.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ type: 'wholesale' }) }),
      );
      expect(result.data[0].id).toBe('c1');
      expect(result.pagination.total).toBe(1);
    });

    it('throws NotFoundError for a missing customer in getCustomer', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      await expect(crmService.getCustomer('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('creates a customer with defaults for segment and source', async () => {
      mockPrisma.customer.create.mockResolvedValue({ id: 'c1' });

      await crmService.createCustomer({ name: 'Kouame', type: 'retail', country: 'CI' });

      expect(mockPrisma.customer.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: 'Kouame', segment: 'new', source: 'web', tags: [] }),
        }),
      );
    });

    it('throws NotFoundError when updating a missing customer', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      await expect(crmService.updateCustomer('missing', { name: 'X' })).rejects.toBeInstanceOf(NotFoundError);
    });

    it('deletes an existing customer', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({ id: 'c1' });
      mockPrisma.customer.delete.mockResolvedValue({});

      const result = await crmService.deleteCustomer('c1');

      expect(result.success).toBe(true);
      expect(mockPrisma.customer.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    });
  });

  describe('interactions', () => {
    it('lists interactions of a customer', async () => {
      mockPrisma.customerInteraction.findMany.mockResolvedValue([{ id: 'i1' }]);

      const result = await crmService.listInteractions('c1');

      expect(result).toHaveLength(1);
      expect(mockPrisma.customerInteraction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { customerId: 'c1' } }),
      );
    });

    it('throws NotFoundError when creating an interaction for a missing customer', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      await expect(crmService.createInteraction({ customerId: 'missing', type: 'call' })).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it('creates an interaction and stamps lastOrderAt on the customer', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({ id: 'c1' });
      mockPrisma.customerInteraction.create.mockResolvedValue({ id: 'i1' });

      await crmService.createInteraction({ customerId: 'c1', type: 'call', subject: 'Relance' }, 'user-1');

      expect(mockPrisma.customerInteraction.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ customerId: 'c1', userId: 'user-1' }) }),
      );
      expect(mockPrisma.customer.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { lastOrderAt: expect.any(Date) },
      });
    });
  });

  describe('leads', () => {
    it('lists leads filtered by status', async () => {
      mockPrisma.lead.findMany.mockResolvedValue([{ id: 'l1' }]);
      mockPrisma.lead.count.mockResolvedValue(1);

      const result = await crmService.listLeads({ status: 'new' }, { page: 1, pageSize: 20 });

      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'new' }) }),
      );
      expect(result.data[0].id).toBe('l1');
    });

    it('creates a lead with a default source', async () => {
      mockPrisma.lead.create.mockResolvedValue({ id: 'l1' });

      await crmService.createLead({ name: 'Prospect', phone: '+225' });

      expect(mockPrisma.lead.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ name: 'Prospect', source: 'web' }) }),
      );
    });

    it('throws NotFoundError when updating the status of a missing lead', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(null);

      await expect(crmService.updateLeadStatus('missing', 'converted')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('deletes an existing lead', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue({ id: 'l1' });
      mockPrisma.lead.delete.mockResolvedValue({});

      const result = await crmService.deleteLead('l1');

      expect(result.success).toBe(true);
    });
  });

  describe('stats', () => {
    it('returns the CRM KPIs', async () => {
      mockPrisma.customer.count.mockResolvedValue(10);
      mockPrisma.lead.count.mockResolvedValue(5);

      const result = await crmService.getStats();

      expect(result.totalCustomers).toBe(10);
      expect(result.totalLeads).toBe(5);
      expect(mockPrisma.customer.count).toHaveBeenCalled();
      expect(mockPrisma.lead.count).toHaveBeenCalled();
    });
  });
});

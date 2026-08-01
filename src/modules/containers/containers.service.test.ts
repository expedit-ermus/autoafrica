import { describe, it, expect, vi, beforeEach } from 'vitest';
import { containersService } from '@/modules/containers/containers.service';
import { NotFoundError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  container: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  purchaseOrder: {
    findUnique: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('ContainersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a container linked to a purchase order', async () => {
    mockPrisma.container.findUnique.mockResolvedValue(null);
    mockPrisma.purchaseOrder.findUnique.mockResolvedValue({ id: 'po-1' });
    mockPrisma.container.create.mockResolvedValue({ id: 'ctn-1', containerNumber: 'MSKU1234567' });

    const result = await containersService.create({
      containerNumber: 'MSKU1234567',
      purchaseOrderId: 'po-1',
      size: '40hq',
      originPort: 'Ningbo',
      destinationPort: 'Abidjan',
      shippingLine: 'CMA CGM',
    });

    expect(mockPrisma.purchaseOrder.findUnique).toHaveBeenCalledWith({ where: { id: 'po-1' } });
    expect(mockPrisma.container.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          containerNumber: 'MSKU1234567',
          size: '40hq',
          status: 'LOADING',
        }),
      }),
    );
    expect(result.id).toBe('ctn-1');
  });

  it('rejects a container without required fields', async () => {
    await expect(
      containersService.create({ containerNumber: '', size: '20ft', originPort: 'Ningbo', destinationPort: 'Abidjan' }),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      containersService.create({ containerNumber: 'MSKU1', size: '', originPort: '', destinationPort: '' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a duplicate container number', async () => {
    mockPrisma.container.findUnique.mockResolvedValue({ id: 'ctn-1' });

    await expect(
      containersService.create({ containerNumber: 'MSKU1234567', size: '20ft', originPort: 'Ningbo', destinationPort: 'Abidjan' }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws NotFoundError when the purchase order does not exist', async () => {
    mockPrisma.container.findUnique.mockResolvedValue(null);
    mockPrisma.purchaseOrder.findUnique.mockResolvedValue(null);

    await expect(
      containersService.create({ containerNumber: 'MSKU1', purchaseOrderId: 'missing', size: '20ft', originPort: 'Ningbo', destinationPort: 'Abidjan' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('lists containers with filters and count', async () => {
    mockPrisma.container.findMany.mockResolvedValue([{ id: 'ctn-1', containerNumber: 'MSKU1234567', customsRecord: null }]);
    mockPrisma.container.count.mockResolvedValue(1);

    const result = await containersService.list({ status: 'IN_TRANSIT', search: 'MSKU' }, { page: 1, pageSize: 20 });

    expect(result.total).toBe(1);
    expect(mockPrisma.container.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: 'IN_TRANSIT' }) }),
    );
  });

  it('throws NotFoundError for a missing container in getById', async () => {
    mockPrisma.container.findUnique.mockResolvedValue(null);

    await expect(containersService.getById('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('stamps departedAt when transitioning to SHIPPED', async () => {
    mockPrisma.container.findUnique.mockResolvedValue({ id: 'ctn-1', departedAt: null });
    mockPrisma.container.update.mockResolvedValue({ id: 'ctn-1', status: 'SHIPPED' });

    await containersService.updateStatus('ctn-1', 'SHIPPED');

    expect(mockPrisma.container.update).toHaveBeenCalledWith({
      where: { id: 'ctn-1' },
      data: { status: 'SHIPPED', departedAt: expect.any(Date) },
    });
  });

  it('stamps arrivedAt and clearedAt on later transitions', async () => {
    mockPrisma.container.findUnique.mockResolvedValue({ id: 'ctn-1', arrivedAt: null, clearedAt: null });

    await containersService.updateStatus('ctn-1', 'ARRIVED_PORT');
    expect(mockPrisma.container.update).toHaveBeenCalledWith({
      where: { id: 'ctn-1' },
      data: { status: 'ARRIVED_PORT', arrivedAt: expect.any(Date) },
    });

    mockPrisma.container.findUnique.mockResolvedValue({ id: 'ctn-1', arrivedAt: new Date(), clearedAt: null });
    await containersService.updateStatus('ctn-1', 'CUSTOMS_CLEARED');
    expect(mockPrisma.container.update).toHaveBeenCalledWith({
      where: { id: 'ctn-1' },
      data: { status: 'CUSTOMS_CLEARED', clearedAt: expect.any(Date) },
    });
  });

  it('deletes an existing container', async () => {
    mockPrisma.container.findUnique.mockResolvedValue({ id: 'ctn-1' });
    mockPrisma.container.delete.mockResolvedValue({});

    const result = await containersService.remove('ctn-1');

    expect(result.success).toBe(true);
    expect(mockPrisma.container.delete).toHaveBeenCalledWith({ where: { id: 'ctn-1' } });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { customsRecordsService } from '@/modules/customs-records/customs-records.service';
import { NotFoundError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  customsRecord: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  container: {
    findUnique: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('CustomsRecordsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a customs record linked to a container', async () => {
    mockPrisma.customsRecord.findUnique.mockResolvedValue(null);
    mockPrisma.container.findUnique.mockResolvedValue({ id: 'ctn-1' });
    mockPrisma.customsRecord.create.mockResolvedValue({ id: 'cr-1', declarationNumber: 'D2024-001' });

    const result = await customsRecordsService.create({
      containerId: 'ctn-1',
      declarationNumber: 'D2024-001',
      hsCode: '8708',
      cifValue: 25000,
      duties: 5000,
      taxes: 2500,
      fees: 500,
      totalDuty: 8000,
      broker: 'SGS Cote d\'Ivoire',
    });

    expect(mockPrisma.container.findUnique).toHaveBeenCalledWith({ where: { id: 'ctn-1' } });
    expect(mockPrisma.customsRecord.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          containerId: 'ctn-1',
          declarationNumber: 'D2024-001',
          status: 'PENDING',
          totalDuty: 8000,
        }),
      }),
    );
    expect(result.id).toBe('cr-1');
  });

  it('rejects a customs record without a container', async () => {
    await expect(customsRecordsService.create({} as never)).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a duplicate customs record for the same container', async () => {
    mockPrisma.customsRecord.findUnique.mockResolvedValue({ id: 'cr-1' });

    await expect(customsRecordsService.create({ containerId: 'ctn-1' })).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws NotFoundError when the container does not exist', async () => {
    mockPrisma.customsRecord.findUnique.mockResolvedValue(null);
    mockPrisma.container.findUnique.mockResolvedValue(null);

    await expect(customsRecordsService.create({ containerId: 'missing' })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('lists customs records with filters', async () => {
    mockPrisma.customsRecord.findMany.mockResolvedValue([{ id: 'cr-1', declarationNumber: 'D2024-001' }]);
    mockPrisma.customsRecord.count.mockResolvedValue(1);

    const result = await customsRecordsService.list({ status: 'UNDER_REVIEW', search: 'D2024' }, { page: 1, pageSize: 20 });

    expect(result.total).toBe(1);
    expect(mockPrisma.customsRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: 'UNDER_REVIEW' }) }),
    );
  });

  it('throws NotFoundError for a missing record in getById', async () => {
    mockPrisma.customsRecord.findUnique.mockResolvedValue(null);

    await expect(customsRecordsService.getById('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('stamps releasedAt when the record is released', async () => {
    mockPrisma.customsRecord.findUnique.mockResolvedValue({ id: 'cr-1', releasedAt: null });
    mockPrisma.customsRecord.update.mockResolvedValue({ id: 'cr-1', status: 'RELEASED' });

    await customsRecordsService.updateStatus('cr-1', 'RELEASED');

    expect(mockPrisma.customsRecord.update).toHaveBeenCalledWith({
      where: { id: 'cr-1' },
      data: { status: 'RELEASED', releasedAt: expect.any(Date) },
    });
  });

  it('deletes an existing customs record', async () => {
    mockPrisma.customsRecord.findUnique.mockResolvedValue({ id: 'cr-1' });
    mockPrisma.customsRecord.delete.mockResolvedValue({});

    const result = await customsRecordsService.remove('cr-1');

    expect(result.success).toBe(true);
    expect(mockPrisma.customsRecord.delete).toHaveBeenCalledWith({ where: { id: 'cr-1' } });
  });
});

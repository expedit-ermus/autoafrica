import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sellerService } from '@/modules/seller/seller.service';
import { NotFoundError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  sellerProfile: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('SellerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const input = {
    displayName: 'Garage Moussa',
    city: 'Abidjan',
    phoneForOrders: '+225 07 08 09 10',
    payoutMethod: 'ORANGE_MONEY' as const,
    payoutNumber: '+225 07 00 00 00',
  };

  it('activates a seller by creating the SellerProfile and enabling selling', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    mockPrisma.sellerProfile.upsert.mockResolvedValue({ id: 'sp-1', userId: 'user-1', ...input });
    mockPrisma.user.update.mockResolvedValue({ id: 'user-1', sellerEnabled: true, role: 'BUYER' });

    const result = await sellerService.activate('user-1', input);

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { sellerEnabled: true },
      select: expect.any(Object),
    });
    expect(result.user.sellerEnabled).toBe(true);
    expect(result.sellerProfile.id).toBe('sp-1');
  });

  it('throws NotFoundError when activating for a missing user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(sellerService.activate('missing', input)).rejects.toBeInstanceOf(NotFoundError);
    expect(mockPrisma.sellerProfile.upsert).not.toHaveBeenCalled();
  });

  it('returns the seller profile with sellerEnabled state', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', sellerEnabled: true, sellerProfile: null });

    const result = await sellerService.getProfile('user-1');

    expect(result.sellerEnabled).toBe(true);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'user-1' } }));
  });

  it('throws NotFoundError when the user does not exist in getProfile', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(sellerService.getProfile('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('updates the SellerProfile when it already exists', async () => {
    mockPrisma.sellerProfile.findUnique.mockResolvedValue({ id: 'sp-1', userId: 'user-1' });
    mockPrisma.sellerProfile.update.mockResolvedValue({ id: 'sp-1', displayName: 'Garage Awa' });

    const result = await sellerService.updateProfile('user-1', { displayName: 'Garage Awa' });

    expect(result.displayName).toBe('Garage Awa');
    expect(mockPrisma.sellerProfile.update).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      data: { displayName: 'Garage Awa' },
      select: expect.any(Object),
    });
  });

  it('throws NotFoundError when updating a missing SellerProfile', async () => {
    mockPrisma.sellerProfile.findUnique.mockResolvedValue(null);

    await expect(sellerService.updateProfile('user-1', { displayName: 'X' })).rejects.toBeInstanceOf(NotFoundError);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword } from '@/lib/auth';
import { authService } from '@/modules/auth/auth.service';
import { ConflictError, UnauthorizedError, NotFoundError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  refreshToken: {
    create: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a new user and returns token + refreshToken', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'a@example.com',
      firstName: 'Awa',
      lastName: 'Diallo',
      role: 'SELLER',
      country: 'CI',
      city: 'Abidjan',
      shopName: 'Garage Awa',
    });
    mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

    const result = await authService.register({
      email: 'a@example.com',
      password: 'password123',
      firstName: 'Awa',
      lastName: 'Diallo',
      country: 'CI',
      role: 'SELLER',
    });

    expect(result.user.id).toBe('user-1');
    expect(result.token).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@example.com' } });
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  it('throws ConflictError when the email is already registered', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

    await expect(
      authService.register({
        email: 'dup@example.com',
        password: 'password123',
        firstName: 'A',
        lastName: 'B',
        country: 'CI',
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it('logs in with valid credentials and strips the password', async () => {
    const hash = await hashPassword('password123');
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'a@example.com',
      password: hash,
      role: 'SELLER',
      firstName: 'Awa',
      lastName: 'Diallo',
      country: 'CI',
    });
    mockPrisma.user.update.mockResolvedValue({});
    mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-1' });

    const result = await authService.login({ email: 'a@example.com', password: 'password123' });

    expect(result.user).not.toHaveProperty('password');
    expect(result.token).toBeTruthy();
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { lastLoginAt: expect.any(Date) },
    });
  });

  it('throws UnauthorizedError for a wrong password', async () => {
    const hash = await hashPassword('good-password');
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'a@example.com',
      password: hash,
      role: 'SELLER',
    });

    await expect(
      authService.login({ email: 'a@example.com', password: 'bad-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('returns the user from me()', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'a@example.com' });

    const user = await authService.me('user-1');
    expect(user.id).toBe('user-1');
  });

  it('throws NotFoundError when the user does not exist in me()', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.me('missing')).rejects.toBeInstanceOf(NotFoundError);
  });
});

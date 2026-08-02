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

  it('throws UnauthorizedError when the user does not exist in login()', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'nobody@example.com', password: 'pw' }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('refreshes the token when the refresh token is valid', async () => {
    mockPrisma.refreshToken.findUnique.mockResolvedValue({
      id: 'rt-1',
      token: 'rtoken',
      expiresAt: new Date(Date.now() + 100000),
      userId: 'user-1',
      user: { role: 'SELLER' },
    });
    mockPrisma.refreshToken.delete.mockResolvedValue({});
    mockPrisma.refreshToken.create.mockResolvedValue({ id: 'rt-2' });

    const result = await authService.refresh('rtoken');

    expect(result.token).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({ where: { id: 'rt-1' } });
  });

  it('throws UnauthorizedError for a missing refresh token', async () => {
    mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

    await expect(authService.refresh('missing')).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws UnauthorizedError for an expired refresh token', async () => {
    mockPrisma.refreshToken.findUnique.mockResolvedValue({
      id: 'rt-1',
      token: 'rtoken',
      expiresAt: new Date(Date.now() - 1000),
      userId: 'user-1',
      user: { role: 'SELLER' },
    });

    await expect(authService.refresh('rtoken')).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('logs out by deleting all refresh tokens for the user', async () => {
    mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

    const result = await authService.logout('user-1');

    expect(result.success).toBe(true);
    expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
  });

  it('enables MFA and returns a 6-digit secret', async () => {
    mockPrisma.user.update.mockResolvedValue({});

    const result = await authService.enableMfa('user-1');

    expect(result.secret).toMatch(/^\d{6}$/);
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ mfaSecret: result.secret }) }),
    );
  });

  it('verifies a valid MFA code and enables MFA', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', mfaSecret: '123456' });
    mockPrisma.user.update.mockResolvedValue({});

    const result = await authService.verifyMfa('user-1', '123456');

    expect(result.success).toBe(true);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({ where: { id: 'user-1' }, data: { mfaEnabled: true } });
  });

  it('throws UnauthorizedError when MFA is not enabled', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', mfaSecret: null });

    await expect(authService.verifyMfa('user-1', '123456')).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws UnauthorizedError for an invalid MFA code', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', mfaSecret: '111111' });

    await expect(authService.verifyMfa('user-1', '999999')).rejects.toBeInstanceOf(UnauthorizedError);
  });
});

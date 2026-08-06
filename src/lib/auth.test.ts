import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth';

describe('auth lib', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('secret123');
    expect(hash).not.toBe('secret123');
    await expect(verifyPassword('secret123', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });

  it('generates and verifies a token', () => {
    const token = generateToken('user-1', 'SELLER');
    expect(typeof token).toBe('string');
    const payload = verifyToken(token);
    expect(payload?.userId).toBe('user-1');
    expect(payload?.role).toBe('SELLER');
  });

  it('returns null for an invalid token', () => {
    expect(verifyToken('not-a-valid-token')).toBeNull();
    expect(verifyToken('')).toBeNull();
  });

  it('throws when JWT_SECRET is missing', () => {
    const previous = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    try {
      expect(() => generateToken('user-1')).toThrow('JWT_SECRET');
    } finally {
      process.env.JWT_SECRET = previous;
    }
  });
});

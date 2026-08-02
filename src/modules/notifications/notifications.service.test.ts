import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationService } from '@/modules/notifications/notifications.service';
import { ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  notification: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('NotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listNotifications', () => {
    it('lists notifications scoped to the user with filters', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([{ id: 'notif-1', read: false }]);
      mockPrisma.notification.count.mockResolvedValue(1);

      const result = await notificationService.listNotifications(
        'user-1',
        { read: 'false', type: 'order', search: 'commande' },
        { page: 1, pageSize: 20 },
      );

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1', read: false, type: 'order' }),
        }),
      );
      expect(result.total).toBe(1);
      expect(result.data[0].id).toBe('notif-1');
    });

    it('returns the unread count for the user', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([]);
      mockPrisma.notification.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1);

      const result = await notificationService.listNotifications('user-1', {}, { page: 1, pageSize: 20 });

      expect(result.total).toBe(2);
      expect(result.unreadCount).toBe(1);
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({ where: { userId: 'user-1', read: false } });
    });
  });

  describe('getUnreadCount', () => {
    it('counts unread notifications of the user', async () => {
      mockPrisma.notification.count.mockResolvedValue(3);

      const count = await notificationService.getUnreadCount('user-1');

      expect(count).toBe(3);
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({ where: { userId: 'user-1', read: false } });
    });
  });

  describe('markAsRead', () => {
    it('rejects an empty ids list', async () => {
      await expect(notificationService.markAsRead('user-1', [])).rejects.toBeInstanceOf(ValidationError);
      await expect(notificationService.markAsRead('user-1', [])).rejects.toThrow('Au moins un identifiant');
    });

    it('marks the given notifications as read scoped to the user', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 2 });

      const result = await notificationService.markAsRead('user-1', ['notif-1', 'notif-2']);

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['notif-1', 'notif-2'] }, userId: 'user-1' },
        data: { read: true, readAt: expect.any(Date) },
      });
      expect(result.count).toBe(2);
    });
  });

  describe('markAllAsRead', () => {
    it('marks all unread notifications of the user as read', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await notificationService.markAllAsRead('user-1');

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', read: false },
        data: { read: true, readAt: expect.any(Date) },
      });
      expect(result.count).toBe(5);
    });
  });

  describe('createNotification', () => {
    it('rejects missing required fields', async () => {
      await expect(
        notificationService.createNotification({ userId: '', title: 'T', message: 'M' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects an invalid type', async () => {
      await expect(
        notificationService.createNotification({ userId: 'user-1', title: 'T', message: 'M', type: 'unknown' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('creates a notification with the given data', async () => {
      mockPrisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      const result = await notificationService.createNotification({
        userId: 'user-1',
        title: 'Nouvelle commande',
        message: 'CMD-2026-001 confirmee',
        type: 'order',
        link: '/dashboard/orders',
      });

      expect(mockPrisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: 'user-1', type: 'order', link: '/dashboard/orders' }),
        }),
      );
      expect(result.id).toBe('notif-1');
    });

    it('defaults the type to system', async () => {
      mockPrisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      await notificationService.createNotification({ userId: 'user-1', title: 'T', message: 'M' });

      expect(mockPrisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: 'system' }) }),
      );
    });
  });
});

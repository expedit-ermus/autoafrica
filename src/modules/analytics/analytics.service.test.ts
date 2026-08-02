import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from '@/modules/analytics/analytics.service';
import { ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  analyticsEvent: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('rejects an empty event name', async () => {
      await expect(analyticsService.trackEvent({ event: '' })).rejects.toBeInstanceOf(ValidationError);
      await expect(analyticsService.trackEvent({ event: '  ' })).rejects.toThrow('événement');
    });

    it('rejects an unknown event name', async () => {
      await expect(analyticsService.trackEvent({ event: 'not_a_tracked_event' })).rejects.toBeInstanceOf(
        ValidationError,
      );
      await expect(analyticsService.trackEvent({ event: 'not_a_tracked_event' })).rejects.toThrow('non reconnu');
    });

    it('rejects non-object properties', async () => {
      await expect(
        analyticsService.trackEvent({ event: 'page_view', properties: 'nope' as unknown as Record<string, unknown> }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('creates an event with stringified properties and optional fields', async () => {
      mockPrisma.analyticsEvent.create.mockResolvedValue({ id: 'evt-1' });

      const result = await analyticsService.trackEvent({
        event: 'view_product',
        userId: 'user-1',
        sessionId: 'sess-1',
        entity: 'product',
        entityId: 'p-1',
        properties: { product_id: 'p-1', price: 5000 },
        country: 'CI',
        city: 'Abidjan',
      });

      expect(mockPrisma.analyticsEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            event: 'view_product',
            userId: 'user-1',
            sessionId: 'sess-1',
            entity: 'product',
            entityId: 'p-1',
            country: 'CI',
            city: 'Abidjan',
          }),
        }),
      );
      expect(JSON.parse(mockPrisma.analyticsEvent.create.mock.calls[0][0].data.properties)).toEqual({
        product_id: 'p-1',
        price: 5000,
      });
      expect(result.id).toBe('evt-1');
    });

    it('stores DbNull properties when none are provided', async () => {
      mockPrisma.analyticsEvent.create.mockResolvedValue({ id: 'evt-2' });

      await analyticsService.trackEvent({ event: 'page_view' });

      const data = mockPrisma.analyticsEvent.create.mock.calls[0][0].data;
      expect(data.properties).toBeDefined();
      expect(data.properties).not.toBe('{}');
    });
  });

  describe('listEvents', () => {
    it('lists events with filters and returns the total', async () => {
      mockPrisma.analyticsEvent.findMany.mockResolvedValue([{ id: 'evt-1', event: 'search_product' }]);
      mockPrisma.analyticsEvent.count.mockResolvedValue(1);

      const result = await analyticsService.listEvents({ event: 'search_product', from: '2026-01-01' });

      expect(mockPrisma.analyticsEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ event: 'search_product' }),
          orderBy: { createdAt: 'desc' },
        }),
      );
      expect(mockPrisma.analyticsEvent.findMany.mock.calls[0][0].where.createdAt).toEqual({
        gte: new Date('2026-01-01'),
      });
      expect(result.total).toBe(1);
      expect(result.data[0].id).toBe('evt-1');
    });

    it('caps the limit to 200', async () => {
      mockPrisma.analyticsEvent.findMany.mockResolvedValue([]);
      mockPrisma.analyticsEvent.count.mockResolvedValue(0);

      await analyticsService.listEvents({ limit: 5000 });

      expect(mockPrisma.analyticsEvent.findMany.mock.calls[0][0].take).toBe(200);
    });
  });

  describe('getStats', () => {
    it('aggregates events by type and computes the funnel', async () => {
      mockPrisma.analyticsEvent.findMany.mockResolvedValue([
        { id: '1', event: 'page_view', sessionId: 'sess-1', createdAt: new Date('2026-01-01T10:00:00Z') },
        { id: '2', event: 'page_view', sessionId: 'sess-2', createdAt: new Date('2026-01-01T11:00:00Z') },
        { id: '3', event: 'search_product', sessionId: 'sess-1', createdAt: new Date('2026-01-02T10:00:00Z') },
        { id: '4', event: 'view_product', sessionId: 'sess-1', createdAt: new Date('2026-01-02T10:05:00Z') },
        { id: '5', event: 'add_to_cart', sessionId: 'sess-1', createdAt: new Date('2026-01-02T10:06:00Z') },
        { id: '6', event: 'order_complete', sessionId: 'sess-1', createdAt: new Date('2026-01-02T10:10:00Z') },
      ]);

      const stats = await analyticsService.getStats();

      expect(stats.totalEvents).toBe(6);
      expect(stats.uniqueSessions).toBe(2);
      expect(stats.byEvent).toEqual({
        page_view: 2,
        search_product: 1,
        view_product: 1,
        add_to_cart: 1,
        order_complete: 1,
      });
      expect(stats.funnel).toEqual({ searches: 1, productViews: 1, addToCarts: 1, checkouts: 0, orders: 1 });
      expect(stats.series).toHaveLength(2);
      expect(stats.series[0]).toEqual({ date: '2026-01-01', count: 2 });
    });

    it('passes the period filter to the query', async () => {
      mockPrisma.analyticsEvent.findMany.mockResolvedValue([]);

      const from = new Date('2026-01-01');
      const to = new Date('2026-01-31');
      await analyticsService.getStats({ from, to });

      expect(mockPrisma.analyticsEvent.findMany.mock.calls[0][0].where.createdAt).toEqual({ gte: from, lte: to });
    });
  });
});

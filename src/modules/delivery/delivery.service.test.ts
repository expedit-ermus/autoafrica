import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deliveryService } from '@/modules/delivery/delivery.service';
import { NotFoundError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  shipment: {
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
  deliveryRoute: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  fleetVehicle: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('DeliveryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('shipments', () => {
    it('creates a shipment linked to an order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order-1' });
      mockPrisma.shipment.create.mockResolvedValue({ id: 'shp-1', trackingNumber: 'DHL123' });

      const result = await deliveryService.createShipment({
        orderId: 'order-1',
        trackingNumber: 'DHL123',
        carrier: 'dhl',
        method: 'express',
      });

      expect(mockPrisma.order.findUnique).toHaveBeenCalledWith({ where: { id: 'order-1' } });
      expect(mockPrisma.shipment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ trackingNumber: 'DHL123', status: 'PENDING' }),
        }),
      );
      expect(result.id).toBe('shp-1');
    });

    it('rejects a shipment without an order', async () => {
      await expect(
        deliveryService.createShipment({ orderId: '' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('throws NotFoundError when the order does not exist', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(
        deliveryService.createShipment({ orderId: 'missing' }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it('rejects a duplicate tracking number', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order-1' });
      mockPrisma.shipment.findUnique.mockResolvedValue({ id: 'shp-1' });

      await expect(
        deliveryService.createShipment({ orderId: 'order-1', trackingNumber: 'DHL123' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('lists shipments with filters and count', async () => {
      mockPrisma.shipment.findMany.mockResolvedValue([{ id: 'shp-1' }]);
      mockPrisma.shipment.count.mockResolvedValue(1);

      const result = await deliveryService.listShipments({ status: 'IN_TRANSIT', search: 'DHL' }, { page: 1, pageSize: 20 });

      expect(result.total).toBe(1);
      expect(mockPrisma.shipment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'IN_TRANSIT' }) }),
      );
    });

    it('throws NotFoundError for a missing shipment in getById', async () => {
      mockPrisma.shipment.findUnique.mockResolvedValue(null);

      await expect(deliveryService.getShipmentById('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('stamps actualDelivery when transitioning to DELIVERED', async () => {
      mockPrisma.shipment.findUnique.mockResolvedValue({ id: 'shp-1', actualDelivery: null });
      mockPrisma.shipment.update.mockResolvedValue({ id: 'shp-1', status: 'DELIVERED' });

      await deliveryService.updateShipmentStatus('shp-1', 'DELIVERED');

      expect(mockPrisma.shipment.update).toHaveBeenCalledWith({
        where: { id: 'shp-1' },
        data: { status: 'DELIVERED', actualDelivery: expect.any(Date) },
      });
    });

    it('deletes an existing shipment', async () => {
      mockPrisma.shipment.findUnique.mockResolvedValue({ id: 'shp-1' });
      mockPrisma.shipment.delete.mockResolvedValue({});

      const result = await deliveryService.removeShipment('shp-1');

      expect(result.success).toBe(true);
      expect(mockPrisma.shipment.delete).toHaveBeenCalledWith({ where: { id: 'shp-1' } });
    });
  });

  describe('delivery routes', () => {
    it('creates a delivery route', async () => {
      mockPrisma.deliveryRoute.create.mockResolvedValue({ id: 'route-1', name: 'Tournee Abidjan' });

      const result = await deliveryService.createRoute({
        name: 'Tournee Abidjan',
        country: 'CI',
        city: 'Abidjan',
        date: '2026-08-03',
      });

      expect(mockPrisma.deliveryRoute.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: 'Tournee Abidjan', status: 'planned' }),
        }),
      );
      expect(result.id).toBe('route-1');
    });

    it('rejects a route without required fields', async () => {
      await expect(
        deliveryService.createRoute({ name: '', country: 'CI', date: '2026-08-03' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('lists routes with filters and count', async () => {
      mockPrisma.deliveryRoute.findMany.mockResolvedValue([{ id: 'route-1' }]);
      mockPrisma.deliveryRoute.count.mockResolvedValue(1);

      const result = await deliveryService.listRoutes({ status: 'active' }, { page: 1, pageSize: 20 });

      expect(result.total).toBe(1);
      expect(mockPrisma.deliveryRoute.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: 'active' }) }),
      );
    });

    it('throws NotFoundError for a missing route in getById', async () => {
      mockPrisma.deliveryRoute.findUnique.mockResolvedValue(null);

      await expect(deliveryService.getRouteById('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('stamps completedAt when transitioning to completed', async () => {
      mockPrisma.deliveryRoute.findUnique.mockResolvedValue({ id: 'route-1', completedAt: null });

      await deliveryService.updateRouteStatus('route-1', 'completed');

      expect(mockPrisma.deliveryRoute.update).toHaveBeenCalledWith({
        where: { id: 'route-1' },
        data: { status: 'completed', completedAt: expect.any(Date) },
      });
    });

    it('deletes an existing route', async () => {
      mockPrisma.deliveryRoute.findUnique.mockResolvedValue({ id: 'route-1' });
      mockPrisma.deliveryRoute.delete.mockResolvedValue({});

      const result = await deliveryService.removeRoute('route-1');

      expect(result.success).toBe(true);
      expect(mockPrisma.deliveryRoute.delete).toHaveBeenCalledWith({ where: { id: 'route-1' } });
    });
  });

  describe('fleet vehicles', () => {
    it('creates a fleet vehicle with defaults', async () => {
      mockPrisma.fleetVehicle.create.mockResolvedValue({ id: 'veh-1', plateNumber: 'CI-1234-AB' });

      const result = await deliveryService.createVehicle({ plateNumber: 'CI-1234-AB', type: 'camion' });

      expect(mockPrisma.fleetVehicle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ plateNumber: 'CI-1234-AB', status: 'active' }),
        }),
      );
      expect(result.id).toBe('veh-1');
    });

    it('rejects a vehicle with an invalid type', async () => {
      await expect(
        deliveryService.createVehicle({ plateNumber: 'CI-1234-AB', type: 'avion' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('rejects a duplicate plate number', async () => {
      mockPrisma.fleetVehicle.findUnique.mockResolvedValue({ id: 'veh-1' });

      await expect(
        deliveryService.createVehicle({ plateNumber: 'CI-1234-AB', type: 'camion' }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('lists vehicles with filters and count', async () => {
      mockPrisma.fleetVehicle.findMany.mockResolvedValue([{ id: 'veh-1' }]);
      mockPrisma.fleetVehicle.count.mockResolvedValue(1);

      const result = await deliveryService.listVehicles({ type: 'camion' }, { page: 1, pageSize: 20 });

      expect(result.total).toBe(1);
      expect(mockPrisma.fleetVehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ type: 'camion' }) }),
      );
    });

    it('throws NotFoundError for a missing vehicle in getById', async () => {
      mockPrisma.fleetVehicle.findUnique.mockResolvedValue(null);

      await expect(deliveryService.getVehicleById('missing')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('deletes an existing vehicle', async () => {
      mockPrisma.fleetVehicle.findUnique.mockResolvedValue({ id: 'veh-1' });
      mockPrisma.fleetVehicle.delete.mockResolvedValue({});

      const result = await deliveryService.removeVehicle('veh-1');

      expect(result.success).toBe(true);
      expect(mockPrisma.fleetVehicle.delete).toHaveBeenCalledWith({ where: { id: 'veh-1' } });
    });
  });
});

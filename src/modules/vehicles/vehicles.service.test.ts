import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vehiclesService } from '@/modules/vehicles/vehicles.service';
import { NotFoundError, ForbiddenError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  vehicle: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  vehicleListing: {
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  brand: {
    findUnique: vi.fn(),
  },
  carModel: {
    findFirst: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('VehiclesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a vehicle with an active listing in XOF', async () => {
    mockPrisma.brand.findUnique.mockResolvedValue({ id: 'brand-1', name: 'Toyota' });
    mockPrisma.carModel.findFirst.mockResolvedValue(null);
    mockPrisma.vehicle.create.mockResolvedValue({ id: 'v1', name: 'Corolla 2023', brandId: 'brand-1' });
    mockPrisma.vehicleListing.create.mockResolvedValue({ id: 'l1' });

    const result = await vehiclesService.create(
      { brand: 'Toyota', name: 'Corolla 2023', year: 2023, price: 12000000, city: 'Abidjan' },
      'seller-1',
    );

    expect(mockPrisma.brand.findUnique).toHaveBeenCalledWith({ where: { name: 'Toyota' } });
    expect(mockPrisma.vehicle.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          brandId: 'brand-1',
          name: 'Corolla 2023',
          year: 2023,
          price: 12000000,
          currency: 'XOF',
          country: 'CI',
          city: 'Abidjan',
        }),
      }),
    );
    expect(mockPrisma.vehicleListing.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          vehicleId: 'v1',
          sellerId: 'seller-1',
          status: 'ACTIVE',
          price: 12000000,
          currency: 'XOF',
        }),
      }),
    );
    expect(result.id).toBe('v1');
  });

  it('rejects an unknown brand', async () => {
    mockPrisma.brand.findUnique.mockResolvedValue(null);

    await expect(
      vehiclesService.create({ brand: 'Lada', name: 'Niva', year: 2020, price: 1000000 }, 'seller-1'),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects missing required fields', async () => {
    await expect(
      vehiclesService.create({ brand: 'Toyota' } as never, 'seller-1'),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('lists active vehicles with listings', async () => {
    mockPrisma.vehicle.findMany.mockResolvedValue([
      {
        id: 'v1',
        name: 'Corolla',
        year: 2023,
        price: 12000000,
        brand: { name: 'Toyota' },
        carModel: null,
        listings: [{ id: 'l1', status: 'ACTIVE', price: 12000000, seller: { id: 's1', firstName: 'Awa' } }],
      },
    ]);
    mockPrisma.vehicle.count.mockResolvedValue(1);

    const result = await vehiclesService.list({ country: 'CI' }, { page: 1, pageSize: 12 });

    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(mockPrisma.vehicle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ active: true, country: 'CI' }) }),
    );
  });

  it('increments views when getting a vehicle', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue({ id: 'v1', name: 'Tucson', images: null });
    mockPrisma.vehicle.update.mockResolvedValue({});

    const vehicle = await vehiclesService.getById('v1');

    expect(mockPrisma.vehicle.update).toHaveBeenCalledWith({ where: { id: 'v1' }, data: { views: { increment: 1 } } });
    expect(vehicle.images).toEqual([]);
  });

  it('throws NotFoundError for a missing vehicle', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(null);

    await expect(vehiclesService.getById('missing')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('forbids updating a vehicle that is not yours', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue({ id: 'l1', vehicleId: 'v1', sellerId: 'other-user' });

    await expect(
      vehiclesService.update('v1', { price: 5000000 }, 'seller-1'),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('sells a vehicle via setStatus', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue({ id: 'l1', vehicleId: 'v1', sellerId: 'seller-1' });
    mockPrisma.vehicleListing.update.mockResolvedValue({});
    mockPrisma.vehicle.update.mockResolvedValue({});

    const result = await vehiclesService.setStatus('v1', 'SOLD', 'seller-1');

    expect(result.status).toBe('SOLD');
    expect(mockPrisma.vehicle.update).toHaveBeenCalledWith({ where: { id: 'v1' }, data: { active: false } });
  });

  it('applies all list filters to the where clause', async () => {
    mockPrisma.vehicle.findMany.mockResolvedValue([]);
    mockPrisma.vehicle.count.mockResolvedValue(0);

    await vehiclesService.list(
      {
        brand: 'Toyota',
        model: 'Corolla',
        country: 'CI',
        city: 'Abidjan',
        search: '2023',
        minPrice: 1000000,
        maxPrice: 20000000,
        fuel: 'DIESEL',
        gearbox: 'AUTOMATIC',
        condition: 'USED',
        minYear: 2019,
        maxYear: 2023,
        sellerId: 's1',
      },
      { page: 2, pageSize: 12 },
    );

    expect(mockPrisma.vehicle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          active: true,
          brand: { name: 'Toyota' },
          country: 'CI',
          fuel: 'DIESEL',
          gearbox: 'AUTOMATIC',
          condition: 'USED',
          OR: expect.any(Array),
          year: expect.objectContaining({ gte: 2019, lte: 2023 }),
          price: expect.objectContaining({ gte: 1000000, lte: 20000000 }),
          listings: { some: { sellerId: 's1' } },
        }),
      }),
    );
  });

  it('rejects a non-positive price on create', async () => {
    await expect(
      vehiclesService.create({ brand: 'Toyota', name: 'X', year: 2020, price: 0 }, 'seller-1'),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('creates a vehicle with a car model and serialized images', async () => {
    mockPrisma.brand.findUnique.mockResolvedValue({ id: 'brand-1', name: 'Toyota' });
    mockPrisma.carModel.findFirst.mockResolvedValue({ id: 'model-1' });
    mockPrisma.vehicle.create.mockResolvedValue({ id: 'v1' });
    mockPrisma.vehicleListing.create.mockResolvedValue({ id: 'l1' });

    await vehiclesService.create(
      {
        brand: 'Toyota',
        model: 'Corolla',
        name: 'Corolla',
        year: 2023,
        price: 10000000,
        images: ['/a.jpg'],
        condition: 'USED',
      },
      'seller-1',
    );

    expect(mockPrisma.vehicle.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          carModelId: 'model-1',
          images: JSON.stringify(['/a.jpg']),
          condition: 'USED',
        }),
      }),
    );
  });

  it('updates a vehicle and its listing price', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue({ id: 'l1', vehicleId: 'v1', sellerId: 'seller-1' });
    mockPrisma.vehicle.update.mockResolvedValue({ id: 'v1' });
    mockPrisma.vehicleListing.update.mockResolvedValue({});

    const result = await vehiclesService.update('v1', { price: 5000000, name: 'Corolla X' }, 'seller-1');

    expect(result.id).toBe('v1');
    expect(mockPrisma.vehicleListing.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ price: 5000000, currency: 'XOF' }) }),
    );
  });

  it('throws NotFoundError when updating a missing vehicle', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue(null);

    await expect(vehiclesService.update('missing', { price: 100 }, 'seller-1')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deletes a vehicle by deactivating it and cancelling the listing', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue({ id: 'l1', vehicleId: 'v1', sellerId: 'seller-1' });
    mockPrisma.vehicle.update.mockResolvedValue({});
    mockPrisma.vehicleListing.update.mockResolvedValue({});

    const result = await vehiclesService.delete('v1', 'seller-1');

    expect(result.success).toBe(true);
    expect(mockPrisma.vehicle.update).toHaveBeenCalledWith({ where: { id: 'v1' }, data: { active: false } });
    expect(mockPrisma.vehicleListing.update).toHaveBeenCalledWith({ where: { id: 'l1' }, data: { status: 'CANCELLED' } });
  });

  it('forbids deleting a vehicle that is not yours', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue({ id: 'l1', vehicleId: 'v1', sellerId: 'other' });

    await expect(vehiclesService.delete('v1', 'seller-1')).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('sets a non-SOLD status without deactivating the vehicle', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue({ id: 'l1', vehicleId: 'v1', sellerId: 'seller-1' });
    mockPrisma.vehicleListing.update.mockResolvedValue({});

    const result = await vehiclesService.setStatus('v1', 'RESERVED', 'seller-1');

    expect(result.status).toBe('RESERVED');
    expect(mockPrisma.vehicle.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundError for setStatus on a missing vehicle', async () => {
    mockPrisma.vehicleListing.findFirst.mockResolvedValue(null);

    await expect(vehiclesService.setStatus('v1', 'ACTIVE', 'seller-1')).rejects.toBeInstanceOf(NotFoundError);
  });
});

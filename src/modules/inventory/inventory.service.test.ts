import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inventoryService } from '@/modules/inventory/inventory.service';
import { NotFoundError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  warehouse: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  inventory: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  stockMovement: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

describe('InventoryService — Warehouses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a warehouse with defaults', async () => {
    mockPrisma.warehouse.create.mockResolvedValue({ id: 'wh-1', name: 'Depot Abidjan' });

    const result = await inventoryService.createWarehouse({ name: 'Depot Abidjan', country: 'CI', city: 'Abidjan' });

    expect(mockPrisma.warehouse.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'Depot Abidjan', type: 'STANDARD', active: true }),
      }),
    );
    expect(result.id).toBe('wh-1');
  });

  it('rejects a warehouse without name/country/city', async () => {
    await expect(inventoryService.createWarehouse({ name: '', country: '', city: '' })).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws NotFoundError for missing warehouse in update', async () => {
    mockPrisma.warehouse.findUnique.mockResolvedValue(null);
    await expect(inventoryService.updateWarehouse('missing', { name: 'X' })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deletes an existing warehouse', async () => {
    mockPrisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1' });
    mockPrisma.warehouse.delete.mockResolvedValue({});
    const result = await inventoryService.removeWarehouse('wh-1');
    expect(result.success).toBe(true);
  });
});

describe('InventoryService — Stock lines', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates an inventory line and records a RECEIVED movement', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: 'p-1' });
    mockPrisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1' });
    mockPrisma.inventory.findUnique.mockResolvedValue(null);
    mockPrisma.inventory.create.mockResolvedValue({ id: 'inv-1', quantity: 100, available: 95 });
    mockPrisma.stockMovement.create.mockResolvedValue({});

    const result = await inventoryService.createInventory(
      { productId: 'p-1', warehouseId: 'wh-1', quantity: 100, reserved: 5 },
      'user-1',
    );

    expect(result.id).toBe('inv-1');
    const createCall = mockPrisma.inventory.create.mock.calls[0][0];
    expect(createCall.data.available).toBe(95);
    expect(mockPrisma.stockMovement.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: 'RECEIVED', quantity: 100, createdBy: 'user-1' }) }),
    );
  });

  it('rejects an inventory line without product/warehouse', async () => {
    await expect(inventoryService.createInventory({ productId: '', warehouseId: '' })).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws NotFoundError when product is missing', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);
    await expect(inventoryService.createInventory({ productId: 'p-x', warehouseId: 'wh-1' })).rejects.toBeInstanceOf(NotFoundError);
  });

  it('rejects a duplicate inventory line', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: 'p-1' });
    mockPrisma.warehouse.findUnique.mockResolvedValue({ id: 'wh-1' });
    mockPrisma.inventory.findUnique.mockResolvedValue({ id: 'inv-1' });

    await expect(inventoryService.createInventory({ productId: 'p-1', warehouseId: 'wh-1' })).rejects.toBeInstanceOf(ValidationError);
  });

  it('adjusts quantity and records an ADJUSTED movement', async () => {
    mockPrisma.inventory.findUnique.mockResolvedValue({ id: 'inv-1', productId: 'p-1', warehouseId: 'wh-1', quantity: 50, reserved: 0, available: 50 });
    mockPrisma.inventory.update.mockResolvedValue({ id: 'inv-1', quantity: 80, available: 80 });
    mockPrisma.stockMovement.create.mockResolvedValue({});

    await inventoryService.adjustInventory('inv-1', { quantity: 80 }, 'user-1');

    expect(mockPrisma.inventory.update).toHaveBeenCalledWith({
      where: { id: 'inv-1' },
      data: expect.objectContaining({ quantity: 80, available: 80 }),
    });
    expect(mockPrisma.stockMovement.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ type: 'ADJUSTED', quantity: 30 }) }),
    );
  });

  it('rejects reserved quantity exceeding total', async () => {
    mockPrisma.inventory.findUnique.mockResolvedValue({ id: 'inv-1', quantity: 10, reserved: 0, available: 10 });
    await expect(inventoryService.adjustInventory('inv-1', { reserved: 15 })).rejects.toBeInstanceOf(ValidationError);
  });

  it('lists inventory with filters', async () => {
    mockPrisma.inventory.findMany.mockResolvedValue([{ id: 'inv-1' }]);
    mockPrisma.inventory.count.mockResolvedValue(1);

    const result = await inventoryService.listInventory({ stockStatus: 'low' }, { page: 1, pageSize: 20 });

    expect(result.total).toBe(1);
    expect(mockPrisma.inventory.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ available: { lte: 10, gt: 0 } }) }),
    );
  });
});

describe('InventoryService — Transfer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('transfers stock between warehouses in a transaction', async () => {
    mockPrisma.inventory.findUnique
      .mockResolvedValueOnce({ id: 'from', quantity: 100, available: 80 })
      .mockResolvedValueOnce({ id: 'to', quantity: 10, available: 10 });
    mockPrisma.$transaction.mockResolvedValue([{}, {}, {}]);

    const result = await inventoryService.transferStock(
      { productId: 'p-1', fromWarehouseId: 'wh-1', toWarehouseId: 'wh-2', quantity: 30 },
      'user-1',
    );

    expect(result.success).toBe(true);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('rejects transfer without required fields', async () => {
    await expect(inventoryService.transferStock({} as never)).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects transfer to the same warehouse', async () => {
    await expect(
      inventoryService.transferStock({ productId: 'p-1', fromWarehouseId: 'wh-1', toWarehouseId: 'wh-1', quantity: 5 }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects transfer when available stock is insufficient', async () => {
    mockPrisma.inventory.findUnique
      .mockResolvedValueOnce({ id: 'from', quantity: 10, available: 2 })
      .mockResolvedValueOnce({ id: 'to', quantity: 10, available: 10 });

    await expect(
      inventoryService.transferStock({ productId: 'p-1', fromWarehouseId: 'wh-1', toWarehouseId: 'wh-2', quantity: 30 }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('throws NotFoundError when a warehouse inventory is missing', async () => {
    mockPrisma.inventory.findUnique.mockResolvedValueOnce(null);

    await expect(
      inventoryService.transferStock({ productId: 'p-1', fromWarehouseId: 'wh-1', toWarehouseId: 'wh-2', quantity: 5 }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('InventoryService — Movements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists movements with type filter', async () => {
    mockPrisma.stockMovement.findMany.mockResolvedValue([{ id: 'm-1' }]);
    mockPrisma.stockMovement.count.mockResolvedValue(1);

    const result = await inventoryService.listMovements({ type: 'SOLD' }, { page: 1, pageSize: 20 });

    expect(result.total).toBe(1);
    expect(mockPrisma.stockMovement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ type: 'SOLD' }) }),
    );
  });
});

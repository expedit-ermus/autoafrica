import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vehiclesService, parseVehicleImages } from '@/modules/vehicles/vehicles.service';
import { NotFoundError, ForbiddenError, ValidationError } from '@/shared/errors';

const mockPrisma = vi.hoisted(() => ({
  vehicle: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
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

/**
 * Vitrine publique.
 *
 * La rubrique ouvre sur un catalogue volontairement vide : les dix vehicules
 * presents en base etaient les fixtures de `prisma/seed.mjs` — memes noms,
 * memes prix, aucune image, un seul vendeur `@example.com` — et ont ete
 * desactives avant publication. Ces tests fixent ce qu'une page publique a le
 * droit de montrer.
 */
describe('VehiclesService — vitrine publique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const ligne = (surcharge: Record<string, unknown> = {}) => ({
    id: 'v1',
    slug: 'toyota-corolla-2021-abc',
    name: 'Toyota Corolla 2021',
    year: 2021,
    price: 11500000,
    currency: 'XOF',
    mileage: null,
    fuel: null,
    gearbox: null,
    condition: 'USED',
    bodyType: null,
    color: null,
    city: 'Abidjan',
    country: 'CI',
    description: null,
    images: null,
    updatedAt: new Date('2026-02-01T00:00:00.000Z'),
    brand: { name: 'Toyota', slug: 'toyota' },
    carModel: null,
    listings: [
      {
        id: 'l1',
        status: 'ACTIVE',
        price: 11000000,
        currency: 'XOF',
        seller: { shopName: 'Garage Moussa', city: 'Abidjan' },
      },
    ],
    ...surcharge,
  });

  const FILTRE_PUBLIC = {
    active: true,
    listings: { some: { status: { in: ['ACTIVE', 'RESERVED'] } } },
  };

  it('n expose que les vehicules actifs portant une annonce vivante', async () => {
    mockPrisma.vehicle.findMany.mockResolvedValue([ligne()]);
    mockPrisma.vehicle.count.mockResolvedValue(1);

    await vehiclesService.listPublic({}, { page: 1, pageSize: 20 });

    expect(mockPrisma.vehicle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining(FILTRE_PUBLIC) }),
    );
  });

  // Si le comptage voyait un filtre plus large que la requete, la pagination
  // annoncerait des vehicules que la liste ne contient pas.
  it('compte avec exactement le meme filtre que la liste', async () => {
    mockPrisma.vehicle.findMany.mockResolvedValue([]);
    mockPrisma.vehicle.count.mockResolvedValue(0);

    await vehiclesService.listPublic({ brand: 'Toyota' }, { page: 1, pageSize: 20 });

    const whereListe = mockPrisma.vehicle.findMany.mock.calls[0][0].where;
    const whereCompte = mockPrisma.vehicle.count.mock.calls[0][0].where;
    expect(whereCompte).toEqual(whereListe);
  });

  it('exige active et une annonce vivante sur la fiche, pas seulement sur la liste', async () => {
    mockPrisma.vehicle.findFirst.mockResolvedValue(null);

    await vehiclesService.getPublicBySlug('un-slug');

    expect(mockPrisma.vehicle.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ ...FILTRE_PUBLIC, slug: 'un-slug' }),
      }),
    );
  });

  // Un vehicule desactive doit disparaitre du web, pas seulement des listes :
  // sans ce `null`, la page resterait servie a son URL directe et indexee.
  it('renvoie null sur un vehicule introuvable ou retire', async () => {
    mockPrisma.vehicle.findFirst.mockResolvedValue(null);

    expect(await vehiclesService.getPublicBySlug('retire')).toBeNull();
  });

  // `getById` incremente `views`. Sur une page publique, `generateMetadata` et
  // le composant chargent tous deux la fiche : le compteur doublerait, et une
  // ecriture pendant le rendu n'a rien a faire dans un segment revalide.
  it('ne compte aucune vue et n ecrit rien lors d une lecture publique', async () => {
    mockPrisma.vehicle.findFirst.mockResolvedValue(ligne());

    await vehiclesService.getPublicBySlug('toyota-corolla-2021-abc');

    expect(mockPrisma.vehicle.update).not.toHaveBeenCalled();
  });

  // Le prix qui fait foi est celui de l'annonce : c'est ce que le vendeur
  // offre reellement, `Vehicle.price` pouvant avoir diverge.
  it('retient le prix de l annonce et non celui du vehicule', async () => {
    mockPrisma.vehicle.findFirst.mockResolvedValue(ligne());

    const v = await vehiclesService.getPublicBySlug('toyota-corolla-2021-abc');

    expect(v?.price).toBe(11000000);
  });

  it('n invente aucune valeur pour les champs absents', async () => {
    mockPrisma.vehicle.findFirst.mockResolvedValue(ligne());

    const v = await vehiclesService.getPublicBySlug('toyota-corolla-2021-abc');

    // Un kilometrage absent n'est pas 0 km, une couleur absente n'est pas
    // « Non precisee » : le champ reste vide et la vue omet la ligne (D61).
    expect(v?.mileage).toBeUndefined();
    expect(v?.color).toBeUndefined();
    expect(v?.fuel).toBeUndefined();
    expect(v?.gearbox).toBeUndefined();
    expect(v?.images).toEqual([]);
  });

  // Les fiches pieces font passer la prise de contact par le numero de la
  // plateforme. Publier le telephone personnel d'un vendeur sur une page
  // indexee serait un autre choix, qui n'a pas ete fait.
  it('ne publie ni telephone ni nom personnel du vendeur', async () => {
    mockPrisma.vehicle.findFirst.mockResolvedValue(ligne());

    const v = await vehiclesService.getPublicBySlug('toyota-corolla-2021-abc');
    const champs = Object.keys(v ?? {});

    expect(champs.some((c) => /phone|firstName|lastName|email/i.test(c))).toBe(false);
    expect(JSON.stringify(v)).not.toMatch(/example\.com/);

    const select =
      mockPrisma.vehicle.findFirst.mock.calls[0][0].include.listings.select.seller.select;
    expect(select.phone).toBeUndefined();
    expect(select).toEqual({ shopName: true, city: true });
  });

  it('remonte le statut RESERVED pour que la fiche puisse le dire', async () => {
    mockPrisma.vehicle.findFirst.mockResolvedValue(
      ligne({ listings: [{ id: 'l1', status: 'RESERVED', price: 9, currency: 'XOF', seller: null }] }),
    );

    const v = await vehiclesService.getPublicBySlug('x');

    expect(v?.listingStatus).toBe('RESERVED');
  });

  describe('facettes', () => {
    it('deduit les valeurs proposees des annonces reellement publiables', async () => {
      mockPrisma.vehicle.findMany.mockResolvedValue([
        {
          year: 2021,
          price: 11500000,
          city: 'Abidjan',
          fuel: 'DIESEL',
          gearbox: 'MANUAL',
          condition: 'USED',
          bodyType: 'SUV',
          brand: { name: 'Toyota' },
        },
        {
          year: 2019,
          price: 8000000,
          city: 'Bouake',
          fuel: 'DIESEL',
          gearbox: null,
          condition: 'USED',
          bodyType: null,
          brand: { name: 'Kia' },
        },
      ]);

      const f = await vehiclesService.publicFacets();

      expect(f.brands).toEqual(['Kia', 'Toyota']);
      expect(f.cities).toEqual(['Abidjan', 'Bouake']);
      expect(f.fuels).toEqual(['DIESEL']);
      // Une boite ou une carrosserie absente ne devient pas une option vide,
      // qui ne filtrerait rien.
      expect(f.gearboxes).toEqual(['MANUAL']);
      expect(f.bodyTypes).toEqual(['SUV']);
      expect(f.minPrice).toBe(8000000);
      expect(f.maxYear).toBe(2021);
    });

    // Sur une vitrine vide, un plancher de prix a 0 et une annee a 0 sont des
    // bornes fausses : `Math.min()` d'un tableau vide vaut Infinity, et un
    // repli a 0 afficherait « a partir de 0 FCFA ».
    it('ne fabrique aucune borne quand rien n est publiable', async () => {
      mockPrisma.vehicle.findMany.mockResolvedValue([]);

      const f = await vehiclesService.publicFacets();

      expect(f.total).toBe(0);
      expect(f.minPrice).toBeUndefined();
      expect(f.maxPrice).toBeUndefined();
      expect(f.minYear).toBeUndefined();
      expect(f.maxYear).toBeUndefined();
      expect(f.brands).toEqual([]);
    });
  });
});

/**
 * `Vehicle.images` est une colonne JSON ecrite par `JSON.stringify` : selon le
 * chemin d'ecriture elle arrive comme chaine, comme tableau deja decode, ou
 * NULL. Un contenu illisible ne doit jamais produire une image empruntee.
 */
describe('parseVehicleImages', () => {
  it('decode une chaine JSON', () => {
    expect(parseVehicleImages('["/a.jpg","/b.jpg"]')).toEqual(['/a.jpg', '/b.jpg']);
  });

  it('accepte un tableau deja decode', () => {
    expect(parseVehicleImages(['/a.jpg'])).toEqual(['/a.jpg']);
  });

  it('renvoie une liste vide sur NULL, vide ou JSON invalide', () => {
    expect(parseVehicleImages(null)).toEqual([]);
    expect(parseVehicleImages('')).toEqual([]);
    expect(parseVehicleImages('{pas du json')).toEqual([]);
    expect(parseVehicleImages(42)).toEqual([]);
  });

  it('ecarte les entrees qui ne sont pas des chemins exploitables', () => {
    expect(parseVehicleImages('["/a.jpg", null, 7, ""]')).toEqual(['/a.jpg']);
  });
});

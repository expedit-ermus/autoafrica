import { NextRequest, NextResponse } from 'next/server';

interface VehicleRegistration {
  plate: string;
  country: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  fuel: string;
  vin?: string;
  color?: string;
  bodyType?: string;
  registrationDate?: string;
  nextInspection?: string;
}

// Mock database for CI (Côte d'Ivoire) plates
// Format: AB-123-CD
const MOCK_CI_VEHICLES: Record<string, VehicleRegistration> = {
  'AB-123-CD': {
    plate: 'AB-123-CD',
    country: 'CI',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    engine: '1ZR-FAE',
    fuel: 'Essence',
    color: 'Blanc',
    bodyType: 'Berline',
    registrationDate: '2022-03-15',
    nextInspection: '2025-03-15',
  },
  'AB-456-EF': {
    plate: 'AB-456-EF',
    country: 'CI',
    brand: 'Renault',
    model: 'Duster',
    year: 2023,
    engine: 'H4M',
    fuel: 'Essence',
    color: 'Gris',
    bodyType: 'SUV',
    registrationDate: '2023-01-20',
    nextInspection: '2026-01-20',
  },
  'CD-789-GH': {
    plate: 'CD-789-GH',
    country: 'CI',
    brand: 'Peugeot',
    model: '308',
    year: 2021,
    engine: 'DV6',
    fuel: 'Diesel',
    color: 'Bleu',
    bodyType: 'Berline',
    registrationDate: '2021-06-10',
    nextInspection: '2024-06-10',
  },
  'EF-012-IJ': {
    plate: 'EF-012-IJ',
    country: 'CI',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    engine: 'G4FL',
    fuel: 'Essence',
    color: 'Noir',
    bodyType: 'SUV',
    registrationDate: '2024-02-01',
    nextInspection: '2027-02-01',
  },
  'GH-345-KL': {
    plate: 'GH-345-KL',
    country: 'CI',
    brand: 'Suzuki',
    model: 'Carry',
    year: 2023,
    engine: 'F10D',
    fuel: 'Essence',
    color: 'Blanc',
    bodyType: 'Camionnette',
    registrationDate: '2023-09-05',
    nextInspection: '2025-09-05',
  },
  'IJ-678-MN': {
    plate: 'IJ-678-MN',
    country: 'CI',
    brand: 'Toyota',
    model: 'Hilux',
    year: 2021,
    engine: '1GD-FTV',
    fuel: 'Diesel',
    color: 'Gris',
    bodyType: 'Pickup',
    registrationDate: '2021-11-12',
    nextInspection: '2024-11-12',
  },
  'OP-901-QR': {
    plate: 'OP-901-QR',
    country: 'CI',
    brand: 'Nissan',
    model: 'Qashqai',
    year: 2022,
    engine: 'MR20DD',
    fuel: 'Essence',
    color: 'Rouge',
    bodyType: 'SUV',
    registrationDate: '2022-08-22',
    nextInspection: '2025-08-22',
  },
  'ST-234-UV': {
    plate: 'ST-234-UV',
    country: 'CI',
    brand: 'Renault',
    model: 'Logan',
    year: 2020,
    engine: 'K7M',
    fuel: 'Essence',
    color: 'Argent',
    bodyType: 'Berline',
    registrationDate: '2020-04-18',
    nextInspection: '2024-04-18',
  },
};

// Additional mock data for other countries
const MOCK_VEHICLES: Record<string, VehicleRegistration> = {
  ...MOCK_CI_VEHICLES,
  // Senegal
  '12AB1234': { plate: '12AB1234', country: 'SN', brand: 'Toyota', model: 'Corolla', year: 2021, engine: '1ZR-FAE', fuel: 'Essence' },
  '23CD2345': { plate: '23CD2345', country: 'SN', brand: 'Hyundai', model: 'Tucson', year: 2023, engine: 'G4FD', fuel: 'Essence' },
  // Burkina Faso
  'BF-1234-AB': { plate: 'BF-1234-AB', country: 'BF', brand: 'Toyota', model: 'Hilux', year: 2022, engine: '1GD-FTV', fuel: 'Diesel' },
  // Mali
  'ML1234AB': { plate: 'ML1234AB', country: 'ML', brand: 'Peugeot', model: '308', year: 2021, engine: 'DV6', fuel: 'Diesel' },
  // Benin
  'BJ1234AB': { plate: 'BJ1234AB', country: 'BJ', brand: 'Nissan', model: 'Qashqai', year: 2022, engine: 'MR20DD', fuel: 'Essence' },
  // Togo
  'TG-1234-AB': { plate: 'TG-1234-AB', country: 'TG', brand: 'Hyundai', model: 'i10', year: 2023, engine: 'G3LA', fuel: 'Essence' },
  // Ghana
  'GH-1234-AB': { plate: 'GH-1234-AB', country: 'GH', brand: 'Toyota', model: 'Camry', year: 2023, engine: '2AR-FE', fuel: 'Hybride' },
  // Nigeria
  'ABC1234D': { plate: 'ABC1234D', country: 'NG', brand: 'Toyota', model: 'Camry', year: 2022, engine: '2AR-FE', fuel: 'Essence' },
};

// Validation patterns per country
const PLATE_PATTERNS: Record<string, RegExp> = {
  CI: /^[A-Z]{2}-\d{3}-[A-Z]{2}$/,
  SN: /^\d{2}[A-Z]{2}\d{4}$/,
  BF: /^[A-Z]{2}-\d{4}[A-Z]{2}$/,
  ML: /^[A-Z]{2}\d{3}[A-Z]{2}$/,
  BJ: /^[A-Z]{2}\d{4}[A-Z]{2}$/,
  TG: /^[A-Z]{2}-\d{4}[A-Z]{2}$/,
  GH: /^[A-Z]{2}-\d{4}-[A-Z]{2}$/,
  NG: /^[A-Z]{3}-\d{3}[A-Z]{1}$/,
};

function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/\s/g, '').trim();
}

function validatePlate(plate: string, country: string): boolean {
  const pattern = PLATE_PATTERNS[country];
  if (!pattern) return false;
  return pattern.test(normalizePlate(plate));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const plate = searchParams.get('plate');
  const country = searchParams.get('country') || 'CI';

  if (!plate) {
    return NextResponse.json(
      { error: 'Numéro d\'immatriculation requis' },
      { status: 400 }
    );
  }

  const normalizedPlate = normalizePlate(plate);

  if (!validatePlate(plate, country)) {
    return NextResponse.json(
      { 
        error: 'Format d\'immatriculation invalide',
        details: `Format attendu pour ${country}: voir documentation`
      },
      { status: 400 }
    );
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const vehicle = MOCK_VEHICLES[normalizedPlate];

  if (!vehicle) {
    return NextResponse.json(
      { 
        error: 'Véhicule non trouvé',
        message: 'Cette immatriculation n\'est pas dans notre base de données. Essayez la recherche par modèle.',
        plate: normalizedPlate,
        country
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    vehicle: {
      ...vehicle,
      plate: normalizedPlate,
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plate, country = 'CI' } = body;

    if (!plate) {
      return NextResponse.json(
        { error: 'Numéro d\'immatriculation requis' },
        { status: 400 }
      );
    }

    const normalizedPlate = normalizePlate(plate);

    if (!validatePlate(plate, country)) {
      return NextResponse.json(
        { 
          error: 'Format d\'immatriculation invalide',
          details: `Format attendu pour ${country}`
        },
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const vehicle = MOCK_VEHICLES[normalizedPlate];

    if (!vehicle) {
      return NextResponse.json(
        { 
          error: 'Véhicule non trouvé',
          message: 'Cette immatriculation n\'est pas dans notre base de données.',
          plate: normalizedPlate,
          country
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle: {
        ...vehicle,
        plate: normalizedPlate,
      }
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
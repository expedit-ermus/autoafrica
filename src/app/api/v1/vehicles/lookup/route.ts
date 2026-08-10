import { NextRequest, NextResponse } from 'next/server'
import { decodeVin } from '@/modules/vehicles/vin-decoder'

interface VehicleRegistration {
  plate: string
  country: string
  brand: string
  model: string
  year: number
  engine: string
  fuel: string
  vin?: string
  color?: string
  bodyType?: string
  registrationDate?: string
  nextInspection?: string
}

// Mock database for CI (Côte d'Ivoire) plates (Format: AB-123-CD)
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
    vin: 'JT2BF18V9M1234567',
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
    vin: 'VF1H4M18P23456789',
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
    vin: 'VF3DV618M34567890',
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
    vin: 'KMHG4F18R45678901',
    registrationDate: '2024-02-01',
    nextInspection: '2027-02-01',
  },
}

const MOCK_VEHICLES: Record<string, VehicleRegistration> = {
  ...MOCK_CI_VEHICLES,
  '12AB1234': { plate: '12AB1234', country: 'SN', brand: 'Toyota', model: 'Corolla', year: 2021, engine: '1ZR-FAE', fuel: 'Essence' },
  'BF-1234-AB': { plate: 'BF-1234-AB', country: 'BF', brand: 'Toyota', model: 'Hilux', year: 2022, engine: '1GD-FTV', fuel: 'Diesel' },
}

const PLATE_PATTERNS: Record<string, RegExp> = {
  CI: /^[A-Z]{2}-\d{3}-[A-Z]{2}$/,
  SN: /^\d{2}[A-Z]{2}\d{4}$/,
  BF: /^[A-Z]{2}-\d{4}[A-Z]{2}$/,
  ML: /^[A-Z]{2}\d{3}[A-Z]{2}$/,
  BJ: /^[A-Z]{2}\d{4}[A-Z]{2}$/,
  TG: /^[A-Z]{2}-\d{4}[A-Z]{2}$/,
  GH: /^[A-Z]{2}-\d{4}-[A-Z]{2}$/,
  NG: /^[A-Z]{3}-\d{3}[A-Z]{1}$/,
}

function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/\s/g, '').trim()
}

function validatePlate(plate: string, country: string): boolean {
  const pattern = PLATE_PATTERNS[country]
  if (!pattern) return false
  return pattern.test(normalizePlate(plate))
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const plate = searchParams.get('plate')
  const vin = searchParams.get('vin')
  const country = searchParams.get('country') || 'CI'

  // VIN Lookup branch
  if (vin) {
    const decoded = decodeVin(vin)
    if (!decoded.valid) {
      return NextResponse.json(
        { error: 'Code VIN invalide. Le code VIN doit comporter exactement 17 caractères ISO 3779.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      type: 'VIN',
      vehicle: {
        vin: decoded.vin,
        brand: decoded.brand,
        model: `${decoded.brand} Series`,
        year: decoded.modelYear,
        countryOfOrigin: decoded.countryOfOrigin,
        bodyType: decoded.bodyType,
        engine: decoded.engine,
        fuel: decoded.fuel,
        gearbox: decoded.gearbox,
        recommendedPartsCategories: [
          'Filtre à huile & Filtre à air',
          'Plaquettes de frein avant & arrière',
          'Amortisseurs renforcés',
          'Kit d\'embrayage complet',
          'Courroie de distribution',
        ],
      },
    })
  }

  // Plate Lookup branch
  if (!plate) {
    return NextResponse.json(
      { error: 'Numéro d\'immatriculation ou code VIN requis' },
      { status: 400 }
    )
  }

  const normalizedPlate = normalizePlate(plate)

  if (!validatePlate(plate, country)) {
    return NextResponse.json(
      {
        error: 'Format d\'immatriculation invalide',
        details: `Format attendu pour ${country}: ex. AB-123-CD`,
      },
      { status: 400 }
    )
  }

  const vehicle = MOCK_VEHICLES[normalizedPlate]

  if (!vehicle) {
    return NextResponse.json(
      {
        error: 'Véhicule non trouvé',
        message: 'Cette immatriculation n\'est pas enregistrée. Essayez la recherche par code VIN.',
        plate: normalizedPlate,
        country,
      },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    type: 'PLATE',
    vehicle: {
      ...vehicle,
      plate: normalizedPlate,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plate, vin, country = 'CI' } = body

    if (vin) {
      const decoded = decodeVin(vin)
      if (!decoded.valid) {
        return NextResponse.json(
          { error: 'Code VIN invalide (17 caractères requis)' },
          { status: 400 }
        )
      }
      return NextResponse.json({
        success: true,
        type: 'VIN',
        vehicle: {
          vin: decoded.vin,
          brand: decoded.brand,
          model: `${decoded.brand} Series`,
          year: decoded.modelYear,
          countryOfOrigin: decoded.countryOfOrigin,
          bodyType: decoded.bodyType,
          engine: decoded.engine,
          fuel: decoded.fuel,
          gearbox: decoded.gearbox,
        },
      })
    }

    if (!plate) {
      return NextResponse.json(
        { error: 'Numéro d\'immatriculation ou code VIN requis' },
        { status: 400 }
      )
    }

    const normalizedPlate = normalizePlate(plate)
    if (!validatePlate(plate, country)) {
      return NextResponse.json(
        { error: 'Format d\'immatriculation invalide' },
        { status: 400 }
      )
    }

    const vehicle = MOCK_VEHICLES[normalizedPlate]
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Véhicule non trouvé', plate: normalizedPlate, country },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      type: 'PLATE',
      vehicle: { ...vehicle, plate: normalizedPlate },
    })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
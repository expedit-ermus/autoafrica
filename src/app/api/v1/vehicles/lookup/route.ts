import { NextRequest, NextResponse } from 'next/server'
import { decodeVin } from '@/modules/vehicles/vin-decoder'
import {
  validateLicensePlate,
  isSupportedCountry,
  COUNTRY_PLATE_SPECS,
} from '@/modules/vehicles/license-plate.validator'

/**
 * Identification du vehicule a partir d'une plaque ou d'un VIN.
 *
 * **Ce que cette route ne fait pas, et pourquoi.** Elle servait auparavant un
 * registre simule : six plaques ecrites en dur (`MOCK_VEHICLES`) renvoyaient
 * une immatriculation complete — marque, modele, motorisation, couleur, date
 * de premiere mise en circulation, prochaine visite technique. Toute autre
 * plaque repondait 404 « Cette immatriculation n'est pas enregistree », ce qui
 * laissait croire a l'existence d'un registre ou le vehicule manquait.
 *
 * Aucun acces au registre national n'existe — ni Quipux/DIGIMMAT en Cote
 * d'Ivoire, ni ses equivalents. Une plaque ne peut donc pas designer un
 * modele. La route valide le format, ce qui est reel et utile, et le dit.
 *
 * Le format vient de `license-plate.validator.ts`, source unique. Cette route
 * portait sa propre table `PLATE_PATTERNS` qui attendait `AB-123-CD` pour la
 * Cote d'Ivoire : les plaques ivoiriennes reelles, `1234 AB 01`, etaient
 * rejetees comme invalides.
 */

interface CorpsRequete {
  plate?: string
  vin?: string
  country?: string
}

function reponseVin(vin: string) {
  const decoded = decodeVin(vin)

  if (!decoded.valid) {
    return NextResponse.json(
      { error: 'Code VIN invalide. Le code VIN doit comporter exactement 17 caractères ISO 3779.' },
      { status: 400 },
    )
  }

  // Le VIN ne porte que le constructeur, le pays et l'annee-modele. Le modele
  // commercial n'y figure pas : la route renvoyait `${brand} Series`, une
  // chaine qui n'a jamais designe un vehicule. Les caracteristiques techniques
  // etaient deduites du VDS, propre a chaque constructeur (voir `vin-decoder`).
  return NextResponse.json({
    success: true,
    type: 'VIN',
    vehicle: {
      vin: decoded.vin,
      wmi: decoded.wmi,
      ...(decoded.brand ? { brand: decoded.brand } : {}),
      ...(decoded.countryOfOrigin ? { countryOfOrigin: decoded.countryOfOrigin } : {}),
      ...(decoded.modelYear ? { year: decoded.modelYear } : {}),
    },
    ...(decoded.brand
      ? {}
      : {
          message:
            "Ce code constructeur (WMI) n'est pas référencé. Sélectionnez la marque de votre véhicule pour voir les pièces disponibles.",
        }),
  })
}

function reponsePlaque(plate: string, country: string) {
  if (!isSupportedCountry(country)) {
    return NextResponse.json(
      { error: `Pays non pris en charge : ${country}` },
      { status: 400 },
    )
  }

  const validation = validateLicensePlate(plate, country)

  if (!validation.isValid) {
    return NextResponse.json(
      {
        error: "Format d'immatriculation invalide",
        details: `Format attendu pour ${validation.countryName} : ${validation.formatDescription}`,
        sample: COUNTRY_PLATE_SPECS[country].sample,
      },
      { status: 400 },
    )
  }

  // 200 et non 404 : le format est bon et la demande a abouti. Un 404
  // signifierait que le vehicule est absent d'un registre, et donnerait a
  // penser qu'un tel registre est consulte.
  return NextResponse.json({
    success: true,
    type: 'PLATE',
    plate: validation.normalized,
    country: validation.countryCode,
    countryName: validation.countryName,
    identified: false,
    message:
      "Le format est valide. L'identification automatique du véhicule par plaque n'est pas disponible : " +
      'elle suppose un accès au registre national des immatriculations. ' +
      'Sélectionnez la marque de votre véhicule pour voir les pièces disponibles.',
    officialSystem: validation.officialSystem,
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const plate = searchParams.get('plate')
  const vin = searchParams.get('vin')
  const country = searchParams.get('country') || 'CI'

  if (vin) return reponseVin(vin)

  if (!plate) {
    return NextResponse.json(
      { error: "Numéro d'immatriculation ou code VIN requis" },
      { status: 400 },
    )
  }

  return reponsePlaque(plate, country)
}

export async function POST(request: NextRequest) {
  try {
    const body: CorpsRequete = await request.json()
    const { plate, vin, country = 'CI' } = body

    if (vin) return reponseVin(vin)

    if (!plate) {
      return NextResponse.json(
        { error: "Numéro d'immatriculation ou code VIN requis" },
        { status: 400 },
      )
    }

    return reponsePlaque(plate, country)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

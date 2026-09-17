import { NextRequest, NextResponse } from 'next/server'
import { decodeVin } from '@/modules/vehicles/vin-decoder'
import {
  validateLicensePlate,
  isSupportedCountry,
  COUNTRY_PLATE_SPECS,
} from '@/modules/vehicles/license-plate.validator'
import { garageService } from '@/modules/vehicles/garage.service'
import { optionalAuth } from '@/modules/auth/auth.guard'

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
 * d'Ivoire, ni ses equivalents. Une plaque ne peut donc pas designer un modele
 * du parc national.
 *
 * Elle en designe un du garage de l'utilisateur. Un acheteur connecte qui a
 * declare sa voiture la retrouve par sa plaque : l'identification est reelle,
 * et son perimetre est dit — ce que cet utilisateur a enregistre, pas le parc
 * ivoirien. La recherche est scopee au proprietaire, une plaque saisie par un
 * tiers ne revelant jamais le vehicule d'autrui.
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

async function reponsePlaque(request: NextRequest, plate: string, country: string) {
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
        // Toutes les normes acceptees, pas seulement celle en vigueur : une
        // plaque d'avant juin 2023 reste valide et son porteur doit le voir.
        acceptedFormats: validation.acceptedFormats.map((f) => ({
          norm: f.norm,
          description: f.formatDescription,
          sample: f.sample,
        })),
        sample: COUNTRY_PLATE_SPECS[country].formats[0].sample,
      },
      { status: 400 },
    )
  }

  const commun = {
    success: true,
    type: 'PLATE' as const,
    plate: validation.normalized,
    country: validation.countryCode,
    countryName: validation.countryName,
    matchedNorm: validation.matchedNorm,
    isLegacy: validation.isLegacy,
    officialSystem: validation.officialSystem,
  }

  // `optionalAuth` et non `requireAuth` : un visiteur non connecte doit
  // pouvoir verifier un format sans compte.
  const auth = await optionalAuth(request)
  if (auth?.userId) {
    const vehicule = await garageService.findByPlate(auth.userId, validation.normalized)
    if (vehicule) {
      return NextResponse.json({
        ...commun,
        identified: true,
        source: 'GARAGE',
        vehicle: {
          id: vehicule.id,
          brand: vehicule.brandName,
          ...(vehicule.model ? { model: vehicule.model } : {}),
          ...(vehicule.year ? { year: vehicule.year } : {}),
          ...(vehicule.fuel ? { fuel: vehicule.fuel } : {}),
          ...(vehicule.gearbox ? { gearbox: vehicule.gearbox } : {}),
          ...(vehicule.engine ? { engine: vehicule.engine } : {}),
          ...(vehicule.nickname ? { nickname: vehicule.nickname } : {}),
        },
      })
    }
  }

  // 200 et non 404 : le format est bon et la demande a abouti. Un 404
  // signifierait que le vehicule est absent d'un registre, et donnerait a
  // penser qu'un tel registre est consulte.
  return NextResponse.json({
    ...commun,
    identified: false,
    message: auth?.userId
      ? "Cette plaque n'est pas dans votre garage. Ajoutez le véhicule une fois, et vous le retrouverez ensuite par sa plaque."
      : "Le format est valide. Connectez-vous et enregistrez votre véhicule pour le retrouver ensuite par sa plaque. " +
        "L'identification depuis le registre national des immatriculations n'est pas disponible.",
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

  return reponsePlaque(request, plate, country)
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

    return reponsePlaque(request, plate, country)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

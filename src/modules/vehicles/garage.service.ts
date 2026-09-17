import { prisma } from '@/lib/prisma'
import { Prisma, VehicleFuel, VehicleGearbox } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import {
  validateLicensePlate,
  isSupportedCountry,
  type SupportedCountryCode,
} from './license-plate.validator'

/**
 * Garage de l'acheteur : les vehicules qu'il declare pour retrouver ses pieces.
 *
 * Une plaque ne dit rien du vehicule — elle ne le designe que par un registre,
 * et celui de Cote d'Ivoire est concede a un operateur prive dont le projet n'a
 * pas l'acces (D70, D71). Le garage renverse le probleme : l'acheteur declare
 * sa voiture une fois, et c'est notre propre base qui l'identifie ensuite.
 *
 * L'identification est donc reelle, et son perimetre est dit : elle porte sur
 * ce que l'utilisateur a lui-meme enregistre, pas sur le parc national.
 */

export interface GarageVehicleInput {
  plateNumber: string
  countryCode?: string
  brandName: string
  model?: string
  year?: number
  fuel?: string
  gearbox?: string
  engine?: string
  nickname?: string
}

const ANNEE_MIN = 1950

/**
 * Forme de comparaison d'une plaque : majuscules, sans espaces ni tirets.
 *
 * Une meme plaque s'ecrit `AB-123-CD`, `AB 123 CD` ou `ab123cd` ; enregistrer
 * l'une et chercher l'autre ne doit pas produire deux vehicules distincts ni
 * un echec de recherche. La forme saisie est conservee pour l'affichage, cette
 * forme-ci sert de cle.
 */
export function normaliserPlaque(plate: string): string {
  return plate.toUpperCase().replace(/[\s-]/g, '')
}

function valider(data: GarageVehicleInput): {
  plateNumber: string
  plateKey: string
  countryCode: SupportedCountryCode
} {
  const pays = data.countryCode || 'CI'
  if (!isSupportedCountry(pays)) {
    throw new ValidationError(`Pays non pris en charge : ${pays}`)
  }

  const validation = validateLicensePlate(data.plateNumber ?? '', pays)
  if (!validation.isValid) {
    // Les normes remplacees sont acceptees : le message ne cite donc pas le
    // seul format en vigueur, qui ferait croire a un refus de l'ancienne.
    const formats = validation.acceptedFormats.map((f) => f.formatDescription).join(' ou ')
    throw new ValidationError(
      `Immatriculation invalide pour ${validation.countryName}. Formats acceptés : ${formats}.`,
    )
  }

  if (!data.brandName?.trim()) {
    throw new ValidationError('La marque du véhicule est requise')
  }

  if (data.year !== undefined) {
    const anneeMax = new Date().getFullYear() + 1
    if (!Number.isInteger(data.year) || data.year < ANNEE_MIN || data.year > anneeMax) {
      throw new ValidationError(`L'année doit être comprise entre ${ANNEE_MIN} et ${anneeMax}`)
    }
  }

  // La saisie est conservee pour l'affichage — un automobiliste reconnait
  // « AB-123-CD », pas « AB123CD » — et sa forme normalisee sert de cle.
  return {
    plateNumber: validation.normalized,
    plateKey: normaliserPlaque(data.plateNumber),
    countryCode: pays,
  }
}

function versEnum<T extends Record<string, string>>(
  table: T,
  valeur: string | undefined,
  champ: string,
): T[keyof T] | undefined {
  if (!valeur) return undefined
  if (!(valeur in table)) {
    // Une valeur inconnue n'est pas remplacee par un defaut : elle serait
    // affichee comme un fait sur la fiche du vehicule (D61).
    throw new ValidationError(`Valeur de ${champ} inconnue : ${valeur}`)
  }
  return table[valeur as keyof T]
}

function champsCommuns(data: GarageVehicleInput) {
  return {
    brandName: data.brandName.trim(),
    model: data.model?.trim() || null,
    year: data.year ?? null,
    fuel: versEnum(VehicleFuel, data.fuel, 'carburant') ?? null,
    gearbox: versEnum(VehicleGearbox, data.gearbox, 'boîte de vitesses') ?? null,
    engine: data.engine?.trim() || null,
    nickname: data.nickname?.trim() || null,
  }
}

export class GarageService {
  async list(userId: string) {
    return prisma.userVehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(userId: string, data: GarageVehicleInput) {
    const { plateNumber, plateKey, countryCode } = valider(data)

    const existant = await prisma.userVehicle.findUnique({
      where: { userId_plateKey: { userId, plateKey } },
    })
    if (existant) {
      throw new ValidationError('Ce véhicule est déjà dans votre garage')
    }

    return prisma.userVehicle.create({
      data: { userId, plateNumber, plateKey, countryCode, ...champsCommuns(data) },
    })
  }

  async update(userId: string, id: string, data: GarageVehicleInput) {
    // La propriete est verifiee par la clause `where`, pas par une lecture
    // suivie d'une comparaison : un `updateMany` scope evite toute fenetre
    // entre les deux.
    const { plateNumber, plateKey, countryCode } = valider(data)

    const modifies = await prisma.userVehicle.updateMany({
      where: { id, userId },
      data: { plateNumber, plateKey, countryCode, ...champsCommuns(data) },
    })

    if (modifies.count === 0) throw new NotFoundError('UserVehicle', id)

    return prisma.userVehicle.findUnique({ where: { id } })
  }

  async remove(userId: string, id: string) {
    const supprimes = await prisma.userVehicle.deleteMany({ where: { id, userId } })
    if (supprimes.count === 0) throw new NotFoundError('UserVehicle', id)
    return { success: true }
  }

  /**
   * Identifie un vehicule du garage par sa plaque.
   *
   * Volontairement limitee au proprietaire : une plaque saisie par un tiers ne
   * doit pas reveler le vehicule de quelqu'un d'autre. C'est pourquoi le
   * `@@unique` porte sur le couple utilisateur/plaque et non sur la plaque
   * seule, et pourquoi cette methode exige un `userId`.
   */
  async findByPlate(userId: string, plate: string) {
    const plateKey = normaliserPlaque(plate ?? '')
    if (!plateKey) return null

    return prisma.userVehicle.findUnique({
      where: { userId_plateKey: { userId, plateKey } },
    })
  }
}

export const garageService = new GarageService()

export type GarageVehicle = Prisma.UserVehicleGetPayload<object>

export interface DecodedVin {
  vin: string
  valid: boolean
  wmi: string
  /** Renseignes seulement quand le VIN les porte reellement. */
  brand?: string
  countryOfOrigin?: string
  modelYear?: number
}

// ISO 3779 WMI Mapping
const WMI_MAP: Record<string, { brand: string; country: string }> = {
  // Toyota / Lexus
  JT1: { brand: 'Toyota', country: 'Japon' },
  JT2: { brand: 'Toyota', country: 'Japon' },
  JTD: { brand: 'Toyota', country: 'Japon' },
  JTE: { brand: 'Toyota', country: 'Japon' },
  JTM: { brand: 'Toyota', country: 'Japon' },
  JTJ: { brand: 'Lexus', country: 'Japon' },
  // Peugeot / Citroën / DS / Renault
  VF3: { brand: 'Peugeot', country: 'France' },
  VF7: { brand: 'Citroën', country: 'France' },
  VF1: { brand: 'Renault', country: 'France' },
  // Hyundai / Kia
  KMH: { brand: 'Hyundai', country: 'Corée du Sud' },
  KNA: { brand: 'Kia', country: 'Corée du Sud' },
  // Suzuki
  JSA: { brand: 'Suzuki', country: 'Japon' },
  // Nissan
  JN1: { brand: 'Nissan', country: 'Japon' },
  JN8: { brand: 'Nissan', country: 'Japon' },
  // Volkswagen / Audi / BMW / Mercedes
  WVW: { brand: 'Volkswagen', country: 'Allemagne' },
  WAU: { brand: 'Audi', country: 'Allemagne' },
  WBA: { brand: 'BMW', country: 'Allemagne' },
  WDB: { brand: 'Mercedes-Benz', country: 'Allemagne' },
  WDD: { brand: 'Mercedes-Benz', country: 'Allemagne' },
  // Ford
  '1FA': { brand: 'Ford', country: 'États-Unis' },
  '1FT': { brand: 'Ford', country: 'États-Unis' },
}

/**
 * Codes d'annee-modele ISO 3779, 10e caractere.
 *
 * Le cycle compte trente codes et se repete : `A` vaut 1980 comme 2010, `1`
 * vaut 2001 comme 2031. Le code seul ne leve donc pas l'ambiguite. La regle
 * retenue est explicite : on prend l'annee du cycle courant, et si elle est
 * dans le futur on retire trente ans. `V` donne ainsi 1997 et non 2027, et un
 * vehicule de 2027 ne peut pas apparaitre dans un catalogue d'occasion.
 *
 * I, O et Q sont absents du VIN par la norme ; U, Z et 0 ne servent pas de
 * code d'annee. Un caractere hors de cette table ne produit aucune annee.
 */
const ORDRE_CODES_ANNEE = 'ABCDEFGHJKLMNPRSTVWXY123456789'
const PREMIERE_ANNEE_DU_CYCLE = 2010
const LONGUEUR_DU_CYCLE = 30

export function decodeModelYear(code: string, anneeCourante = new Date().getFullYear()): number | undefined {
  // `indexOf('')` vaut 0, pas -1 : sans ce controle de longueur, une chaine
  // vide tombait sur le premier code de la table et donnait 2010.
  if (code.length !== 1) return undefined

  const index = ORDRE_CODES_ANNEE.indexOf(code.toUpperCase())
  if (index === -1) return undefined

  const annee = PREMIERE_ANNEE_DU_CYCLE + index
  return annee > anneeCourante ? annee - LONGUEUR_DU_CYCLE : annee
}

/**
 * Decode ce qu'un VIN porte reellement : le constructeur et le pays par le WMI
 * (ISO 3779, trois premiers caracteres), et l'annee-modele par le dixieme.
 *
 * Il ne renvoie plus ni carrosserie, ni motorisation, ni carburant, ni boite de
 * vitesses. Ces valeurs etaient deduites des caracteres 5 a 7 — le VDS, dont la
 * signification est propre a chaque constructeur et n'est normalisee par
 * personne. Un `charAt(5) === 'D'` annoncait « 2.0L Turbo Diesel » sur
 * n'importe quel vehicule dont le VIN portait un D a cette place.
 *
 * Un WMI inconnu ne donne plus `Toyota` : le champ reste vide. Le repli
 * `WMI_MAP[wmi] || { brand: 'Toyota' }` attribuait cette marque a tout
 * vehicule non reference, et c'est sur cette marque que la recherche de pieces
 * compatibles se serait appuyee (D61).
 *
 * Un VIN invalide ne renvoie aucune caracteristique : il en renvoyait
 * auparavant — « 1.6L 4-Cyl, Essence, Manuelle » — pour une saisie que le code
 * venait pourtant de declarer invalide.
 */
export function decodeVin(vin: string): DecodedVin {
  const cleanVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '').trim()

  if (cleanVin.length !== 17) {
    return { vin: cleanVin, valid: false, wmi: '' }
  }

  const wmi = cleanVin.substring(0, 3)
  const manufacturer = WMI_MAP[wmi]

  return {
    vin: cleanVin,
    valid: true,
    wmi,
    brand: manufacturer?.brand,
    countryOfOrigin: manufacturer?.country,
    modelYear: decodeModelYear(cleanVin.charAt(9)),
  }
}

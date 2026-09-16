export type SupportedCountryCode = 'CI' | 'SN' | 'ML' | 'BF' | 'NE' | 'BJ' | 'TG' | 'GW' | 'NG' | 'GH'

export interface PlateFormat {
  /** Norme dont releve ce format, telle qu'on la presente a l'utilisateur. */
  norm: string
  pattern: RegExp
  formatDescription: string
  sample: string
  /** Vrai pour un format remplace mais encore en circulation. */
  legacy?: boolean
}

export interface PlateValidationResult {
  isValid: boolean
  normalized: string
  countryCode: SupportedCountryCode
  countryName: string
  /** Format en vigueur, celui qu'un placeholder doit montrer. */
  formatDescription: string
  officialSystem: string
  /** Norme reconnue quand la saisie est valide. */
  matchedNorm?: string
  /** Vrai quand la plaque releve d'une norme remplacee mais encore valide. */
  isLegacy: boolean
  /** Tous les formats acceptes, pour afficher l'aide a la saisie. */
  acceptedFormats: PlateFormat[]
}

export interface PartSafetyCheckResult {
  isPermitted: boolean
  requiresVinTraceability: boolean
  reason?: string
}

/**
 * Formats acceptes par pays. Le premier est la norme en vigueur ; les suivants
 * sont des normes remplacees dont les plaques restent valides et circulent.
 *
 * La Cote d'Ivoire a change de norme le 1er juin 2023 : `AA-123-AA`, sur le
 * modele francais, remplace le `4 chiffres + 2 lettres + 2 chiffres` en usage
 * depuis 1997. Les anciennes plaques restent valables — refuser l'une ou
 * l'autre ecarte une partie du parc.
 */
export const COUNTRY_PLATE_SPECS: Record<
  SupportedCountryCode,
  {
    countryName: string
    officialSystem: string
    formats: PlateFormat[]
  }
> = {
  CI: {
    countryName: "Côte d'Ivoire",
    officialSystem: 'Quipux Afrique / CGI (DIGIMMAT)',
    formats: [
      {
        norm: 'Norme en vigueur depuis le 1er juin 2023',
        pattern: /^[A-Z]{2}-?\s?\d{3}-?\s?[A-Z]{2}$/i,
        formatDescription: '2 lettres + 3 chiffres + 2 lettres (ex: AB-123-CD)',
        sample: 'AB-123-CD',
      },
      {
        norm: 'Ancienne norme 1997-2023, toujours valide',
        pattern: /^\d{4}\s?[A-Z]{2}\s?\d{2}$/i,
        formatDescription: '4 chiffres + 2 lettres + 2 chiffres de région (ex: 4550 EG 01)',
        sample: '4550 EG 01',
        legacy: true,
      },
    ],
  },
  SN: {
    countryName: 'Sénégal',
    officialSystem: 'Capp Karangë (Ministère des Transports)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^\d{4}\s?[A-Z]{2}\s?\d{2}$/i,
        formatDescription: '4 chiffres + 2 lettres région (DK, TH, SL...) + 2 chiffres (ex: 1234 DK 01)',
        sample: '1234 DK 01',
      },
    ],
  },
  ML: {
    countryName: 'Mali',
    officialSystem: 'Direction Nationale des Transports (DNTTM)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^([A-Z]{1,2}\s?\d{4}\s?[A-Z]{1,2}(\s?ML)?|\d{4}\s?[A-Z]{2}\s?ML)$/i,
        formatDescription: 'Lettre + 4 chiffres + Lettre + ML (ex: A 1234 B ML)',
        sample: 'A 1234 B ML',
      },
    ],
  },
  BF: {
    countryName: 'Burkina Faso',
    officialSystem: 'Direction Générale des Transports (DGTTM)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^\d{1,2}\s?[A-Z]{2}\s?\d{4}\s?BF$/i,
        formatDescription: 'Code région (11=Oua) + 2 lettres + 4 chiffres + BF (ex: 11 JK 1234 BF)',
        sample: '11 JK 1234 BF',
      },
    ],
  },
  NE: {
    countryName: 'Niger',
    officialSystem: 'Direction Générale des Transports (DGT)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^\d{1,2}\s?[A-Z]{2}\s?\d{4}(\s?RN)?$/i,
        formatDescription: 'Code région + 2 lettres + 4 chiffres (ex: 8 NI 1234)',
        sample: '8 NI 1234',
      },
    ],
  },
  BJ: {
    countryName: 'Bénin',
    officialSystem: 'Agence Nationale des Transports Terrestres (ANaTT)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^[A-Z]{1,2}\s?\d{4}\s?[A-Z]{2}\s?(RB|BJ)?$/i,
        formatDescription: 'Lettre + 4 chiffres + 2 lettres + RB (ex: A 1234 AB RB)',
        sample: 'A 1234 AB RB',
      },
    ],
  },
  TG: {
    countryName: 'Togo',
    officialSystem: 'Direction des Transports Routiers (DTR)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^\d{4}\s?[A-Z]{2}\s?TG$/i,
        formatDescription: '4 chiffres + 2 lettres + TG (ex: 1234 RT TG)',
        sample: '1234 RT TG',
      },
    ],
  },
  GW: {
    countryName: 'Guinée-Bissau',
    officialSystem: 'Direcção-Geral dos Transportes (DGTT)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^(GB|GW)-?\d{2}-?\d{2}$/i,
        formatDescription: 'GB/GW - 2 chiffres - 2 chiffres (ex: GB-12-34)',
        sample: 'GB-12-34',
      },
    ],
  },
  NG: {
    countryName: 'Nigeria',
    officialSystem: 'FRSC / NVIS (National Vehicle Identification Scheme)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^[A-Z]{3}-?\d{3}[A-Z]{2}$/i,
        formatDescription: '3 lettres état + 3 chiffres + 2 lettres (ex: KJA-123AA)',
        sample: 'KJA-123AA',
      },
    ],
  },
  GH: {
    countryName: 'Ghana',
    officialSystem: 'DVLA (Driver and Vehicle Licensing Authority)',
    formats: [
      {
        norm: 'Format national',
        pattern: /^[A-Z]{2}-?\d{1,4}-?\d{2}$/i,
        formatDescription: '2 lettres région + 1-4 chiffres + 2 chiffres année (ex: GR-1234-24)',
        sample: 'GR-1234-24',
      },
    ],
  },

}

/**
 * Pays couverts, dans l'ordre d'affichage. Le drapeau est la seule donnee
 * d'interface portee ici : il evite une troisieme liste de pays cote client.
 *
 * `COUNTRY_PLATE_SPECS` est la source unique du format. Il en existait trois
 * copies : ce module, `PLATE_PATTERNS` dans `/api/v1/vehicles/lookup`, et
 * `COUNTRIES` dans `VehiclePartsSearch`. Les deux dernieres attendaient
 * `AB-123-CD` pour la Cote d'Ivoire — un format francais. Une plaque
 * ivoirienne reelle, `1234 AB 01`, etait donc refusee par le formulaire comme
 * par l'API, alors que ce module la validait correctement.
 */
export const SUPPORTED_COUNTRIES: { code: SupportedCountryCode; flag: string }[] = [
  { code: 'CI', flag: '🇨🇮' },
  { code: 'SN', flag: '🇸🇳' },
  { code: 'ML', flag: '🇲🇱' },
  { code: 'BF', flag: '🇧🇫' },
  { code: 'NE', flag: '🇳🇪' },
  { code: 'BJ', flag: '🇧🇯' },
  { code: 'TG', flag: '🇹🇬' },
  { code: 'GW', flag: '🇬🇼' },
  { code: 'NG', flag: '🇳🇬' },
  { code: 'GH', flag: '🇬🇭' },
]

export function isSupportedCountry(code: string): code is SupportedCountryCode {
  return code in COUNTRY_PLATE_SPECS
}

/**
 * Validates vehicle license plate against official 10 West African countries formats
 */
export function validateLicensePlate(
  plateNumber: string,
  countryCode: SupportedCountryCode = 'CI'
): PlateValidationResult {
  const spec = COUNTRY_PLATE_SPECS[countryCode]
  if (!spec) {
    throw new Error(`Code pays non supporté: ${countryCode}`)
  }

  const cleanInput = plateNumber.trim().toUpperCase()
  // Le premier format qui reconnait la saisie l'emporte, et les formats sont
  // ranges norme en vigueur d'abord : une plaque valide sous les deux normes
  // serait rattachee a la plus recente.
  const matched = spec.formats.find((format) => format.pattern.test(cleanInput))
  const enVigueur = spec.formats[0]

  return {
    isValid: Boolean(matched),
    normalized: cleanInput,
    countryCode,
    countryName: spec.countryName,
    formatDescription: enVigueur.formatDescription,
    officialSystem: spec.officialSystem,
    matchedNorm: matched?.norm,
    isLegacy: Boolean(matched?.legacy),
    acceptedFormats: spec.formats,
  }
}

/**
 * Validates safety and legal OHADA compliance of auto parts before marketplace listing.
 * Prohibits raw uncertified critical safety items (airbags, worn brake pads).
 */
export function checkUsedPartSafetyCompliance(
  partCategory: string,
  condition: 'NEW' | 'USED_INSPECTED'
): PartSafetyCheckResult {
  const normalizedCategory = partCategory.toLowerCase()

  if (condition === 'USED_INSPECTED') {
    // Prohibited used safety parts per West African road safety regulations
    if (normalizedCategory.includes('airbag') || normalizedCategory.includes('pretensionneur')) {
      return {
        isPermitted: false,
        requiresVinTraceability: true,
        reason: 'Réglementation Sécurité : La revente d’airbags ou prétensionneurs d’occasion est strictement interdite.',
      }
    }

    if (normalizedCategory.includes('plaquette') || normalizedCategory.includes('garniture frein')) {
      return {
        isPermitted: false,
        requiresVinTraceability: false,
        reason: 'Réglementation Sécurité : Les plaquettes et garnitures de frein usagées doivent être neuves.',
      }
    }

    // Require VIN traceability for major mechanical assemblies (engines, gearboxes, axles)
    if (
      normalizedCategory.includes('moteur') ||
      normalizedCategory.includes('boite') ||
      normalizedCategory.includes('pont') ||
      normalizedCategory.includes('cremaillere')
    ) {
      return {
        isPermitted: true,
        requiresVinTraceability: true,
        reason: 'Attestation de traçabilité VIN obligatoire (Véhicule donneur contrôlé anti-vol).',
      }
    }
  }

  return {
    isPermitted: true,
    requiresVinTraceability: false,
  }
}

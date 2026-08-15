export type SupportedCountryCode = 'CI' | 'SN' | 'ML' | 'BF' | 'NE' | 'BJ' | 'TG' | 'GW' | 'NG' | 'GH'

export interface PlateValidationResult {
  isValid: boolean
  normalized: string
  countryCode: SupportedCountryCode
  countryName: string
  formatDescription: string
  officialSystem: string
}

export interface PartSafetyCheckResult {
  isPermitted: boolean
  requiresVinTraceability: boolean
  reason?: string
}

export const COUNTRY_PLATE_SPECS: Record<
  SupportedCountryCode,
  {
    countryName: string
    officialSystem: string
    pattern: RegExp
    formatDescription: string
    sample: string
  }
> = {
  CI: {
    countryName: "Côte d'Ivoire",
    officialSystem: 'Quipux Afrique / CGI (DIGIMMAT)',
    pattern: /^\d{4}\s?[A-Z]{2}\s?\d{2}$/i,
    formatDescription: '4 chiffres + 2 lettres + 2 chiffres (ex: 1234 AB 01)',
    sample: '1234 AB 01',
  },
  SN: {
    countryName: 'Sénégal',
    officialSystem: 'Capp Karangë (Ministère des Transports)',
    pattern: /^\d{4}\s?[A-Z]{2}\s?\d{2}$/i,
    formatDescription: '4 chiffres + 2 lettres région (DK, TH, SL...) + 2 chiffres (ex: 1234 DK 01)',
    sample: '1234 DK 01',
  },
  ML: {
    countryName: 'Mali',
    officialSystem: 'Direction Nationale des Transports (DNTTM)',
    pattern: /^([A-Z]{1,2}\s?\d{4}\s?[A-Z]{1,2}(\s?ML)?|\d{4}\s?[A-Z]{2}\s?ML)$/i,
    formatDescription: 'Lettre + 4 chiffres + Lettre + ML (ex: A 1234 B ML)',
    sample: 'A 1234 B ML',
  },
  BF: {
    countryName: 'Burkina Faso',
    officialSystem: 'Direction Générale des Transports (DGTTM)',
    pattern: /^\d{1,2}\s?[A-Z]{2}\s?\d{4}\s?BF$/i,
    formatDescription: 'Code région (11=Oua) + 2 lettres + 4 chiffres + BF (ex: 11 JK 1234 BF)',
    sample: '11 JK 1234 BF',
  },
  NE: {
    countryName: 'Niger',
    officialSystem: 'Direction Générale des Transports (DGT)',
    pattern: /^\d{1,2}\s?[A-Z]{2}\s?\d{4}(\s?RN)?$/i,
    formatDescription: 'Code région + 2 lettres + 4 chiffres (ex: 8 NI 1234)',
    sample: '8 NI 1234',
  },
  BJ: {
    countryName: 'Bénin',
    officialSystem: 'Agence Nationale des Transports Terrestres (ANaTT)',
    pattern: /^[A-Z]{1,2}\s?\d{4}\s?[A-Z]{2}\s?(RB|BJ)?$/i,
    formatDescription: 'Lettre + 4 chiffres + 2 lettres + RB (ex: A 1234 AB RB)',
    sample: 'A 1234 AB RB',
  },
  TG: {
    countryName: 'Togo',
    officialSystem: 'Direction des Transports Routiers (DTR)',
    pattern: /^\d{4}\s?[A-Z]{2}\s?TG$/i,
    formatDescription: '4 chiffres + 2 lettres + TG (ex: 1234 RT TG)',
    sample: '1234 RT TG',
  },
  GW: {
    countryName: 'Guinée-Bissau',
    officialSystem: 'Direcção-Geral dos Transportes (DGTT)',
    pattern: /^(GB|GW)-?\d{2}-?\d{2}$/i,
    formatDescription: 'GB/GW - 2 chiffres - 2 chiffres (ex: GB-12-34)',
    sample: 'GB-12-34',
  },
  NG: {
    countryName: 'Nigeria',
    officialSystem: 'FRSC / NVIS (National Vehicle Identification Scheme)',
    pattern: /^[A-Z]{3}-?\d{3}[A-Z]{2}$/i,
    formatDescription: '3 lettres état + 3 chiffres + 2 lettres (ex: KJA-123AA)',
    sample: 'KJA-123AA',
  },
  GH: {
    countryName: 'Ghana',
    officialSystem: 'DVLA (Driver and Vehicle Licensing Authority)',
    pattern: /^[A-Z]{2}-?\d{1,4}-?\d{2}$/i,
    formatDescription: '2 lettres région + 1-4 chiffres + 2 chiffres année (ex: GR-1234-24)',
    sample: 'GR-1234-24',
  },
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
  const isValid = spec.pattern.test(cleanInput)

  return {
    isValid,
    normalized: cleanInput,
    countryCode,
    countryName: spec.countryName,
    formatDescription: spec.formatDescription,
    officialSystem: spec.officialSystem,
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

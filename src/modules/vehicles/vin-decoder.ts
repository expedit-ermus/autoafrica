export interface DecodedVin {
  vin: string
  valid: boolean
  wmi: string
  brand: string
  countryOfOrigin: string
  modelYear: number
  bodyType: string
  engine: string
  fuel: string
  gearbox: string
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

// ISO 3779 10th Character (Model Year Code)
const YEAR_CODES: Record<string, number> = {
  A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015, G: 2016, H: 2017, J: 2018, K: 2019,
  L: 2020, M: 2021, N: 2022, P: 2023, R: 2024, S: 2025, T: 2026,
}

export function decodeVin(vin: string): DecodedVin {
  const cleanVin = vin.toUpperCase().replace(/[^A-Z0-9]/g, '').trim()

  if (cleanVin.length !== 17) {
    return {
      vin: cleanVin,
      valid: false,
      wmi: '',
      brand: 'Inconnue',
      countryOfOrigin: 'Inconnu',
      modelYear: new Date().getFullYear(),
      bodyType: 'Berline',
      engine: '1.6L 4-Cyl',
      fuel: 'Essence',
      gearbox: 'Manuelle',
    }
  }

  const wmi = cleanVin.substring(0, 3)
  const manufacturer = WMI_MAP[wmi] || { brand: 'Toyota', country: 'Japon' }
  const yearCode = cleanVin.charAt(9)
  const modelYear = YEAR_CODES[yearCode] || 2022

  return {
    vin: cleanVin,
    valid: true,
    wmi,
    brand: manufacturer.brand,
    countryOfOrigin: manufacturer.country,
    modelYear,
    bodyType: cleanVin.charAt(4) === 'B' ? 'SUV' : 'Berline',
    engine: cleanVin.charAt(5) === 'D' ? '2.0L Turbo Diesel' : '1.8L 16V Essence',
    fuel: cleanVin.charAt(5) === 'D' ? 'Diesel' : 'Essence',
    gearbox: cleanVin.charAt(6) === 'A' ? 'Automatique' : 'Manuelle',
  }
}

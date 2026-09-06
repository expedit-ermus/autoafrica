/**
 * Numéros de téléphone ouest-africains et détection de l'opérateur Mobile Money.
 *
 * Objectif produit : sur le tunnel de paiement, l'acheteur saisit son numéro et
 * l'opérateur est proposé automatiquement, au lieu de lui demander de choisir
 * entre Orange Money, MTN MoMo, Moov Money et Wave — source d'erreurs et
 * d'abandons quand le choix ne correspond pas au numéro.
 *
 * La détection n'est activée que pour les plans de numérotation dont le
 * découpage par opérateur est stable et documenté (Côte d'Ivoire, Sénégal).
 * Ailleurs, on valide le format et on laisse l'utilisateur choisir : mieux vaut
 * ne rien proposer qu'orienter vers le mauvais opérateur.
 */

export type MobileMoneyOperator = 'ORANGE_MONEY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'WAVE'

export interface CountryPhoneRule {
  /** Indicatif international, sans le « + ». */
  dialCode: string
  /** Longueurs valides du numéro national (hors indicatif). */
  nationalLengths: number[]
  /** Préfixes nationaux → opérateur. Vide si le découpage n'est pas fiable. */
  operatorPrefixes: Record<string, MobileMoneyOperator>
  /**
   * Portefeuilles utilisables quel que soit l'opérateur du numéro.
   * Wave n'est pas un opérateur mobile : il fonctionne sur n'importe quelle ligne.
   */
  wallets: MobileMoneyOperator[]
}

export const COUNTRY_PHONE_RULES: Record<string, CountryPhoneRule> = {
  CI: {
    // Plan de numérotation à 10 chiffres depuis 2021 : 01 Moov, 05 MTN, 07 Orange.
    dialCode: '225',
    nationalLengths: [10],
    operatorPrefixes: {
      '01': 'MOOV_MONEY',
      '05': 'MTN_MOMO',
      '07': 'ORANGE_MONEY',
    },
    wallets: ['WAVE'],
  },
  SN: {
    dialCode: '221',
    nationalLengths: [9],
    operatorPrefixes: {
      '77': 'ORANGE_MONEY',
      '78': 'ORANGE_MONEY',
    },
    wallets: ['WAVE'],
  },
  ML: { dialCode: '223', nationalLengths: [8], operatorPrefixes: {}, wallets: [] },
  BF: { dialCode: '226', nationalLengths: [8], operatorPrefixes: {}, wallets: [] },
  NE: { dialCode: '227', nationalLengths: [8], operatorPrefixes: {}, wallets: [] },
  TG: { dialCode: '228', nationalLengths: [8], operatorPrefixes: {}, wallets: [] },
  BJ: { dialCode: '229', nationalLengths: [8, 10], operatorPrefixes: {}, wallets: [] },
  GN: { dialCode: '224', nationalLengths: [9], operatorPrefixes: {}, wallets: [] },
  GH: { dialCode: '233', nationalLengths: [9], operatorPrefixes: {}, wallets: [] },
  CM: { dialCode: '237', nationalLengths: [9], operatorPrefixes: {}, wallets: [] },
  GW: { dialCode: '245', nationalLengths: [7, 9], operatorPrefixes: {}, wallets: [] },
  NG: { dialCode: '234', nationalLengths: [10, 11], operatorPrefixes: {}, wallets: [] },
}

/**
 * Pays desservis, source unique pour le formulaire d'inscription et pour la
 * validation serveur. Auparavant les deux listes divergeaient : la Guinée et le
 * Cameroun étaient proposés à l'écran mais refusés par le schéma de validation,
 * et l'inscription échouait sans message compréhensible.
 */
export const SUPPORTED_COUNTRIES = [
  { code: 'CI', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: 'SN', flag: '🇸🇳', name: 'Sénégal' },
  { code: 'ML', flag: '🇲🇱', name: 'Mali' },
  { code: 'BF', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'NE', flag: '🇳🇪', name: 'Niger' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'TG', flag: '🇹🇬', name: 'Togo' },
  { code: 'BJ', flag: '🇧🇯', name: 'Bénin' },
  { code: 'GN', flag: '🇬🇳', name: 'Guinée' },
  { code: 'CM', flag: '🇨🇲', name: 'Cameroun' },
  { code: 'GW', flag: '🇬🇼', name: 'Guinée-Bissau' },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria' },
] as const

export const SUPPORTED_COUNTRY_CODES = SUPPORTED_COUNTRIES.map((c) => c.code)

export const DEFAULT_COUNTRY = 'CI'

/** Ne garde que les chiffres : espaces, points, tirets et parenthèses sont ignorés. */
function digitsOnly(input: string): string {
  return input.replace(/\D/g, '')
}

/**
 * Ramène une saisie libre au numéro national.
 * Accepte « +225 07 12 34 56 78 », « 0022507... », « 07-12-34-56-78 ».
 */
export function toNationalNumber(input: string, countryCode: string = DEFAULT_COUNTRY): string {
  const rule = COUNTRY_PHONE_RULES[countryCode]
  let digits = digitsOnly(input)
  if (!rule) return digits

  // Préfixe international composé (00225…) puis indicatif nu (225…).
  if (digits.startsWith('00' + rule.dialCode)) {
    digits = digits.slice(2 + rule.dialCode.length)
  } else if (digits.startsWith(rule.dialCode) && digits.length > Math.max(...rule.nationalLengths)) {
    digits = digits.slice(rule.dialCode.length)
  }

  return digits
}

export function isValidPhone(input: string, countryCode: string = DEFAULT_COUNTRY): boolean {
  const rule = COUNTRY_PHONE_RULES[countryCode]
  if (!rule) return digitsOnly(input).length >= 8
  return rule.nationalLengths.includes(toNationalNumber(input, countryCode).length)
}

/** Forme internationale canonique : « +22507123456 78 » → « +2250712345678 ». */
export function toE164(input: string, countryCode: string = DEFAULT_COUNTRY): string | null {
  const rule = COUNTRY_PHONE_RULES[countryCode]
  if (!rule || !isValidPhone(input, countryCode)) return null
  return `+${rule.dialCode}${toNationalNumber(input, countryCode)}`
}

/**
 * Opérateur Mobile Money déduit du préfixe, ou `null` si le pays n'a pas de
 * découpage fiable ou si le numéro est incomplet.
 */
export function detectOperator(
  input: string,
  countryCode: string = DEFAULT_COUNTRY,
): MobileMoneyOperator | null {
  const rule = COUNTRY_PHONE_RULES[countryCode]
  if (!rule) return null

  const national = toNationalNumber(input, countryCode)
  if (!rule.nationalLengths.includes(national.length)) return null

  for (const [prefix, operator] of Object.entries(rule.operatorPrefixes)) {
    if (national.startsWith(prefix)) return operator
  }
  return null
}

/**
 * Moyens de paiement proposables pour ce numéro : l'opérateur détecté d'abord,
 * puis les portefeuilles indépendants du réseau (Wave).
 */
export function availableOperators(
  input: string,
  countryCode: string = DEFAULT_COUNTRY,
): MobileMoneyOperator[] {
  const rule = COUNTRY_PHONE_RULES[countryCode]
  if (!rule) return []

  const detected = detectOperator(input, countryCode)
  return detected ? [detected, ...rule.wallets] : [...rule.wallets]
}

/** Affichage lisible : « 07 12 34 56 78 ». */
export function formatNationalNumber(input: string, countryCode: string = DEFAULT_COUNTRY): string {
  const national = toNationalNumber(input, countryCode)
  return national.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

export const OPERATOR_LABELS: Record<MobileMoneyOperator, string> = {
  ORANGE_MONEY: 'Orange Money',
  MTN_MOMO: 'MTN MoMo',
  MOOV_MONEY: 'Moov Money',
  WAVE: 'Wave',
}

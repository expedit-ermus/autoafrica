import { describe, it, expect } from 'vitest'
import { decodeVin, decodeModelYear } from './vin-decoder'

describe('VIN Decoder Module', () => {
  it('decodes a valid Toyota VIN correctly', () => {
    const result = decodeVin('JT2BF18V9M1234567')

    expect(result.valid).toBe(true)
    expect(result.brand).toBe('Toyota')
    expect(result.countryOfOrigin).toBe('Japon')
    expect(result.modelYear).toBe(2021)
    expect(result.wmi).toBe('JT2')
  })

  it('decodes a valid Peugeot VIN correctly', () => {
    const result = decodeVin('VF3DV6180P4567890')

    expect(result.valid).toBe(true)
    expect(result.brand).toBe('Peugeot')
    expect(result.countryOfOrigin).toBe('France')
    expect(result.modelYear).toBe(2023)
  })

  it('accepte un VIN ecrit avec separateurs ou en minuscules', () => {
    expect(decodeVin('jt2-bf18v9m12 34567').brand).toBe('Toyota')
  })

  /**
   * Le repli `WMI_MAP[wmi] || { brand: 'Toyota' }` attribuait Toyota a tout
   * vehicule non reference. C'est sur cette marque que la recherche de pieces
   * se serait appuyee : un proprietaire de Kia se serait vu proposer des
   * pieces Toyota (meme classe de defaut que D61).
   */
  it('n attribue aucune marque a un constructeur non reference', () => {
    const result = decodeVin('ZZZ99999999999999')

    expect(result.valid).toBe(true)
    expect(result.wmi).toBe('ZZZ')
    expect(result.brand).toBeUndefined()
    expect(result.countryOfOrigin).toBeUndefined()
  })

  it('rejects an invalid VIN length', () => {
    const result = decodeVin('TOO_SHORT')

    expect(result.valid).toBe(false)
    expect(result.brand).toBeUndefined()
  })

  /**
   * Un VIN invalide ressortait avec « Berline, 1.6L 4-Cyl, Essence,
   * Manuelle » : des caracteristiques completes pour une saisie que le code
   * venait de declarer invalide.
   */
  it('ne renvoie aucune caracteristique pour un VIN invalide', () => {
    const result = decodeVin('XX')

    expect(result.modelYear).toBeUndefined()
    expect(result.countryOfOrigin).toBeUndefined()
    expect(Object.keys(result)).toEqual(['vin', 'valid', 'wmi'])
  })

  /**
   * La carrosserie, la motorisation, le carburant et la boite etaient deduits
   * des caracteres 5 a 7 — le VDS, dont la signification est propre a chaque
   * constructeur et n'est normalisee par personne. Deux VIN ne differant que
   * par ces caracteres produisaient deux fiches techniques differentes,
   * inventees l'une comme l'autre.
   */
  it('ne deduit plus aucune fiche technique du VDS', () => {
    const avecD = decodeVin('JT2BD18V9M1234567')
    const avecX = decodeVin('JT2BX18V9M1234567')

    // Tout sauf le VIN lui-meme, qui differe par construction.
    const sansVin = ({ vin, ...reste }: ReturnType<typeof decodeVin>) => (void vin, reste)
    expect(sansVin(avecD)).toEqual(sansVin(avecX))
    for (const champ of ['bodyType', 'engine', 'fuel', 'gearbox']) {
      expect(avecD, champ).not.toHaveProperty(champ)
    }
  })
})

/**
 * Le 10e caractere designe l'annee-modele sur un cycle de trente ans : `A`
 * vaut 1980 comme 2010. La regle retenue prend l'annee du cycle courant et
 * retire trente ans si elle est dans le futur.
 */
describe('decodeModelYear', () => {
  const EN_2026 = 2026

  it('decode les annees du cycle courant', () => {
    expect(decodeModelYear('A', EN_2026)).toBe(2010)
    expect(decodeModelYear('M', EN_2026)).toBe(2021)
    expect(decodeModelYear('T', EN_2026)).toBe(2026)
  })

  it('recule d un cycle quand l annee serait dans le futur', () => {
    // V vaudrait 2027 : aucun vehicule d'occasion ne peut l'etre.
    expect(decodeModelYear('V', EN_2026)).toBe(1997)
    expect(decodeModelYear('Y', EN_2026)).toBe(2000)
    expect(decodeModelYear('1', EN_2026)).toBe(2001)
    expect(decodeModelYear('9', EN_2026)).toBe(2009)
  })

  // Le code se decalait auparavant sur `|| 2022`, une annee inventee pour
  // tout caractere hors table.
  it('ne renvoie aucune annee pour un code hors norme', () => {
    // I, O et Q sont absents du VIN ; U, Z et 0 ne servent pas de code d'annee.
    for (const code of ['I', 'O', 'Q', 'U', 'Z', '0', '-', '']) {
      expect(decodeModelYear(code, EN_2026), code).toBeUndefined()
    }
  })

  it('suit l annee courante plutot qu une borne figee', () => {
    // Un an plus tard, V devient decodable dans le cycle courant.
    expect(decodeModelYear('V', 2027)).toBe(2027)
  })
})

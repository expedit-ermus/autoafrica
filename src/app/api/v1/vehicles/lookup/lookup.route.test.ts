import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'
import { COUNTRY_PLATE_SPECS } from '@/modules/vehicles/license-plate.validator'

const SRC_ROOT = path.resolve(process.cwd(), 'src')

function requete(params: string) {
  return new NextRequest(`http://localhost:3000/api/v1/vehicles/lookup?${params}`)
}

/**
 * La recherche par plaque annoncait un service qui n'existe pas.
 *
 * La route servait `MOCK_VEHICLES`, six plaques ecrites en dur qui renvoyaient
 * une immatriculation complete — marque, modele, motorisation, couleur,
 * prochaine visite technique. Toute autre plaque repondait 404 « Cette
 * immatriculation n'est pas enregistree », ce qui laissait croire a un registre
 * consulte ou le vehicule manquerait. Aucun acces au registre national
 * n'existe.
 */
describe('GET /api/v1/vehicles/lookup — plaque', () => {
  /**
   * La Cote d'Ivoire a change de norme le 1er juin 2023 : `AA-123-AA` remplace
   * le `4 chiffres + 2 lettres + 2 chiffres` de 1997. Les anciennes plaques
   * restent valides et circulent : refuser l'une ou l'autre norme ecarte une
   * partie du parc.
   */
  it('accepte la norme ivoirienne en vigueur depuis juin 2023', async () => {
    const res = await GET(requete('plate=AB-123-CD&country=CI'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.plate).toBe('AB-123-CD')
    expect(data.isLegacy).toBe(false)
    expect(data.matchedNorm).toMatch(/2023/)
  })

  it('accepte aussi l ancienne norme, qui reste valide', async () => {
    const res = await GET(requete('plate=4550%20EG%2001&country=CI'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.plate).toBe('4550 EG 01')
    expect(data.isLegacy).toBe(true)
    expect(data.matchedNorm).toMatch(/1997/)
  })

  it('accepte la nouvelle norme saisie sans tirets', async () => {
    expect((await GET(requete('plate=AB%20123%20CD&country=CI'))).status).toBe(200)
  })

  it('indique toutes les normes acceptees quand la saisie est invalide', async () => {
    const data = await (await GET(requete('plate=NIMPORTEQUOI&country=CI'))).json()

    expect(data.details).toContain(COUNTRY_PLATE_SPECS.CI.formats[0].formatDescription)
    expect(data.sample).toBe(COUNTRY_PLATE_SPECS.CI.formats[0].sample)
    // L'ancienne norme doit apparaitre aussi : son porteur ne doit pas croire
    // que sa plaque n'est plus reconnue.
    expect(data.acceptedFormats).toHaveLength(2)
    expect(JSON.stringify(data.acceptedFormats)).toMatch(/1997/)
  })

  // Le format est bon et la demande a abouti : un 404 signifierait que le
  // vehicule manque d'un registre, et donnerait a penser qu'on l'a consulte.
  it('ne pretend pas consulter un registre', async () => {
    const res = await GET(requete('plate=1234%20AB%2001&country=CI'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.identified).toBe(false)
    expect(data.message).toMatch(/pas disponible/i)
    // Aucune caracteristique de vehicule n'est renvoyee.
    for (const champ of ['brand', 'model', 'year', 'engine', 'fuel', 'color', 'vin']) {
      expect(data, champ).not.toHaveProperty(champ)
    }
  })

  it('valide chaque pays sur chacun de ses formats officiels', async () => {
    for (const [code, spec] of Object.entries(COUNTRY_PLATE_SPECS)) {
      for (const format of spec.formats) {
        const res = await GET(requete(`plate=${encodeURIComponent(format.sample)}&country=${code}`))
        expect(res.status, `${code} — ${format.norm} — ${format.sample}`).toBe(200)
      }
    }
  })

  it('refuse un pays non pris en charge', async () => {
    expect((await GET(requete('plate=1234%20AB%2001&country=FR'))).status).toBe(400)
  })
})

describe('GET /api/v1/vehicles/lookup — VIN', () => {
  it('renvoie la marque et l annee quand le VIN les porte', async () => {
    const data = await (await GET(requete('vin=JT2BF18V9M1234567'))).json()

    expect(data.vehicle.brand).toBe('Toyota')
    expect(data.vehicle.year).toBe(2021)
  })

  /**
   * La route renvoyait `model: \`${brand} Series\`` — « Toyota Series » n'a
   * jamais designe un vehicule. Le modele commercial ne figure pas dans le VIN.
   */
  it('ne fabrique pas de modele a partir de la marque', async () => {
    const data = await (await GET(requete('vin=JT2BF18V9M1234567'))).json()

    expect(data.vehicle).not.toHaveProperty('model')
    expect(JSON.stringify(data)).not.toMatch(/Series/)
  })

  it('ne renvoie aucune fiche technique deduite du VDS', async () => {
    const data = await (await GET(requete('vin=JT2BF18V9M1234567'))).json()

    for (const champ of ['bodyType', 'engine', 'fuel', 'gearbox']) {
      expect(data.vehicle, champ).not.toHaveProperty(champ)
    }
  })

  // Une liste fixe de cinq categories etait renvoyee pour tout vehicule,
  // presentee comme recommandee pour lui.
  it('ne recommande pas de categories de pieces identiques pour tout vehicule', async () => {
    const data = await (await GET(requete('vin=JT2BF18V9M1234567'))).json()

    expect(data.vehicle).not.toHaveProperty('recommendedPartsCategories')
  })

  it('n attribue pas Toyota a un constructeur non reference', async () => {
    const data = await (await GET(requete('vin=ZZZ99999999999999'))).json()

    expect(data.vehicle).not.toHaveProperty('brand')
    expect(data.message).toMatch(/marque/i)
  })

  it('rejette un VIN de longueur invalide', async () => {
    expect((await GET(requete('vin=TROPCOURT'))).status).toBe(400)
  })
})

/**
 * Le format de plaque existait en trois copies : le module validateur,
 * `PLATE_PATTERNS` dans cette route, et `COUNTRIES` dans `VehiclePartsSearch`.
 *
 * Les deux dernieres portaient `AB-123-CD` — la norme entree en vigueur le
 * 1er juin 2023 — et le module validateur le format de 1997. Aucune des trois
 * n'avait entierement tort : chacune decrivait une norme reelle, et chacune
 * refusait les plaques de l'autre. C'est la dispersion qui faisait le defaut,
 * pas une valeur fausse. Une quatrieme copie la ferait revenir.
 */
describe('source unique du format de plaque', () => {
  function fichiersSource(dir: string): string[] {
    return readdirSync(dir).flatMap((entree) => {
      const complet = path.join(dir, entree)
      if (statSync(complet).isDirectory()) return fichiersSource(complet)
      return /\.tsx?$/.test(entree) && !/\.test\.tsx?$/.test(entree) ? [complet] : []
    })
  }

  it('inspecte reellement le code source', () => {
    expect(fichiersSource(SRC_ROOT).length).toBeGreaterThan(100)
  })

  /**
   * Signature d'une expression reguliere de plaque : une classe de lettres et
   * un quantificateur de chiffres dans le meme fichier. Le motif precedent
   * citait les deux ecritures connues en dur ; il aurait laissse passer une
   * troisieme ecriture de la meme regle.
   */
  it('seul le module validateur decrit un format de plaque', () => {
    const classeLettres = /\[A-Z\]\{\d/
    const quantificateurChiffres = /\\d\{\d/

    const porteurs = fichiersSource(SRC_ROOT)
      .filter((f) => {
        const source = readFileSync(f, 'utf8')
        return classeLettres.test(source) && quantificateurChiffres.test(source)
      })
      .map((f) => path.relative(SRC_ROOT, f).replace(/\\/g, '/'))

    expect(porteurs).toEqual(['modules/vehicles/license-plate.validator.ts'])
  })

  it('le formulaire ne porte plus sa propre liste de pays', () => {
    const composant = readFileSync(path.join(SRC_ROOT, 'components', 'VehiclePartsSearch.tsx'), 'utf8')

    expect(composant).toContain("from '@/modules/vehicles/license-plate.validator'")
    expect(composant).not.toMatch(/const COUNTRIES\s*=/)
  })
})

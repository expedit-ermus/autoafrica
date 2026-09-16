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
  it('accepte une plaque ivoirienne au format national reel', async () => {
    const res = await GET(requete('plate=1234%20AB%2001&country=CI'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.plate).toBe('1234 AB 01')
    expect(data.countryName).toBe("Côte d'Ivoire")
  })

  /**
   * La route attendait `AB-123-CD`, un format francais. Une plaque ivoirienne
   * reelle etait donc rejetee comme invalide, et le format invente accepte.
   */
  it('rejette le format francais qui etait attendu auparavant', async () => {
    const res = await GET(requete('plate=AB-123-CD&country=CI'))

    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/format/i)
  })

  it('indique le format attendu et un exemple quand la saisie est invalide', async () => {
    const data = await (await GET(requete('plate=NIMPORTEQUOI&country=CI'))).json()

    expect(data.details).toContain(COUNTRY_PLATE_SPECS.CI.formatDescription)
    expect(data.sample).toBe(COUNTRY_PLATE_SPECS.CI.sample)
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

  it('valide chaque pays sur son propre format officiel', async () => {
    for (const [code, spec] of Object.entries(COUNTRY_PLATE_SPECS)) {
      const res = await GET(requete(`plate=${encodeURIComponent(spec.sample)}&country=${code}`))
      expect(res.status, `${code} — ${spec.sample}`).toBe(200)
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
 * Les deux dernieres attendaient `AB-123-CD` pour la Cote d'Ivoire. Une
 * quatrieme copie ferait revenir la divergence.
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

  it('seul le module validateur decrit un format de plaque', () => {
    // Le motif ivoirien reel, sous ses deux ecritures possibles.
    const motifPlaque = /\\d\{4\}\s*\\s\?\[A-Z\]\{2\}|\[A-Z\]\{2\}-\\d\{3\}-\[A-Z\]\{2\}/

    const porteurs = fichiersSource(SRC_ROOT)
      .filter((f) => motifPlaque.test(readFileSync(f, 'utf8')))
      .map((f) => path.relative(SRC_ROOT, f).replace(/\\/g, '/'))

    expect(porteurs).toEqual(['modules/vehicles/license-plate.validator.ts'])
  })

  it('le formulaire ne porte plus sa propre liste de pays', () => {
    const composant = readFileSync(path.join(SRC_ROOT, 'components', 'VehiclePartsSearch.tsx'), 'utf8')

    expect(composant).toContain("from '@/modules/vehicles/license-plate.validator'")
    expect(composant).not.toMatch(/const COUNTRIES\s*=/)
  })
})

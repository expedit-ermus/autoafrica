import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { COUNTRY_PLATE_SPECS } from '@/modules/vehicles/license-plate.validator'

const mocks = vi.hoisted(() => ({
  optionalAuth: vi.fn(),
  findByPlate: vi.fn(),
}))

// Par defaut : visiteur non connecte. Les tests d'identification arment
// explicitement la session, ce qui garde visible la difference entre les deux.
vi.mock('@/modules/auth/auth.guard', () => ({ optionalAuth: mocks.optionalAuth }))
vi.mock('@/modules/vehicles/garage.service', () => ({
  garageService: { findByPlate: mocks.findByPlate },
}))

import { GET } from './route'

beforeEach(() => {
  // L'historique d'appels doit etre remis a zero, et pas seulement les valeurs
  // renvoyees : les assertions « n'a pas ete appele » compteraient sinon les
  // appels des tests precedents.
  vi.clearAllMocks()
  mocks.optionalAuth.mockResolvedValue(null)
  mocks.findByPlate.mockResolvedValue(null)
})

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

/**
 * Identification reelle par plaque, via le garage de l'utilisateur.
 *
 * Le registre national etant inaccessible, c'est l'acheteur qui declare sa
 * voiture. La route identifie alors depuis notre propre base — et seulement
 * dans le garage du demandeur.
 */
describe('GET /api/v1/vehicles/lookup — identification par le garage', () => {
  const vehicule = {
    id: 'g1',
    brandName: 'Kia',
    model: 'Sportage',
    year: 2019,
    fuel: 'DIESEL',
    gearbox: 'MANUAL',
    engine: '2.0 CRDi',
    nickname: null,
  }

  it('identifie le vehicule quand la plaque est au garage', async () => {
    mocks.optionalAuth.mockResolvedValue({ userId: 'user-1' })
    mocks.findByPlate.mockResolvedValue(vehicule)

    const data = await (await GET(requete('plate=AB-123-CD&country=CI'))).json()

    expect(data.identified).toBe(true)
    expect(data.source).toBe('GARAGE')
    expect(data.vehicle).toMatchObject({ brand: 'Kia', model: 'Sportage', year: 2019 })
  })

  /**
   * Le cloisonnement tient au service, mais la route doit lui passer le bon
   * identifiant : c'est ici qu'une confusion ouvrirait le garage d'autrui.
   *
   * L'identifiant est volontairement inhabituel. Ecrit `user-1`, il coincidait
   * avec la valeur qu'un code fautif aurait pu figer, et le test ne prouvait
   * plus rien — une mutation qui remplacait `auth.userId` par `'user-1'`
   * passait au vert.
   */
  it('ne cherche que dans le garage du demandeur', async () => {
    mocks.optionalAuth.mockResolvedValue({ userId: 'compte-du-demandeur-9f3a' })

    await GET(requete('plate=AB-123-CD&country=CI'))

    expect(mocks.findByPlate).toHaveBeenCalledWith('compte-du-demandeur-9f3a', 'AB-123-CD')
  })

  it('n interroge aucun garage pour un visiteur non connecte', async () => {
    const data = await (await GET(requete('plate=AB-123-CD&country=CI'))).json()

    expect(mocks.findByPlate).not.toHaveBeenCalled()
    expect(data.identified).toBe(false)
    // Le visiteur doit savoir quoi faire pour que sa plaque serve.
    expect(data.message).toMatch(/connectez-vous/i)
  })

  it('distingue une plaque absente du garage d une absence de session', async () => {
    mocks.optionalAuth.mockResolvedValue({ userId: 'user-1' })

    const data = await (await GET(requete('plate=AB-123-CD&country=CI'))).json()

    expect(data.identified).toBe(false)
    expect(data.message).toMatch(/pas dans votre garage/i)
    expect(data).not.toHaveProperty('vehicle')
  })

  // Un champ laisse vide au garage ne doit pas ressortir en null ni en valeur
  // par defaut : il est absent de la reponse (D61).
  it('omet les caracteristiques non renseignees', async () => {
    mocks.optionalAuth.mockResolvedValue({ userId: 'user-1' })
    mocks.findByPlate.mockResolvedValue({
      id: 'g2',
      brandName: 'Toyota',
      model: null,
      year: null,
      fuel: null,
      gearbox: null,
      engine: null,
      nickname: null,
    })

    const data = await (await GET(requete('plate=AB-123-CD&country=CI'))).json()

    expect(data.vehicle).toEqual({ id: 'g2', brand: 'Toyota' })
  })

  it('n identifie rien sur une plaque au format invalide', async () => {
    mocks.optionalAuth.mockResolvedValue({ userId: 'user-1' })

    const res = await GET(requete('plate=PASUNEPLAQUE&country=CI'))

    expect(res.status).toBe(400)
    expect(mocks.findByPlate).not.toHaveBeenCalled()
  })
})

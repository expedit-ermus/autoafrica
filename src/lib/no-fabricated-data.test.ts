import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC_ROOT = path.resolve(process.cwd(), 'src')

/**
 * D45, D46 et D47 posent qu'aucun chiffre ni libelle commercial ne doit etre
 * invente. La regle n'etait verifiee par rien, et des valeurs de repli
 * fabriquees etaient revenues un peu partout (D61) : note de 4,8, « 24 avis »,
 * marque « Toyota », etat « Neuf », categorie « Pieces Auto ».
 *
 * Le piege etait invisible a la lecture : `Product.rating` et
 * `Product.reviewCount` valent 0 par defaut au schema, si bien qu'un
 * `p.rating || 4.8` se declenchait exactement pour les pieces reellement
 * depourvues d'avis — donc pour tout le catalogue d'une marketplace qui demarre.
 *
 * Ce test interdit les substitutions par une valeur commerciale inventee.
 * Un repli neutre (`|| 0`, `|| ''`, `?? 0`) reste permis : il n'affirme rien.
 */
const REPLIS_INTERDITS: { motif: RegExp; explication: string }[] = [
  { motif: /\|\|\s*'Toyota'/, explication: "marque « Toyota » substituee a une marque absente" },
  { motif: /\|\|\s*\{\s*name:\s*'Toyota'/, explication: "objet marque « Toyota » invente" },
  { motif: /\|\|\s*'Pièces Auto'/, explication: "categorie « Pieces Auto » inventee" },
  { motif: /\|\|\s*'Neuf'/, explication: "etat « Neuf » affirme sans donnee (le defaut du schema est USED)" },
  { motif: /(rating|reviewCount)\s*(\|\||\?\?)\s*[1-9]/, explication: 'note ou nombre d\'avis fabrique' },
  { motif: /\|\|\s*4\.8/, explication: 'note 4,8 fabriquee' },
]

function fichiersSource(dir: string): string[] {
  return readdirSync(dir).flatMap((entree) => {
    const complet = path.join(dir, entree)
    if (statSync(complet).isDirectory()) return fichiersSource(complet)
    return /\.tsx?$/.test(entree) && !/\.test\.tsx?$/.test(entree) ? [complet] : []
  })
}

describe('aucune donnee commerciale inventee (D45/D46/D47)', () => {
  const fichiers = fichiersSource(SRC_ROOT)

  it('inspecte reellement le code source', () => {
    // Sans ce garde-fou, le test suivant passerait aussi si l'arborescence
    // changeait et que plus aucun fichier n'etait collecte.
    expect(fichiers.length).toBeGreaterThan(100)
  })

  it('ne substitue aucune valeur commerciale a une donnee absente', () => {
    const infractions: string[] = []

    for (const fichier of fichiers) {
      const lignes = readFileSync(fichier, 'utf8').split('\n')
      lignes.forEach((ligne, index) => {
        for (const { motif, explication } of REPLIS_INTERDITS) {
          if (motif.test(ligne)) {
            infractions.push(
              `${path.relative(process.cwd(), fichier)}:${index + 1} — ${explication}`
            )
          }
        }
      })
    }

    expect(infractions).toEqual([])
  })

  it('detecte reellement un repli fabrique', () => {
    const ligne = "    rating: p.rating || 4.8,"
    expect(REPLIS_INTERDITS.some(({ motif }) => motif.test(ligne))).toBe(true)

    const ligneNeutre = "    rating: p.rating ?? 0,"
    expect(REPLIS_INTERDITS.some(({ motif }) => motif.test(ligneNeutre))).toBe(false)

  })
})

/**
 * Disponibilite affirmee en dur.
 *
 * `availability` valait « InStock » sans condition dans le schema Produit
 * (corrige en D61) puis dans le schema Vehicule, ou un vehicule vendu restait
 * declare disponible aux moteurs de recherche.
 *
 * Toutes les valeurs en dur ne sont pas fautives : un plan d'abonnement SaaS
 * n'a pas de stock, il est reellement toujours disponible. La regle n'est donc
 * pas « jamais en dur » mais « jamais en dur sans raison ecrite ». Une ligne
 * portant le marqueur ci-dessous est acceptee, et la raison est lisible a
 * l'endroit exact ou la valeur est affirmee.
 */
const MARQUEUR_DISPONIBILITE_CONSTANTE = 'disponibilite-constante:'
const DISPONIBILITE_EN_DUR = /availability:\s*'https:\/\/schema\.org\/(InStock|LimitedAvailability)'/

describe('aucune disponibilite affirmee sans donnee', () => {
  const fichiers = fichiersSource(SRC_ROOT)

  it('ne declare une disponibilite constante qu avec une justification ecrite', () => {
    const infractions: string[] = []

    for (const fichier of fichiers) {
      const lignes = readFileSync(fichier, 'utf8').split('\n')
      lignes.forEach((ligne, index) => {
        if (!DISPONIBILITE_EN_DUR.test(ligne)) return
        // Fenetre volontairement courte : le marqueur doit se trouver sur la
        // ligne elle-meme ou juste au-dessus. Une justification unique en tete
        // de fichier couvrirait des affirmations qu'elle n'a pas examinees.
        const contexte = lignes.slice(Math.max(0, index - 1), index + 1).join('\n')
        if (contexte.includes(MARQUEUR_DISPONIBILITE_CONSTANTE)) return
        infractions.push(
          `${path.relative(process.cwd(), fichier)}:${index + 1} — disponibilite affirmee en dur sans justification`
        )
      })
    }

    expect(infractions).toEqual([])
  })

  it('detecte reellement une disponibilite non justifiee', () => {
    expect(DISPONIBILITE_EN_DUR.test("      availability: 'https://schema.org/InStock',")).toBe(true)
    expect(DISPONIBILITE_EN_DUR.test('      availability: LISTING_AVAILABILITY[input.listingStatus],')).toBe(false)
  })

  it('inspecte reellement le code source', () => {
    expect(fichiers.length).toBeGreaterThan(100)
  })
})

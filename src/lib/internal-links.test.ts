import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveBrand, resolveCategory } from './marketplace-catalog'

const SRC_ROOT = path.resolve(process.cwd(), 'src')

/**
 * Les articles du blog referencaient des slugs de categories inexistants
 * (`filtration`, `freinage`, `eclairage`, `transmission`). `/categories/[slug]`
 * appelle `notFound()` sur un slug inconnu : chaque lien renvoyait donc un 404,
 * depuis des pages indexees. Ce test verifie que tout lien interne vers une page
 * SEO de categorie ou de marque pointe vers une entree reelle du catalogue.
 */
function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) return collectSourceFiles(full)
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [full] : []
  })
}

// `(?<!images)` ecarte les chemins de vignettes `/images/categories/x.jpg`, qui
// ne sont pas des liens : sans cette exclusion, une image nommee d'apres une
// ancienne categorie serait signalee comme un lien mort.
function collectLinks(pattern: RegExp): { slug: string; file: string }[] {
  return collectSourceFiles(SRC_ROOT).flatMap((file) => {
    const matches = readFileSync(file, 'utf8').matchAll(pattern)
    return [...matches].map((m) => ({
      slug: m[1],
      file: path.relative(process.cwd(), file),
    }))
  })
}

describe('liens internes vers les pages SEO du catalogue', () => {
  it('inspecte reellement les liens du code source', () => {
    // Sans ce garde-fou, les deux tests suivants passeraient aussi si le
    // collecteur ne trouvait plus aucun lien (regex ou arborescence modifiee).
    expect(collectLinks(/(?<!images)\/categories\/([a-z0-9-]+)/g).length).toBeGreaterThan(20)
    expect(collectLinks(/\/marques\/([a-z0-9-]+)/g).length).toBeGreaterThan(20)
  })

  it('ne pointe vers aucune categorie inexistante', () => {
    const dead = collectLinks(/(?<!images)\/categories\/([a-z0-9-]+)/g).filter(
      ({ slug }) => !resolveCategory(slug)
    )

    expect(dead).toEqual([])
  })

  it('ne pointe vers aucune marque inexistante', () => {
    const dead = collectLinks(/\/marques\/([a-z0-9-]+)/g).filter(
      ({ slug }) => !resolveBrand(slug)
    )

    expect(dead).toEqual([])
  })

  it('ne declare aucun slug de categorie inconnu dans les grilles de navigation', () => {
    // `PartsCatalog` construit ses liens par template — `/categories/${cat.slug}` —
    // que la regex ci-dessus ne peut pas voir : ses douze slugs pointaient vers
    // l'ancienne taxonomie sans qu'aucun test ne s'en apercoive (D62). Les
    // composants qui declarent des slugs sont donc verifies a la source.
    const declares = collectSourceFiles(SRC_ROOT)
      .filter((f) => /PartsCatalog\.tsx$/.test(f))
      .flatMap((f) => {
        const matches = readFileSync(f, 'utf8').matchAll(/slug: '([a-z0-9-]+)'/g)
        return [...matches].map((m) => ({ slug: m[1], file: path.relative(process.cwd(), f) }))
      })

    expect(declares.length).toBeGreaterThan(5)
    expect(declares.filter(({ slug }) => !resolveCategory(slug))).toEqual([])
  })

  // Les vignettes de categorie etaient rendues sur `/images/categories/{slug}.jpg`.
  // Le realignement de la taxonomie (D62) a renomme les slugs sans renommer les
  // fichiers : six categories sur dix affichaient une image inexistante sur la
  // page d'accueil. Les chemins declares sont desormais verifies sur le disque.
  it('ne declare aucune image de categorie inexistante', () => {
    const source = readFileSync(path.join(SRC_ROOT, 'components', 'PartsCatalog.tsx'), 'utf8')
    const chemins = [...source.matchAll(/image: '(\/images\/[a-z0-9\/-]+\.jpg)'/g)].map((m) => m[1])

    expect(chemins.length).toBeGreaterThan(3)

    const manquantes = chemins.filter(
      (chemin) => !existsSync(path.join(process.cwd(), 'public', chemin))
    )

    expect(manquantes).toEqual([])
  })

  it('detecte reellement une image manquante', () => {
    expect(existsSync(path.join(process.cwd(), 'public', '/images/categories/moteur.jpg'))).toBe(true)
    expect(existsSync(path.join(process.cwd(), 'public', '/images/categories/electricite.jpg'))).toBe(false)
  })

  it('detecte reellement un slug absent du catalogue', () => {
    // `filtre` etait une categorie inventee pour le SEO, sans produit en base ;
    // elle a ete retiree quand la taxonomie a ete alignee sur la base (D62).
    expect(resolveCategory('filtre')).toBeUndefined()
    expect(resolveCategory('moteur')).toBeDefined()
  })
})

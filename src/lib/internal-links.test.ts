import { readFileSync, readdirSync, statSync } from 'node:fs'
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
    expect(collectLinks(/\/categories\/([a-z0-9-]+)/g).length).toBeGreaterThan(20)
    expect(collectLinks(/\/marques\/([a-z0-9-]+)/g).length).toBeGreaterThan(20)
  })

  it('ne pointe vers aucune categorie inexistante', () => {
    const dead = collectLinks(/\/categories\/([a-z0-9-]+)/g).filter(
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

  it('detecte reellement un slug absent du catalogue', () => {
    expect(resolveCategory('filtration')).toBeUndefined()
    expect(resolveCategory('filtre')).toBeDefined()
  })
})

import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { paymentProviders } from '@/modules/payments/providers/registry'

const SRC_ROOT = path.resolve(process.cwd(), 'src')

/**
 * Le site ne doit annoncer que les moyens de paiement qu'il encaisse.
 *
 * Quatre adaptateurs sont enregistres : Wave, Orange Money, MTN MoMo, Moov
 * Money. Le site en promettait davantage. `/aide`, `/tarifs`, le blog, la FAQ
 * des pages marque, le ChatBot et le pied de page affirmaient que les cartes
 * Visa et Mastercard etaient acceptees ; `/aide` promettait en outre le
 * paiement a la livraison. Aucun de ces moyens n'a d'adaptateur.
 *
 * Le panier allait plus loin qu'une promesse : il proposait « Djamo Visa » et
 * le mappait sur `CARD`. `paymentProviders.get('CARD')` leve « Moyen de
 * paiement non supporte » — l'acheteur qui choisissait Djamo ne payait pas, il
 * tombait sur une erreur.
 *
 * Meme classe de defaut que D64, D65 et D66 : le site affirmait ce qu'il ne
 * fait pas. Ici l'affirmation portait sur le moyen de paiement lui-meme, sur
 * des pages indexees.
 */
const METHODES_SERVIES = ['WAVE', 'ORANGE_MONEY', 'MTN_MOMO', 'MOOV_MONEY']

const METHODES_SANS_ADAPTATEUR = ['CARD', 'BANK_TRANSFER', 'CASH_ON_DELIVERY', 'CASH']

function fichiersSource(dir: string): string[] {
  return readdirSync(dir).flatMap((entree) => {
    const complet = path.join(dir, entree)
    if (statSync(complet).isDirectory()) return fichiersSource(complet)
    return /\.tsx?$/.test(entree) && !/\.test\.tsx?$/.test(entree) ? [complet] : []
  })
}

/**
 * Les commentaires sont ecartes : ceux qui expliquent le retrait nomment
 * necessairement ce qui a ete retire. Un test qui les lirait signalerait sa
 * propre documentation.
 */
function sansCommentaires(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
}

describe('moyens de paiement annonces', () => {
  it('le registre sert exactement les quatre Mobile Money', () => {
    expect(paymentProviders.list().map((p) => p.id).sort()).toEqual([...METHODES_SERVIES].sort())
  })

  it('aucun adaptateur ne repond pour la carte, le virement ou les especes', () => {
    for (const methode of METHODES_SANS_ADAPTATEUR) {
      expect(
        () => paymentProviders.get(methode),
        `${methode} ne doit pas etre servi`,
      ).toThrow(/non support/i)
    }
  })

  describe('ce que le code source annonce', () => {
    const fichiers = fichiersSource(SRC_ROOT)

    it('inspecte reellement le code source', () => {
      // Sans ce garde-fou, les tests suivants passeraient aussi si
      // l'arborescence changeait et que plus aucun fichier n'etait collecte.
      expect(fichiers.length).toBeGreaterThan(100)
    })

    const INTERDITS: { motif: RegExp; explication: string }[] = [
      { motif: /carte[s]?\s+bancaire/i, explication: 'la carte bancaire est annoncee' },
      { motif: /\bvisa\b/i, explication: 'Visa est annonce' },
      { motif: /\bmastercard\b/i, explication: 'Mastercard est annoncee' },
      { motif: /\bdjamo\b/i, explication: 'Djamo est annonce, sans adaptateur pour l encaisser' },
      { motif: /paiement\s+à\s+la\s+livraison\s+est\s+disponible/i, explication: 'le paiement a la livraison est promis' },
      { motif: /cash\s+on\s+delivery\s+is\s+available/i, explication: 'le paiement a la livraison est promis (EN)' },
    ]

    for (const { motif, explication } of INTERDITS) {
      it(`n annonce nulle part : ${explication}`, () => {
        const coupables = fichiers
          .filter((f) => motif.test(sansCommentaires(readFileSync(f, 'utf8'))))
          .map((f) => path.relative(process.cwd(), f))

        expect(coupables, explication).toEqual([])
      })
    }

    // Le defaut ne tenait pas qu'aux textes : le panier envoyait reellement
    // `CARD` a l'API. Ce test lit la table de correspondance et exige que
    // chaque valeur produite soit servie par le registre.
    it('le panier ne mappe que des methodes que le registre sert', () => {
      const panier = readFileSync(
        path.join(SRC_ROOT, 'app', 'dashboard', 'cart', 'page.tsx'),
        'utf8',
      )
      const table = panier.match(/METHODE_API:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\}/)
      expect(table, 'table METHODE_API introuvable').not.toBeNull()

      const methodes = [...table![1].matchAll(/:\s*'([A-Z_]+)'/g)].map((m) => m[1])
      expect(methodes.length, 'la table doit porter des methodes').toBeGreaterThan(0)

      for (const methode of methodes) {
        expect(() => paymentProviders.get(methode), `${methode} mappe par le panier`).not.toThrow()
      }
    })

    // `paymentAccepted` est lu par Google : y declarer la carte ou les especes
    // annoncait aux moteurs des moyens qu'aucun code n'honore.
    it('les donnees structurees ne declarent que les methodes servies', () => {
      const source = readFileSync(path.join(SRC_ROOT, 'lib', 'structured-data.ts'), 'utf8')
      const declare = source.match(/paymentAccepted:\s*'([^']+)'/)
      expect(declare, 'paymentAccepted introuvable').not.toBeNull()

      expect(declare![1]).toBe('Wave, Orange Money, MTN Mobile Money, Moov Money')
    })
  })
})

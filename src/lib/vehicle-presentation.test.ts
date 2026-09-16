import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  FUEL_LABELS,
  GEARBOX_LABELS,
  CONDITION_LABELS,
  libelle,
  formatPrix,
} from './vehicle-presentation';

describe('libelle', () => {
  it('traduit les valeurs connues des enums', () => {
    expect(libelle(FUEL_LABELS, 'DIESEL')).toBe('Diesel');
    expect(libelle(GEARBOX_LABELS, 'AUTOMATIC')).toBe('Automatique');
    expect(libelle(CONDITION_LABELS, 'CERTIFIED')).toBe('Occasion certifiée');
  });

  // Une valeur absente doit rester absente : l'appelant omet la ligne. Un
  // repli sur « Non precise » remplirait la fiche d'affirmations vides (D61).
  it('renvoie undefined sur une valeur absente, jamais un texte de repli', () => {
    expect(libelle(FUEL_LABELS, undefined)).toBeUndefined();
    expect(libelle(FUEL_LABELS, '')).toBeUndefined();
  });

  // Un carburant ajoute au schema Prisma sans etre ajoute ici doit se voir,
  // pas se fondre dans un « Autre » qui masquerait l'oubli.
  it('rend une valeur inconnue telle quelle plutot que de la ranger dans Autre', () => {
    expect(libelle(FUEL_LABELS, 'HYDROGEN')).toBe('HYDROGEN');
  });
});

describe('formatPrix', () => {
  it('affiche les francs CFA sous leur nom usuel', () => {
    expect(formatPrix(11500000, 'XOF')).toBe('11 500 000 FCFA');
  });

  it('conserve le code des autres devises', () => {
    expect(formatPrix(1000, 'EUR')).toBe('1 000 EUR');
  });

  it('formate zero sans le confondre avec une absence de prix', () => {
    expect(formatPrix(0, 'XOF')).toBe('0 FCFA');
  });
});

/**
 * Garde-fou de frontiere serveur/client.
 *
 * Ces fonctions vivaient dans `VehiculesFilters.tsx`, marque `'use client'`.
 * La fiche `/vehicules/[slug]` est un composant serveur : elle repondait 500
 * sur « Attempted to call formatPrix() from the server ». Le defaut n'a ete vu
 * qu'en rendant la page dans un vrai navigateur — les tests unitaires et les
 * E2E le manquaient, la vitrine etant vide, donc aucune fiche n'etait visitee.
 */
describe('frontiere serveur / client', () => {
  const lire = (relatif: string) =>
    readFileSync(path.resolve(process.cwd(), relatif), 'utf8');

  // C'est la directive en tete de fichier qui compte, pas le texte : ces
  // fichiers *parlent* de `'use client'` dans leurs commentaires, et une
  // recherche naive du mot passerait au vert sans rien verifier.
  const directiveClient = (contenu: string) =>
    /^['"]use client['"]/.test(contenu.trimStart());

  it('le module de mise en forme reste neutre', () => {
    expect(directiveClient(lire('src/lib/vehicle-presentation.ts'))).toBe(false);
  });

  it('la fiche vehicule ne prend aucune fonction au composant client', () => {
    const fiche = lire('src/app/(public)/vehicules/[slug]/page.tsx');

    expect(fiche).toContain("from '@/lib/vehicle-presentation'");
    // Seul le module neutre fournit les fonctions. Un import de valeurs depuis
    // `VehiculesFilters` ferait revenir le 500.
    expect(fiche).not.toMatch(/import\s*{[^}]*}\s*from\s*'@\/components\/VehiculesFilters'/);
  });

  it('le composant client ne reexporte pas ces fonctions', () => {
    const client = lire('src/components/VehiculesFilters.tsx');

    // Une reexportation rouvrirait le chemin : un module serveur pourrait de
    // nouveau importer `formatPrix` depuis un module `'use client'`.
    expect(directiveClient(client), 'le composant doit rester client').toBe(true);
    expect(client).not.toMatch(/export\s*{\s*[^}]*formatPrix/);
  });
});

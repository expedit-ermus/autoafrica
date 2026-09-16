/**
 * Mise en forme des champs vehicule, partagee par la grille (client) et la
 * fiche (serveur).
 *
 * Ces fonctions vivaient dans `VehiculesFilters.tsx`, marque `'use client'`.
 * La fiche `/vehicules/[slug]` est un composant serveur : appeler une fonction
 * exportee par un module client depuis le serveur leve
 * « Attempted to call formatPrix() from the server » et la page repondait 500.
 * Le module reste donc neutre — ni `'use client'`, ni acces a la base — pour
 * etre appelable des deux cotes.
 */

/**
 * Libelles des enums Prisma. Une valeur inconnue n'est pas traduite en
 * « Autre » : elle est rendue telle quelle, pour qu'un ajout au schema se voie
 * au lieu de se fondre dans une categorie fourre-tout.
 */
export const FUEL_LABELS: Record<string, string> = {
  DIESEL: 'Diesel',
  GASOLINE: 'Essence',
  HYBRID: 'Hybride',
  ELECTRIC: 'Électrique',
  LPG: 'GPL',
};

export const GEARBOX_LABELS: Record<string, string> = {
  MANUAL: 'Manuelle',
  AUTOMATIC: 'Automatique',
};

export const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Neuf',
  USED: 'Occasion',
  CERTIFIED: 'Occasion certifiée',
};

/**
 * Renvoie `undefined` — et non une chaine vide ou un tiret — quand la valeur
 * est absente : l'appelant omet la ligne plutot que d'afficher un champ vide
 * qui informerait moins que son absence (D61).
 */
export const libelle = (table: Record<string, string>, valeur?: string): string | undefined =>
  valeur ? table[valeur] ?? valeur : undefined;

export const formatPrix = (montant: number, devise: string): string =>
  `${montant.toLocaleString('fr-FR')} ${devise === 'XOF' ? 'FCFA' : devise}`;

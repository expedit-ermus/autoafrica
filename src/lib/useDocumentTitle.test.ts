import { describe, it, expect } from 'vitest';
import { buildDocumentTitle } from './useDocumentTitle';

describe('buildDocumentTitle', () => {
  it('prefisse le titre produit avec la marque', () => {
    expect(buildDocumentTitle('Plaquettes de frein Toyota', 'Marketplace | AutoAfrique')).toBe(
      'Plaquettes de frein Toyota | AutoAfrique',
    );
  });

  it('restaure le titre de la page quand aucun detail n est actif', () => {
    expect(buildDocumentTitle(null, 'Marketplace — Pièces détachées automobile | AutoAfrique')).toBe(
      'Marketplace — Pièces détachées automobile | AutoAfrique',
    );
  });

  it('gere un titre actif vide', () => {
    expect(buildDocumentTitle('', "Véhicules — Annonces Côte d'Ivoire | AutoAfrique")).toBe(
      "Véhicules — Annonces Côte d'Ivoire | AutoAfrique",
    );
  });
});

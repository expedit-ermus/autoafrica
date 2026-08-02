// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, renderHook } from '@testing-library/react';
import { buildDocumentTitle, useDocumentTitle } from './useDocumentTitle';

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

describe('useDocumentTitle', () => {
  afterEach(cleanup);

  it('applique le titre <detail> | AutoAfrique quand une modal est ouverte', () => {
    renderHook(() => useDocumentTitle('Toyota RAV4 2021', "Véhicules — Annonces Côte d'Ivoire | AutoAfrique"));
    expect(document.title).toBe('Toyota RAV4 2021 | AutoAfrique');
  });

  it('restaure le titre de la page quand aucun detail n est actif', () => {
    renderHook(() => useDocumentTitle(null, 'Marketplace — Pièces détachées automobile | AutoAfrique'));
    expect(document.title).toBe('Marketplace — Pièces détachées automobile | AutoAfrique');
  });

  it('met a jour le titre quand le detail change', () => {
    const { rerender } = renderHook(
      ({ active }) => useDocumentTitle(active, 'Marketplace | AutoAfrique'),
      { initialProps: { active: 'Produit A' } },
    );
    expect(document.title).toBe('Produit A | AutoAfrique');

    rerender({ active: 'Produit B' });
    expect(document.title).toBe('Produit B | AutoAfrique');
  });
});

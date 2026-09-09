import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BRAND_SLUGS, CATEGORY_SLUGS } from '@/lib/marketplace-catalog';

const mockPrisma = vi.hoisted(() => ({
  category: { findMany: vi.fn() },
  brand: { findMany: vi.fn() },
}));

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }));

import sitemap from '@/app/sitemap';

/**
 * Le sitemap ne doit annoncer a l'indexation que des pages qui portent quelque
 * chose. Il a deja derive deux fois : douze categories inventees (D62), puis
 * treize marques dont cinq sans stock. Ces tests fixent la regle.
 */
describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function urls(categories: string[], marques: string[]) {
    mockPrisma.category.findMany.mockResolvedValue(categories.map((slug) => ({ slug })));
    mockPrisma.brand.findMany.mockResolvedValue(marques.map((name) => ({ name })));
    const entrees = await sitemap();
    return entrees.map((e) => e.url);
  }

  it('n annonce que les categories qui ont du stock', async () => {
    const liens = await urls(['moteur', 'frein'], []);

    expect(liens).toContain('https://autoafrique-saas.vercel.app/categories/moteur');
    expect(liens).toContain('https://autoafrique-saas.vercel.app/categories/frein');
    for (const vide of ['pneumatique', 'direction', 'echappement', 'suspension']) {
      expect(liens, `categorie sans stock : ${vide}`).not.toContain(
        `https://autoafrique-saas.vercel.app/categories/${vide}`,
      );
    }
  });

  it('n annonce que les marques qui ont du stock', async () => {
    const liens = await urls([], ['Toyota', 'Peugeot']);

    expect(liens).toContain('https://autoafrique-saas.vercel.app/marques/toyota');
    expect(liens).toContain('https://autoafrique-saas.vercel.app/marques/peugeot');
    for (const vide of ['suzuki', 'ford', 'bmw', 'citroen', 'opel']) {
      expect(liens, `marque sans stock : ${vide}`).not.toContain(
        `https://autoafrique-saas.vercel.app/marques/${vide}`,
      );
    }
  });

  // Le filtre des pages marque s'applique par nom, pas par slug : la base porte
  // « Mercedes » quand l'URL porte « mercedes-benz » (D62). Un rapprochement
  // fait sur le slug ferait disparaitre cette marque du sitemap en silence.
  it('rapproche les marques par nom et non par slug', async () => {
    const liens = await urls([], ['Mercedes']);

    expect(liens).toContain('https://autoafrique-saas.vercel.app/marques/mercedes-benz');
  });

  // Les routes repondent 404 sur un slug absent des listes : une categorie
  // creee en base sans page dediee ne doit pas entrer au sitemap.
  it('n annonce pas une categorie de la base qui n a pas de page', async () => {
    const liens = await urls(['moteur', 'categorie-sans-page'], ['Marque Sans Page']);

    expect(liens).not.toContain('https://autoafrique-saas.vercel.app/categories/categorie-sans-page');
    expect(liens.filter((u) => u.includes('/marques/'))).toHaveLength(0);
  });

  // Garde-fou du garde-fou : si le sitemap cessait de produire des URL, ou si
  // les listes de reference se vidaient, les assertions « ne contient pas »
  // passeraient toutes sans rien prouver.
  it('produit bien un sitemap non vide adosse a des listes non vides', async () => {
    const liens = await urls(
      CATEGORY_SLUGS.map((c) => c.slug),
      BRAND_SLUGS.map((b) => b.name),
    );

    expect(CATEGORY_SLUGS.length).toBeGreaterThan(5);
    expect(BRAND_SLUGS.length).toBeGreaterThan(5);
    expect(liens.length).toBeGreaterThan(20);
    expect(liens.filter((u) => u.includes('/categories/'))).toHaveLength(CATEGORY_SLUGS.length);
    expect(liens.filter((u) => u.includes('/marques/'))).toHaveLength(BRAND_SLUGS.length);
    expect(new Set(liens).size, 'aucune URL en double').toBe(liens.length);
  });
});

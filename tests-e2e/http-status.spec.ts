import { test, expect } from '@playwright/test';

/**
 * Verifie que les routes dynamiques renvoient un vrai 404 sur un slug inconnu.
 *
 * Les six familles renvoyaient 200 avec la page « Page introuvable » — des soft
 * 404 que Google traite comme des pages a explorer. La cause etait un
 * `loading.tsx` par segment : il cree une frontiere Suspense, la reponse part en
 * flux, et le statut est emis avant que le corps de page n'appelle `notFound()`
 * (D60). Reintroduire un `loading.tsx` sur l'un de ces segments — ou sur un
 * segment parent, ce qui suffit — ferait silencieusement revenir le defaut.
 *
 * Le code HTTP est le seul verdict : la page rendue est identique dans les deux
 * cas, seul le statut distingue une impasse d'une page a indexer.
 */
const SLUGS_INCONNUS = [
  '/categories/slug-inexistant-pour-test',
  '/marques/slug-inexistant-pour-test',
  '/marketplace/categorie/slug-inexistant-pour-test',
  '/marketplace/marque/slug-inexistant-pour-test',
  '/catalogue/slug-inexistant-pour-test',
  '/pieces/slug-inexistant-pour-test',
];

const PAGES_VALIDES = [
  '/catalogue',
  '/catalogue/frein',
  '/categories/filtre',
  '/categories/carrosserie',
  '/marques/toyota',
  '/marketplace/categorie/frein',
  '/marketplace/marque/peugeot',
];

test('un slug inconnu renvoie 404 sur toutes les routes dynamiques', async ({ request }) => {
  const soft404: string[] = [];

  for (const route of SLUGS_INCONNUS) {
    const reponse = await request.get(route, { failOnStatusCode: false });
    if (reponse.status() !== 404) {
      soft404.push(`${route} → ${reponse.status()}`);
    }
  }

  expect(soft404, 'routes renvoyant autre chose qu\'un 404').toEqual([]);
});

test('les pages de catalogue valides restent en 200', async ({ request }) => {
  const enPanne: string[] = [];

  for (const route of PAGES_VALIDES) {
    const reponse = await request.get(route, { failOnStatusCode: false });
    if (reponse.status() !== 200) {
      enPanne.push(`${route} → ${reponse.status()}`);
    }
  }

  expect(enPanne, 'pages valides ne renvoyant pas 200').toEqual([]);
});

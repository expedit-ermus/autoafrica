import { test, expect } from '@playwright/test';
import { SEED_SELLER_EMAIL, login } from './helpers/session';

/**
 * Verifie que chaque ecran du dashboard se rend sans erreur client.
 *
 * `/dashboard/inventory` deballait mal les reponses paginees de l'API : la
 * `TypeError` levee au rendu faisait basculer l'ecran entier dans le filet
 * d'erreur global, et personne ne l'avait vu. Ce parcours couvre cette classe
 * de panne sur l'ensemble des ecrans plutot que sur le seul qui a ete corrige.
 */
const SELLER_ROUTES = [
  '/dashboard',
  '/dashboard/analytics',
  '/dashboard/cart',
  '/dashboard/containers',
  '/dashboard/crm',
  '/dashboard/customs',
  '/dashboard/delivery',
  '/dashboard/finance',
  '/dashboard/help',
  '/dashboard/inventory',
  '/dashboard/marketplace',
  '/dashboard/notifications',
  '/dashboard/orders',
  '/dashboard/parts-search',
  '/dashboard/payments',
  '/dashboard/profile',
  '/dashboard/purchase-orders',
  '/dashboard/settings',
  '/dashboard/suppliers',
  '/dashboard/vehicles',
];

/** Textes affiches par le filet d'erreur global lorsqu'un rendu echoue. */
const ERROR_BOUNDARY = /Réessayer|Une erreur est survenue/i;

test('chaque ecran du dashboard se rend sans erreur client', async ({ page }) => {
  test.setTimeout(180000);

  const clientErrors: string[] = [];
  page.on('pageerror', (error) => clientErrors.push(error.message));

  await login(page, SEED_SELLER_EMAIL);

  const broken: string[] = [];
  for (const route of SELLER_ROUTES) {
    clientErrors.length = 0;
    await page.goto(route, { waitUntil: 'domcontentloaded' });

    // On collecte plutot que d'echouer a la premiere route : un seul passage
    // doit rapporter tous les ecrans en panne, pas seulement le premier.
    const heading = page.getByRole('heading', { level: 1 }).first();
    await heading.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {
      broken.push(`${route} : aucun h1 visible`);
    });

    const body = await page.locator('body').innerText();
    if (ERROR_BOUNDARY.test(body)) broken.push(`${route} : filet d'erreur global affiche`);
    if (clientErrors.length > 0) broken.push(`${route} : ${clientErrors[0]}`);
  }

  expect(broken).toEqual([]);
});

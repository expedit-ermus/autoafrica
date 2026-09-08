import { expect, type Page } from '@playwright/test';

/**
 * Comptes issus de `prisma/seed.ts` — le script qui a reellement peuplé la base
 * de developpement (`prisma/seed.mjs`, vise par `npm run db:seed`, decrit un
 * tout autre jeu de comptes qui n existe pas en base).
 */
export const SEED_PASSWORD = 'Password123!';
export const SEED_SELLER_EMAIL = 'vendeur.abidjan@autoafrique.com';
export const SEED_BUYER_EMAIL = 'acheteur.koffi@gmail.com';

/**
 * Adresse unique par execution : les flux critiques ecrivent dans la base de
 * developpement, les jeux de donnees ne doivent donc jamais entrer en collision
 * entre deux passages ni entre deux workers Playwright.
 */
export function uniqueSuffix(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${uniqueSuffix()}@e2e.autoafrique.test`;
}

/**
 * Enregistre un choix de cookies avant tout rendu. Sans cela le bandeau de
 * consentement, fixe en bas de fenetre, recouvre les boutons de bas de page et
 * intercepte les clics (notamment la validation du paiement).
 */
export async function skipCookieBanner(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'autoafrique_cookie_consent_v1',
      JSON.stringify({ essential: true, analytics: true, marketing: true, decidedAt: new Date().toISOString() }),
    );
  });
}

/** Connexion par le formulaire, jusqu'a la redirection hors de /auth/login. */
export async function login(page: Page, email: string, password: string = SEED_PASSWORD): Promise<void> {
  await skipCookieBanner(page);
  await page.goto('/auth/login');
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/login'), { timeout: 20000 });
}

/**
 * Verifie qu'une session est bien active : une route protegee doit s'afficher
 * sans etre renvoyee vers /auth/login par le middleware.
 */
export async function expectAuthenticated(page: Page, path = '/dashboard/orders'): Promise<void> {
  await page.goto(path);
  await expect(page).not.toHaveURL(/\/auth\/login/);
}

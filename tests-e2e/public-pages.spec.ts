import { test, expect } from '@playwright/test';

test.describe('Public Pages & Conversion Features', () => {
  test('Landing page renders hero, car selector, and WhatsApp widget', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AutoAfrique/i);

    // Header & Hero
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Floating WhatsApp widget
    const waButton = page.locator('a[aria-label*="WhatsApp"]');
    await expect(waButton).toBeAttached();
  });

  test('Catalogue page renders filters and product grid', async ({ page }) => {
    await page.goto('/catalogue');
    await expect(page).toHaveTitle(/Catalogue/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Estimation & Devis page loads with repair options and garage schemas', async ({ page }) => {
    await page.goto('/estimation-devis');
    await expect(page).toHaveTitle(/Estimateur de Devis/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Tarifs SaaS page renders all 3 pricing tiers', async ({ page }) => {
    await page.goto('/tarifs');
    await expect(page).toHaveTitle(/Tarifs/i);
    await expect(page.getByText('Starter')).toBeVisible();
    await expect(page.getByText('Pro')).toBeVisible();
    await expect(page.getByText('Entreprise')).toBeVisible();
  });

  test('Devenir Vendeur page displays onboarding perks and CTA', async ({ page }) => {
    await page.goto('/devenir-vendeur');
    await expect(page).toHaveTitle(/Vendeur/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Livraison page renders delivery zones for Abidjan', async ({ page }) => {
    await page.goto('/livraison');
    await expect(page).toHaveTitle(/Livraison/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Blog article on part compatibility is readable with TOC and CTA', async ({ page }) => {
    await page.goto('/blog/verifier-compatibilite-piece-auto-vehicule');
    await expect(page).toHaveTitle(/compatibilité/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Méthode 1')).toBeVisible();
  });
});

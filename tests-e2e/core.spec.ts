import { test, expect } from '@playwright/test';

test('landing page (R001) renders the brand H1 and is indexable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AutoAfrique/);
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toContainText('AutoAfrique');
});

test('marketplace page (R005) loads with its metadata and grid', async ({ page }) => {
  await page.goto('/dashboard/marketplace');
  await expect(page).toHaveTitle('Marketplace — Pièces détachées automobile | AutoAfrique');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Marketplace');
});

test('vehicles page (R017) is indexable with its title', async ({ page }) => {
  await page.goto('/dashboard/vehicles');
  await expect(page).toHaveTitle("Véhicules — Annonces Côte d'Ivoire | AutoAfrique");
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('unknown route (R206) returns the custom FR 404', async ({ page }) => {
  const response = await page.goto('/route-inexistante-xyz');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('Page introuvable')).toBeVisible();
});

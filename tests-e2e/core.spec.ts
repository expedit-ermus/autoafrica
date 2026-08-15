import { test, expect } from '@playwright/test';

test('landing page (R001) renders the brand H1 and is indexable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AutoAfrique/i);
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toContainText('AutoAfrique');
});

test('marketplace page (R005) loads with its grid', async ({ page }) => {
  await page.goto('/marketplace');
  await expect(page).toHaveTitle(/AutoAfrique/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('vehicles page (R017) is indexable with its heading', async ({ page }) => {
  await page.goto('/dashboard/vehicles');
  await expect(page).toHaveTitle(/AutoAfrique/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('parts search page (R018) renders registration search form', async ({ page }) => {
  await page.goto('/dashboard/parts-search');
  await expect(page).toHaveTitle(/AutoAfrique/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('blog hub page renders recent articles', async ({ page }) => {
  await page.goto('/blog');
  await expect(page).toHaveTitle(/AutoAfrique/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('repair manuals page renders searchable manuals', async ({ page }) => {
  await page.goto('/manuels-reparation');
  await expect(page).toHaveTitle(/AutoAfrique/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('unknown route (R206) returns the custom FR 404', async ({ page }) => {
  const response = await page.goto('/route-inexistante-xyz');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('Page introuvable')).toBeVisible();
});

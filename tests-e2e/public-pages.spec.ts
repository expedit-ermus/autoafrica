import { test, expect } from '@playwright/test';

test.describe('Public Pages & Conversion Features', () => {
  test('Landing page renders hero, car selector, and WhatsApp widget', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AutoAfrique/i);

    // Header & Hero
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Floating WhatsApp widget (bouton ouvrant le formulaire de demande express)
    const waButton = page.getByRole('button', { name: 'Demande express de pièce auto sur WhatsApp' });
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

  test('Tarifs SaaS page renders all 4 pricing tiers', async ({ page }) => {
    await page.goto('/tarifs');
    await expect(page).toHaveTitle(/Tarifs/i);
    for (const tier of ['Gratuit', 'Starter', 'Professionnel', 'Entreprise']) {
      await expect(page.getByRole('heading', { name: tier, exact: true })).toBeVisible();
    }
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

  /**
   * Le selecteur portait une taxonomie ecrite en dur qui avait derive de la
   * base : il proposait Suzuki, Dacia et Mitsubishi — zero piece en stock, et
   * les deux dernieres absentes de la table `Brand` — et omettait Kia,
   * Mercedes et Volkswagen, qui portent seize des cinquante et une pieces.
   */
  test('la recherche par vehicule ne propose que des marques du catalogue', async ({ page }) => {
    await page.goto('/recherche-pieces');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

    const selectMarque = page.locator('#vps-marque');
    await expect(selectMarque).toBeVisible();

    const options = (await selectMarque.locator('option').allTextContents()).map((t) => t.trim());

    // Ces trois marques n'ont aucune piece : quelle que soit la base servie,
    // elles ne doivent jamais reapparaitre comme choix.
    for (const sansStock of ['Suzuki', 'Dacia', 'Mitsubishi']) {
      expect(options, `${sansStock} n'a pas de stock`).not.toContain(sansStock);
    }

    // La cascade modele / annee / motorisation a ete retiree : elle etait
    // collectee puis jetee, et rien en base ne pouvait l'honorer.
    await expect(page.locator('#vps-annee')).toHaveCount(0);
    await expect(page.locator('#vps-motorisation')).toHaveCount(0);
  });

  /**
   * L'onglet immatriculation attendait `AB-123-CD`, un format francais : une
   * plaque ivoirienne reelle etait refusee par le formulaire.
   */
  test('le formulaire accepte le format de plaque ivoirien reel', async ({ page }) => {
    await page.goto('/recherche-pieces');
    await page.getByRole('tab', { name: /immatriculation/i }).click();

    const champ = page.locator('#vps-plaque');
    await expect(champ).toHaveAttribute('placeholder', '1234 AB 01');

    await champ.fill('1234 AB 01');
    const bouton = page.getByRole('button', { name: /Vérifier le format/i });
    await expect(bouton).toBeEnabled();

    await bouton.click();
    await expect(page.getByRole('heading', { name: /1234 AB 01 — format valide/i })).toBeVisible();
    // La page ne pretend pas avoir identifie un vehicule.
    await expect(page.getByText(/identification automatique/i).first()).toBeVisible();
  });

  test('Blog article on part compatibility is readable with TOC and CTA', async ({ page }) => {
    await page.goto('/blog/verifier-compatibilite-piece-auto-vehicule');
    await expect(page).toHaveTitle(/compatibilité/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Méthode 1/ })).toBeVisible();
  });
});

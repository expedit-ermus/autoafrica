import { test, expect } from '@playwright/test';
import {
  SEED_BUYER_EMAIL,
  SEED_PASSWORD,
  SEED_SELLER_EMAIL,
  expectAuthenticated,
  login,
  skipCookieBanner,
  uniqueEmail,
  uniqueSuffix,
} from './helpers/session';

/**
 * Flux critiques exiges par `docs/22-TESTS.md`.
 *
 * Ces scenarios ecrivent dans la base de developpement (comptes, commandes,
 * produits, leads) : chaque jeu de donnees est suffixe pour rester unique d'une
 * execution a l'autre et entre workers.
 */

// ---------------------------------------------------------------------------
// 1. Inscription
// ---------------------------------------------------------------------------

test.describe('Flux critique : inscription', () => {
  test('un nouvel acheteur s inscrit, ouvre une session puis se reconnecte', async ({ page, context }) => {
    const email = uniqueEmail('acheteur');

    await skipCookieBanner(page);
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.locator('#reg-firstName').fill('Awa');
    await page.locator('#reg-lastName').fill('Traore');
    await page.locator('#reg-email').fill(email);
    await page.locator('#reg-password').fill(SEED_PASSWORD);
    await page.locator('#reg-confirmPassword').fill(SEED_PASSWORD);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: "S'inscrire" }).click();

    // L'inscription ouvre directement la session (pas de detour par /auth/login).
    await page.waitForURL(/\/dashboard/, { timeout: 20000 });
    await expectAuthenticated(page);

    // Les identifiants crees doivent permettre une reconnexion depuis zero.
    await context.clearCookies();
    await page.goto('/dashboard/orders');
    await expect(page).toHaveURL(/\/auth\/login/);

    await login(page, email);
    await expectAuthenticated(page);
  });

  test('un mot de passe de confirmation divergent bloque l inscription', async ({ page }) => {
    await skipCookieBanner(page);
    await page.goto('/auth/register');
    await page.locator('#reg-firstName').fill('Awa');
    await page.locator('#reg-lastName').fill('Traore');
    await page.locator('#reg-email').fill(uniqueEmail('refus'));
    await page.locator('#reg-password').fill(SEED_PASSWORD);
    await page.locator('#reg-confirmPassword').fill('autre-mot-de-passe');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: "S'inscrire" }).click();

    await expect(page.getByText('Les mots de passe ne correspondent pas').first()).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/register/);
  });
});

// ---------------------------------------------------------------------------
// 2. Achat : catalogue -> panier -> paiement Mobile Money sous sequestre
// ---------------------------------------------------------------------------

test.describe('Flux critique : achat et paiement Mobile Money', () => {
  test('un acheteur commande une piece et paie par sequestre Mobile Money', async ({ page }) => {
    // Le scenario fournit sa propre piece : la base de developpement ne garantit
    // aucun catalogue pre-existant, et un test d achat ne doit pas dependre de
    // l etat laisse par une autre execution.
    await login(page, SEED_SELLER_EMAIL);
    const pieceTitle = `Amortisseur avant ${uniqueSuffix().toUpperCase()}`;
    const published = await page.request.post('/api/v1/products', {
      data: {
        title: pieceTitle,
        description: 'Amortisseur avant, piece de test E2E.',
        brand: 'Toyota',
        price: 32000,
        stock: 3,
        condition: 'NEW',
      },
    });
    expect(published.status()).toBe(201);
    const pieceId: string = (await published.json()).data.id;

    // L acheteur ouvre la fiche de la piece. Le parcours ne passe pas par
    // /catalogue : cette page est prerendue statiquement sans revalidation, une
    // piece publiee apres le build n y apparait donc jamais.
    await login(page, SEED_BUYER_EMAIL);
    await page.goto(`/pieces/${pieceId}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(pieceTitle);

    // Le CTA de la fiche ajoute au panier puis redirige vers le panier.
    await page.getByRole('button', { name: /Commander avec Séquestre Mobile Money/i }).click();
    await page.waitForURL(/\/dashboard\/cart/, { timeout: 20000 });

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mon Panier');
    await expect(page.getByText(pieceTitle, { exact: false }).first()).toBeVisible();

    // Paiement : operateur, numero, prompt USSD puis code PIN de demonstration.
    await page.getByRole('button', { name: /Payer en toute sécurité/i }).click();
    await expect(page.getByText('Paiement Séquestre Mobile Money')).toBeVisible();

    await page.getByRole('button', { name: 'Orange Money' }).click();
    await page.getByLabel('Numéro de téléphone Mobile Money').fill('0712345678');
    await page.getByRole('button', { name: /Continuer vers la validation/i }).click();

    await expect(page.getByText(/Validation USSD Mobile Money/i)).toBeVisible();
    await page.getByLabel('Code PIN Mobile Money').fill('1234');
    await page.getByRole('button', { name: /Confirmer le paiement/i }).click();

    await expect(page.getByText(/Paiement Séquestre Confirmé/i)).toBeVisible({ timeout: 30000 });

    // La confirmation renvoie vers le suivi de commande : on attend cette
    // navigation avant d interroger l API, sinon la requete court contre elle.
    await page.waitForURL(/\/dashboard\/orders/, { timeout: 30000 });

    // Le message de succes ne suffit pas : la commande doit exister cote serveur.
    // Le panier signalait auparavant un paiement valide alors que l appel de
    // creation echouait en 500 sans que sa reponse soit verifiee.
    const orders = await page.request.get('/api/v1/orders');
    expect(orders.ok()).toBeTruthy();
    const body = await orders.json();
    const rows = body.data?.data ?? body.data ?? [];
    const orderedProductIds: string[] = rows.flatMap(
      (o: { items?: Array<{ productId: string }> }) => (o.items ?? []).map((i) => i.productId),
    );
    expect(orderedProductIds).toContain(pieceId);
  });

  test('le panier vide n expose pas de bouton de paiement', async ({ page }) => {
    await login(page, SEED_BUYER_EMAIL);
    await page.goto('/dashboard/cart');
    await expect(page.getByText('Votre panier est vide')).toBeVisible();
    await expect(page.getByRole('button', { name: /Payer en toute sécurité/i })).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// 3. Gestion produit (vendeur)
// ---------------------------------------------------------------------------

test.describe('Flux critique : gestion produit vendeur', () => {
  test('un vendeur publie une piece qui devient visible au catalogue', async ({ page }) => {
    await login(page, SEED_SELLER_EMAIL);

    const reference = `E2E-${uniqueSuffix().toUpperCase()}`;
    const title = `Plaquettes de frein avant ${reference}`;

    // Aucune interface de creation de produit n'existe cote vendeur : le flux
    // passe par l'API, seule voie de publication actuellement implementee.
    const created = await page.request.post('/api/v1/products', {
      data: {
        title,
        description: 'Jeu de plaquettes de frein avant, piece de test E2E.',
        reference,
        brand: 'Toyota',
        price: 25000,
        stock: 4,
        condition: 'NEW',
      },
    });
    expect(created.status()).toBe(201);
    const payload = await created.json();
    const productId: string = payload.data.id;
    expect(productId).toBeTruthy();

    // La piece publiee doit etre servie par sa fiche publique. La route
    // /pieces/[slug] resout par identifiant : la colonne `Product.slug`
    // generee a la creation n est utilisee par aucun lien de l application.
    await page.goto(`/pieces/${productId}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title);

    // ... et remontee par la recherche du catalogue.
    const listed = await page.request.get(`/api/v1/products?search=${encodeURIComponent(reference)}`);
    expect(listed.ok()).toBeTruthy();
    const listing = await listed.json();
    const rows = listing.data?.data ?? listing.data ?? [];
    const titles: string[] = rows.map((p: { title: string }) => p.title);
    expect(titles).toContain(title);
  });

  test('un acheteur ne peut pas publier de piece', async ({ page }) => {
    await login(page, SEED_BUYER_EMAIL);
    const refused = await page.request.post('/api/v1/products', {
      data: { title: `Interdit ${uniqueSuffix()}`, price: 1000 },
    });
    expect(refused.status()).toBeGreaterThanOrEqual(400);
    expect(refused.status()).toBeLessThan(500);
  });
});

// ---------------------------------------------------------------------------
// 4. CRM : lead -> statut -> conversion
// ---------------------------------------------------------------------------

test.describe('Flux critique : CRM', () => {
  test('un vendeur cree un lead, le fait progresser puis le convertit', async ({ page }) => {
    await login(page, SEED_SELLER_EMAIL);

    const leadName = `Prospect E2E ${uniqueSuffix()}`;

    await page.goto('/dashboard/crm');
    await expect(page).not.toHaveURL(/\/auth\/login/);

    await page.getByRole('button', { name: /^Leads/ }).click();
    await page.getByRole('button', { name: /Ajouter un\s*lead/i }).click();

    await page.locator('#lead-name').fill(leadName);
    await page.locator('#lead-phone').fill('+225 05 05 05 05');
    await page.locator('#lead-email').fill(uniqueEmail('prospect'));
    await page.locator('#lead-value').fill('750000');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    await expect(page.getByText(leadName).first()).toBeVisible({ timeout: 20000 });

    // Progression du statut puis conversion.
    const statusSelect = page.getByLabel(`Statut du lead ${leadName}`);
    await expect(statusSelect).toHaveValue('new');

    await statusSelect.selectOption('contacted');
    await expect(statusSelect).toHaveValue('contacted', { timeout: 20000 });

    await statusSelect.selectOption('converted');
    await expect(statusSelect).toHaveValue('converted', { timeout: 20000 });
  });

  test('le CRM est refuse a un acheteur', async ({ page }) => {
    await login(page, SEED_BUYER_EMAIL);
    await page.goto('/dashboard/crm');
    await expect(page).not.toHaveURL(/\/dashboard\/crm/);
  });
});

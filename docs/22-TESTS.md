# Tests

## Types de tests

### Tests unitaires
- Outils : Vitest
- Couverture : fonctions utilitaires, hooks, composants isolés
- Objectif : > 80% couverture

### Tests d'integration
- Outils : Vitest + Testing Library
- Composants avec providers (i18n, auth)
- Interactions utilisateur

### Tests E2E
- Outils : Playwright
- Flux critiques

### Tests visuels
- Outils : Storybook + Chromatic (optionnel)
- Regressions visuelles

## Flux critiques a tester

### Inscription
1. Remplir formulaire inscription
2. Soumettre
3. Redirection vers login
4. Connexion avec nouveaux identifiants
5. Acces au dashboard

### Achat
1. Rechercher produit
2. Ajouter au panier
3. Voir panier
4. Passer commande
5. Payer par Mobile Money
6. Confirmation

### Gestion produit (vendeur)
1. Creer produit
2. Remplir formulaire
3. Upload images
4. Publier
5. Apparait dans catalogue

### CRM
1. Creer lead
2. Modifier statut
3. Convertir en client
4. Voir dans liste clients

## Couverture des flux critiques

Les quatre flux ci-dessus sont couverts par `tests-e2e/critical-flows.spec.ts`
(helpers de session dans `tests-e2e/helpers/session.ts`). Les scenarios creent
leurs propres donnees : la base de developpement ne garantit aucun catalogue ni
compte prealable.

Depuis D55, les quatre parcours sont pilotes entierement par l interface :

- **Gestion produit** : la publication passe par la modale « Publier une piece »
  de `/dashboard/inventory` (R006), puis la piece est recherchee au catalogue et
  ouverte sur sa fiche publique.
- **CRM** : la conversion d un lead cree un client, verifie dans l onglet
  Contacts.

`tests-e2e/dashboard-smoke.spec.ts` charge en outre les vingt ecrans du
dashboard et verifie, pour chacun, la presence d un h1 visible, l absence
d erreur client et l absence du filet d erreur global (cf. D58).

## Tests de non-regression

### Pages
- Landing : affichage, navigation, CTA
- Marketplace : filtres, recherche, pagination
- Dashboard : sidebar, navigation
- Auth : login, register, erreurs

### API
- Auth : login, register, me
- Products : CRUD, recherche
- Orders : CRUD, status
- Payments : creation, statut

## Scripts

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

## CI/CD

### GitHub Actions
- Lint au push
- Typecheck au push
- Tests unitaires au push
- Tests E2E au merge sur main
- Build verification avant deploy

### Coverage minimum
- Instructions : > 80%
- Branches : > 70%
- Functions : > 80%
- Lines : > 80%

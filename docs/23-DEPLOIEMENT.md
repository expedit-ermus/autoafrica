# Deploiement

## Environnements

| Environnement | URL | Branche | Usage |
|---------------|-----|---------|-------|
| Production | autoafrique-saas.vercel.app | main | Utilisateurs finaux |
| Preview | [preview-url].vercel.app | PR branches | Review avant merge |
| Local | localhost:3000 | - | Developpement |

## Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 16.2.9 | Framework |
| React | 19.1.0 | UI |
| TypeScript | 5.8.3 | Typage |
| Tailwind CSS | 4.2.1 | Styling |
| Prisma | 7.8.0 | ORM |
| SQLite (libSQL) | - | Base de donnees |
| Vercel | - | Hebergement |

## Pipeline CI/CD

### GitHub Actions — verification uniquement

`.github/workflows/ci-cd.yml` s'execute sur les push vers `main` et sur les pull requests. Cinq jobs, tous bloquants :

| Job | Ce qu'il verifie |
|-----|------------------|
| `lint` | `npx eslint` |
| `typecheck` | `npx tsc --noEmit` |
| `build` | `prisma db push` puis `npm run build` |
| `unit-tests` | `prisma db push` puis `npx vitest run` |
| `e2e` | `prisma db push`, `db:seed:accounts`, `npm run build`, `npx playwright test` |

`build` et `unit-tests` creent le schema de base parce que `/catalogue` interroge le catalogue au prerendu et que `audit.service.test.ts` s'execute contre une vraie base (cf. D58). Les traces Playwright sont publiees en artefact quand un test echoue.

**Cette chaine ne deploie pas.** Un job `deploy` a existe, appelant `amondnet/vercel-action@v25` avec les secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID` — jamais renseignes dans le depot. Il echouait en 0 s sur « Input required and not supplied: vercel-token », masque par `continue-on-error`, et n'a jamais rien deploye. Retire en D63.

### Deploiement Vercel

Le deploiement est assure par **l'integration GitHub native de Vercel** : chaque push sur `main` produit un deploiement de production, chaque push sur une branche de pull request un deploiement preview.

Elle ne consulte pas GitHub Actions. Un code dont les tests echouent partira donc quand meme en production : la CI signale, elle ne bloque pas. Retablir un couplage tests-avant-deploiement demanderait de renseigner les trois secrets, de remettre un job de deploiement, et de desactiver l'auto-deploiement Vercel sur `main`.

```bash
# Deploiement manuel, si besoin
npx vercel --prod --yes

# Deploiement preview
npx vercel --yes
```

## Variables d'environnement

### Production (Vercel)

| Variable | Valeur | Securite |
|----------|--------|----------|
| DATABASE_URL | file:./prod.db | Production |
| JWT_SECRET | [secret] | Production |
| NEXTAUTH_SECRET | [secret] | Production |

### Base de donnees persistante (Turso/libSQL — optionnel)

Par defaut la production utilise une SQLite ephemere (`file:./prod.db`) reinitialisee a chaque deploiement. Pour une base persistante gratuite (Turso) :

1. Creer un compte et une base sur https://turso.tech (plan gratuit : 500 bases, 5 Go / base).
2. Recuperer l'URL (`libsql://<slug>.turso.io`) et generer un token.
3. Pousser le schema vers la base distante :

```bash
DATABASE_URL="libsql://<slug>.turso.io" TURSO_AUTH_TOKEN="<token>" npm run db:push
```

4. (Optionnel) Alimenter la base distante avec les donnees de demo :

```bash
DATABASE_URL="libsql://<slug>.turso.io" TURSO_AUTH_TOKEN="<token>" npm run db:seed
```

5. Mettre a jour les variables Vercel :

| Variable | Valeur | Securite |
|----------|--------|----------|
| DATABASE_URL | libsql://<slug>.turso.io | Production |
| TURSO_AUTH_TOKEN | [token Turso] | Production |

Le client (`src/lib/prisma.ts`) detecte automatiquement une URL distante (`libsql://`, `wss://`, `https://`) et utilise `TURSO_AUTH_TOKEN` ; le chemin local `file:` reste inchange.

### Development (.env.local)

| Variable | Valeur |
|----------|--------|
| DATABASE_URL | file:./dev.db |
| JWT_SECRET | dev-secret |
| NEXTAUTH_SECRET | dev-secret |

## Database

### Migrations

```bash
# Generer migration
npx prisma migrate dev --name [name]

# Appliquer migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

### Seed

Deux scripts complementaires, a ne pas confondre :

| Script | Commande | Contenu |
|--------|----------|---------|
| `prisma/seed.ts` | `npm run db:seed:accounts` | Tenant, comptes et profils vendeur/acheteur uniquement. Aucun produit. |
| `prisma/seed.mjs` | `npm run db:seed:demo` (alias historique : `npm run db:seed`) | Jeu de demonstration complet : catalogue, commandes, finances. Donnees commerciales fictives, reservees au developpement (cf. D43) ; le script refuse une base distante sauf `SEED_ALLOW_REMOTE=1`. |

Une base alimentee par `db:seed:accounts` seul possede des comptes mais un
catalogue vide : lancer aussi `db:seed:demo` pour disposer de produits.

```bash
npm run db:seed:accounts
npm run db:seed:demo
```

## Monitoring

### Vercel Dashboard
- Analytics (Web Vitals)
- Speed Insights
- Edge function logs
- Function invocations

### Logs
- Console logs en development
- Error tracking en production

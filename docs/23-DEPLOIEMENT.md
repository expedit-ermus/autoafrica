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

### GitHub Actions

```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:run

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
```

### Deploiement Vercel

```bash
# Deploiement manuel
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

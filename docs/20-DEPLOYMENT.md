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

```bash
npx tsx prisma/seed.ts
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

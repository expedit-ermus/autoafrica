# AutoAfrique — SaaS ERP Marketplace Pièces Automobiles

## Présentation

AutoAfrique est la première plateforme ERP Marketplace dédiée aux pièces détachées automobile en Afrique de l'Ouest. Elle connecte vendeurs, acheteurs et garagistes dans 10 pays avec paiements Mobile Money.

## Objectifs

1. Gérer l'inventaire de pièces automobiles en temps réel
2. Permettre la vente en ligne avec paiements sécurisés (Orange Money, MTN MoMo, Wave)
3. Offrir un CRM intégré pour la gestion client
4. Gérer la chaîne d'approvisionnement (fournisseurs, conteneurs, douanes)
5. Fournir des analytics et rapports financiers

## Stack

- **Framework** : Next.js 16.2.9
- **Langage** : TypeScript 5
- **CSS** : Tailwind CSS 4
- **Base de données** : SQLite (via libSQL)
- **ORM** : Prisma 7.8.0
- **Authentification** : JWT (jsonwebtoken) + httpOnly cookies
- **Hébergement** : Vercel
- **Tracking** : Google Analytics 4 (à configurer)
- **CMP** : À définir

## Installation

```bash
git clone https://github.com/expedit-ermus/autoafrica.git
cd autoafrique-saas
npm install
cp .env.example .env.local
npx prisma generate
npx prisma db push
npm run dev
```

## Variables d'environnement

Copier `.env.example` vers `.env.local`.

Ne jamais versionner les valeurs réelles.

## Commandes

```bash
npm run dev        # Développement
npm run lint       # Lint
npm run build      # Build production
npm run start      # Démarrer en production
```

## Documentation

Lire `AGENTS.md` avant toute modification.

La documentation détaillée est disponible dans `/docs`.

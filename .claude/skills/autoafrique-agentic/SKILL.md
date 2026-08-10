---
name: autoafrique-agentic
description: |
  Audit, développement agentique et bonnes pratiques pour le projet AutoAfrique (ERP SaaS + Marketplace Pièces Auto Afrique de l'Ouest).
  À utiliser lors du développement de nouvelles routes, composants UI, balisages SEO/JSON-LD, intégrations Mobile Money (Orange, MTN, Wave, Moov),
  ou lors d'audits de performance, d'accessibilité et de sécurité sur le projet AutoAfrique.
license: MIT
metadata:
  author: AutoAfrique Engineering
  version: "1.0.0"
---

# AutoAfrique — Développement Agentique (Modules IA 7 & 8)

Ce skill formalise la méthodologie agentique appliquée au projet **AutoAfrique SaaS & Marketplace**, combinant la boucle agentique (`observer → décider → exécuter → vérifier`), l'utilisation des serveurs MCP (Notion, Chrome DevTools, Search Console, Analytics) et le respect des 24 modules du Cahier des Charges (`/docs`).

---

## 🔁 Boucle Agentique Obligatoire

1. **Observer** : Consulter l'arborescence, lire la documentation de référence dans `/docs` (ex: `02-ROUTES.md`, `06-SEO.md`, `11-MOBILE-MONEY.md`, `18-DATABASE.md`) et inspecter l'état du code.
2. **Décider** : Formuler une approche conforme aux spécifications métier sans improviser de nouvelles routes ou de fausses données.
3. **Exécuter** : Écrire du code TypeScript strict, réutiliser les composants du Design System et les adaptateurs existants.
4. **Vérifier** : Exécuter la chaîne de contrôle qualité (`npm run typecheck`, `npm run test`, `npm run build`).

---

## 📋 Méthode Avant Développement

Avant toute modification importante :
1. **Source de vérité** : Vérifier le document fonctionnel concerné dans `/docs/`.
2. **Routes & Composants** : Identifier les chemins impactés et les composants du Design System (`src/components/ui/`).
3. **Structured Data** : Définir le balisage Schema.org (`BreadcrumbList`, `Product`, `Vehicle`, `FAQPage`, `Organization`).
4. **Garde-fous Sécurité & Anti-factices** :
   - Jamais de fausses données, faux avis ou faux témoignages.
   - Pas de clés exposées côté client (`NEXT_PUBLIC_` uniquement si non sensible).

---

## ✅ Méthode Après Développement (Definition of Done)

Toute tâche est validée uniquement si les contrôles suivants réussissent :
```bash
# 1. Vérification TypeScript sans émission de fichiers
npm run typecheck

# 2. Exécution de la suite de tests unitaires & d'intégration Vitest (287/287 PASS)
npm run test

# 3. Validation de la compilation Next.js & Turbopack
npm run build
```

---

## 🛠️ Intégration des Serveurs MCP (Model Context Protocol)

- **MCP Notion** (`https://mcp.notion.com/mcp` ou `@notionhq/notion-mcp-server`) : Utilisé pour lire et mettre à jour la documentation du projet et la cartographie des routes sur l'espace Notion officiel.
- **MCP Search Console & Analytics** : Utilisé pour mesurer le trafic réel, les positions moyennes et le comportement utilisateur post-déploiement.
- **MCP Chrome DevTools / Playwright** : Utilisé pour auditer l'accessibilité (WCAG 2.1 AA), les cibles tactiles (>= 44px) et le rendu responsive (Mobile 360px, Desktop 1440px).

---

## 🔒 Principes du Moindre Privilège & Sécurité

- **Secrets** : Stockés dans `.env.local` et variables Vercel — **jamais dans Git**.
- **Paiements Mobile Money** : Validation stricte des numéros (masques `CI`, `SN`, `ML`, `BF`, `BJ`, `TG`, `GH`, `NG`), plafonds FCFA et simulation sécurisée des webhooks/USSD.

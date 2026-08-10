# Instructions pour les agents de développement

## Objectif

Construire et maintenir le site AutoAfrique en respectant strictement les documents du dossier `/docs`.

L'agent ne doit pas improviser une architecture, une route, une fonctionnalité, une donnée, un témoignage ou une règle métier absente de la documentation.

## Architecture Agentique (Modules IA 7 & 8)

Ce projet applique les principes d'IA agentique formalisés dans le support de consolidation (Modules IA 7 & 8) :
- **Boucle Agentique** : `Observer → Décider → Exécuter → Vérifier`.
- **Skill dédié** : `.claude/skills/autoafrique-agentic/SKILL.md` (Contrat procédural et règles de développement).
- **Serveurs MCP** : Notion (`@notionhq/notion-mcp-server`), Search Console, Analytics, Chrome DevTools.
- **Principe du Moindre Privilège** : Clés API et secrets uniquement dans `.env.local` et Vercel (jamais dans le code source).
- **Notion Sync** : Les mises à jour de documentation et cartographie de routes sont synchronisées avec la page Notion officielle.


## Ordre de lecture obligatoire

1. `docs/00-VISION.md`
2. `docs/01-ARCHITECTURE.md`
3. `docs/02-ROUTES.md`
4. `docs/03-PAGES.md`
5. `docs/04-DESIGN-SYSTEM.md`
6. `docs/05-UX-ACCESSIBILITY.md`
7. `docs/06-SEO.md`
8. `docs/07-CRAWL-INDEXATION.md`
9. `docs/08-STRUCTURED-DATA.md`
10. `docs/09-TRACKING.md`
11. `docs/10-AUTHENTIFICATION.md`
12. `docs/11-MOBILE-MONEY.md`
13. `docs/12-MARKETPLACE.md`
14. `docs/13-ERP.md`
15. `docs/14-CRM.md`
16. `docs/15-CATALOGUE.md`
17. `docs/16-PRODUITS.md`
18. `docs/17-IMAGES-MEDIA.md`
19. `docs/18-DATABASE.md`
20. `docs/19-API.md`
21. `docs/20-SECURITY.md`
22. `docs/21-PERFORMANCE.md`
23. `docs/22-TESTS.md`
24. `docs/23-DEPLOIEMENT.md`
25. `docs/README.md`
26. `docs/DECISIONS.md`

## Sources de vérité

- Les routes sont définies exclusivement dans `02-ROUTES.md`.
- Les modèles de pages sont définis dans `03-PAGES.md`.
- Les composants visuels sont définis dans `04-DESIGN-SYSTEM.md`.
- Les règles d'accessibilité sont définies dans `05-UX-ACCESSIBILITY.md`.
- Les règles SEO, de crawl et d'indexation sont définies dans `06-SEO.md`, `07-CRAWL-INDEXATION.md` et `08-STRUCTURED-DATA.md`.
- Les événements de tracking sont définis dans `09-TRACKING.md`.
- L'authentification est définie dans `10-AUTHENTIFICATION.md`.
- Les paiements Mobile Money sont définis dans `11-MOBILE-MONEY.md`.
- Le marketplace, l'ERP, le CRM, le catalogue et les produits sont définis dans `12-MARKETPLACE.md`, `13-ERP.md`, `14-CRM.md`, `15-CATALOGUE.md` et `16-PRODUITS.md`.
- Les règles images et médias sont définies dans `17-IMAGES-MEDIA.md`.
- Les modèles de données sont définis dans `18-DATABASE.md`.
- Les API sont définies exclusivement dans `19-API.md`.
- Les règles de gestion des erreurs sont définies dans `19-API.md`.
- Les règles de sécurité sont définies dans `20-SECURITY.md`.
- Les budgets de performance sont définis dans `21-PERFORMANCE.md`.
- Les critères de validation sont définis dans `22-TESTS.md`.
- Les règles de déploiement sont définies dans `23-DEPLOIEMENT.md`.
- Les règles d'internationalisation sont définies dans `03-PAGES.md` (section Internationalisation).

## Interdictions

- Ne créer aucune route non documentée.
- Ne supprimer aucune route sans consigne explicite.
- Ne créer aucun faux témoignage.
- Ne créer aucun faux avis.
- Ne créer aucun faux client.
- Ne créer aucune fausse certification.
- Ne créer aucun faux chiffre.
- Ne créer aucune image trompeuse.
- Ne pas utiliser de Lorem Ipsum dans une version livrable.
- Ne pas exposer un secret dans le code client.
- Ne pas ajouter de dépendance sans justification.
- Ne pas dupliquer un composant existant.
- Ne pas modifier une règle métier sans mettre à jour la documentation.
- Ne pas déclarer une tâche terminée tant que les tests échouent.

## Gestion des contradictions

En cas de contradiction :

1. Ne pas choisir arbitrairement ;
2. Identifier précisément les documents contradictoires ;
3. Appliquer en priorité la source de vérité indiquée dans ce fichier ;
4. Documenter la décision dans `DECISIONS.md` ;
5. Signaler la contradiction dans le compte rendu.

## Méthode avant développement

Avant toute modification importante :

1. Résumer les exigences comprises ;
2. Lister les routes concernées ;
3. Lister les composants concernés ;
4. Identifier les données attendues ;
5. Identifier les événements de tracking ;
6. Identifier les règles SEO et d'indexation ;
7. Identifier les risques de sécurité ;
8. Identifier les tests à exécuter.

## Méthode après développement

Après la modification :

1. Exécuter le lint ;
2. Exécuter la vérification TypeScript ;
3. Exécuter les tests unitaires ;
4. Exécuter les tests d'intégration ;
5. Exécuter les tests E2E concernés ;
6. Exécuter le build de production ;
7. Vérifier les erreurs console ;
8. Vérifier les statuts HTTP ;
9. Vérifier les métadonnées ;
10. Vérifier le tracking ;
11. Vérifier les performances ;
12. Mettre à jour les documents concernés.

## Images

Avant d'ajouter une image, lire `docs/17-IMAGES-MEDIA.md` (budgets, optimisation, texte alternatif) et `docs/21-PERFORMANCE.md` (budgets de performance).

L'agent doit :

- Réutiliser les composants d'image prévus par le projet ;
- Générer ou utiliser des tailles responsives ;
- Respecter les budgets de poids ;
- Fournir une largeur et une hauteur ;
- Distinguer l'image LCP des images différées ;
- Ne jamais inventer un texte alternatif générique ;
- Ne jamais intégrer une image distante non validée ;
- Ne jamais intégrer directement un fichier source inutilement lourd ;
- Ne jamais générer une fausse preuve visuelle.

## Definition of Done globale

Une tâche est terminée uniquement si :

- Elle correspond aux documents fonctionnels ;
- Elle respecte les routes prévues ;
- Elle fonctionne sur mobile et desktop ;
- Elle est accessible au clavier ;
- Ses règles SEO sont respectées ;
- Son tracking est correct ;
- Ses états de chargement, vide et erreur sont présents ;
- Les tests concernés réussissent ;
- Le build de production réussit ;
- La documentation est à jour.

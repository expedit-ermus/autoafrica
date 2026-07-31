# Instructions pour les agents de développement

## Objectif

Construire et maintenir le site AutoAfrique en respectant strictement les documents du dossier `/docs`.

L'agent ne doit pas improviser une architecture, une route, une fonctionnalité, une donnée, un témoignage ou une règle métier absente de la documentation.

## Ordre de lecture obligatoire

1. `docs/00-PROJECT-BRIEF.md`
2. `docs/01-USERS-AND-GOALS.md`
3. `docs/02-INFORMATION-ARCHITECTURE.md`
4. `docs/03-ROUTES-MATRIX.md`
5. `docs/04-PAGE-SPECS.md`
6. `docs/05-DESIGN-SYSTEM.md`
7. `docs/06-UX-ACCESSIBILITY.md`
8. `docs/07-SEO-CONTENT.md`
9. `docs/08-CRAWL-INDEXATION.md`
10. `docs/09-STRUCTURED-DATA.md`
11. `docs/10-TRACKING-PLAN.md`
12. `docs/11-PRIVACY-CONSENT.md`
13. `docs/12-PERFORMANCE-BUDGET.md`
14. `docs/13-SECURITY.md`
15. `docs/14-TECHNICAL-ARCHITECTURE.md`
16. `docs/15-TESTS-ACCEPTANCE.md`
17. `docs/16-DEPLOYMENT-MONITORING.md`
18. `docs/17-IMAGES-MEDIA.md`
19. `docs/DECISIONS.md`

## Sources de vérité

- Les routes sont définies exclusivement dans `03-ROUTES-MATRIX.md`.
- Les modèles de pages sont définis dans `04-PAGE-SPECS.md`.
- Les composants visuels sont définis dans `05-DESIGN-SYSTEM.md`.
- Les règles d'accessibilité sont définies dans `06-UX-ACCESSIBILITY.md`.
- Les règles SEO éditoriales sont définies dans `07-SEO-CONTENT.md`.
- Les règles de crawl et d'indexation sont définies dans `08-CRAWL-INDEXATION.md`.
- Les schémas JSON-LD sont définis dans `09-STRUCTURED-DATA.md`.
- Les événements sont définis exclusivement dans `10-TRACKING-PLAN.md`.
- Les règles de consentement sont définies dans `11-PRIVACY-CONSENT.md`.
- Les budgets de performance sont définis dans `12-PERFORMANCE-BUDGET.md`.
- Les règles de sécurité sont définies dans `13-SECURITY.md`.
- Les critères de validation sont définis dans `15-TESTS-ACCEPTANCE.md`.
- Les règles applicables aux images sont définies dans `17-IMAGES-MEDIA.md`.

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

Avant d'ajouter une image, lire `docs/17-IMAGES-MEDIA.md`.

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

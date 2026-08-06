# Vision du projet

## Nom du projet

AutoAfrique

## Entreprise

AutoAfrique — Plateforme SaaS ERP Marketplace pour pièces détachées automobile en Afrique de l'Ouest.

## Offre

- **Marketplace** : Achat/vente de pièces détachées (Toyota, Hyundai, Kia, Peugeot, Mercedes, Renault)
- **ERP** : Gestion d'inventaire, stocks, entrepôts
- **CRM** : Gestion clients, leads, interactions
- **Paiements** : Orange Money, MTN MoMo, Wave, Moov Money, Visa, Mastercard
- **Logistique** : Suivi livraisons, routes, flotte
- **Finance** : Comptabilité, facturation, rapports
- **Approvisionnement** : Fournisseurs, commandes, conteneurs, douanes

## Problème résolu

En Afrique de l'Ouest, une grande partie des pièces automobiles se vendent dans les marchés en plein air, sans garantie, sans traçabilité, et souvent à prix surélevé. Les garagistes perdent du temps à chercher ce qu'une plateforme pourrait traiter en quelques secondes.

## Proposition de valeur

- Catalogue de pièces détachées neuves et d'occasion contrôlée (volume communiqué avant la mise en production)
- Paiement Mobile Money sécurisé
- Livraison en 24-72h dans 10 pays
- CRM intégré
- Gestion multi-entrepôts
- Analytics en temps réel

## Positionnement

- **Premium** : Solution professionnelle complète
- **Local** : Adaptée au contexte africain (FCFA, Mobile Money)
- **Innovant** : ERP + Marketplace + CRM intégrés

## Zone géographique

Afrique de l'Ouest : Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée-Bissau, Nigeria, Ghana

## Langues

- Français : **Langue principale**
- Anglais : **Supporté**

## Objectifs commerciaux

1. Générer des inscriptions de vendeurs et acheteurs
2. Permettre les ventes en ligne avec paiements Mobile Money
3. Fournir un ERP complet pour la gestion des stocks
4. Offrir un CRM pour la fidélisation client
5. Générer du chiffre d'affaires via les abonnements (SaaS)

## Objectifs de communication

- Faire comprendre l'offre sur le marché africain
- Rassurer sur la sécurité des paiements
- Démontrer la facilité d'utilisation
- Répondre aux objections (fiabilité, livraison, prix)
- Faire progresser l'utilisateur vers l'inscription

## Conversions principales

- Inscription vendeur (`/auth/register`)
- Inscription acheteur (`/auth/register`)
- Achat sur la marketplace
- Souscription abonnement SaaS

## Micro-conversions

- Clic sur "Trouver une pièce"
- Clic sur "Ouvrir ma boutique"
- Consultation d'un produit
- Ajout au panier
- Démarrage d'un formulaire

## Indicateurs de réussite

- Nombre d'inscriptions mensuelles
- Nombre de produits listés
- Volume de transactions (FCFA)
- Taux de conversion landing → inscription
- Core Web Vitals (LCP, INP, CLS)
- Taux de satisfaction client

## Périmètre inclus

- Landing page e-commerce
- Authentification (login/register)
- Dashboard vendeur/acheteur
- Marketplace avec recherche
- Gestion d'inventaire
- Panier et commandes
- Paiements Mobile Money
- CRM (clients, leads)
- Analytics
- Administration
- API REST v1

## Hors périmètre

- Application mobile native
- Paiement par crypto-monnaie
- Livraison drone
- Intelligence artificielle avancée
- Multi-langues (au-delà du FR/EN)

## Contraintes

- Mobile first
- Accessible (WCAG 2.1 AA)
- Compatible avec le tracking GA4
- Conforme au RGPD
- Administrable via dashboard
- Performant (LCP < 2.5s)
- Sécurisé (JWT, rate limiting)
- Explorable et indexable (SEO)

## Date cible

Déploiement initial : **En cours**

## Parties prenantes

| Rôle | Nom | Responsabilité |
|------|-----|----------------|
| Sponsor | Expedit Ermus | Vision produit |
| Product Owner | Expedit Ermus | Décisions produit |
| Développeur | Expedit Ermus | Implémentation |

---

# Utilisateurs et objectifs

## Persona 1 : Moussa — Garagiste Toyota à Abidjan

### Situation
Garagiste spécialisé Toyota à Yopougon, Abidjan. Gère un atelier de 3 mécaniciens. Perd des heures par semaine à chercher des pièces entre Adjamé et le Marché Sandaga.

### Niveau de connaissance
Intermédiaire — utilise Facebook et WhatsApp quotidiennement, peu familier avec les ERP.

### Besoins
- Trouver rapidement des pièces Toyota (Hilux, Corolla, Land Cruiser)
- Payer par Orange Money ou MTN MoMo
- Recevoir les pièces en 24-72h
- Avoir un historique des commandes

### Questions principales
- La pièce est-elle compatible avec mon véhicule ?
- Quel est le prix réel (pas de négociation) ?
- Quand sera-t-elle livrée ?
- Puis-je payer par Mobile Money ?

### Objections
- "Les sites en ligne ne livrent pas à Abidjan"
- "J'ai déjà mes fournisseurs habituels"
- "Comment savoir si la pièce est authentique ?"

### Tâche principale
Trouver et commander une pièce de rechange pour un véhicule client.

### Conversion attendue
Achat sur la marketplace ou inscription comme vendeur.

### Informations nécessaires avant conversion
- Catalogue de pièces avec prix
- Délais de livraison
- Moyens de paiement acceptés
- Avis d'autres garagistes
- Politique de retour

### Risques UX
- Trop de jargon technique
- Formulaire d'inscription trop long
- Prix cachés ou frais imprévus
- Manque de preuves de fiabilité

---

## Persona 2 : Abdoulaye — Revendeur de pièces Peugeot à Dakar

### Situation
Revendeur de pièces Peugeot (307, 406, 206) à Dakar. A un hangar rempli de 300+ pièces qui prennent la poussière.

### Niveau de connaissance
Intermédiaire — utilise WhatsApp Business pour ses ventes.

### Besoins
- Écouler son stock stagnant
- Atteindre des clients dans d'autres pays (Mali, Gambie)
- Gérer ses ventes et inventaire
- Recevoir les paiements via MTN MoMo

### Questions principales
- Comment mettre mes pièces en ligne ?
- Combien ça coûte ?
- Comment je suis payé ?
- Comment je gère les livraisons ?

### Objections
- "Je ne suis pas doué avec la technologie"
- "Mes clients sont à Dakar, pas en ligne"
- "Les frais de commission sont-ils élevés ?"

### Tâche principale
Inscrire son shop et publier ses pièces en vente.

### Conversion attendue
Inscription vendeur + publication de produits.

### Informations nécessaires avant conversion
- Processus d'inscription simple
- Tutoriel de publication de produits
- Tarification transparente
- Témoignages d'autres vendeurs

### Risques UX
- Interface trop complexe pour un non-technique
- Manque de support en français
- Processus de vérification trop long

---

## Persona 3 : Fatima — Gérante garage Hyundai à Bamako

### Situation
Gère un garage Hyundai à Bamako (Tucson, Santa Fe, Accent). Problème principal : les paiements en cash.

### Niveau de connaissance
Débutant — utilise principalement son téléphone.

### Besoins
- Recevoir les paiements avant la livraison
- Gérer ses commandes simplement
- Avoir un suivi des livraisons
- Éviter les impayés

### Questions principales
- Comment le client paie-t-il ?
- Comment suis-je informée d'une commande ?
- Puis-je suivre la livraison ?
- Comment gérer un problème ?

### Objections
- "Mes clients veulent payer en cash"
- "Je n'ai pas de compte bancaire"
- "Comment faire confiance à un site ?"

### Tâche principale
Recevoir et traiter une commande via la plateforme.

### Conversion attendue
Achat sur la marketplace.

### Informations nécessaires avant conversion
- Démonstration du processus de paiement
- Preuve de sécurité
- Support client accessible
- Garantie de livraison

### Risques UX
- Interface non adaptée aux débutants
- Manque de tutoriels vidéo
- Support client difficile à joindre

---

## Parcours : découverte depuis Google

1. L'utilisateur recherche "pièces Toyota Hilux Abidjan" sur Google
2. Il arrive sur la landing page d'AutoAfrique
3. Il comprend immédiatement : "Des pièces neuves et d'occasion contrôlée, livraison 24-72h"
4. Il voit les moyens de paiement (Orange Money, MTN MoMo)
5. Il clique sur "Trouver une pièce"
6. Il sélectionne Toyota → Hilux → 2.4L D-4D
7. Il voit les pièces disponibles avec prix
8. Il ajoute au panier
9. Il crée un compte
10. Il paie par Orange Money
11. Il reçoit une confirmation
12. La livraison est suivie en temps réel

## Parcours : accès direct

1. L'utilisateur arrive sur l'accueil
2. Il identifie les catégories (Pneus, Frein, Moteur, etc.)
3. Il choisit une catégorie
4. Il filtre par marque/modèle
5. Il consulte un produit
6. Il ajoute au panier
7. Il procède au paiement
8. Il reçoit la confirmation

## Parcours d'échec

Prévoir les cas suivants :

- Résultat de recherche vide → Afficher "Aucune pièce trouvée" + suggestions
- Produit indisponible → Afficher "Rupture de stock" + alternatives
- Erreur formulaire → Messages d'erreur clairs proches des champs
- Paiement refusé → Suggérer un autre moyen de paiement
- Erreur serveur → Page d'erreur 500 avec bouton réessayer
- Session expirée → Redirection vers login avec message
- Page supprimée → Page 404 avec lien vers accueil
- Livraison en retard → Notification + suivi en temps réel

# Spécifications des pages

## Modèle : Landing Page (`/`)

### Routes concernées
- `/`

### Objectif utilisateur
Découvrir AutoAfrique, comprendre l'offre, trouver des pièces

### Objectif commercial
Inscription vendeur/acheteur

### Action principale
"Ouvrir ma boutique gratuitement" ou "Trouver une pièce"

### Action secondaire
"Se connecter"

### Sections obligatoires
1. Header sombre avec recherche et navigation catégories
2. Hero split : Sélecteur véhicule (gauche) + Bannières promo (droite)
3. Catalogue pièces (12 catégories avec images)
4. Marques populaires (12 logos constructeurs)
5. Barre de confiance (Livraison, Paiement sécurisé, Retour, Support)
6. Best-sellers (6 produits avec prix)
7. Texte SEO
8. Footer e-commerce

### Composants
- Header (dark)
- CarSelector
- PromoBanner
- PartsCatalog
- BrandGrid
- ProductCard
- Footer

### Données attendues

| Champ | Type | Obligatoire | Source | Fallback |
|-------|------|-------------|--------|----------|
| carBrands | array | oui | i18n | aucun |
| categories | array | oui | statique | aucun |
| products | array | oui | API | aucun |
| brands | array | oui | API | aucun |

### SEO
- Un seul H1 : "AutoAfrique — Pièces Auto Marketplace Afrique de l'Ouest"
- Title : "AutoAfrique : Pièces détachées auto & Marketplace Afrique de l'Ouest"
- Meta description : "85,000+ pièces pour Toyota, Hyundai, Kia, Peugeot. Paiement Mobile Money. Livraison 24-72h en Afrique de l'Ouest."
- URL canonique : `/`
- Données structurées : Organization, WebSite
- Fil d'Ariane : non (page d'accueil)

### Tracking
- `view_home` (vue page)
- `click_cta_register` (clic inscription)
- `click_cta_marketplace` (clic marketplace)
- `search_vehicle` (recherche véhicule)

### États
- Chargement : Skeleton
- Contenu : affiché
- Erreur : fallback gracieux

---

## Modèle : Marketplace (`/dashboard/marketplace`)

### Routes concernées
- `/dashboard/marketplace`
- `/dashboard/marketplace?category=...`
- `/dashboard/marketplace?search=...`
- `/dashboard/marketplace?brand=...`

### Objectif utilisateur
Trouver et acheter des pièces détachées

### Objectif commercial
Générer des ventes

### Action principale
Ajouter au panier

### Action secondaire
Contacter le vendeur

### Sections obligatoires
1. Fil d'Ariane
2. Barre de recherche
3. Filtres (marque, modèle, condition, prix)
4. Grille de produits
5. Pagination

### Données attendues

| Champ | Type | Obligatoire | Source | Fallback |
|-------|------|-------------|--------|----------|
| products | array | oui | API /api/v1/products | aucun |
| brands | array | oui | API | aucun |
| categories | array | oui | statique | aucun |
| filters | object | oui | URL params | aucun |

### SEO
- Title dynamique selon filtres
- URL canonique elle-même
- Données structurées : ItemList, Product

---

## Modèle : Produit (détail via modal/panneau)

### Objectif utilisateur
Consulter les détails d'une pièce

### Objectif commercial
Conversion en ajout au panier

### Sections obligatoires
1. Image produit
2. Titre et référence
3. Prix (FCFA)
4. Disponibilité et localisation
5. Description
6. Caractéristiques techniques
7. Compatibilité véhicule
8. Avis clients
9. CTA "Ajouter au panier"

---

## Modèle : Panier (`/dashboard/cart`)

### Objectif utilisateur
Voir les articles sélectionnés

### Objectif commercial
Finaliser l'achat

### Sections obligatoires
1. Liste des articles
2. Sous-total
3. Frais de livraison estimés
4. Total
5. CTA "Passer la commande"

---

## Modèle : Connexion (`/auth/login`)

### Objectif utilisateur
Se connecter à son compte

### Objectif commercial
Connexion → Rétention

### Sections obligatoires
1. Formulaire email + mot de passe
2. Lien "Mot de passe oublié"
3. Lien "Créer un compte"
4. Bouton connexion

---

## Modèle : Inscription (`/auth/register`)

### Objectif utilisateur
Créer un compte

### Objectif commercial
Inscription → Activation

### Sections obligatoires
1. Formulaire (nom, email, téléphone, mot de passe)
2. Sélection rôle (vendeur/acheteur)
3. Sélection pays
4. Conditions d'utilisation
5. CTA "S'inscrire"

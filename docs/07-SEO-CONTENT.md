# 07-SEO-CONTENT.md - SEO éditorial et on-page

## Cartographie des intentions

| Route | Intention | Sujet principal | Sujets secondaires | Conversion |
| --- | --- | --- | --- | --- |
| `/` | Transactionnelle / Commerciale | AutoAfrique Marketplace Pièces Auto Afrique de l'Ouest | Sélecteur véhicule par VIN/Marque, Mobile Money, livraison 24-72h, pièces d'origine Toyota/Peugeot/Renault | Inscription Vendeur / Recherche Pièce |
| `/dashboard/marketplace` | Transactionnelle | Recherche et Achat de pièces auto | Filtres par catégorie, marque, état (Neuf/Occasion), tranche de prix FCFA | Ajout au Panier / Achat direct |
| `/pieces/[slug]` | Transactionnelle | Fiche technique et commande d'une pièce auto | Numéro OEM, compatibilité véhicules par code VIN, stock Abidjan, profil vendeur certifié | Ajout au Panier / Achat |
| `/marketplace/categorie/[slug]` | Commerciale / SEO Local | Pièces détachées par catégorie à Abidjan (Moteur, Freins, Pneus, etc.) | Tarifs FCFA, pièces neuves et occasion contrôlées, garanties et livraison régionale | Explorer la Catégorie / Acheter |
| `/marketplace/marque/[slug]` | Commerciale / SEO Local | Pièces détachées par marque automobile à Abidjan (Toyota, Peugeot, Nissan, etc.) | Compatibilité modèles, pièces d'origine neuves & reconditionnées, références constructeurs | Filtrer la Marque / Acheter |
| `/devenir-vendeur` | Commerciale / Acquisition B2B | Digitalisation pour magasins de pièces & casseaurs auto | Publication rapide par note vocale/photo WhatsApp, séquestre Mobile Money, formules tarifaires | Inscription Vendeur Gratuit |
| `/auth/register` | Transactionnelle | Création de compte Acheteur ou Vendeur | Inscription garagiste/particulier, formules d'abonnement marchand, sécurité des données | Inscription Finalisée |
| `/auth/login` | Navigationnelle | Connexion à l'espace client & vendeur | Accès dashboard ERP, réinitialisation mot de passe, sécurité des sessions JWT | Connexion Espace Membre |
| `/livraison` | Informationnelle | Modes et délais de livraison en Afrique de l'Ouest | Tiak-Tiak Abidjan (24h), expédition gare routière vers l'intérieur (Bouaké, San Pedro), suivi GPS | Passer une Commande |
| `/paiement` | Informationnelle / Confiance | Modes de paiement Mobile Money & Sécurité | Wave, Orange Money, MTN MoMo, Moov Money, Djamo, séquestre bancaire, devise FCFA | Réglage d'une Commande |
| `/manuels-reparation` | Informationnelle | Guides d'entretien et tutoriels mécaniques auto | Diagnostic par code défaut OBD2, schémas de démontage moteur, périodicité des vidanges | Trouver la Pièce Adaptée |
| `/aide` | Support / Assistance | Centre d'aide et FAQ interactive | Suivi de colis, retours 30j, procédure de réclamation, contact support | Résolution de Problème / Support |
| `/a-propos` | Institutionnelle | Présentation d'AutoAfrique et de sa mission panafricaine | Transparence des prix, réseau de garagistes certifiés, digitalisation de la filière automobile | Découvrir l'Offre / Contact |
| `/conditions-generales` | Légale | Conditions Générales d'Utilisation et de Vente (CGU/CGV) | Rôle d'intermédiaire marketplace, commission, règlement des litiges | Validation Légale |
| `/politique-de-confidentialite` | Légale | Politique de confidentialité et protection des données | Conformité RGPD/loi informatique locale, gestion des cookies et jetons d'accès | Consultation |
| `/retours` | Informationnelle / Confiance | Politique de retour et procédure de remboursement | Garantie satisfait ou remboursé 30 jours, échange de pièce non conforme | Demande de Retour |
| `/blog` | Informationnelle | Articles de conseils automobiles et guides d'achat | Entretien courant, choix pièces neuves vs occasion, prix du marché à Abidjan | Inscription / Recommandation Produit |

---

## Règles générales

```markdown
# SEO éditorial

## Principes

- Une intention principale par page.
- Une page principale par sujet.
- Pas de pages quasi identiques créées uniquement pour cibler des variantes.
- Répondre réellement au besoin de l’utilisateur.
- Éviter le remplissage et la répétition artificielle.
- Présenter les preuves nécessaires (avis clients, pièces d'origine vérifiées, garanties).
- Identifier l’auteur lorsque pertinent (rédacteurs techniques AutoAfrique).
- Afficher les dates lorsque pertinentes (date de mise à jour des guides et tarifs).
- Mettre à jour les contenus obsolètes.
```

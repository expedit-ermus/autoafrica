# Chrome Web Store Listing — AutoAfrique

> Last Updated: 2026-08-27

## Store Listing

**Extension Name** [REQUIRED]
AutoAfrique — Pièces Auto & Devis Vendeur

**Short Description** [REQUIRED]
Assistant vendeur WhatsApp & recherche OEM instantanée pour pièces détachées auto à Abidjan et en Afrique de l'Ouest.

**Detailed Description** [REQUIRED]
AutoAfrique pour Chrome est l'assistant indispensable pour tous les garagistes, revendeurs de pièces détachées et automobilistes à Abidjan et en Afrique de l'Ouest.

FONCTIONNALITÉS PRINCIPALES :
- Recherche instantanée par référence OEM, VIN ou modèle (Toyota, Hyundai, Peugeot, Suzuki, Nissan, Kia...)
- Consultation en temps réel des stocks disponibles dans les entrepôts d'Abidjan (Marcory, Treichville, Adjamé, Yopougon, Koumassi)
- Générateur de Devis Express pour WhatsApp : calcul automatique des frais de livraison par commune et vers les gares routières (UTB, STIF)
- Paiement Sécurisé sous Séquestre Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money, Djamo Visa)
- Détection intelligente des demandes de pièces sur WhatsApp Web avec pré-remplissage en un clic

COMMENT L'UTILISER :
1. Cliquez sur l'icône AutoAfrique ou utilisez le raccourci Alt+A pour ouvrir le panneau latéral.
2. Recherchez votre pièce par référence OEM ou modèle de voiture.
3. Ajoutez les pièces à votre devis, sélectionnez la commune de livraison et l'opérateur Mobile Money.
4. Cliquez sur "Copier pour WhatsApp" ou insérez directement le devis formaté dans votre conversation client.

CONFIDENTIALITÉ ET SÉCURITÉ :
Vos données et devis restent enregistrés localement sur votre navigateur. Aucune donnée personnelle n'est revendue à des tiers.

SUPPORT & CONTACT :
Site web officiel : https://autoafrique-saas.vercel.app
Support Abidjan : contact@autoafrique.ci / Lun-Sam 08h00 - 19h00 (GMT)

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Rechercher des pièces détachées automobiles et générer des devis avec paiement Mobile Money pour WhatsApp Web.

**Primary Language** [REQUIRED]
French

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | icons/icon-128.png |
| Screenshot 1 [REQUIRED] | 1280×800 | ⬜ À capturer | screenshot-search.png |
| Screenshot 2 [RECOMMENDED] | 1280×800 | ⬜ À capturer | screenshot-quote.png |
| Screenshot 3 [RECOMMENDED] | 1280×800 | ⬜ À capturer | screenshot-whatsapp.png |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Optionnel | promo-small.png |
| Marquee Promo Tile | 1400×560 | ⬜ Optionnel | promo-marquee.png |

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| storage | permissions | Sauvegarde locale des préférences du vendeur (nom, téléphone, commune par défaut) et historique des devis. |
| sidePanel | permissions | Affichage du panneau latéral de recherche de pièces et de création de devis sans quitter la page active. |
| contextMenus | permissions | Permet la recherche rapide au clic-droit sur n'importe quelle référence OEM ou nom de pièce sélectionné. |
| tabs | permissions | Détection de l'onglet actif pour ouvrir le panneau latéral et insérer le devis dans WhatsApp Web. |
| notifications | permissions | Notification discrète confirmant la copie du devis ou le résultat d'une recherche. |
| clipboardWrite | permissions | Permet au vendeur de copier le devis formaté d'un clic pour l'envoyer par message. |
| https://autoafrique-saas.vercel.app/* | host_permissions | Synchronisation des prix, des stocks et de la disponibilité du catalogue de pièces en ligne. |
| https://web.whatsapp.com/* | host_permissions | Détection contextuelle des demandes de pièces et collage rapide du devis dans la discussion. |

## Privacy & Data Use

### Data Collection
**Does the extension collect user data?** No
Toutes les préférences de devis sont conservées localement dans `chrome.storage.local` de l'utilisateur. Aucune donnée de navigation n'est transmise ni vendue.

## Version History

- **v1.0.0** (2026-08-27) : Version initiale officielle Manifest V3 avec Side Panel, WhatsApp Web Assistant, Recherche OEM et Devis Séquestre Mobile Money.

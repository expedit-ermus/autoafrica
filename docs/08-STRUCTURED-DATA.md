# Données structurées

## Organization (Landing)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AutoAfrique",
  "url": "https://autoafrique-saas.vercel.app",
  "logo": "https://autoafrique-saas.vercel.app/logo.png",
  "description": "Marketplace de pièces détachées automobile en Afrique de l'Ouest",
  "areaServed": ["SN", "CI", "ML", "BF", "NE", "GM", "GN", "BJ", "TG", "GH"],
  "sameAs": []
}
```

## WebSite (Landing)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AutoAfrique",
  "url": "https://autoafrique-saas.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://autoafrique-saas.vercel.app/dashboard/marketplace?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## Product (Marketplace)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[product name]",
  "description": "[product description]",
  "image": "[product image]",
  "offers": {
    "@type": "Offer",
    "price": "[price]",
    "priceCurrency": "XOF",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "[seller name]"
    }
  }
}
```

## ItemList (Marketplace)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "[product url]"
    }
  ]
}
```

## Vehicle (Véhicules)

```json
{
  "@context": "https://schema.org",
  "@type": "Vehicle",
  "name": "[marque] [modèle] [année]",
  "brand": { "@type": "Brand", "name": "[marque]" },
  "vehicleModelDate": "[année]",
  "mileageFromOdometer": {
    "@type": "QuantitativeValue",
    "value": "[kilométrage]",
    "unitCode": "KMT"
  },
  "color": "[couleur]",
  "bodyType": "[type de carrosserie]",
  "fuelType": "[https://schema.org/DieselFuel | Gasoline | Hybrid | ElectricFuel | Propane]",
  "vehicleTransmission": "[https://schema.org/ManualTransmission | AutomaticTransmission]",
  "offers": {
    "@type": "Offer",
    "price": "[prix]",
    "priceCurrency": "XOF",
    "availability": "https://schema.org/InStock",
    "itemCondition": "[https://schema.org/NewCondition | UsedCondition]",
    "seller": {
      "@type": "Organization",
      "name": "[nom vendeur]"
    }
  }
}
```

## FAQPage (Aide)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[question]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[answer]"
      }
    }
  ]
}
```

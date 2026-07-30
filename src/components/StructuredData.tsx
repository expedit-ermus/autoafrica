"use client";

import Script from "next/script";

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint: {
    "@type": "ContactPoint";
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
  };
}

interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  image: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  offers: {
    "@type": "Offer";
    priceCurrency: string;
    price: string;
    availability: string;
    seller: {
      "@type": "Organization";
      name: string;
    };
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

function OrganizationStructuredData() {
  const data: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AutoAfrique",
    url: "https://autoafrique-saas.vercel.app",
    logo: "https://autoafrique-saas.vercel.app/logo.png",
    description:
      "La plateforme ERP Marketplace pour pièces détachées automobile en Afrique de l'Ouest.",
    sameAs: [
      "https://www.facebook.com/autoafrique",
      "https://www.twitter.com/autoafrique",
      "https://www.linkedin.com/company/autoafrique",
      "https://www.instagram.com/autoafrique",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+221-XX-XXX-XX-XX",
      contactType: "customer service",
      availableLanguage: ["French", "English", "Wolof"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "SN",
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function WebsiteStructuredData() {
  const data: WebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AutoAfrique",
    url: "https://autoafrique-saas.vercel.app",
    description:
      "La plateforme ERP Marketplace pour pièces détachées automobile en Afrique de l'Ouest.",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://autoafrique-saas.vercel.app/dashboard/marketplace?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductStructuredDataProps {
  name: string;
  description: string;
  image: string;
  brand: string;
  price: string;
  currency?: string;
  seller?: string;
}

function ProductStructuredData({
  name,
  description,
  image,
  brand,
  price,
  currency = "XOF",
  seller = "AutoAfrique",
}: ProductStructuredDataProps) {
  const data: ProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: seller,
      },
    },
  };

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const data: BreadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: index < items.length - 1 ? item.url : undefined,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface FAQStructuredDataProps {
  items: FAQItem[];
}

function FAQStructuredData({ items }: FAQStructuredDataProps) {
  const data: FAQPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export {
  OrganizationStructuredData,
  WebsiteStructuredData,
  ProductStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
};

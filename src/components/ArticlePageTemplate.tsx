'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArticleStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData'

export interface ArticleTocItem {
  id: string
  title: string
}

export interface ArticleSectionContent {
  id: string
  heading: string
  body: string[]
  subsections?: { heading: string; body: string }[]
}

export interface ArticleResourceItem {
  title: string
  description: string
  href: string
  type?: string
}

export interface RelatedArticleItem {
  slug: string
  title: string
  excerpt: string
  category: string
  imageUrl?: string
}

export interface ArticlePageProps {
  slug: string
  title: string
  excerpt: string
  author: {
    name: string
    role: string
    avatarUrl?: string
  }
  datePublished: string
  dateModified?: string
  mainImage: {
    url: string
    alt: string
    caption?: string
  }
  tableOfContents?: ArticleTocItem[]
  contentSections: ArticleSectionContent[]
  resources?: ArticleResourceItem[]
  cta: {
    title: string
    description: string
    buttonText: string
    buttonHref: string
  }
  relatedArticles?: RelatedArticleItem[]
}

export default function ArticlePageTemplate(props: ArticlePageProps) {
  const fullUrl = `https://autoafrique-saas.vercel.app/blog/${props.slug}`
  const breadcrumbItems = [
    { name: 'Accueil', url: 'https://autoafrique-saas.vercel.app' },
    { name: 'Blog', url: 'https://autoafrique-saas.vercel.app/blog' },
    { name: props.title, url: fullUrl },
  ]

  return (
    <article className="bg-gray-50 min-h-screen py-6 sm:py-10">
      {/* Obligations SEO : Données structurées Article & Breadcrumb */}
      <ArticleStructuredData
        title={props.title}
        description={props.excerpt}
        authorName={props.author.name}
        datePublished={props.datePublished}
        dateModified={props.dateModified}
        imageUrl={props.mainImage.url}
        url={fullUrl}
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Fil d'Ariane */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-orange-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">{props.title}</span>
        </nav>

        {/* Header de l'article */}
        <header className="mb-8">
          {/* 2. Titre (H1 unique) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {props.title}
          </h1>

          {/* 3. Chapô (Résumé d'introduction) */}
          <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed mb-6">
            {props.excerpt}
          </p>

          {/* 4. Auteur, 5. Date de publication, 6. Date de mise à jour */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-y border-gray-200 py-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-extrabold flex items-center justify-center text-sm">
                {props.author.name.charAt(0)}
              </span>
              <div>
                <span className="font-bold text-gray-900 block">{props.author.name}</span>
                <span className="text-gray-500">{props.author.role}</span>
              </div>
            </div>
            <span className="text-gray-300">•</span>
            <div>
              <span className="block font-semibold">Publié le :</span>
              <time dateTime={props.datePublished}>{props.datePublished}</time>
            </div>
            {props.dateModified && (
              <>
                <span className="text-gray-300">•</span>
                <div>
                  <span className="block font-semibold">Mis à jour le :</span>
                  <time dateTime={props.dateModified}>{props.dateModified}</time>
                </div>
              </>
            )}
          </div>
        </header>

        {/* 7. Image principale avec alt obligatoire */}
        <figure className="mb-10 rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100">
          <div className="relative w-full h-64 sm:h-96">
            <Image
              src={props.mainImage.url}
              alt={props.mainImage.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
          {props.mainImage.caption && (
            <figcaption className="p-3 text-center text-xs text-gray-500 bg-white border-t border-gray-100 font-medium">
              {props.mainImage.caption}
            </figcaption>
          )}
        </figure>

        {/* 8. Sommaire si pertinent */}
        {props.tableOfContents && props.tableOfContents.length > 0 && (
          <nav aria-label="Table des matières" className="bg-white rounded-2xl p-6 border border-gray-200 mb-10 shadow-sm">
            <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider mb-3">
              📑 Sommaire de l&apos;article
            </h2>
            <ol className="space-y-2 text-sm">
              {props.tableOfContents.map((toc, index) => (
                <li key={toc.id}>
                  <a href={`#${toc.id}`} className="text-orange-600 hover:underline font-semibold flex items-center gap-2">
                    <span>{index + 1}.</span>
                    <span>{toc.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* 9. Corps de l'article (Hiérarchie H2 / H3 obligatoire) */}
        <div className="prose prose-orange max-w-none mb-12 space-y-8">
          {props.contentSections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{sec.heading}</h2>
              {sec.body.map((paragraph, idx) => (
                <p key={idx} className="text-gray-700 text-base leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
              {sec.subsections && sec.subsections.map((sub, sidx) => (
                <div key={sidx} className="mt-6 pl-4 border-l-4 border-orange-500">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{sub.heading}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{sub.body}</p>
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* 10. Ressources associées */}
        {props.resources && props.resources.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-12">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <span>📎</span> Ressources & Liens Utiles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {props.resources.map((res, i) => (
                <Link
                  key={i}
                  href={res.href}
                  className="p-4 rounded-2xl bg-orange-50/50 hover:bg-orange-100/50 border border-orange-200/60 transition-all block"
                >
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{res.title}</h4>
                  <p className="text-xs text-gray-600">{res.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 11. CTA */}
        <section className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 text-center text-white shadow-xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{props.cta.title}</h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto mb-6">{props.cta.description}</p>
          <Link
            href={props.cta.buttonHref}
            className="inline-block px-8 py-4 bg-white text-orange-700 font-extrabold rounded-2xl shadow-lg hover:bg-orange-50 transition-all"
          >
            {props.cta.buttonText}
          </Link>
        </section>

        {/* 12. Articles liés */}
        {props.relatedArticles && props.relatedArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Articles Similaires & À Lire Aussitôt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.relatedArticles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/blog/${art.slug}`}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all block group"
                >
                  <span className="text-[10px] font-extrabold uppercase bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md mb-2 inline-block">
                    {art.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{art.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

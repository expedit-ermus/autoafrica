'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { track } from '@/lib/tracking'
import { FAQStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData'

export interface ServiceIncludedItem {
  title: string
  description: string
  icon?: string
}

export interface ServiceWorkflowStep {
  stepNumber: number
  title: string
  description: string
}

export interface ServiceBenefitItem {
  title: string
  description: string
}

export interface ServiceFaqItem {
  question: string
  answer: string
}

export interface ServicePageProps {
  serviceId: string
  serviceTitle: string
  categoryName: string
  heroBadge?: string
  heroTitle: string
  heroDescription: string
  problemTitle: string
  problemDescription: string
  problemPoints: string[]
  solutionTitle: string
  solutionDescription: string
  solutionFeatures: ServiceIncludedItem[]
  workflowSteps: ServiceWorkflowStep[]
  benefits: ServiceBenefitItem[]
  proofPoints: string[]
  faq: ServiceFaqItem[]
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaHref: string
}

export default function ServicePageTemplate(props: ServicePageProps) {
  useEffect(() => {
    // 1. Tracking view_service
    track('view_service', {
      service_id: props.serviceId,
      service_title: props.serviceTitle,
    })
  }, [props.serviceId, props.serviceTitle])

  const handleCtaClick = (source: string) => {
    // 2. Tracking click_cta
    track('click_cta', {
      service_id: props.serviceId,
      cta_source: source,
    })
    // 3. Tracking form_start / generate_lead
    track('form_start', {
      service_id: props.serviceId,
    })
    track('generate_lead', {
      service_id: props.serviceId,
      source,
    })
  }

  const breadcrumbItems = [
    { name: 'Accueil', url: 'https://autoafrique-saas.vercel.app' },
    { name: 'Services', url: 'https://autoafrique-saas.vercel.app/aide' },
    { name: props.serviceTitle, url: `https://autoafrique-saas.vercel.app/${props.serviceId}` },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <FAQStructuredData items={props.faq} />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* 1. Fil d'Ariane */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/aide" className="hover:text-orange-600 transition-colors">Services</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{props.serviceTitle}</span>
        </nav>

        {/* 2. Hero */}
        <section className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-12">
          {props.heroBadge && (
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white px-3.5 py-1.5 rounded-full border border-white/30 mb-4">
              {props.heroBadge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {props.heroTitle}
          </h1>
          <p className="text-orange-50 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
            {props.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={props.ctaHref}
              onClick={() => handleCtaClick('hero_cta')}
              className="px-8 py-4 bg-white hover:bg-orange-50 text-orange-700 font-extrabold text-center rounded-2xl transition-all shadow-lg"
            >
              {props.ctaButtonText}
            </Link>
          </div>
        </section>

        {/* 3. Problème rencontré */}
        <section className="bg-white rounded-3xl p-8 border border-red-100 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-extrabold text-xl">
              ⚠️
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">{props.problemTitle}</h2>
          </div>
          <p className="text-gray-600 text-base mb-6 leading-relaxed">{props.problemDescription}</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {props.problemPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-red-50/50 p-3 rounded-xl border border-red-100">
                <span className="text-red-500 font-bold">✕</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Présentation de la solution */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-lg mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full border border-orange-500/30">
            La Solution AutoAfrique
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-4">{props.solutionTitle}</h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">{props.solutionDescription}</p>
        </section>

        {/* 5. Prestations incluses */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
            Prestations & Fonctionnalités Incluses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {props.solutionFeatures.map((feat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold mb-4">
                  {feat.icon || '✓'}
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Déroulement */}
        <section className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">
            Comment ça déroule ? (Étape par Étape)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {props.workflowSteps.map((step) => (
              <div key={step.stepNumber} className="relative p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <span className="w-8 h-8 rounded-full bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center mb-3">
                  {step.stepNumber}
                </span>
                <h4 className="font-extrabold text-gray-900 text-base mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Bénéfices */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Vos Bénéfices Clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {props.benefits.map((b, i) => (
              <div key={i} className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <span className="text-emerald-600 font-extrabold text-xl">✓</span>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">{b.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Preuves */}
        <section className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">Garanties & Engagements de Confiance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {props.proofPoints.map((proof, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center font-semibold text-gray-800 text-sm">
                🛡️ {proof}
              </div>
            ))}
          </div>
        </section>

        {/* 9. Questions fréquentes */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">Questions Fréquentes</h2>
          <div className="space-y-4">
            {props.faq.map((f, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 text-base mb-2">{f.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. CTA final */}
        <section className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{props.ctaTitle}</h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto mb-6">{props.ctaDescription}</p>
          <Link
            href={props.ctaHref}
            onClick={() => handleCtaClick('final_cta')}
            className="inline-block px-8 py-4 bg-white text-orange-700 font-extrabold rounded-2xl shadow-lg hover:bg-orange-50 transition-all"
          >
            {props.ctaButtonText}
          </Link>
        </section>
      </main>
    </div>
  )
}

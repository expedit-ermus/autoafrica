import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { SITE_URL } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Contactez AutoAfrique à Abidjan',
  description:
    "Contactez l'équipe AutoAfrique à Abidjan : questions, commandes, paiements Mobile Money, livraisons, retours ou devenir vendeur partenaire en Côte d'Ivoire.",
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="bg-[#F8FAFC] text-slate-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Contact', url: `${SITE_URL}/contact` },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <p className="text-xs font-black uppercase tracking-wider text-orange-600 mb-2">AutoAfrique</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
          Contactez AutoAfrique
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-10 max-w-2xl leading-relaxed">
          Une question sur une pièce, une commande, un paiement Mobile Money ou une livraison ? Notre équipe vous
          accompagne via ce formulaire ou directement sur WhatsApp.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Moyens de contact</h2>
              <ContactForm />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3">Besoin d&apos;assistance immédiate ?</h2>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-base font-bold text-slate-700">@</span>
                  <div>
                    <p className="font-bold text-slate-900">Support par e-mail</p>
                    <p className="mt-0.5 text-xs text-slate-500">contact@autoafrique.ci · Réponse sous 2h ouvrées</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-base font-bold text-orange-600">📞</span>
                  <div>
                    <p className="font-bold text-slate-900">Téléphone Direct</p>
                    <p className="mt-0.5 text-xs text-slate-500">+225 07 00 00 00 00 (Abidjan)</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-base font-bold text-emerald-600">💬</span>
                  <div>
                    <p className="font-bold text-slate-900">WhatsApp Business</p>
                    <p className="mt-0.5 text-xs text-slate-500">Service client direct et envoi de photos de pièces</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-base font-bold text-slate-700">🕒</span>
                  <div>
                    <p className="font-bold text-slate-900">Horaires d&apos;ouverture</p>
                    <p className="mt-0.5 text-xs text-slate-500">Lun - Sam : 08h00 - 18h30 · Zone Afrique de l&apos;Ouest (GMT)</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Une réponse rapide à votre question ?</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                La plupart des réponses se trouvent dans le centre d&apos;aide : création de compte, paiement Mobile Money (Wave, Orange, MTN, Moov),
                livraison express 24h, retours et suivi de commande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

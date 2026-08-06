import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Nous contacter',
  description:
    "Contactez l'équipe AutoAfrique : questions, commandes, paiements, livraisons, retours ou devenir vendeur. Service client Afrique de l'Ouest.",
};

export default function ContactPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">AutoAfrique</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-warm-ink)] mb-3 tracking-tight">
          Contactez AutoAfrique
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-warm-muted)] mb-6 sm:mb-10 max-w-2xl">
          Une question sur une pièce, une commande, un paiement Mobile Money ou une livraison ? Notre équipe vous
          accompagne via ce formulaire ; les horaires seront communiqués avant la mise en production.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="bg-white rounded-3xl border border-[var(--color-warm-border)] p-6 sm:p-8 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-warm-ink)] mb-4">Moyens de contact</h2>
              <ContactForm />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[var(--color-warm-border)] p-6 sm:p-8 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-warm-ink)] mb-3">Besoin d&apos;assistance immédiate ?</h2>
              <ul className="space-y-4 text-sm text-[var(--color-warm-faint)]">
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[var(--color-bg-warm)] flex items-center justify-center shrink-0 text-base">@</span>
                  <div>
                    <p className="font-semibold text-gray-800">Support par e-mail</p>
                    <p className="mt-0.5">Adresse confirmée avant la mise en production (utilisez le formulaire ci-contre pour préparer votre message).</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[var(--color-bg-warm)] flex items-center justify-center shrink-0 text-base">T</span>
                  <div>
                    <p className="font-semibold text-gray-800">Téléphone</p>
                    <p className="mt-0.5">Numéro officiel communiqué à l&apos;ouverture du service client.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[var(--color-bg-warm)] flex items-center justify-center shrink-0 text-base">W</span>
                  <div>
                    <p className="font-semibold text-gray-800">WhatsApp Business</p>
                    <p className="mt-0.5">Le canal WhatsApp sera activé avec le service client officiel.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[var(--color-bg-warm)] flex items-center justify-center shrink-0 text-base">H</span>
                  <div>
                    <p className="font-semibold text-gray-800">Horaires</p>
                    <p className="mt-0.5">Horaires à confirmer avant la mise en production · Zone Afrique de l&apos;Ouest.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-[var(--color-warm-border)] p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[var(--color-warm-ink)] mb-3">Une réponse rapide à votre question ?</h2>
              <p className="text-sm text-[var(--color-warm-faint)] leading-relaxed">
                La plupart des réponses se trouvent dans le centre d&apos;aide : création de compte, paiement Mobile Money,
                livraison 24-72h, retours et suivi de commande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

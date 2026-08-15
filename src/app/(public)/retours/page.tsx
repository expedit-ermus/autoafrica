'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

// --- Inline SVGs to replace lucide-react ---
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
const RefreshCcw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
);
const Package = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
const Settings = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const Smartphone = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
const XCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);
const Truck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
);
const HelpCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);
const ChevronDown = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);
const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
);
const PhoneCall = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/></svg>
);
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);
const MessageSquare = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
// ------------------------------------------------

export default function RetoursPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [checkerStep, setCheckerStep] = useState(0);
  const [checkerAnswers, setCheckerAnswers] = useState<Record<string, string>>({});

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const processSteps = [
    {
      id: 1,
      icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
      title: L('Demande en 1 clic', '1-Click Request'),
      desc: L('Depuis votre espace client ou notre ligne WhatsApp.', 'From your customer account or our WhatsApp line.')
    },
    {
      id: 2,
      icon: <Truck className="w-8 h-8 text-orange-500" />,
      title: L('Restitution de la pièce', 'Return the Part'),
      desc: L('Dépôt en gare ou ramassage par notre coursier partenaire.', 'Drop off at the station or pickup by our partner courier.')
    },
    {
      id: 3,
      icon: <Settings className="w-8 h-8 text-orange-500" />,
      title: L('Contrôle conformité', 'Compliance Check'),
      desc: L('Inspection par nos experts mécaniques sous 24h.', 'Inspection by our mechanical experts within 24 hours.')
    },
    {
      id: 4,
      icon: <Smartphone className="w-8 h-8 text-orange-500" />,
      title: L('Remboursement Mobile Money', 'Mobile Money Refund'),
      desc: L('Instantané via Wave, Orange, MTN, ou Moov.', 'Instant refund via Wave, Orange, MTN, or Moov.')
    }
  ];

  const eligibleConditions = [
    L('Pièce défectueuse au montage (preuve vidéo demandée)', 'Defective part upon assembly (video proof required)'),
    L('Erreur de notre part (mauvaise référence livrée)', 'Error on our part (wrong part number delivered)'),
    L('Pièce incompatible (malgré vérification de la carte grise)', 'Incompatible part (despite registration card verification)'),
    L('Signalement fait sous 14 jours (occasion) ou 30 jours (neuf)', 'Reported within 14 days (used) or 30 days (new)'),
    L('Marquage antivol ou garantie intact', 'Anti-theft or guarantee marking intact')
  ];

  const nonEligibleConditions = [
    L('Pièce ouverte, démontée ou modifiée par le client', 'Part opened, disassembled or modified by the customer'),
    L('Dommage lié à une mauvaise installation', 'Damage related to improper installation'),
    L('Erreur de diagnostic de votre mécanicien', 'Misdiagnosis by your mechanic'),
    L('Dépassement du délai de garantie', 'Exceeded guarantee period'),
    L('Étiquettes ou marquages de garantie retirés ou effacés', 'Guarantee labels or markings removed or erased')
  ];

  const faqs = [
    {
      q: L('Combien de temps prend le remboursement ?', 'How long does the refund take?'),
      a: L('Dès que la pièce est réceptionnée et validée par nos experts (sous 24h), le remboursement est initié immédiatement via Mobile Money. Vous le recevez généralement dans les minutes qui suivent.', 'As soon as the part is received and validated by our experts (within 24h), the refund is initiated immediately via Mobile Money. You usually receive it within minutes.')
    },
    {
      q: L('Qui paie les frais de retour ?', 'Who pays for return shipping?'),
      a: L('Si l\'erreur vient de nous (mauvaise pièce) ou que la pièce est défectueuse, AutoAfrique prend en charge 100% des frais de retour. Si vous avez commandé la mauvaise pièce par erreur, les frais de retour sont à votre charge.', 'If the error is ours (wrong part) or the part is defective, AutoAfrique covers 100% of return shipping. If you ordered the wrong part by mistake, return shipping is at your expense.')
    },
    {
      q: L('Puis-je échanger au lieu d\'être remboursé ?', 'Can I exchange instead of being refunded?'),
      a: L('Absolument ! Si nous avons la bonne pièce en stock, nous vous proposons un échange direct avec livraison express. La différence de prix sera ajustée (remboursement ou complément).', 'Absolutely! If we have the right part in stock, we offer a direct exchange with express delivery. The price difference will be adjusted (refund or supplement).')
    }
  ];

  // Eligibility Checker Logic
  const handleCheckerSelect = (key: string, value: string) => {
    setCheckerAnswers({ ...checkerAnswers, [key]: value });
    setCheckerStep(checkerStep + 1);
  };

  const resetChecker = () => {
    setCheckerStep(0);
    setCheckerAnswers({});
  };

  const renderCheckerContent = () => {
    if (checkerStep === 0) {
      return (
        <div className="text-center space-y-6">
          <p className="text-slate-600 dark:text-slate-300">
            {L('Répondez à 3 questions rapides pour savoir si votre pièce est éligible à un retour et remboursement immédiat.', 'Answer 3 quick questions to find out if your part is eligible for an immediate return and refund.')}
          </p>
          <button
            onClick={() => setCheckerStep(1)}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-orange-500/30"
          >
            {L('Démarrer le test', 'Start the test')} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      );
    }

    if (checkerStep === 1) {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            {L('1. Quel est le type de la pièce ?', '1. What is the type of the part?')}
          </h4>
          <button onClick={() => handleCheckerSelect('type', 'occasion')} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all">
            <span className="font-semibold block text-slate-900 dark:text-white">{L('Pièce d\'occasion contrôlée', 'Controlled used part')}</span>
            <span className="text-sm text-slate-500">{L('Garantie standard 14 à 30 jours', 'Standard 14 to 30 days guarantee')}</span>
          </button>
          <button onClick={() => handleCheckerSelect('type', 'neuve')} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all">
            <span className="font-semibold block text-slate-900 dark:text-white">{L('Pièce neuve', 'New part')}</span>
            <span className="text-sm text-slate-500">{L('Garantie fabricant AutoAfrique', 'AutoAfrique manufacturer guarantee')}</span>
          </button>
        </div>
      );
    }

    if (checkerStep === 2) {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            {L('2. Quel est le motif principal ?', '2. What is the main reason?')}
          </h4>
          <button onClick={() => handleCheckerSelect('reason', 'defective')} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-900 dark:text-white">
            {L('La pièce est défectueuse ou ne fonctionne pas', 'The part is defective or does not work')}
          </button>
          <button onClick={() => handleCheckerSelect('reason', 'error_autoafrique')} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-900 dark:text-white">
            {L('Ce n\'est pas la bonne pièce (erreur AutoAfrique)', 'Not the right part (AutoAfrique error)')}
          </button>
          <button onClick={() => handleCheckerSelect('reason', 'error_client')} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-900 dark:text-white">
            {L('Erreur de diagnostic / Je me suis trompé(e)', 'Misdiagnosis / I made a mistake')}
          </button>
        </div>
      );
    }

    if (checkerStep === 3) {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            {L('3. Dans quel état est la pièce ?', '3. What is the condition of the part?')}
          </h4>
          <button onClick={() => handleCheckerSelect('state', 'intact')} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-900 dark:text-white">
            {L('Intacte, avec marquages et non démontée', 'Intact, with markings and not disassembled')}
          </button>
          <button onClick={() => handleCheckerSelect('state', 'modified')} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-900 dark:text-white">
            {L('Ouverte, modifiée ou marquages effacés', 'Opened, modified or markings erased')}
          </button>
        </div>
      );
    }

    if (checkerStep === 4) {
      const isEligible = checkerAnswers.state === 'intact' && checkerAnswers.reason !== 'error_client';
      const isPartial = checkerAnswers.state === 'intact' && checkerAnswers.reason === 'error_client';

      return (
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
          {isEligible ? (
            <>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {L('Bonne nouvelle !', 'Good news!')}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {L('Votre pièce semble 100% éligible à un retour et remboursement intégral gratuit.', 'Your part seems 100% eligible for a free return and full refund.')}
                </p>
                <Link href="/contact" className="inline-flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all">
                  {L('Initier mon retour sur WhatsApp', 'Initiate my return on WhatsApp')}
                </Link>
              </div>
            </>
          ) : isPartial ? (
            <>
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
                <RefreshCcw className="w-10 h-10 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {L('Retour possible sous conditions', 'Return possible under conditions')}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {L('Comme il s\'agit d\'une erreur de commande, le retour est accepté mais des frais logistiques (10%) peuvent s\'appliquer.', 'Since this is an order error, the return is accepted but logistics fees (10%) may apply.')}
                </p>
                <Link href="/contact" className="inline-flex items-center justify-center w-full bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all">
                  {L('Contacter le support', 'Contact support')}
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {L('Retour non éligible', 'Return not eligible')}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {L('Les pièces ouvertes, démontées ou dont le marquage de garantie a été altéré ne peuvent malheureusement pas être reprises.', 'Parts that have been opened, disassembled, or whose guarantee marking has been altered unfortunately cannot be taken back.')}
                </p>
                <button onClick={resetChecker} className="text-orange-500 font-medium hover:underline">
                  {L('Refaire le test', 'Retake the test')}
                </button>
              </div>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 dark:bg-slate-950 pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-500/10 blur-3xl rounded-full -translate-x-1/4 translate-y-1/4"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-orange-400 mb-8 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide uppercase">
              {L('Garantie & Sérénité', 'Guarantee & Peace of Mind')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            {L('Politique de Retour & Remboursement ', 'Returns & Refund Policy ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              {L('Mobile Money', 'Mobile Money')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {L('Parce que votre satisfaction est notre priorité. Une pièce ne correspond pas ? Nous la reprenons et vous remboursons rapidement, sans complication.', 'Because your satisfaction is our priority. A part doesn\'t fit? We take it back and refund you quickly, with no hassle.')}
          </p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              {L('Un processus simple et transparent', 'A simple and transparent process')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {L('4 étapes rapides pour votre retour', '4 quick steps for your return')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>

            {processSteps.map((step, idx) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-white dark:border-slate-950">
                    {step.id}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions & Checker Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Eligibility Lists */}
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
                {L('Conditions d\'Éligibilité', 'Eligibility Conditions')}
              </h2>
              
              <div className="bg-green-50 dark:bg-green-900/10 rounded-3xl p-6 md:p-8 border border-green-100 dark:border-green-900/30">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {L('Retours Acceptés', 'Returns Accepted')}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {eligibleConditions.map((cond, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="min-w-6 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-6 md:p-8 border border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {L('Retours Refusés', 'Returns Refused')}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {nonEligibleConditions.map((cond, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="min-w-6 mt-0.5">
                        <XCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Checker */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HelpCircle className="w-6 h-6 text-orange-500" />
                      {L('Test d\'éligibilité', 'Eligibility Check')}
                    </h3>
                    {checkerStep > 0 && checkerStep < 4 && (
                      <span className="text-sm font-semibold text-orange-500 bg-orange-100 dark:bg-orange-500/20 px-3 py-1 rounded-full">
                        Étape {checkerStep}/3
                      </span>
                    )}
                  </div>
                  
                  <div className="min-h-[300px] flex flex-col justify-center">
                    {renderCheckerContent()}
                  </div>

                  {checkerStep > 0 && checkerStep < 4 && (
                    <button 
                      onClick={resetChecker}
                      className="mt-8 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <RefreshCcw className="w-4 h-4" /> {L('Recommencer', 'Start over')}
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Guarantees Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              {L('Nos Garanties par type de pièce', 'Our Guarantees by part type')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-colors">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Settings className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {L('Pièces d\'Occasion', 'Used Parts')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 h-12">
                {L('Pièces d\'origine contrôlées par nos experts mécaniques.', 'Original parts checked by our mechanical experts.')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold">{L('Garantie de montage : 14 jours', 'Assembly guarantee: 14 days')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>{L('Contrôle visuel strict avant expédition', 'Strict visual check before shipping')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <RefreshCcw className="w-5 h-5 text-blue-500" />
                  <span>{L('Marquage d\'authentification unique', 'Unique authentication marking')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-3xl border-2 border-slate-900 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                PREMIUM
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {L('Pièces Neuves', 'New Parts')}
              </h3>
              <p className="text-slate-400 mb-6 h-12">
                {L('Pièces neuves sous emballage d\'origine constructeur.', 'New parts in original manufacturer packaging.')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold">{L('Garantie Fabricant : jusqu\'à 1 an', 'Manufacturer Guarantee: up to 1 year')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <span>{L('Garantie AutoAfrique 30 jours', 'AutoAfrique 30-day guarantee')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>{L('Facture et certificat d\'authenticité', 'Invoice and certificate of authenticity')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              {L('Questions Fréquentes', 'Frequently Asked Questions')}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="font-bold text-lg text-slate-900 dark:text-white pr-4">{faq.q}</span>
                  <div className={`flex-shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-orange-500' : 'text-slate-400'}`}>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    activeFaq === idx ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
            {L('Besoin d\'assistance pour un retour ?', 'Need help with a return?')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            {L('Notre équipe support est disponible 7j/7 pour vous accompagner dans vos démarches.', 'Our support team is available 7 days a week to help you with your process.')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-orange-500/30">
              <PhoneCall className="w-5 h-5" />
              {L('Contacter le Support', 'Contact Support')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

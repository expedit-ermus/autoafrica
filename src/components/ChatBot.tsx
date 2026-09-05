'use client';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface FlowOption {
  label: string;
  action: string;
  icon?: string;
  color?: string;
}

interface Message {
  id: string;
  from: 'bot' | 'user' | 'system';
  text: string;
  time: string;
  options?: FlowOption[];
}

interface Flow {
  label: string;
  reply?: string;
  options?: FlowOption[];
  url?: string;
}

export default function ChatBot() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getNow = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const welcomeText = L(
    'Bonjour ! 👋 Je suis **AutoBot**, l\'assistant IA d\'AutoAfrique.\n\nComment puis-je vous aider aujourd\'hui ?\n• 🔍 Recherche par plaque ou N° VIN\n• 🏪 Catalogue de pièces détachées\n• 💳 Paiements Mobile Money (Wave, Orange, MTN, Moov)\n• 🚚 Délais de livraison 24-72h\n• 🛠️ Manuels de réparation & tutos\n• 💼 Offres Garages & Vendeurs',
    'Hello! 👋 I\'m **AutoBot**, AutoAfrique\'s AI assistant.\n\nHow can I help you today?\n• 🔍 Search by plate or VIN number\n• 🏪 Spare parts catalogue\n• 💳 Mobile Money payments (Wave, Orange, MTN, Moov)\n• 🚚 Delivery times 24-72h\n• 🛠️ Repair manuals & tutorials\n• 💼 Garage & Seller plans'
  );

  const welcomeOptions: FlowOption[] = [
    { label: L('💬 Parler sur WhatsApp avec un conseiller (Direct)', '💬 Chat with an advisor on WhatsApp (Direct)'), action: 'whatsapp_redirect', icon: '💬', color: 'bg-emerald-600 text-white hover:bg-emerald-700 border-none font-bold shadow-md shadow-emerald-700/20' },
    { label: L('📋 Demander un Devis Express (30s)', '📋 Request Express Quote (30s)'), action: 'open_lead_quote', icon: '📋', color: 'bg-emerald-500 text-white hover:bg-emerald-600 border-none font-bold' },
    { label: L('📞 Être rappelé sous 15 min', '📞 Get callback in 15 min'), action: 'open_lead_callback', icon: '📞', color: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95 border-none font-bold' },
    { label: L('🔍 Recherche par Plaque / VIN', '🔍 Search by Plate / VIN'), action: 'open_vin_search', icon: '🔍' },
    { label: L('🏪 Catalogue pièces', '🏪 Parts catalogue'), action: 'open_marketplace', icon: '🏪' },
    { label: L('💳 Paiements Mobile Money', '💳 Mobile Money Payments'), action: 'open_payments', icon: '💳' },
    { label: L('🚚 Livraisons 24-72h', '🚚 24-72h Delivery'), action: 'open_livraison', icon: '🚚' },
    { label: L('💼 Tarifs & Espace Vendeur', '💼 Plans & Seller Area'), action: 'open_tarifs', icon: '💼' },
    { label: L('✉️ Support Client', '✉️ Support Client'), action: 'open_contact', icon: '✉️' },
  ];

  const flows: Record<string, Flow> = {
    welcome: { label: L('🏠 Menu principal', '🏠 Main menu'), reply: welcomeText, options: welcomeOptions },
    whatsapp_redirect: { label: L('💬 WhatsApp Direct', '💬 Direct WhatsApp'), url: 'https://wa.me/2250700000000?text=' + encodeURIComponent('Bonjour AutoAfrique, je cherche une pièce auto...') },
    open_lead_quote: { label: L('📋 Devis Express', '📋 Express Quote'), reply: L('📋 **Demande de Devis Express**\n\nRemplissez ce court formulaire ci-dessous pour recevoir une offre sur mesure par WhatsApp ou téléphone.', '📋 **Express Quote Request**\n\nFill the form below to get a custom offer on WhatsApp or phone.') },
    open_lead_callback: { label: L('📞 Rappel Téléphonique', '📞 Phone Callback'), reply: L('📞 **Rappel Téléphonique sous 15 min**\n\nLaissez vos coordonnées pour qu\'un conseiller commercial AutoAfrique vous rappelle immédiatement.', '📞 **Phone Callback in 15 min**\n\nLeave your details and an AutoAfrique sales rep will call you right away.') },
    open_vin_search: { label: L('🔍 Recherche par Plaque / VIN', '🔍 Search by Plate / VIN'), url: '/catalogue' },
    open_marketplace: { label: L('🏪 Catalogue pièces', '🏪 Parts catalogue'), url: '/catalogue' },
    open_vehicles: { label: L('🚙 Véhicules', '🚙 Vehicles'), url: '/catalogue' },
    open_inventory: { label: L('📦 Inventaire', '📦 Inventory'), url: '/catalogue' },
    open_payments: { label: L('💳 Paiements', '💳 Payments'), url: '/paiement' },
    open_livraison: { label: L('🚚 Livraisons', '🚚 Delivery'), url: '/livraison' },
    open_manuels: { label: L('🛠️ Manuels de réparation', '🛠️ Repair Manuals'), url: '/manuels-reparation' },
    open_tarifs: { label: L('💼 Tarifs SaaS', '💼 SaaS Plans'), url: '/tarifs' },
    open_vendeur: { label: L('📈 Devenir Vendeur', '📈 Become Seller'), url: '/devenir-vendeur' },
    open_aide: { label: L('❓ Aide', '❓ Help'), url: '/aide' },
    open_contact: { label: L('✉️ Support Client', '✉️ Support Client'), url: '/contact' },
  };

  const pushBot = (text: string, options?: FlowOption[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'bot', text, time: getNow(), options }]);
      setIsTyping(false);
    }, 450);
  };

  const openChat = () => {
    setIsOpen(true);
    setUnread(0);
    if (messages.length === 0) pushBot(welcomeText, welcomeOptions);
  };

  const closeChat = () => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.from === 'bot') setUnread((prev) => prev + 1);
    }
    setIsOpen(false);
  };

  const analyzeIntent = (userText: string): { reply: string; options: FlowOption[] } => {
    const q = userText.toLowerCase();

    // 1. Recherche par immatriculation / VIN
    if (q.includes('vin') || q.includes('immatricul') || q.includes('plaque') || q.includes('chass') || q.includes('compatib')) {
      return {
        reply: L(
          '🔍 **Recherche par Immatriculation ou Carte Grise**\n\nAutoAfrique intègre un moteur de décodage pour les véhicules d\'Afrique de l\'Ouest (Côte d\'Ivoire 🇨🇮, Sénégal 🇸🇳, Burkina 🇧🇫, Mali 🇲🇱, etc.).\n\nSouhaitez-vous rechercher vos pièces compatibles maintenant ?',
          '🔍 **Plate or VIN Search**\n\nAutoAfrique includes a decoding engine for West African vehicles.\n\nWould you like to search your compatible parts now?'
        ),
        options: [
          { label: L('🔍 Lancer la recherche par plaque', '🔍 Start plate search'), action: 'open_vin_search', icon: '🔍' },
          { label: L('🏪 Parcourir le catalogue', '🏪 Browse catalogue'), action: 'open_marketplace', icon: '🏪' },
        ],
      };
    }

    // 2. Paiements Mobile Money
    if (q.includes('wave') || q.includes('orange') || q.includes('mtn') || q.includes('moov') || q.includes('pay') || q.includes('argent') || q.includes('fcfa') || q.includes('factur')) {
      return {
        reply: L(
          '💳 **Paiements Sécurisés en Afrique de l\'Ouest**\n\nAutoAfrique accepte les règlements par **Wave**, **Orange Money**, **MTN MoMo**, **Moov Money** ainsi que par **Carte Visa/Mastercard**.\n\n• Aucun compte bancaire requis.\n• Confirmation instantanée par code USSD.\n• Facture FCFA téléchargable dans votre espace membre.',
          '💳 **Secure West African Payments**\n\nAutoAfrique accepts **Wave**, **Orange Money**, **MTN MoMo**, **Moov Money** and **Visa/Mastercard**.\n\n• No bank account required.\n• Instant USSD confirmation.'
        ),
        options: [
          { label: L('💳 Voir la page Paiement', '💳 View Payment page'), action: 'open_payments', icon: '💳' },
          { label: L('✉️ Poser une question sur les paiements', '✉️ Ask payment question'), action: 'open_contact', icon: '✉️' },
        ],
      };
    }

    // 3. Livraison & Délais
    if (q.includes('livra') || q.includes('exped') || q.includes('colis') || q.includes('dakar') || q.includes('abidjan') || q.includes('delai')) {
      return {
        reply: L(
          '🚚 **Livraison & Expédition 24h - 72h**\n\n• **Abidjan & Côte d\'Ivoire** : Livraison en 24h à domicile ou en point relais garage.\n• **Dakar, Bamako, Ouagadougou, Lomé, Cotonou** : Expédition express sous 48h à 72h.\n• Suivi en temps réel de votre colis.',
          '🚚 **24h - 72h Delivery**\n\n• **Abidjan & Ivory Coast**: 24h delivery.\n• **Sub-region (Dakar, Bamako, etc.)**: 48-72h express.'
        ),
        options: [
          { label: L('🚚 Informations de livraison', '🚚 Delivery details'), action: 'open_livraison', icon: '🚚' },
          { label: L('❓ FAQ & Support', '❓ FAQ & Support'), action: 'open_aide', icon: '❓' },
        ],
      };
    }

    // 4. Manuels & Tutoriels
    if (q.includes('manuel') || q.includes('tuto') || q.includes('repar') || q.includes('moteur') || q.includes('vidange') || q.includes('schema')) {
      return {
        reply: L(
          '🛠️ **Manuels de Réparation & Fiches Techniques**\n\nConsultez gratuitement nos manuels techniques, schémas de montage et tutoriels vidéo pour l\'entretien de vos véhicules (Toyota, Suzuki, Peugeot, Hyundai, Kia...).',
          '🛠️ **Repair Manuals & Tech Specs**\n\nAccess free manuals, wiring diagrams, and tutorials for your vehicle.'
        ),
        options: [
          { label: L('🛠️ Consulter les Manuels', '🛠️ View Manuals'), action: 'open_manuels', icon: '🛠️' },
          { label: L('🏪 Chercher des pièces', '🏪 Search parts'), action: 'open_marketplace', icon: '🏪' },
        ],
      };
    }

    // 5. Tarifs & Inscription Garage / Vendeur
    if (q.includes('tarif') || q.includes('prix') || q.includes('abonnement') || q.includes('vendre') || q.includes('garage') || q.includes('casse')) {
      return {
        reply: L(
          '💼 **Offres SaaS ERP & Espace Vendeur AutoAfrique**\n\nDigitalisez votre garage ou magasin de pièces :\n• Formule **Starter** (15 000 FCFA/mois) pour casseaurs & ateliers.\n• Formule **Pro** (45 000 FCFA/mois) avec gestion multi-entrepôts.\n• Formule **Enterprise** pour flottes & gros importateurs.',
          '💼 **SaaS ERP & Seller Plans**\n\nDigitalize your garage or auto parts shop with AutoAfrique plans.'
        ),
        options: [
          { label: L('💼 Voir les formules Tarifs', '💼 View SaaS Plans'), action: 'open_tarifs', icon: '💼' },
          { label: L('📈 Devenir Vendeur', '📈 Become Seller'), action: 'open_vendeur', icon: '📈' },
        ],
      };
    }

    // Réponse générique intelligente
    return {
      reply: L(
        `Merci pour votre message concernant : « ${userText} ».\n\nJe suis l'assistant AutoBot d'AutoAfrique. Pour trouver des informations réelles et précises, sélectionnez l'une des rubriques ci-dessous :`,
        `Thank you for your message about: "${userText}".\n\nI am AutoBot, AutoAfrique's assistant. Select one of the topics below for real information:`
      ),
      options: welcomeOptions,
    };
  };

  const respondToText = (text: string) => {
    const { reply, options } = analyzeIntent(text);
    pushBot(reply, options);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'user', text: userText, time: getNow() }]);
    setInput('');
    respondToText(userText);
  };

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormType, setLeadFormType] = useState<'quote' | 'callback'>('quote');
  const [leadData, setLeadData] = useState({ name: '', phone: '', countryCode: '+225', need: '' });

  const handleOptionClick = (action: string) => {
    const flow = flows[action];
    if (!flow) return;
    const label = flow.label.replace(/^[^\s]+ /, '');
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'user', text: label, time: getNow() }]);

    if (action === 'open_lead_quote' || action === 'open_lead_callback') {
      setLeadFormType(action === 'open_lead_quote' ? 'quote' : 'callback');
      setShowLeadForm(true);
      if (flow.reply) pushBot(flow.reply);
      return;
    }

    if (flow.url) {
      pushBot(L(`Ouverture de la page « ${label} » dans un nouvel onglet.`, `Opening the "${label}" page in a new tab.`));
      window.open(flow.url, '_blank', 'noopener,noreferrer');
    } else if (flow.reply) {
      pushBot(flow.reply, flow.options);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name.trim() || !leadData.phone.trim()) return;

    const fullPhone = `${leadData.countryCode} ${leadData.phone.trim()}`;

    setShowLeadForm(false);
    pushBot(
      L(
        `✅ **Demande de Lead Enregistrée !**\n\nMerci ${leadData.name}, vos coordonnées (**${fullPhone}**) ont été transmises à notre équipe commerciale.\n\nUn conseiller vous recontactera sous 15 minutes. Vous pouvez aussi échanger directement via WhatsApp ci-dessous :`,
        `✅ **Lead Request Captured!**\n\nThank you ${leadData.name}, your contact info (**${fullPhone}**) has been sent to our sales team.`
      ),
      [
        {
          label: L('💬 WhatsApp Direct Commercial', '💬 Direct WhatsApp Sales'),
          action: 'whatsapp_redirect',
          icon: '💬',
          color: 'bg-emerald-600 text-white hover:bg-emerald-700 border-none font-bold',
        },
        { label: L('🏠 Retour au Menu Principal', '🏠 Back to Main Menu'), action: 'welcome', icon: '🏠' },
      ]
    );

    // Prepare WhatsApp URL
    const waText = encodeURIComponent(`Bonjour AutoAfrique, je souhaite un devis pour : ${leadData.need || 'Pièces auto'}. Nom : ${leadData.name}, Tel : ${fullPhone}`);
    window.open(`https://wa.me/2250700000000?text=${waText}`, '_blank', 'noopener,noreferrer');
    setLeadData({ name: '', phone: '', countryCode: '+225', need: '' });
  };

  interface SpeechLike {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
    onerror: () => void;
    onend: () => void;
    start: () => void;
  }

  const handleVoice = () => {
    const SR = (window as unknown as {
      webkitSpeechRecognition?: { new (): SpeechLike };
      SpeechRecognition?: { new (): SpeechLike };
    }).webkitSpeechRecognition || (window as unknown as {
      webkitSpeechRecognition?: { new (): SpeechLike };
      SpeechRecognition?: { new (): SpeechLike };
    }).SpeechRecognition;

    if (!SR) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(), from: 'system',
        text: L('🎤 Reconnaissance vocale non supportée sur ce navigateur.', '🎤 Voice recognition not supported on this browser.'),
        time: getNow(),
      }]);
      return;
    }

    const recognition = new SR();
    recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    recognition.onresult = (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'user', text: `🎤 "${transcript}"`, time: getNow() }]);
        respondToText(transcript);
      }, 300);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {!isOpen && (
        <button onClick={openChat}
          className="fixed bottom-6 right-4 sm:right-6 z-[80] w-14 h-14 sm:w-15 sm:h-15 rounded-full gradient-primary flex items-center justify-center shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border-2 border-white/20"
          aria-label={L('Ouvrir l\'assistant AutoBot & WhatsApp', 'Open AutoBot & WhatsApp assistant')}
          title={L('Discuter avec AutoBot IA ou sur WhatsApp', 'Chat with AutoBot AI or on WhatsApp')}>
          <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform">💬</span>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">{unread}</span>
          )}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-sm animate-pulse"></span>

          {/* Hover Tooltip */}
          <span className="absolute right-full mr-3 px-3.5 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-extrabold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 backdrop-blur-md hidden sm:flex items-center gap-2">
            <span>🤖</span>
            <span>{L('AutoBot IA & WhatsApp', 'AutoBot AI & WhatsApp')}</span>
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[90] w-[calc(100vw-2rem)] sm:w-[390px] lg:w-[420px] h-[calc(100vh-5rem)] sm:h-[590px] lg:h-[650px] max-h-[calc(100vh-3.5rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in"
          role="dialog" aria-label={L('Assistant AutoBot', 'AutoBot assistant')}>
          <div className="gradient-primary p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-500"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">AutoBot AI</p>
              <p className="text-orange-100 text-[10px] flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                {L('Assistant virtuel & WhatsApp', 'Virtual assistant & WhatsApp')}
              </p>
            </div>
            <a
              href="https://wa.me/2250700000000?text=Bonjour%20AutoAfrique,%20je%20recherche%20une%20pièce%20auto..."
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95 border border-white/20 shrink-0 cursor-pointer"
              title={L('Discuter directement sur WhatsApp', 'Chat directly on WhatsApp')}
            >
              <span>💬</span>
              <span className="hidden sm:inline font-bold">WhatsApp</span>
            </a>
            <button onClick={closeChat} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition text-sm shrink-0 cursor-pointer" aria-label={L('Fermer', 'Close')}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white scrollbar-hide">
            {/* Direct WhatsApp Action Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs mb-2 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-emerald-950 truncate">
                    {L('Conseillers WhatsApp en direct', 'Live WhatsApp Advisors')}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {L('Réponse moyenne en 5 min', 'Average reply in 5 min')}
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/2250700000000?text=Bonjour%20AutoAfrique,%20je%20recherche%20une%20pièce%20auto..."
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1 hover:scale-105 cursor-pointer"
              >
                <span>💬</span>
                <span>Ouvrir</span>
              </a>
            </div>
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.from === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-orange-500 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] shadow-sm">
                      <p className="text-[13px] leading-relaxed">{msg.text}</p>
                      <p className="text-[9px] text-orange-200 text-right mt-1">{msg.time}</p>
                    </div>
                  </div>
                ) : msg.from === 'system' ? (
                  <div className="flex justify-center">
                    <div className="bg-blue-50 text-blue-700 rounded-xl px-4 py-2 text-xs text-center">{msg.text}</div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[90%] shadow-sm">
                      {msg.text && <p className="text-[13px] whitespace-pre-line leading-relaxed text-gray-800">{msg.text}</p>}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="text-[10px] text-orange-500 hover:text-orange-700 flex items-center gap-1 font-semibold transition"
                          aria-label={L('Écouter le message', 'Listen to message')}
                        >
                          {speakingId === msg.id ? '⏹️ Stop' : '🔊 Écouter'}
                        </button>
                        <p className="text-[9px] text-gray-400">{msg.time}</p>
                      </div>
                    </div>
                  </div>
                )}

                {msg.options && !isTyping && msg.id === messages[messages.length - 1]?.id && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                    {msg.options.map((opt) => (
                      <button key={opt.action} onClick={() => handleOptionClick(opt.action)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow-md ${opt.color || 'bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-400'}`}>
                        {opt.icon && <span className="mr-1">{opt.icon}</span>}
                        {opt.label.replace(/^[^\s]+ /, '')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-[10px] text-gray-400">{L('AutoBot réfléchit...', 'AutoBot thinking...')}</span>
                  </div>
                </div>
              </div>
            )}

            {showLeadForm && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 shadow-sm animate-fade-in my-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>📋</span> {leadFormType === 'quote' ? 'Formulaire de Devis Express' : 'Rappel Téléphonique 15 min'}
                  </p>
                  <button onClick={() => setShowLeadForm(false)} className="text-xs text-gray-400 hover:text-gray-600 font-bold" type="button">✕</button>
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-1">Nom / Nom du Garage</label>
                    <input aria-label="Garage Koné / Mamadou Diallo"
                      type="text"
                      required
                      placeholder="Ex: Garage Koné / Mamadou Diallo"
                      value={leadData.name}
                      onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-1">Téléphone WhatsApp / Mobile Money</label>
                    <div className="flex gap-1.5">
                      <select
                        value={leadData.countryCode}
                        onChange={(e) => setLeadData({ ...leadData, countryCode: e.target.value })}
                        className="px-2 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                      >
                        <option value="+225">🇨🇮 +225</option>
                        <option value="+221">🇸🇳 +221</option>
                        <option value="+226">🇧🇫 +226</option>
                        <option value="+223">🇲🇱 +223</option>
                        <option value="+229">🇧🇯 +229</option>
                        <option value="+228">🇹🇬 +228</option>
                        <option value="+234">🇳🇬 +234</option>
                      </select>
                      <input aria-label="Votre numéro de téléphone"
                        type="tel" inputMode="tel" autoComplete="tel"
                        required
                        placeholder="07 01 02 03 04"
                        value={leadData.phone}
                        onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-1">Pièce ou Véhicule recherché</label>
                    <input aria-label="Amortisseurs Toyota Corolla 2018"
                      type="text"
                      placeholder="Ex: Amortisseurs Toyota Corolla 2018"
                      value={leadData.need}
                      onChange={(e) => setLeadData({ ...leadData, need: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 mt-1"
                  >
                    <span>🚀 Envoyer ma demande de devis</span>
                  </button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <button onClick={handleVoice} aria-label={L('Dicter', 'Dictate')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                🎤
              </button>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-gray-100 rounded-xl px-3 sm:px-4 py-2.5 text-base sm:text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                placeholder={isListening ? L('🎤 Écoute en cours...', '🎤 Listening...') : L('Tapez ou dictez...', 'Type or speak...')} />
              <button onClick={handleSend} aria-label={L('Envoyer', 'Send')}
                className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white hover:opacity-90 transition shadow-md disabled:opacity-50"
                disabled={!input.trim()}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
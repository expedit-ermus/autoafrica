'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';

interface Message {
  id: string;
  from: 'bot' | 'user' | 'system';
  text: string;
  time: string;
  options?: { label: string; action: string; icon?: string; color?: string }[];
  card?: VehicleCard | AgentCard | TxCard;
  isComparison?: boolean;
  comparisonData?: any[];
}

interface VehicleCard {
  type: 'vehicle';
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  condition: string;
  mileage: number;
  fuel: string;
  color: string;
  seller: string;
  phone: string;
  id: string;
}

interface AgentCard {
  type: 'agent';
  name: string;
  location: string;
  rating: number;
  hours: string;
  providers: string[];
  phone: string;
}

interface TxCard {
  type: 'transaction';
  reference: string;
  amount: number;
  status: string;
  method: string;
  date: string;
}

const vehicleDB: VehicleCard[] = [
  { type: 'vehicle', make: 'Toyota', model: 'Corolla', year: 2022, price: 8500000, location: 'Abidjan, CI', condition: 'Occasion', mileage: 15000, fuel: 'Essence', color: 'Blanc', seller: 'AutoConcession CI', phone: '+22507080910', id: 'VH001' },
  { type: 'vehicle', make: 'Mercedes-Benz', model: 'C200', year: 2023, price: 25000000, location: 'Dakar, SN', condition: 'Certifié', mileage: 8000, fuel: 'Diesel', color: 'Noir', seller: 'Sénégal Auto Plus', phone: '+221771234567', id: 'VH002' },
  { type: 'vehicle', make: 'Hyundai', model: 'Tucson', year: 2024, price: 18500000, location: 'Abidjan, CI', condition: 'Neuf', mileage: 2000, fuel: 'Diesel', color: 'Gris', seller: 'AutoConcession CI', phone: '+22507080910', id: 'VH003' },
  { type: 'vehicle', make: 'BMW', model: 'Série 3', year: 2021, price: 22000000, location: 'Lagos, NG', condition: 'Occasion', mileage: 35000, fuel: 'Essence', color: 'Bleu', seller: 'Lagos Motors', phone: '+2348012345678', id: 'VH004' },
  { type: 'vehicle', make: 'Peugeot', model: '308', year: 2023, price: 12000000, location: 'Ouagadougou, BF', condition: 'Occasion', mileage: 12000, fuel: 'Diesel', color: 'Rouge', seller: 'Burkina Garage', phone: '+22670123456', id: 'VH005' },
  { type: 'vehicle', make: 'Kia', model: 'Sportage', year: 2024, price: 19500000, location: 'Accra, GH', condition: 'Neuf', mileage: 500, fuel: 'Hybride', color: 'Blanc', seller: 'Ghana Auto Hub', phone: '+233245678901', id: 'VH006' },
  { type: 'vehicle', make: 'Toyota', model: 'Land Cruiser', year: 2022, price: 45000000, location: 'Bamako, ML', condition: 'Occasion', mileage: 28000, fuel: 'Diesel', color: 'Beige', seller: 'Mali Véhicules', phone: '+22376543210', id: 'VH007' },
  { type: 'vehicle', make: 'Nissan', model: 'Qashqai', year: 2023, price: 14500000, location: 'Cotonou, BJ', condition: 'Certifié', mileage: 18000, fuel: 'Essence', color: 'Gris', seller: 'Cotonou Motors', phone: '+22997123456', id: 'VH008' },
  { type: 'vehicle', make: 'Toyota', model: 'RAV4', year: 2023, price: 15000000, location: 'Dakar, SN', condition: 'Occasion', mileage: 10000, fuel: 'Hybride', color: 'Rouge', seller: 'Sénégal Auto Plus', phone: '+221771234567', id: 'VH009' },
  { type: 'vehicle', make: 'Mercedes-Benz', model: 'GLC', year: 2022, price: 35000000, location: 'Abidjan, CI', condition: 'Occasion', mileage: 22000, fuel: 'Diesel', color: 'Noir', seller: 'AutoConcession CI', phone: '+22507080910', id: 'VH010' },
];

const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

export default function ChatBot() {
  const { t, locale } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [unread, setUnread] = useState(0);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getNow = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const pushHistory = (action: string) => {
    setViewHistory(prev => [...prev, action]);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = viewHistory.slice(0, -1);
      setViewHistory(newHistory);
      const prev = newHistory[newHistory.length - 1];
      addBotMessage(prev, true);
    } else {
      addBotMessage('welcome', true);
    }
  };

  const addBotMessage = useCallback((action: string, isBack = false) => {
    if (!isBack) pushHistory(action);
    setIsTyping(true);
    setQuickReplies([]);

    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const flow = getFlow(action, locale, vehicleDB);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        from: 'bot',
        text: flow.text,
        time: getNow(),
        options: flow.options,
        card: flow.card,
        isComparison: flow.isComparison,
        comparisonData: flow.comparisonData,
      }]);
      setIsTyping(false);
      if (flow.quickReplies) setQuickReplies(flow.quickReplies);
    }, delay);
  }, [locale]);

  const openChat = () => {
    setIsOpen(true);
    setUnread(0);
    if (messages.length === 0) addBotMessage('welcome');
  };

  const closeChat = () => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.from === 'bot') setUnread(prev => prev + 1);
    }
    setIsOpen(false);
  };

  const handleOptionClick = (action: string) => {
    const label = getLabel(action, locale);
    setMessages(prev => [...prev, { id: Date.now().toString(), from: 'user', text: label, time: getNow() }]);
    setQuickReplies([]);

    if (action === 'open_dashboard') { window.open('/dashboard', '_blank'); addBotMessage('welcome'); return; }
    if (action === 'whatsapp_support') { window.open('https://wa.me/22507080910?text=' + encodeURIComponent('Bonjour, j\'ai besoin d\'aide sur AutoAfrique'), '_blank'); addBotMessage(action); return; }
    if (action === 'call_support') { window.open('tel:+22520304050', '_self'); addBotMessage(action); return; }
    if (action === 'send_email') { window.open('mailto:support@autoafrique.com?subject=Support AutoAfrique'); addBotMessage(action); return; }
    if (action === 'map_agents') { window.open('https://maps.google.com/?q=autoafrique+agent', '_blank'); addBotMessage(action); return; }
    if (action === 'open_marketplace') { window.open('/dashboard/marketplace', '_blank'); addBotMessage(action); return; }
    if (action === 'open_inventory') { window.open('/dashboard/inventory', '_blank'); addBotMessage(action); return; }
    if (action === 'open_payments') { window.open('/dashboard/payments', '_blank'); addBotMessage(action); return; }
    if (action.startsWith('compare_')) { handleCompare(action); return; }
    if (action.startsWith('book_testdrive_')) { handleBookTestDrive(action); return; }
    if (action.startsWith('set_alert_')) { handleSetAlert(action); return; }
    if (action.startsWith('buy_')) { handleBuy(action); return; }
    if (action.startsWith('call_seller_')) { handleCallSeller(action); return; }
    if (action.startsWith('whatsapp_seller_')) { handleWhatsAppSeller(action); return; }

    addBotMessage(action);
  };

  const handleCompare = (action: string) => {
    const ids = action.replace('compare_', '').split('_');
    const vehicles = vehicleDB.filter(v => ids.includes(v.id));
    if (vehicles.length >= 2) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), from: 'bot', text: '', time: getNow(),
        isComparison: true, comparisonData: vehicles,
      }]);
    }
  };

  const handleBuy = (action: string) => {
    const vehicleId = action.replace('buy_', '');
    const v = vehicleDB.find(veh => veh.id === vehicleId);
    if (v) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), from: 'bot',
        text: locale === 'fr'
          ? `🛡️ **Séquestre activé pour ${v.make} ${v.model}**\n\n💰 Montant : ${formatCFA(v.price)} FCFA\n👤 Vendeur : ${v.seller}\n📞 ${v.phone}\n\nLes fonds seront sécurisés jusqu'à inspection.`
          : `🛡️ **Escrow activated for ${v.make} ${v.model}**\n\n💰 Amount: ${formatCFA(v.price)} FCFA\n👤 Seller: ${v.seller}\n📞 ${v.phone}\n\nFunds secured until inspection.`,
        time: getNow(),
        options: [
          { label: locale === 'fr' ? '🟠 Payer avec Orange Money' : '🟠 Pay with Orange Money', action: 'pay_om', icon: '🟠', color: 'bg-orange-50 border-orange-200 text-orange-700' },
          { label: locale === 'fr' ? '🟡 Payer avec MTN MoMo' : '🟡 Pay with MTN MoMo', action: 'pay_mtn', icon: '🟡', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: locale === 'fr' ? '🔵 Payer avec Wave' : '🔵 Pay with Wave', action: 'pay_wave', icon: '🔵', color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: locale === 'fr' ? '💬 Contacter le vendeur' : '💬 Contact seller', action: `whatsapp_seller_${v.id}`, icon: '💬', color: 'bg-green-50 border-green-200 text-green-700' },
          { label: locale === 'fr' ? '← Retour' : '← Back', action: 'welcome', icon: '←' },
        ],
      }]);
    }
  };

  const handleCallSeller = (action: string) => {
    const id = action.replace('call_seller_', '');
    const v = vehicleDB.find(veh => veh.id === id);
    if (v) { window.open(`tel:${v.phone}`, '_self'); addBotMessage('contact_seller'); }
  };

  const handleWhatsAppSeller = (action: string) => {
    const id = action.replace('whatsapp_seller_', '');
    const v = vehicleDB.find(veh => veh.id === id);
    if (v) {
      const msg = encodeURIComponent(`Bonjour, je suis intéressé par ${v.make} ${v.model} ${v.year} à ${formatCFA(v.price)} FCFA sur AutoAfrique. Est-il toujours disponible ?`);
      window.open(`https://wa.me/${v.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
      addBotMessage('contact_seller');
    }
  };

  const handleBookTestDrive = (action: string) => {
    const id = action.replace('book_testdrive_', '');
    const v = vehicleDB.find(veh => veh.id === id);
    setMessages(prev => [...prev, {
      id: Date.now().toString(), from: 'bot',
      text: locale === 'fr'
        ? `🚗 **Réservation d'essai**\n\n${v ? `${v.make} ${v.model} — ${v.location}` : 'Véhicule sélectionné'}\n\n📅 Date souhaitée :\n🕐 Heure :\n📍 Adresse de prise en charge :\n\nUn SMS de confirmation vous sera envoyé.`
        : `🚗 **Test Drive Booking**\n\n${v ? `${v.make} ${v.model} — ${v.location}` : 'Selected vehicle'}\n\n📅 Desired date:\n🕐 Time:\n📍 Pickup address:\n\nAn SMS confirmation will be sent.`,
      time: getNow(),
      options: [
        { label: locale === 'fr' ? '✅ Confirmer' : '✅ Confirm', action: 'welcome', icon: '✅', color: 'bg-green-50 border-green-200 text-green-700' },
        { label: locale === 'fr' ? '← Retour' : '← Back', action: 'search_vehicle', icon: '←' },
      ],
    }]);
  };

  const handleSetAlert = (action: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(), from: 'bot',
      text: locale === 'fr'
        ? '🔔 **Alerte prix activée !**\n\nVous serez notifié par SMS lorsque le prix baisse.\n\n✅ Alerte configurée avec succès.'
        : '🔔 **Price alert activated!**\n\nYou\'ll be notified by SMS when the price drops.\n\n✅ Alert configured successfully.',
      time: getNow(),
      options: [{ label: locale === 'fr' ? '🏠 Menu principal' : '🏠 Main menu', action: 'welcome', icon: '🏠' }],
    }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), from: 'user', text: userText, time: getNow() }]);
    setInput('');
    setQuickReplies([]);

    setIsTyping(true);
    setTimeout(() => {
      const lower = userText.toLowerCase();
      const results = searchVehicles(lower, vehicleDB);

      if (results.length > 0) {
        const cards = results.slice(0, 3);
        const vehicleOptions = cards.map(v => ({
            label: `${v.make} ${v.model} — ${formatCFA(v.price)} FCFA`,
            action: `buy_${v.id}`,
            icon: '🚗',
            color: 'bg-white border-gray-200',
          }));
          const extraOptions = [
            { label: locale === 'fr' ? '🔍 Recherche avancée' : '🔍 Advanced search', action: 'advanced_search', icon: '🔍', color: '' },
            { label: locale === 'fr' ? '🏠 Menu' : '🏠 Menu', action: 'welcome', icon: '🏠', color: '' },
          ];
          setMessages(prev => [...prev, {
            id: Date.now().toString(), from: 'bot',
            text: locale === 'fr' ? `🔍 **${cards.length} véhicule(s) trouvé(s) pour "${userText}"` : `🔍 **${cards.length} vehicle(s) found for "${userText}"`,
            time: getNow(),
            options: [...vehicleOptions, ...extraOptions],
          }]);
        setIsTyping(false);
      } else if (lower.includes('bonjour') || lower.includes('hello') || lower.includes('salut') || lower.includes('hi') || lower.includes('hey')) {
        setIsTyping(false);
        addBotMessage('welcome');
      } else if (lower.includes('comparer') || lower.includes('compare')) {
        setIsTyping(false);
        addBotMessage('compare_menu');
      } else if (lower.includes('essai') || lower.includes('test drive') || lower.includes('essayer')) {
        setIsTyping(false);
        addBotMessage('test_drive');
      } else if (lower.includes('alerte') || lower.includes('alert') || lower.includes('notification')) {
        setIsTyping(false);
        addBotMessage('price_alerts');
      } else if (lower.includes('assurance') || lower.includes('insurance')) {
        setIsTyping(false);
        addBotMessage('insurance');
      } else if (lower.includes('financement') || lower.includes('credit') || lower.includes('loan') || lower.includes('installment')) {
        setIsTyping(false);
        addBotMessage('financing');
      } else if (lower.includes('mécanicien') || lower.includes('mechanic') || lower.includes('réparation') || lower.includes('repair')) {
        setIsTyping(false);
        addBotMessage('mechanic');
      } else if (lower.includes('import') || lower.includes('douane') || lower.includes('customs')) {
        setIsTyping(false);
        addBotMessage('import');
      } else {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), from: 'bot',
          text: locale === 'fr'
            ? `🤔 Je n'ai pas trouvé de résultat pour "${userText}". Essayez :`
            : `🤔 No results for "${userText}". Try:`,
          time: getNow(),
          options: [
            { label: locale === 'fr' ? '🚗 Rechercher un véhicule' : '🚗 Search vehicle', action: 'search_vehicle', icon: '🚗' },
            { label: locale === 'fr' ? '💳 Payer' : '💳 Pay', action: 'make_payment', icon: '💳' },
            { label: locale === 'fr' ? '📞 Parler à un agent' : '📞 Talk to agent', action: 'talk_agent', icon: '📞' },
          ],
          quickReplies: locale === 'fr' ? ['Toyota Corolla', 'Mercedes', 'SUV < 15M', 'Neuf'] : ['Toyota Corolla', 'Mercedes', 'SUV < 15M', 'New'],
        }]);
      }
    }, 1000);
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), from: 'system',
        text: locale === 'fr' ? '🎤 Reconnaissance vocale non supportée sur ce navigateur.' : '🎤 Voice recognition not supported on this browser.',
        time: getNow(),
      }]);
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = locale === 'fr' ? 'fr-FR' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), from: 'user', text: `🎤 "${transcript}"`, time: getNow() }]);
        setIsTyping(true);
        setTimeout(() => {
          const lower = transcript.toLowerCase();
          const results = searchVehicles(lower, vehicleDB);
          if (results.length > 0) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(), from: 'bot',
              text: locale === 'fr' ? `🔍 ${results.length} véhicule(s) trouvé(s)` : `🔍 ${results.length} vehicle(s) found`,
              time: getNow(),
              options: [...results.slice(0, 3).map(v => ({
                label: `${v.make} ${v.model} — ${formatCFA(v.price)} FCFA`, action: `buy_${v.id}`, icon: '🚗', color: 'bg-white border-gray-200',
              })), { label: '🏠', action: 'welcome', icon: '🏠', color: '' }],
            }]);
          } else {
            addBotMessage('welcome');
          }
          setIsTyping(false);
        }, 1000);
      }, 300);
    };
    recognition.onerror = () => { setIsListening(false); };
    recognition.onend = () => { setIsListening(false); };
    recognition.start();
  };

  return (
    <>
      {!isOpen && (
        <button onClick={openChat}
          className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[80] w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
          <span className="text-white text-xl">💬</span>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">{unread}</span>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[80] w-[calc(100vw-2rem)] lg:w-[400px] h-[calc(100vh-8rem)] lg:h-[650px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="gradient-primary p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-500"></span>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">AutoBot</p>
              <p className="text-orange-100 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                {locale === 'fr' ? 'En ligne • IA intelligente' : 'Online • Smart AI'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {viewHistory.length > 1 && (
                <button onClick={goBack} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition text-sm">←</button>
              )}
              <button onClick={closeChat} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white scrollbar-hide">
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

                      {/* Vehicle Comparison Table */}
                      {msg.isComparison && msg.comparisonData && msg.comparisonData.length > 0 && (
                        <div className="mt-3 overflow-x-auto">
                          <table className="w-full text-[11px]">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-1 text-gray-500"></th>
                                {msg.comparisonData!.map((v: any, i: number) => (
                                  <th key={i} className="text-center py-1 px-2 font-bold text-orange-600">{v.make}<br/>{v.model}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {['price', 'year', 'mileage', 'fuel', 'condition', 'location'].map(field => (
                                <tr key={field} className="border-b border-gray-50">
                                  <td className="py-1 text-gray-500 capitalize">{field === 'price' ? 'Prix' : field === 'year' ? 'Année' : field === 'mileage' ? 'Km' : field === 'fuel' ? 'Carburant' : field === 'condition' ? 'État' : 'Lieu'}</td>
                                  {msg.comparisonData!.map((v: any, i: number) => (
                                    <td key={i} className="text-center py-1 px-2 font-medium">
                                      {field === 'price' ? `${formatCFA(v[field])}F` : field === 'mileage' ? `${(v[field]/1000).toFixed(0)}k` : v[field]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="flex gap-1 mt-2">
                            {msg.comparisonData!.map((v: any) => (
                              <button key={v.id} onClick={() => handleOptionClick(`buy_${v.id}`)}
                                className="flex-1 py-1.5 rounded-lg bg-orange-500 text-white text-[10px] font-semibold">
                                {locale === 'fr' ? 'Acheter' : 'Buy'} {v.model}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[9px] text-gray-400 text-right mt-1">{msg.time}</p>
                    </div>
                  </div>
                )}

                {/* Options */}
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

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-[10px] text-gray-400">{locale === 'fr' ? 'AutoBot réfléchit...' : 'AutoBot thinking...'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick replies */}
            {!isTyping && quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {quickReplies.map((qr) => (
                  <button key={qr} onClick={() => { setInput(qr); }}
                    className="px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium hover:bg-orange-100 transition">
                    {qr}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <button onClick={handleVoice}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                🎤
              </button>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                placeholder={isListening ? (locale === 'fr' ? '🎤 Écoute en cours...' : '🎤 Listening...') : (locale === 'fr' ? 'Tapez ou dictez...' : 'Type or speak...')} />
              <button onClick={handleSend}
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

// ===== HELPER FUNCTIONS =====

function searchVehicles(query: string, db: VehicleCard[]): VehicleCard[] {
  const q = query.toLowerCase();
  return db.filter(v =>
    v.make.toLowerCase().includes(q) ||
    v.model.toLowerCase().includes(q) ||
    v.location.toLowerCase().includes(q) ||
    v.condition.toLowerCase().includes(q) ||
    v.fuel.toLowerCase().includes(q) ||
    v.color.toLowerCase().includes(q) ||
    (q.includes('suv') && ['Tucson', 'Sportage', 'RAV4', 'GLC', 'Qashqai'].includes(v.model)) ||
    (q.includes('berline') && ['Corolla', 'C200', 'Série 3', '308'].includes(v.model)) ||
    (q.includes('neuf') && v.condition === 'Neuf') ||
    (q.includes('new') && v.condition === 'Neuf') ||
    (q.includes('occasion') && v.condition === 'Occasion') ||
    (q.includes('diesel') && v.fuel === 'Diesel') ||
    (q.includes('essence') && v.fuel === 'Essence') ||
    (q.includes('hybride') && v.fuel === 'Hybride') ||
    (q.includes('< 10m') && v.price < 10000000) ||
    (q.includes('< 15m') && v.price < 15000000) ||
    (q.includes('< 20m') && v.price < 20000000) ||
    (q.includes('> 20m') && v.price > 20000000) ||
    (q.includes('abidjan') && v.location.includes('Abidjan')) ||
    (q.includes('dakar') && v.location.includes('Dakar')) ||
    (q.includes('lagos') && v.location.includes('Lagos'))
  );
}

function getLabel(action: string, locale: string): string {
  const labels: Record<string, string> = {
    welcome: '🏠 ' + (locale === 'fr' ? 'Menu principal' : 'Main menu'),
    search_vehicle: '🚗 ' + (locale === 'fr' ? 'Rechercher' : 'Search'),
    make_payment: '💳 ' + (locale === 'fr' ? 'Payer' : 'Pay'),
    manage_inventory: '📦 ' + (locale === 'fr' ? 'Inventaire' : 'Inventory'),
    crm_menu: '👤 ' + (locale === 'fr' ? 'Clients' : 'Clients'),
    stats: '📊 ' + (locale === 'fr' ? 'Stats' : 'Stats'),
    escrow_info: '🛡️ ' + (locale === 'fr' ? 'Séquestre' : 'Escrow'),
    find_agent: '🏪 ' + (locale === 'fr' ? 'Agents' : 'Agents'),
    crossborder: '🌍 ' + (locale === 'fr' ? 'Transfrontalier' : 'Cross-border'),
    help: '❓ ' + (locale === 'fr' ? 'Aide' : 'Help'),
  };
  return labels[action] || action;
}

interface FlowResult {
  text: string;
  options?: { label: string; action: string; icon?: string; color?: string }[];
  card?: VehicleCard;
  quickReplies?: string[];
  isComparison?: boolean;
  comparisonData?: any[];
}

function getFlow(action: string, locale: string, db: VehicleCard[]): FlowResult {
  const L = (fr: string, en: string) => locale === 'fr' ? fr : en;

  const flows: Record<string, () => FlowResult> = {
    welcome: () => ({
      text: L(
        'Bonjour ! 👋 Je suis **AutoBot**, votre assistant IA.\n\nJe peux vous aider à :\n• 🚗 Trouver le véhicule idéal\n• 💳 Payer par Mobile Money\n• 📦 Gérer votre inventaire\n• 👥 suivre vos clients\n• 📊 Analyser vos ventes\n\nQue souhaitez-vous faire ?',
        'Hello! 👋 I\'m **AutoBot**, your AI assistant.\n\nI can help you:\n• 🚗 Find the perfect vehicle\n• 💳 Pay with Mobile Money\n• 📦 Manage your inventory\n• 👥 Track your customers\n• 📊 Analyze your sales\n\nWhat would you like to do?'
      ),
      options: [
        { label: L('🚗 Rechercher un véhicule', '🚗 Search vehicle'), action: 'search_vehicle', icon: '🚗' },
        { label: L('💳 Effectuer un paiement', '💳 Make payment'), action: 'make_payment', icon: '💳' },
        { label: L('📦 Gérer inventaire', '📦 Manage inventory'), action: 'manage_inventory', icon: '📦' },
        { label: L('👤 Gestion clients', '👤 CRM'), action: 'crm_menu', icon: '👤' },
        { label: L('📊 Statistiques', '📊 Stats'), action: 'stats', icon: '📊' },
        { label: L('🛡️ Séquestre', '🛡️ Escrow'), action: 'escrow_info', icon: '🛡️' },
        { label: L('🏪 Trouver agent', '🏪 Find agent'), action: 'find_agent', icon: '🏪' },
        { label: L('🌍 Transfrontalier', '🌍 Cross-border'), action: 'crossborder', icon: '🌍' },
        { label: L('🔍 Comparer véhicules', '🔍 Compare vehicles'), action: 'compare_menu', icon: '🔍' },
        { label: L('🚗 Essai routier', '🚗 Test drive'), action: 'test_drive', icon: '🚗' },
        { label: L('🔔 Alertes prix', '🔔 Price alerts'), action: 'price_alerts', icon: '🔔' },
        { label: L('🛡️ Assurance', '🛡️ Insurance'), action: 'insurance', icon: '🛡️' },
        { label: L('💰 Financement', '💰 Financing'), action: 'financing', icon: '💰' },
        { label: L('🔧 Mécanicien', '🔧 Mechanic'), action: 'mechanic', icon: '🔧' },
        { label: L('📦 Import/Douane', '📦 Import/Customs'), action: 'import', icon: '📦' },
        { label: L('❓ Aide', '❓ Help'), action: 'help', icon: '❓' },
      ],
      quickReplies: locale === 'fr'
        ? ['Toyota Corolla', 'Mercedes C200', 'SUV diesel', 'Budget < 15M']
        : ['Toyota Corolla', 'Mercedes C200', 'SUV diesel', 'Budget < 15M'],
    }),

    search_vehicle: () => ({
      text: L('🔍 **Recherche de véhicule**\n\nTapez une marque, modèle, ville ou critère.\nExemples : "Toyota Abidjan", "SUV < 15M", "Diesel Dakar"', '🔍 **Vehicle Search**\n\nType a brand, model, city or criteria.\nExamples: "Toyota Abidjan", "SUV < 15M", "Diesel Dakar"'),
      options: [
        { label: '🚗 Toyota', action: 'search_toyota', icon: '🚗' },
        { label: '🚗 Mercedes-Benz', action: 'search_mercedes', icon: '🚗' },
        { label: '🚗 Hyundai', action: 'search_hyundai', icon: '🚗' },
        { label: '🚗 BMW', action: 'search_bmw', icon: '🚗' },
        { label: '🚗 Kia', action: 'search_kia', icon: '🚗' },
        { label: L('🏙️ Par ville', '🏙️ By city'), action: 'search_by_city', icon: '🏙️' },
        { label: L('💰 Par budget', '💰 By budget'), action: 'search_by_budget', icon: '💰' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
      quickReplies: locale === 'fr'
        ? ['Toyota Corolla', 'Mercedes C200', 'SUV', 'Diesel < 15M']
        : ['Toyota Corolla', 'Mercedes C200', 'SUV', 'Diesel < 15M'],
    }),

    search_toyota: () => {
      const cars = db.filter(v => v.make === 'Toyota');
      return {
        text: L(`🚗 **Toyota disponibles (${cars.length})** :`, `🚗 **Available Toyota (${cars.length})**:`),
        options: [...cars.map(v => ({
          label: `${v.model} ${v.year} — ${formatCFA(v.price)}F — ${v.location.split(',')[0]}`,
          action: `buy_${v.id}`, icon: '🚗', color: 'bg-white border-gray-200',
        })), { label: L('📞 Contacter un vendeur', '📞 Contact seller'), action: 'contact_seller', icon: '📞', color: '' },
          { label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←', color: '' }],
      };
    },

    search_mercedes: () => {
      const cars = db.filter(v => v.make === 'Mercedes-Benz');
      return {
        text: L(`🚗 **Mercedes-Benz disponibles (${cars.length})** :`, `🚗 **Available Mercedes-Benz (${cars.length})**:`),
        options: [...cars.map(v => ({
          label: `${v.model} ${v.year} — ${formatCFA(v.price)}F — ${v.location.split(',')[0]}`,
          action: `buy_${v.id}`, icon: '🚗', color: 'bg-white border-gray-200',
        })), { label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←', color: '' }],
      };
    },

    search_hyundai: () => {
      const cars = db.filter(v => v.make === 'Hyundai');
      return {
        text: L(`🚗 **Hyundai disponibles (${cars.length})** :`, `🚗 **Available Hyundai (${cars.length})**:`),
        options: [...cars.map(v => ({
          label: `${v.model} ${v.year} — ${formatCFA(v.price)}F — ${v.location.split(',')[0]}`,
          action: `buy_${v.id}`, icon: '🚗', color: 'bg-white border-gray-200',
        })), { label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←', color: '' }],
      };
    },

    search_bmw: () => {
      const cars = db.filter(v => v.make === 'BMW');
      return {
        text: L(`🚗 **BMW disponibles (${cars.length})** :`, `🚗 **Available BMW (${cars.length})**:`),
        options: [...cars.map(v => ({
          label: `${v.model} ${v.year} — ${formatCFA(v.price)}F — ${v.location.split(',')[0]}`,
          action: `buy_${v.id}`, icon: '🚗', color: 'bg-white border-gray-200',
        })), { label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←', color: '' }],
      };
    },

    search_kia: () => {
      const cars = db.filter(v => v.make === 'Kia');
      return {
        text: L(`🚗 **Kia disponibles (${cars.length})** :`, `🚗 **Available Kia (${cars.length})**:`),
        options: [...cars.map(v => ({
          label: `${v.model} ${v.year} — ${formatCFA(v.price)}F — ${v.location.split(',')[0]}`,
          action: `buy_${v.id}`, icon: '🚗', color: 'bg-white border-gray-200',
        })), { label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←', color: '' }],
      };
    },

    search_by_city: () => ({
      text: L('🏙️ **Recherche par ville :**', '🏙️ **Search by city:**'),
      options: [
        { label: '📍 Abidjan', action: 'search_toyota', icon: '📍' },
        { label: '📍 Dakar', action: 'search_mercedes', icon: '📍' },
        { label: '📍 Lagos', action: 'search_bmw', icon: '📍' },
        { label: '📍 Accra', action: 'search_kia', icon: '📍' },
        { label: '📍 Ouagadougou', action: 'search_by_city', icon: '📍' },
        { label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←' },
      ],
    }),

    search_by_budget: () => ({
      text: L('💰 **Recherche par budget :**', '💰 **Search by budget:**'),
      options: [
        { label: '< 10M FCFA', action: 'search_kia', icon: '💰' },
        { label: '10M — 20M FCFA', action: 'search_toyota', icon: '💰' },
        { label: '20M — 30M FCFA', action: 'search_mercedes', icon: '💰' },
        { label: '> 30M FCFA', action: 'search_bmw', icon: '💰' },
        { label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←' },
      ],
    }),

    compare_menu: () => ({
      text: L('🔍 **Comparer des véhicules**\n\nSélectionnez 2 véhicules à comparer :', '🔍 **Compare vehicles**\n\nSelect 2 vehicles to compare:'),
      options: [
        { label: 'Corolla vs C200', action: 'compare_VH001_VH002', icon: '⚖️' },
        { label: 'Tucson vs Sportage', action: 'compare_VH003_VH006', icon: '⚖️' },
        { label: 'C200 vs BMW Série 3', action: 'compare_VH002_VH004', icon: '⚖️' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    test_drive: () => ({
      text: L('🚗 **Réserver un essai routier**\n\nSélectionnez un véhicule pour planifier un essai :', '🚗 **Book a test drive**\n\nSelect a vehicle to schedule a test:'),
      options: [
        { label: 'Toyota Corolla 2022', action: 'book_testdrive_VH001', icon: '🚗' },
        { label: 'Mercedes C200 2023', action: 'book_testdrive_VH002', icon: '🚗' },
        { label: 'Hyundai Tucson 2024', action: 'book_testdrive_VH003', icon: '🚗' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    price_alerts: () => ({
      text: L('🔔 **Alertes de prix**\n\nSoyez notifié quand le prix baisse :', '🔔 **Price Alerts**\n\nGet notified when the price drops:'),
      options: [
        { label: 'Toyota Corolla — Alerte -10%', action: 'set_alert_VH001', icon: '🔔' },
        { label: 'Mercedes C200 — Alerte -15%', action: 'set_alert_VH002', icon: '🔔' },
        { label: L('Toutes les Toyota', 'All Toyota'), action: 'set_alert_all_toyota', icon: '🔔' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    insurance: () => ({
      text: L('🛡️ **Assurance Auto**\n\nPartenaires : Allianz, NSIA, AXA\n\n• Tiers : 2.5% du prix\n• Tous risques : 4.5% du prix\n• Mini tous risques : 3.5% du prix\n\nSouscrivez en ligne en 3 minutes.', '🛡️ **Car Insurance**\n\nPartners: Allianz, NSIA, AXA\n\n• Third party: 2.5% of price\n• Full coverage: 4.5% of price\n• Mini full: 3.5% of price\n\nSubscribe online in 3 minutes.'),
      options: [
        { label: L('📝 Souscrire', '📝 Subscribe'), action: 'welcome', icon: '📝' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    financing: () => ({
      text: L('💰 **Financement automobile**\n\n• Crédit auto 6-24 mois\n• Taux : 2.5% — 4.5%/mois\n• Apport min : 10%\n• Paiement via Mobile Money\n\nExemple : 10M FCFA en 12 mois = ~950 000 FCFA/mois', '💰 **Vehicle Financing**\n\n• Auto loan 6-24 months\n• Rate: 2.5% — 4.5%/month\n• Min down: 10%\n• Payment via Mobile Money\n\nExample: 10M FCFA in 12 months = ~950,000 FCFA/month'),
      options: [
        { label: L('📝 Demander un crédit', '📝 Apply for loan'), action: 'welcome', icon: '📝' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    mechanic: () => ({
      text: L('🔧 **Réseau de mécaniciens**\n\n500+ mécaniciens certifiés en Afrique de l\'Ouest.\n\n• Entretien régulier\n• Réparation moteur\n• Carrosserie\n• Électronique\n\nRéservez en ligne.', '🔧 **Mechanic Network**\n\n500+ certified mechanics in West Africa.\n\n• Regular maintenance\n• Engine repair\n• Bodywork\n• Electronics\n\nBook online.'),
      options: [
        { label: L('📍 Trouver un mécanicien', '📍 Find mechanic'), action: 'find_agent', icon: '📍' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    import: () => ({
      text: L('📦 **Import / Douane ECOWAS**\n\n• Tarif extérieur commun : 20-35%\n• Document : C131, facture, certificat d\'origine\n• Délai : 5-15 jours\n• Frais AutoAfrique : 2% du montant\n\nNous gérons toute la procédure.', '📦 **Import / ECOWAS Customs**\n\n• Common external tariff: 20-35%\n• Documents: C131, invoice, certificate of origin\n• Timeline: 5-15 days\n• AutoAfrique fee: 2% of amount\n\nWe handle the entire process.'),
      options: [
        { label: L('📝 Démarrer un import', '📝 Start import'), action: 'welcome', icon: '📝' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    advanced_search: () => ({
      text: L('🔍 **Recherche avancée**\n\nTapez vos critères :\n• "SUV diesel Abidjan < 15M"\n• "Toyota neuf Dakar"\n• "Mercedes occasion > 20M"', '🔍 **Advanced Search**\n\nType your criteria:\n• "SUV diesel Abidjan < 15M"\n• "Toyota new Dakar"\n• "Mercedes used > 20M"'),
      options: [{ label: L('← Retour', '← Back'), action: 'search_vehicle', icon: '←' }],
    }),

    make_payment: () => ({
      text: L('💳 **Paiement Mobile Money**\n\nChoisissez :', '💳 **Mobile Money Payment**\n\nChoose:'),
      options: [
        { label: '🟠 Orange Money', action: 'pay_om', icon: '🟠', color: 'bg-orange-50 border-orange-200 text-orange-700' },
        { label: '🟡 MTN MoMo', action: 'pay_mtn', icon: '🟡', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
        { label: '🔵 Wave', action: 'pay_wave', icon: '🔵', color: 'bg-blue-50 border-blue-200 text-blue-700' },
        { label: '🔷 Moov Money', action: 'pay_moov', icon: '🔷', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
        { label: '🏦 Virement', action: 'pay_bank', icon: '🏦' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    pay_om: () => ({
      text: L('🟠 **Orange Money**\n\n📱 Entrez votre numéro\n🔐 PIN pour confirmer\n\nFrais : 1.5% • Limite : 5M FCFA', '🟠 **Orange Money**\n\n📱 Enter your number\n🔐 PIN to confirm\n\nFee: 1.5% • Limit: 5M FCFA'),
      options: [
        { label: L('📱 Payer maintenant', '📱 Pay now'), action: 'enter_phone_om', icon: '📱' },
        { label: L('← Retour', '← Back'), action: 'make_payment', icon: '←' },
      ],
    }),

    pay_mtn: () => ({
      text: L('🟡 **MTN MoMo**\n\n📱 Entrez votre numéro\n📡 USSD pour confirmer\n\nFrais : 1.8% • Limite : 7M FCFA', '🟡 **MTN MoMo**\n\n📱 Enter your number\n📡 USSD to confirm\n\nFee: 1.8% • Limit: 7M FCFA'),
      options: [
        { label: L('📱 Payer maintenant', '📱 Pay now'), action: 'enter_phone_mtn', icon: '📱' },
        { label: L('← Retour', '← Back'), action: 'make_payment', icon: '←' },
      ],
    }),

    pay_wave: () => ({
      text: L('🔵 **Wave**\n\n📱 Entrez votre numéro\n📲 Approuver dans l\'app\n\nFrais : 1.0% • Limite : 10M FCFA', '🔵 **Wave**\n\n📱 Enter your number\n📲 Approve in app\n\nFee: 1.0% • Limit: 10M FCFA'),
      options: [
        { label: L('📱 Payer maintenant', '📱 Pay now'), action: 'enter_phone_wave', icon: '📱' },
        { label: L('← Retour', '← Back'), action: 'make_payment', icon: '←' },
      ],
    }),

    pay_moov: () => ({
      text: L('🔷 **Moov Money**\n\n📱 Entrez votre numéro\n📩 Répondez à la notification\n\nFrais : 1.5% • Limite : 5M FCFA', '🔷 **Moov Money**\n\n📱 Enter your number\n📩 Respond to notification\n\nFee: 1.5% • Limit: 5M FCFA'),
      options: [
        { label: L('📱 Payer maintenant', '📱 Pay now'), action: 'enter_phone_moov', icon: '📱' },
        { label: L('← Retour', '← Back'), action: 'make_payment', icon: '←' },
      ],
    }),

    pay_bank: () => ({
      text: L('🏦 **Virement bancaire**\n\nSGBCI / BICICI / Ecobank\nRIB : CI05 1234 5678 9012\nRéf : Nom + commande\n\nConfirmation sous 24-48h.', '🏦 **Bank Transfer**\n\nSGBCI / BICICI / Ecobank\nIBAN: CI05 1234 5678 9012\nRef: Name + order\n\nConfirmed within 24-48h.'),
      options: [
        { label: L('✅ J\'ai payé', '✅ I paid'), action: 'confirm_transfer', icon: '✅' },
        { label: L('← Retour', '← Back'), action: 'make_payment', icon: '←' },
      ],
    }),

    confirm_transfer: () => ({
      text: L('✅ **Virement confirmé !**\n\n📋 Réf : VB-2026-001\n⏳ Vérification : 24-48h\n📩 SMS de confirmation envoyé', '✅ **Transfer confirmed!**\n\n📋 Ref: VB-2026-001\n⏳ Verification: 24-48h\n📩 SMS confirmation sent'),
      options: [{ label: L('🏠 Menu', '🏠 Menu'), action: 'welcome', icon: '🏠' }],
    }),

    enter_phone_om: () => ({ text: L('📱 **Orange Money connecté !**\n\n✅ STK Push envoyé\n📱 +225 07 XX XX XX\n💰 Montant en attente', '📱 **Orange Money connected!**\n\n✅ STK Push sent\n📱 +225 07 XX XX XX\n💰 Amount pending'), options: [{ label: L('✅ Confirmé', '✅ Confirmed'), action: 'welcome', icon: '✅' }] }),
    enter_phone_mtn: () => ({ text: L('📱 **MTN MoMo connecté !**\n\n✅ USSD en cours\n📱 +223 XX XX XX XX', '📱 **MTN MoMo connected!**\n\n✅ USSD in progress\n📱 +223 XX XX XX XX'), options: [{ label: L('✅ Confirmé', '✅ Confirmed'), action: 'welcome', icon: '✅' }] }),
    enter_phone_wave: () => ({ text: L('📱 **Wave connecté !**\n\n✅ Notification envoyée\n📱 +221 77 XX XX XX', '📱 **Wave connected!**\n\n✅ Notification sent\n📱 +221 77 XX XX XX'), options: [{ label: L('✅ Confirmé', '✅ Confirmed'), action: 'welcome', icon: '✅' }] }),
    enter_phone_moov: () => ({ text: L('📱 **Moov Money connecté !**\n\n✅ Notification en cours\n📱 +229 XX XX XX XX', '📱 **Moov Money connected!**\n\n✅ Notification in progress\n📱 +229 XX XX XX XX'), options: [{ label: L('✅ Confirmé', '✅ Confirmed'), action: 'welcome', icon: '✅' }] }),

    manage_inventory: () => ({
      text: L('📦 **Inventaire**\n\n📋 5 véhicules • 93.5M FCFA\n✅ 3 disponibles\n📌 1 réservé\n🛡️ 1 en séquestre', '📦 **Inventory**\n\n📋 5 vehicles • 93.5M FCFA\n✅ 3 available\n📌 1 reserved\n🛡️ 1 in escrow'),
      options: [
        { label: L('➕ Ajouter', '➕ Add'), action: 'add_vehicle', icon: '➕' },
        { label: L('📋 Voir tout', '📋 View all'), action: 'open_inventory', icon: '📋' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    add_vehicle: () => ({
      text: L('➕ **Ajouter un véhicule**\n\nMarque, modèle, année, prix, état...\nRemplissez le formulaire sur le dashboard.', '➕ **Add a vehicle**\n\nMake, model, year, price, condition...\nFill the form on the dashboard.'),
      options: [
        { label: L('📋 Ouvrir le formulaire', '📋 Open form'), action: 'open_inventory', icon: '📋' },
        { label: L('← Retour', '← Back'), action: 'manage_inventory', icon: '←' },
      ],
    }),

    crm_menu: () => ({
      text: L('👤 **CRM — 6 clients actifs**\n\n👑 VIP : Amadou Diallo, Aïcha Koné\n👤 Clients : Fatou Sow, Grace Mensah\n🎯 Leads : Ibrahim Touré, Kofi Asante', '👤 **CRM — 6 active clients**\n\n👑 VIP: Amadou Diallo, Aïcha Koné\n👤 Customers: Fatou Sow, Grace Mensah\n🎯 Leads: Ibrahim Touré, Kofi Asante'),
      options: [
        { label: L('➕ Ajouter client', '➕ Add client'), action: 'add_client', icon: '➕' },
        { label: L('🔔 Relances', '🔔 Follow-ups'), action: 'follow_up', icon: '🔔' },
        { label: L('👑 VIP', '👑 VIP'), action: 'vip_clients', icon: '👑' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    add_client: () => ({ text: L('➕ **Nouveau client**\n\nNom, email, téléphone, pays...', '➕ **New client**\n\nName, email, phone, country...'), options: [{ label: L('✅ Enregistrer', '✅ Save'), action: 'welcome', icon: '✅' }] }),
    follow_up: () => ({ text: L('🔔 **Relances :**\n\n📞 Ibrahim Touré — 5j sans contact\n📞 Kofi Asante — Devis en attente', '🔔 **Follow-ups:**\n\n📞 Ibrahim Touré — 5d no contact\n📞 Kofi Asante — Quote pending'), options: [{ label: L('📞 Appeler', '📞 Call'), action: 'call_support', icon: '📞' }, { label: L('← Retour', '← Back'), action: 'crm_menu', icon: '←' }] }),
    vip_clients: () => ({ text: L('👑 **Clients VIP :**\n\n1. Amadou Diallo — 3 achats — CI\n2. Aïcha Koné — 5 achats — CI', '👑 **VIP Clients:**\n\n1. Amadou Diallo — 3 purchases — CI\n2. Aïcha Koné — 5 purchases — CI'), options: [{ label: L('← Retour', '← Back'), action: 'crm_menu', icon: '←' }] }),

    stats: () => ({
      text: L('📊 **Stats du mois :**\n\n🚗 247 véhicules • 💰 425M FCFA\n📈 +15.8% croissance • 🏷️ 38 ventes\n💳 OM 54% • Wave 25% • MTN 21%', '📊 **Monthly stats:**\n\n🚗 247 vehicles • 💰 425M FCFA\n📈 +15.8% growth • 🏷️ 38 sales\n💳 OM 54% • Wave 25% • MTN 21%'),
      options: [
        { label: L('📊 Dashboard', '📊 Dashboard'), action: 'open_dashboard', icon: '📊' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    escrow_info: () => ({
      text: L('🛡️ **Séquestre AutoAfrique**\n\n1️⃣ Paiement → fonds bloqués\n2️⃣ Inspection 7 jours\n3️⃣ Approbation → libération\n4️⃣ Litige → médiation 48h\n\n💰 1% du montant', '🛡️ **AutoAfrique Escrow**\n\n1️⃣ Payment → funds locked\n2️⃣ Inspection 7 days\n3️⃣ Approval → release\n4️⃣ Dispute → mediation 48h\n\n💰 1% of amount'),
      options: [
        { label: L('🛡️ Créer', '🛡️ Create'), action: 'escrow_create', icon: '🛡️' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    escrow_create: () => ({ text: L('🛡️ **Séquestre créé !**\n\n📋 Réf : ESC-' + Date.now().toString().slice(-6) + '\n⏳ Inspection : 7 jours\n💰 Fonds sécurisés', '🛡️ **Escrow created!**\n\n📋 Ref: ESC-' + Date.now().toString().slice(-6) + '\n⏳ Inspection: 7 days\n💰 Funds secured'), options: [{ label: L('✅', '✅'), action: 'welcome', icon: '✅' }] }),

    find_agent: () => ({
      text: L('🏪 **850+ agents dans 10 pays**', '🏪 **850+ agents in 10 countries**'),
      options: [
        { label: '📍 Abidjan (12)', action: 'agent_abidjan', icon: '📍' },
        { label: '📍 Dakar (8)', action: 'agent_dakar', icon: '📍' },
        { label: '📍 Lagos (15)', action: 'agent_lagos', icon: '📍' },
        { label: '📍 Accra (6)', action: 'agent_accra', icon: '📍' },
        { label: '📍 Ouaga (5)', action: 'agent_ouaga', icon: '📍' },
        { label: L('🗺️ Carte', '🗺️ Map'), action: 'map_agents', icon: '🗺️' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    agent_abidjan: () => ({ text: L('📍 **Agents Abidjan :**\n\n🏪 Point Pay Plateau — ⭐4.8\n🏪 AutoChange Cocody — ⭐4.6\n🏪 Mobile Money Marcory — ⭐4.5', '📍 **Agents Abidjan:**\n\n🏪 Point Pay Plateau — ⭐4.8\n🏪 AutoChange Cocody — ⭐4.6\n🏪 Mobile Money Marcory — ⭐4.5'), options: [{ label: L('📞 Appeler', '📞 Call'), action: 'call_support', icon: '📞' }, { label: L('← Retour', '← Back'), action: 'find_agent', icon: '←' }] }),
    agent_dakar: () => ({ text: L('📍 **Agents Dakar :**\n\n🏪 Wave Express Almadies — ⭐4.7\n🏪 OM Plateau — ⭐4.5', '📍 **Agents Dakar:**\n\n🏪 Wave Express Almadies — ⭐4.7\n🏪 OM Plateau — ⭐4.5'), options: [{ label: L('📞 Appeler', '📞 Call'), action: 'call_support', icon: '📞' }, { label: L('← Retour', '← Back'), action: 'find_agent', icon: '←' }] }),
    agent_lagos: () => ({ text: L('📍 **Agents Lagos :**\n\n🏪 MTN Island — ⭐4.3\n🏪 OPay Victoria — ⭐4.2', '📍 **Agents Lagos:**\n\n🏪 MTN Island — ⭐4.3\n🏪 OPay Victoria — ⭐4.2'), options: [{ label: L('📞 Appeler', '📞 Call'), action: 'call_support', icon: '📞' }, { label: L('← Retour', '← Back'), action: 'find_agent', icon: '←' }] }),
    agent_accra: () => ({ text: L('📍 **Agents Accra :**\n\n🏪 MTN Osu — ⭐4.5\n🏪 Vodafone East Legon — ⭐4.3', '📍 **Agents Accra:**\n\n🏪 MTN Osu — ⭐4.5\n🏪 Vodafone East Legon — ⭐4.3'), options: [{ label: L('📞 Appeler', '📞 Call'), action: 'call_support', icon: '📞' }, { label: L('← Retour', '← Back'), action: 'find_agent', icon: '←' }] }),
    agent_ouaga: () => ({ text: L('📍 **Agents Ouaga :**\n\n🏪 Orange Koudougou — ⭐4.4\n🏪 Moov Zone — ⭐4.2', '📍 **Agents Ouaga:**\n\n🏪 Orange Koudougou — ⭐4.4\n🏪 Moov Zone — ⭐4.2'), options: [{ label: L('📞 Appeler', '📞 Call'), action: 'call_support', icon: '📞' }, { label: L('← Retour', '← Back'), action: 'find_agent', icon: '←' }] }),

    crossborder: () => ({
      text: L('🌍 **PAPSS — Paiements transfrontaliers**\n\n• Zone UEMOA : 1:1 FCFA (gratuit)\n• Nigeria / Ghana : taux réel\n• Frais : 0.5% • Instantané', '🌍 **PAPSS — Cross-border payments**\n\n• UEMOA zone: 1:1 CFA (free)\n• Nigeria / Ghana: real rate\n• Fee: 0.5% • Instant'),
      options: [
        { label: L('🔄 Envoyer', '🔄 Send'), action: 'send_money', icon: '🔄' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    send_money: () => ({ text: L('🔄 **Envoyer de l\'argent**\n\nDe → Vers → Montant → Destinataire', '🔄 **Send money**\n\nFrom → To → Amount → Recipient'), options: [{ label: L('✅ Envoyer', '✅ Send'), action: 'welcome', icon: '✅' }] }),

    help: () => ({
      text: L('❓ **Support**\n\n📧 support@autoafrique.com\n📞 +225 27 20 30 40\n💬 WhatsApp : +225 07 08 09 10\n🕐 Lun-Sam 8h-19h', '❓ **Support**\n\n📧 support@autoafrique.com\n📞 +225 27 20 30 40\n💬 WhatsApp: +225 07 08 09 10\n🕐 Mon-Sat 8am-7pm'),
      options: [
        { label: L('💬 WhatsApp', '💬 WhatsApp'), action: 'whatsapp_support', icon: '💬', color: 'bg-green-50 border-green-200 text-green-700' },
        { label: L('📞 Appeler', '📞 Call'), action: 'call_support', icon: '📞', color: 'bg-blue-50 border-blue-200 text-blue-700' },
        { label: L('📧 Email', '📧 Email'), action: 'send_email', icon: '📧' },
        { label: L('📖 FAQ', '📖 FAQ'), action: 'faq', icon: '📖' },
        { label: L('← Retour', '← Back'), action: 'welcome', icon: '←' },
      ],
    }),

    faq: () => ({ text: L('📖 **FAQ :**\n\n❓ Payer ? → Mobile Money\n❓ Séquestre ? → 7 jours\n❓ Annulation ? → 48h, remboursement\n❓ Litige ? → Médiation auto', '📖 **FAQ:**\n\n❓ Pay? → Mobile Money\n❓ Escrow? → 7 days\n❓ Cancel? → 48h, refund\n❓ Dispute? → Auto mediation'), options: [{ label: L('💬 Plus', '💬 More'), action: 'talk_agent', icon: '💬' }, { label: L('← Retour', '← Back'), action: 'help', icon: '←' }] }),

    talk_agent: () => ({ text: L('💬 **Connexion agent...**\n\n⏳ ~2 min d\'attente', '💬 **Connecting to agent...**\n\n⏳ ~2 min wait'), options: [{ label: L('📱 WhatsApp', '📱 WhatsApp'), action: 'whatsapp_support', icon: '📱', color: 'bg-green-50 border-green-200 text-green-700' }, { label: L('← Retour', '← Back'), action: 'help', icon: '←' }] }),

    whatsapp_support: () => ({ text: L('💬 **WhatsApp**\n\nOuverture...', '💬 **WhatsApp**\n\nOpening...'), options: [] }),
    call_support: () => ({ text: L('📞 **Appel...**\n\n+225 27 20 30 40', '📞 **Calling...**\n\n+225 27 20 30 40'), options: [] }),
    send_email: () => ({ text: L('📧 **Email**\n\nsupport@autoafrique.com', '📧 **Email**\n\nsupport@autoafrique.com'), options: [] }),
    map_agents: () => ({ text: L('🗺️ **Carte**\n\nOuverture Google Maps...', '🗺️ **Map**\n\nOpening Google Maps...'), options: [] }),
    open_dashboard: () => ({ text: L('📊 Dashboard...', '📊 Dashboard...'), options: [] }),
    open_marketplace: () => ({ text: L('🏪 Marketplace...', '🏪 Marketplace...'), options: [] }),
    open_inventory: () => ({ text: L('📦 Inventaire...', '📦 Inventory...'), options: [] }),
    open_payments: () => ({ text: L('💳 Paiements...', '💳 Payments...'), options: [] }),
    follow_up_2: () => ({ text: L('🔔 **Relances**\n\n📞 Ibrahim Touré — 5j\n📞 Kofi Asante — Devis', '🔔 **Follow-ups**\n\n📞 Ibrahim Touré — 5d\n📞 Kofi Asante — Quote'), options: [{ label: L('← Retour', '← Back'), action: 'crm_menu', icon: '←' }] }),
  };

  return flows[action]?.() || flows.welcome!();
}

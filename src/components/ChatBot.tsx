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
    'Bonjour ! 👋 Je suis **AutoBot**, l\'assistant d\'AutoAfrique.\n\nJe peux vous orienter vers les fonctionnalités du site :\n• 🏪 Catalogue de pièces détachées\n• 🚙 Annonces de véhicules\n• 📦 Inventaire\n• 💳 Paiements Mobile Money\n• ❓ Aide\n• ✉️ Contact\n\nJe n\'affiche aucune donnée inventée : choisissez une option pour ouvrir la page correspondante.',
    'Hello! 👋 I\'m **AutoBot**, AutoAfrique\'s assistant.\n\nI can point you to the site\'s features:\n• 🏪 Spare parts catalogue\n• 🚙 Vehicle listings\n• 📦 Inventory\n• 💳 Mobile Money payments\n• ❓ Help\n• ✉️ Contact\n\nI don\'t show any invented data: pick an option to open the relevant page.'
  );

  const welcomeOptions: FlowOption[] = [
    { label: L('🏪 Catalogue pièces', '🏪 Parts catalogue'), action: 'open_marketplace', icon: '🏪' },
    { label: L('🚙 Véhicules', '🚙 Vehicles'), action: 'open_vehicles', icon: '🚙' },
    { label: L('📦 Inventaire', '📦 Inventory'), action: 'open_inventory', icon: '📦' },
    { label: L('💳 Paiements', '💳 Payments'), action: 'open_payments', icon: '💳' },
    { label: L('❓ Aide', '❓ Help'), action: 'open_aide', icon: '❓' },
    { label: L('✉️ Contact & support', '✉️ Contact & support'), action: 'open_contact', icon: '✉️' },
  ];

  const flows: Record<string, Flow> = {
    welcome: { label: L('🏠 Menu principal', '🏠 Main menu'), reply: welcomeText, options: welcomeOptions },
    open_marketplace: { label: L('🏪 Catalogue pièces', '🏪 Parts catalogue'), url: '/dashboard/marketplace' },
    open_vehicles: { label: L('🚙 Véhicules', '🚙 Vehicles'), url: '/dashboard/vehicles' },
    open_inventory: { label: L('📦 Inventaire', '📦 Inventory'), url: '/dashboard/inventory' },
    open_payments: { label: L('💳 Paiements', '💳 Payments'), url: '/dashboard/payments' },
    open_aide: { label: L('❓ Aide', '❓ Help'), url: '/aide' },
    open_contact: { label: L('✉️ Contact & support', '✉️ Contact & support'), url: '/contact' },
  };

  const pushBot = (text: string, options?: FlowOption[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'bot', text, time: getNow(), options }]);
      setIsTyping(false);
    }, 550);
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

  const respondToText = (text: string) => {
    pushBot(
      L(
        `Merci pour votre demande : « ${text} ».\n\nDans la conversation, je ne simule ni pièces ni véhicules disponibles. Utilisez le **catalogue de pièces** ou les **annonces de véhicules** pour des résultats réels.`,
        `Thanks for your request: "${text}".\n\nIn chat I don\'t simulate available parts or vehicles. Use the **parts catalogue** or the **vehicle listings** for real results.`
      ),
      [
        { label: L('🏪 Catalogue pièces', '🏪 Parts catalogue'), action: 'open_marketplace', icon: '🏪' },
        { label: L('🚙 Véhicules', '🚙 Vehicles'), action: 'open_vehicles', icon: '🚙' },
        { label: L('✉️ Contact', '✉️ Contact'), action: 'open_contact', icon: '✉️' },
      ]
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'user', text: userText, time: getNow() }]);
    setInput('');
    respondToText(userText);
  };

  const handleOptionClick = (action: string) => {
    const flow = flows[action];
    if (!flow) return;
    const label = flow.label.replace(/^[^\s]+ /, '');
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'user', text: label, time: getNow() }]);
    if (flow.url) {
      pushBot(L(`Ouverture de la page « ${label} » dans un nouvel onglet.`, `Opening the "${label}" page in a new tab.`));
      window.open(flow.url, '_blank', 'noopener,noreferrer');
    } else if (flow.reply) {
      pushBot(flow.reply, flow.options);
    }
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

  return (
    <>
      {!isOpen && (
        <button onClick={openChat}
          className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[80] w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label={L('Ouvrir l\'assistant AutoBot', 'Open AutoBot assistant')}>
          <span className="text-white text-xl">💬</span>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">{unread}</span>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[80] w-[calc(100vw-2rem)] lg:w-[400px] h-[calc(100vh-8rem)] lg:h-[650px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in"
          role="dialog" aria-label={L('Assistant AutoBot', 'AutoBot assistant')}>
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
                {L('Assistant du site', 'Site assistant')}
              </p>
            </div>
            <button onClick={closeChat} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition text-sm" aria-label={L('Fermer', 'Close')}>✕</button>
          </div>

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
                      <p className="text-[9px] text-gray-400 text-right mt-1">{msg.time}</p>
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
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
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
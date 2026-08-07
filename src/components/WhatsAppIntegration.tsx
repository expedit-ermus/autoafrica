'use client';
import { useState } from 'react';

// Canal WhatsApp Business : pas encore en production. Aucun numéro, aucune
// liste de véhicules inventée n'est affiché (cf. DECISIONS.md D40) : les
// coordonnées réelles seront communiquées après confirmation.
export default function WhatsAppIntegration() {
  const [messages, setMessages] = useState([
    {
      from: 'system',
      text: 'Bienvenue sur le canal WhatsApp d\'AutoAfrique. 🚗\n\nCe canal est en cours de mise en place. Les coordonnées officielles seront communiquées avant la mise en production.',
      time: '—',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, {
      from: 'user',
      text: input,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        from: 'system',
        text: 'Merci pour votre message.\n\nPour toute demande, utilisez la page Contact : un canal de réponse sera confirmé avant la mise en production.',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* WhatsApp Frame */}
      <div className="bg-[#075E54] rounded-t-2xl p-3 flex items-center gap-3">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white text-lg cursor-pointer" aria-label="Retour">←</button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">A</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">AutoAfrique</p>
          <p className="text-green-200 text-[10px]">en cours de configuration</p>
        </div>
        <button onClick={() => setMessages([{ from: 'bot', text: 'Bonjour ! Tapez VENDRE pour recevoir la grille tarifaire ou RECHERCHE pour trouver une pièce.', time: '12:00' }])} className="text-white text-lg cursor-pointer" title="Réinitialiser la conversation">⋮</button>
      </div>

      {/* Chat area */}
      <div className="bg-[#ECE5DD] min-h-[300px] sm:min-h-[400px] p-3 sm:p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-3 py-2 ${
              msg.from === 'user'
                ? 'bg-[#DCF8C6] rounded-br-none'
                : 'bg-white rounded-bl-none'
            }`}>
              <p className="text-xs text-gray-800 whitespace-pre-line">{msg.text}</p>
              <p className="text-[9px] text-gray-400 text-right mt-1">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-[#F0F0F0] rounded-b-2xl p-3 flex items-center gap-2">
        <input aria-label="Tapez un message" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-white rounded-full px-4 py-2 text-base sm:text-sm outline-none"
          placeholder="Tapez un message..." />
        <button onClick={handleSend} className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center text-white text-lg" aria-label="Envoyer">
          ➤
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 text-center space-y-2">
        <p className="text-sm font-medium text-gray-700">WhatsApp Business AutoAfrique</p>
        <p className="text-xs text-gray-500">
          Canal en cours de mise en place — les coordonnées officielles seront confirmées avant la mise en production.
        </p>
      </div>
    </div>
  );
}
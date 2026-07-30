'use client';
import { useState } from 'react';

export default function WhatsAppIntegration() {
  const [messages, setMessages] = useState([
    { from: 'system', text: 'Bienvenue sur AutoAfrique WhatsApp Bot ! 🚗', time: '12:00' },
    { from: 'system', text: 'Tapez :\n1 - Rechercher un véhicule\n2 - Voir mes commandes\n3 - Payer une facture\n4 - Parler à un agent\n5 - Aide', time: '12:00' },
    { from: 'user', text: '1', time: '12:01' },
    { from: 'system', text: 'Quelle marque recherchez-vous ?\n\nExemples : Toyota, Mercedes, BMW, Hyundai, Kia...', time: '12:01' },
    { from: 'user', text: 'Toyota Corolla', time: '12:02' },
    { from: 'system', text: 'Voici les Toyota Corolla disponibles :\n\n🚗 Toyota Corolla 2022\n📍 Abidjan, CI\n💰 8 500 000 FCFA\n✅ Disponible\n\n🚗 Toyota Corolla 2023\n📍 Dakar, SN\n💰 12 000 000 FCFA\n✅ Disponible\n\nTapez le numéro pour plus de détails.', time: '12:02' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'system',
        text: 'Merci pour votre message ! Un agent vous répondra sous peu. 📞\n\nEn attendant, vous pouvez :\n- Appeler le +225 27 20 30 40\n- Nous envoyer un vocal',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* WhatsApp Frame */}
      <div className="bg-[#075E54] rounded-t-2xl p-3 flex items-center gap-3">
        <button className="text-white text-lg">←</button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">A</div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">AutoAfrique</p>
          <p className="text-green-200 text-[10px]">en ligne</p>
        </div>
        <button className="text-white text-lg">📞</button>
        <button className="text-white text-lg">⋮</button>
      </div>

      {/* Chat area */}
      <div className="bg-[#ECE5DD] min-h-[400px] p-4 space-y-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4c5a9\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
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
        <button className="text-gray-500 text-lg">😊</button>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-white rounded-full px-4 py-2 text-sm outline-none"
          placeholder="Tapez un message..." />
        <button className="text-gray-500 text-lg">📎</button>
        <button onClick={handleSend} className="w-10 h-10 rounded-full bg-[#075E54] flex items-center justify-center text-white text-lg">
          🎤
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 text-center space-y-2">
        <p className="text-sm font-medium text-gray-700">WhatsApp Business AutoAfrique</p>
        <p className="text-xs text-gray-500">Recherchez, commandez et payez directement via WhatsApp</p>
        <div className="flex justify-center gap-2">
          <a href="https://wa.me/22520304050" className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-semibold">
            💬 Ouvrir WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export function formatFCFA(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('fr-FR').format(num) + ' FCFA';
}

export const COMMUNE_DELIVERY_RATES = {
  'Marcory': { fee: 1500, delay: '1h - 2h' },
  'Treichville': { fee: 1500, delay: '1h - 2h' },
  'Koumassi': { fee: 1500, delay: '1h - 2h' },
  'Plateau': { fee: 2000, delay: '1h - 3h' },
  'Cocody': { fee: 2000, delay: '1h - 3h' },
  'Adjamé': { fee: 2000, delay: '1h - 3h' },
  'Port-Bouët': { fee: 2500, delay: '2h - 4h' },
  'Attécoubé': { fee: 2500, delay: '2h - 4h' },
  'Yopougon': { fee: 3000, delay: '2h - 4h' },
  'Abobo': { fee: 3000, delay: '2h - 4h' },
  'Bingerville': { fee: 3500, delay: '2h - 4h' },
  'Songon': { fee: 4500, delay: '3h - 5h' },
  'Grand-Bassam': { fee: 4500, delay: '3h - 5h' },
  'Gare UTB / STIF (Bouaké, San Pedro, Yamoussoukro)': { fee: 3000, delay: '24h - 48h (Colis Express)' }
};

export const OPERATOR_LABELS = {
  wave: 'Wave Côte d\'Ivoire',
  orange: 'Orange Money CI',
  mtn: 'MTN MoMo CI',
  moov: 'Moov Money CI',
  djamo: 'Djamo Visa'
};

export function extractPotentialParts(text) {
  if (!text) return [];
  const results = [];
  
  // Match OEM-like patterns: 5 digits - 5 digits or alphanumeric sequences
  const oemRegex = /\b([0-9A-Z]{4,7}[- ][0-9A-Z]{4,7})\b/gi;
  let match;
  while ((match = oemRegex.exec(text)) !== null) {
    results.push({ type: 'oem', value: match[1].replace(' ', '-') });
  }

  // Match automotive keywords
  const keywords = [
    'amortisseur', 'plaquette', 'disque de frein', 'filtre à huile', 'filtre à air',
    'filtre à gasoil', 'bougie', 'courroie', 'alternateur', 'démarreur', 'radiateur',
    'cardan', 'crémaillère', 'rotule', 'triangle', 'embrayage', 'batterie', 'pompe à eau',
    'phare', 'rétroviseur', 'pare-choc', 'aile', 'injecteur', 'turbo'
  ];

  const lower = text.toLowerCase();
  keywords.forEach(kw => {
    if (lower.includes(kw)) {
      results.push({ type: 'keyword', value: kw });
    }
  });

  return results;
}

export function buildWhatsAppQuoteMessage({
  quoteId,
  clientName,
  vehicle,
  items,
  commune,
  deliveryFee,
  operator,
  sellerName,
  sellerPhone
}) {
  const partsTotal = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.qty || 1)), 0);
  const grandTotal = partsTotal + Number(deliveryFee || 0);
  const dateStr = new Date().toLocaleDateString('fr-FR');

  const itemsListStr = items.map((it, idx) => 
    `  ${idx + 1}. *${it.title}* (${it.condition || 'Occasion certifiée'})
     → Qté : ${it.qty || 1} × ${formatFCFA(it.price)} = *${formatFCFA(it.price * (it.qty || 1))}*`
  ).join('\n');

  const opLabel = OPERATOR_LABELS[operator] || 'Wave / Orange Money / MTN MoMo';
  const deliveryInfo = COMMUNE_DELIVERY_RATES[commune] || { fee: deliveryFee, delay: 'Express' };
  const paymentLink = `https://autoafrique-saas.vercel.app/paiement?ref=${quoteId || 'DEV-' + Date.now().toString().slice(-6)}&amount=${grandTotal}`;

  return `🔧 *DEVIS EXPRESS AUTOAFRIQUE*
📄 *N° ${quoteId || 'DEV-' + Date.now().toString().slice(-6)}* — ${dateStr}
👤 *Client :* ${clientName || 'Cher client'}
🚗 *Véhicule :* ${vehicle || 'Non spécifié'}
━━━━━━━━━━━━━━━━━━━━
📦 *PIÈCES DÉTACHÉES :*
${itemsListStr}

━━━━━━━━━━━━━━━━━━━━
📍 *Livraison :* ${commune} (${deliveryInfo.delay}) : *${formatFCFA(deliveryFee)}*
💰 *TOTAL À PAYER :* *${formatFCFA(grandTotal)}*
━━━━━━━━━━━━━━━━━━━━
🔒 *PAIEMENT SÉCURISÉ SOUS SÉQUESTRE (${opLabel}) :*
👉 Réglez en toute sécurité ici :
${paymentLink}

🛡️ *Garantie AutoAfrique :*
• Vos fonds sont bloqués sous séquestre jusqu'à livraison conforme.
• Garantie 48h montage & retour gratuit si non compatible.

📞 *Votre conseiller vendeur :* ${sellerName} (${sellerPhone})`;
}

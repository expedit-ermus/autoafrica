// AutoAfrique Content Script for WhatsApp Web
// Scans active conversations for automotive parts requests & injects Quick Quote trigger

(() => {
  console.log('[AutoAfrique] WhatsApp Web Assistant initialized.');

  // Create isolated Shadow DOM container for the toolbar badge
  const host = document.createElement('div');
  host.id = 'autoafrique-wa-root';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  // Styles inside Shadow DOM
  const style = document.createElement('style');
  style.textContent = `
    .autoafrique-floating-btn {
      position: fixed;
      bottom: 85px;
      right: 20px;
      z-index: 999999;
      background: linear-gradient(135deg, #FF5A1F, #E0480C);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 800;
      padding: 10px 16px;
      border-radius: 99px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 8px 24px rgba(255, 90, 31, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .autoafrique-floating-btn:hover {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 12px 30px rgba(255, 90, 31, 0.55);
    }
    .icon {
      font-size: 16px;
    }
    .badge-scan {
      background: #020617;
      color: #F59E0B;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: 900;
    }
  `;
  shadow.appendChild(style);

  // Floating Button
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'autoafrique-floating-btn';
  btn.innerHTML = '<span class="icon">🔧</span> <span>AutoAfrique Devis</span> <span class="badge-scan">Abidjan</span>';
  shadow.appendChild(btn);

  // Click opens Side Panel
  btn.addEventListener('click', async () => {
    // Scan recent messages for automotive keywords
    const detected = scanRecentMessages();
    chrome.runtime.sendMessage({
      action: 'open_sidepanel',
      payload: {
        pendingSearch: detected.query || '',
        pendingQuoteText: detected.summary || '',
        activeTab: detected.query ? 'search' : 'quote'
      }
    });
  });

  // Listen for insert quote message
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'insert_quote' && msg.text) {
      insertTextIntoWhatsAppInput(msg.text);
      sendResponse({ success: true });
    }
    return true;
  });

  function scanRecentMessages() {
    const textNodes = document.querySelectorAll('div[data-pre-plain-text], .selectable-text');
    let combinedText = '';
    const slice = Array.from(textNodes).slice(-10);
    slice.forEach(node => combinedText += ' ' + node.innerText);

    const keywords = [
      'amortisseur', 'plaquette', 'disque', 'filtre', 'bougie', 'courroie',
      'alternateur', 'démarreur', 'radiateur', 'cardan', 'crémaillère',
      'rotule', 'triangle', 'embrayage', 'batterie', 'pompe', 'phare',
      'toyota', 'hilux', 'prado', 'hyundai', 'tucson', 'peugeot', '206', '308', 'suzuki', 'swift'
    ];

    let foundKeywords = [];
    const lower = combinedText.toLowerCase();
    keywords.forEach(kw => {
      if (lower.includes(kw)) foundKeywords.push(kw);
    });

    const oemMatch = combinedText.match(/[0-9A-Z]{4,7}[- ][0-9A-Z]{4,7}/i);
    const query = oemMatch ? oemMatch[0] : (foundKeywords.slice(0, 3).join(' '));

    return {
      query: query.trim(),
      summary: foundKeywords.join(', ')
    };
  }

  function insertTextIntoWhatsAppInput(text) {
    // Find WhatsApp message box (contenteditable div)
    const inputDiv = document.querySelector('div[contenteditable="true"][data-tab="10"]') ||
                     document.querySelector('footer div[contenteditable="true"]') ||
                     document.querySelector('div[contenteditable="true"]');

    if (inputDiv) {
      inputDiv.focus();
      document.execCommand('insertText', false, text);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
    }
  }
})();

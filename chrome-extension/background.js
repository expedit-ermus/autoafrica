// AutoAfrique Chrome Extension — Service Worker (Manifest V3)
// Strictly follows async/await, ephemeral state in storage, and side panel triggers

// Initialize default settings on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[AutoAfrique SW] Installed reason:', details.reason);

  const existing = await chrome.storage.local.get(['apiUrl', 'defaultCommune', 'defaultOperator', 'sellerName', 'sellerPhone']);
  await chrome.storage.local.set({
    apiUrl: existing.apiUrl || 'https://autoafrique-saas.vercel.app',
    defaultCommune: existing.defaultCommune || 'Marcory',
    defaultOperator: existing.defaultOperator || 'wave',
    sellerName: existing.sellerName || 'AutoAfrique Partenaire Abidjan',
    sellerPhone: existing.sellerPhone || '+225 07 08 09 10 11',
    recentSearches: [],
    savedQuotes: []
  });

  // Setup context menus
  try {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
      id: 'search_autoafrique',
      title: '🔍 Rechercher « %s » sur AutoAfrique',
      contexts: ['selection']
    });
    chrome.contextMenus.create({
      id: 'quote_autoafrique',
      title: '⚡ Créer un devis séquestre pour cette sélection',
      contexts: ['selection']
    });
    chrome.contextMenus.create({
      id: 'open_sidepanel',
      title: '🛠️ Ouvrir le panneau AutoAfrique (Alt+A)',
      contexts: ['all']
    });
  } catch (err) {
    console.error('[AutoAfrique SW] Error setting context menus:', err);
  }
});

// Handle context menus
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.windowId) return;

  if (info.menuItemId === 'search_autoafrique') {
    const query = (info.selectionText || '').trim();
    if (query) {
      await chrome.storage.local.set({ pendingSearch: query });
      await chrome.sidePanel.open({ windowId: tab.windowId });
      showNotification('Recherche AutoAfrique', `Recherche lancée pour : "${query}"`);
    }
  } else if (info.menuItemId === 'quote_autoafrique') {
    const prefill = (info.selectionText || '').trim();
    await chrome.storage.local.set({ pendingQuoteText: prefill, activeTab: 'quote' });
    await chrome.sidePanel.open({ windowId: tab.windowId });
    showNotification('Devis Express', 'Texte importé dans le générateur de devis');
  } else if (info.menuItemId === 'open_sidepanel') {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Handle keyboard shortcuts (Alt+A)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-side-panel') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }
  }
});

// Handle messages from popup / content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.action === 'open_sidepanel') {
        const windowId = sender.tab?.windowId || (await chrome.windows.getLastFocused()).id;
        await chrome.sidePanel.open({ windowId });
        if (message.payload) {
          await chrome.storage.local.set(message.payload);
        }
        sendResponse({ success: true });
      } else if (message.action === 'notify') {
        showNotification(message.title || 'AutoAfrique', message.message || '');
        sendResponse({ success: true });
      } else if (message.action === 'get_current_tab') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        sendResponse({ tab });
      } else {
        sendResponse({ status: 'unhandled_action' });
      }
    } catch (err) {
      console.error('[AutoAfrique SW] Message error:', err);
      sendResponse({ error: err.message });
    }
  })();
  return true; // Keep message channel open for async response
});

function showNotification(title, message) {
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
      title: title,
      message: message,
      priority: 1
    });
  } catch (e) {
    console.warn('[AutoAfrique SW] Notification failed:', e);
  }
}

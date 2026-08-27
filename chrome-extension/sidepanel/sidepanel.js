import { searchParts } from '../utils/api.js';
import { formatFCFA, COMMUNE_DELIVERY_RATES, buildWhatsAppQuoteMessage } from '../utils/formatter.js';

let currentQuoteItems = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const cartCountBadge = document.getElementById('cartCountBadge');

  const searchInput = document.getElementById('searchInput');
  const btnSearch = document.getElementById('btnSearch');
  const filterMake = document.getElementById('filterMake');
  const filterCategory = document.getElementById('filterCategory');
  const productsList = document.getElementById('productsList');
  const resultsCount = document.getElementById('resultsCount');
  const btnSyncCatalog = document.getElementById('btnSyncCatalog');

  const quoteClientName = document.getElementById('quoteClientName');
  const quoteVehicle = document.getElementById('quoteVehicle');
  const quoteCommune = document.getElementById('quoteCommune');
  const quoteItemsList = document.getElementById('quoteItemsList');
  const btnClearQuote = document.getElementById('btnClearQuote');
  const btnAddManualItem = document.getElementById('btnAddManualItem');
  const sumPartsTotal = document.getElementById('sumPartsTotal');
  const sumDeliveryZone = document.getElementById('sumDeliveryZone');
  const sumDeliveryFee = document.getElementById('sumDeliveryFee');
  const sumGrandTotal = document.getElementById('sumGrandTotal');
  const btnCopyQuote = document.getElementById('btnCopyQuote');
  const btnInsertInWhatsApp = document.getElementById('btnInsertInWhatsApp');

  const settingSellerName = document.getElementById('settingSellerName');
  const settingSellerPhone = document.getElementById('settingSellerPhone');
  const settingDefaultCommune = document.getElementById('settingDefaultCommune');
  const settingApiUrl = document.getElementById('settingApiUrl');
  const btnSaveSettings = document.getElementById('btnSaveSettings');

  // Populate Communes
  function populateCommunes(selectEl, selectedVal) {
    selectEl.innerHTML = '';
    Object.keys(COMMUNE_DELIVERY_RATES).forEach(commune => {
      const opt = document.createElement('option');
      opt.value = commune;
      opt.textContent = `${commune} — ${formatFCFA(COMMUNE_DELIVERY_RATES[commune].fee)} (${COMMUNE_DELIVERY_RATES[commune].delay})`;
      if (commune === selectedVal) opt.selected = true;
      selectEl.appendChild(opt);
    });
  }

  // Load Saved Settings & State
  const storage = await chrome.storage.local.get([
    'apiUrl', 'sellerName', 'sellerPhone', 'defaultCommune', 
    'pendingSearch', 'pendingQuoteText', 'activeTab', 'savedQuoteItems'
  ]);

  settingSellerName.value = storage.sellerName || 'AutoAfrique Partenaire Abidjan';
  settingSellerPhone.value = storage.sellerPhone || '+225 07 08 09 10 11';
  settingApiUrl.value = storage.apiUrl || 'https://autoafrique-saas.vercel.app';
  
  populateCommunes(quoteCommune, storage.defaultCommune || 'Marcory');
  populateCommunes(settingDefaultCommune, storage.defaultCommune || 'Marcory');

  if (Array.isArray(storage.savedQuoteItems)) {
    currentQuoteItems = storage.savedQuoteItems;
    updateQuoteUI();
  }

  // Tab Switching
  function switchTab(tabId) {
    navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    tabPanes.forEach(p => p.classList.toggle('active', p.id === `tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`));
  }

  navTabs.forEach(t => {
    t.addEventListener('click', () => switchTab(t.dataset.tab));
  });

  // Handle Search Execution
  async function executeSearch() {
    const q = searchInput.value;
    const make = filterMake.value;
    const cat = filterCategory.value;

    resultsCount.textContent = 'Recherche en cours...';
    productsList.innerHTML = '<div style="text-align:center;padding:20px;color:#94A3B8;">Chargement des pièces...</div>';

    const { results } = await searchParts({ query: q, make, category: cat });
    resultsCount.textContent = `${results.length} pièce(s) trouvée(s)`;

    if (results.length === 0) {
      productsList.innerHTML = `
        <div style="text-align:center;padding:30px;color:#64748B;">
          <p style="font-size:24px;margin-bottom:8px;">🔍</p>
          <p style="font-weight:bold;color:#94A3B8;">Aucune pièce trouvée pour "${q}"</p>
          <p style="font-size:11px;margin-top:4px;">Essayez avec la marque ou la référence constructeur OEM.</p>
        </div>
      `;
      return;
    }

    productsList.innerHTML = '';
    results.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="card-top">
          <div class="card-title-box">
            <h3>${product.title || product.name}</h3>
            <span class="oem-code">OEM: ${product.oem || 'N/A'}</span>
          </div>
          <span class="card-condition-badge">${product.condition || 'Occasion'}</span>
        </div>
        <div class="card-details">
          <span>🚗 ${product.make || ''} ${product.model || ''}</span>
          <span>📍 ${product.warehouse || 'Abidjan'}</span>
        </div>
        <div class="card-bottom">
          <div class="price-tag">${formatFCFA(product.price)}</div>
          <button type="button" class="btn-add-quote" data-id="${product.id}">+ Ajouter au Devis</button>
        </div>
      `;

      card.querySelector('.btn-add-quote').addEventListener('click', () => {
        addToQuote(product);
      });

      productsList.appendChild(card);
    });
  }

  btnSearch.addEventListener('click', executeSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeSearch();
  });
  filterMake.addEventListener('change', executeSearch);
  filterCategory.addEventListener('change', executeSearch);
  btnSyncCatalog.addEventListener('click', executeSearch);

  // Quote Item Management
  function addToQuote(product) {
    const existing = currentQuoteItems.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      currentQuoteItems.push({
        id: product.id || 'p-' + Date.now(),
        title: product.title || product.name,
        price: Number(product.price) || 0,
        condition: product.condition || 'Occasion certifiée',
        qty: 1
      });
    }
    chrome.storage.local.set({ savedQuoteItems: currentQuoteItems });
    updateQuoteUI();
    showToast('Pièce ajoutée au devis !');
  }

  function updateQuoteUI() {
    const totalCount = currentQuoteItems.reduce((acc, i) => acc + (i.qty || 1), 0);
    if (totalCount > 0) {
      cartCountBadge.textContent = totalCount;
      cartCountBadge.classList.remove('hidden');
    } else {
      cartCountBadge.classList.add('hidden');
    }

    if (currentQuoteItems.length === 0) {
      quoteItemsList.innerHTML = `
        <div class="empty-quote">
          <span>🛒 Aucune pièce sélectionnée</span>
          <p>Ajoutez des pièces depuis l'onglet « Pièces & OEM » pour générer un devis instantané.</p>
        </div>
      `;
    } else {
      quoteItemsList.innerHTML = '';
      currentQuoteItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'quote-item-row';
        row.innerHTML = `
          <div class="item-info">
            <h4>${item.title}</h4>
            <span>${formatFCFA(item.price)} × ${item.qty} = <b>${formatFCFA(item.price * item.qty)}</b></span>
          </div>
          <div class="item-qty-controls">
            <button type="button" class="btn-qty btn-minus" data-index="${index}">-</button>
            <span style="font-size:12px;font-weight:bold;">${item.qty}</span>
            <button type="button" class="btn-qty btn-plus" data-index="${index}">+</button>
          </div>
        `;

        row.querySelector('.btn-minus').addEventListener('click', () => {
          if (item.qty > 1) {
            item.qty--;
          } else {
            currentQuoteItems.splice(index, 1);
          }
          chrome.storage.local.set({ savedQuoteItems: currentQuoteItems });
          updateQuoteUI();
        });

        row.querySelector('.btn-plus').addEventListener('click', () => {
          item.qty++;
          chrome.storage.local.set({ savedQuoteItems: currentQuoteItems });
          updateQuoteUI();
        });

        quoteItemsList.appendChild(row);
      });
    }

    // Calculations
    const partsTotal = currentQuoteItems.reduce((sum, it) => sum + (it.price * (it.qty || 1)), 0);
    const selectedCommune = quoteCommune.value || 'Marcory';
    const rateInfo = COMMUNE_DELIVERY_RATES[selectedCommune] || { fee: 1500, delay: 'Express' };
    const grandTotal = partsTotal + rateInfo.fee;

    sumPartsTotal.textContent = formatFCFA(partsTotal);
    sumDeliveryZone.textContent = selectedCommune;
    sumDeliveryFee.textContent = formatFCFA(rateInfo.fee);
    sumGrandTotal.textContent = formatFCFA(grandTotal);
  }

  quoteCommune.addEventListener('change', updateQuoteUI);

  btnClearQuote.addEventListener('click', () => {
    currentQuoteItems = [];
    chrome.storage.local.set({ savedQuoteItems: [] });
    updateQuoteUI();
    showToast('Devis vidé');
  });

  btnAddManualItem.addEventListener('click', () => {
    const title = prompt('Désignation de la pièce :');
    if (!title) return;
    const priceStr = prompt('Prix unitaire en FCFA :', '25000');
    const price = parseInt(priceStr, 10) || 0;

    currentQuoteItems.push({
      id: 'custom-' + Date.now(),
      title: title.trim(),
      price: price,
      condition: 'Sur demande',
      qty: 1
    });
    chrome.storage.local.set({ savedQuoteItems: currentQuoteItems });
    updateQuoteUI();
    showToast('Pièce personnalisée ajoutée');
  });

  // Build Quote String
  function getFormattedQuote() {
    if (currentQuoteItems.length === 0) {
      showToast('Ajoutez au moins une pièce au devis.');
      return null;
    }
    const operator = document.querySelector('input[name="quoteOperator"]:checked')?.value || 'wave';
    const commune = quoteCommune.value || 'Marcory';
    const deliveryFee = (COMMUNE_DELIVERY_RATES[commune] || { fee: 1500 }).fee;

    return buildWhatsAppQuoteMessage({
      quoteId: 'DEV-' + Date.now().toString().slice(-6),
      clientName: quoteClientName.value.trim(),
      vehicle: quoteVehicle.value.trim(),
      items: currentQuoteItems,
      commune: commune,
      deliveryFee: deliveryFee,
      operator: operator,
      sellerName: settingSellerName.value.trim(),
      sellerPhone: settingSellerPhone.value.trim()
    });
  }

  // Copy to Clipboard
  btnCopyQuote.addEventListener('click', async () => {
    const text = getFormattedQuote();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    showToast('✅ Devis copié dans le presse-papier !');
  });

  // Insert directly in WhatsApp Web tab if active
  btnInsertInWhatsApp.addEventListener('click', async () => {
    const text = getFormattedQuote();
    if (!text) return;

    await navigator.clipboard.writeText(text);
    const tabs = await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' });

    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];
      await chrome.tabs.update(activeTab.id, { active: true });
      await chrome.tabs.sendMessage(activeTab.id, { action: 'insert_quote', text: text });
      showToast('✅ Devis collé sur WhatsApp Web !');
    } else {
      showToast('📋 Devis copié ! Ouvrez WhatsApp Web pour coller.');
    }
  });

  // Save Settings
  btnSaveSettings.addEventListener('click', async () => {
    await chrome.storage.local.set({
      sellerName: settingSellerName.value.trim(),
      sellerPhone: settingSellerPhone.value.trim(),
      defaultCommune: settingDefaultCommune.value,
      apiUrl: settingApiUrl.value
    });
    populateCommunes(quoteCommune, settingDefaultCommune.value);
    updateQuoteUI();
    showToast('Réglages enregistrés !');
  });

  // Toast Notification
  function showToast(msg) {
    const toast = document.getElementById('toastMessage');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2800);
  }

  // Initial trigger if pendingSearch
  if (storage.pendingSearch) {
    searchInput.value = storage.pendingSearch;
    await chrome.storage.local.remove('pendingSearch');
    switchTab('search');
    executeSearch();
  } else if (storage.pendingQuoteText) {
    quoteVehicle.value = storage.pendingQuoteText;
    await chrome.storage.local.remove('pendingQuoteText');
    switchTab('quote');
  } else if (storage.activeTab) {
    switchTab(storage.activeTab);
    await chrome.storage.local.remove('activeTab');
    executeSearch();
  } else {
    executeSearch();
  }
});

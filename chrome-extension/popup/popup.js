document.addEventListener('DOMContentLoaded', async () => {
  const quickSearchInput = document.getElementById('quickSearchInput');
  const btnQuickSearch = document.getElementById('btnQuickSearch');
  const btnOpenSidePanel = document.getElementById('btnOpenSidePanel');
  const btnOpenStore = document.getElementById('btnOpenStore');
  const btnOpenDashboard = document.getElementById('btnOpenDashboard');
  const btnOpenEstimator = document.getElementById('btnOpenEstimator');
  const linkOptions = document.getElementById('linkOptions');

  const { apiUrl = 'https://autoafrique-saas.vercel.app' } = await chrome.storage.local.get('apiUrl');

  // Trigger search into Side Panel
  async function triggerSearch() {
    const q = (quickSearchInput.value || '').trim();
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.windowId) {
      if (q) {
        await chrome.storage.local.set({ pendingSearch: q, activeTab: 'search' });
      }
      await chrome.sidePanel.open({ windowId: tab.windowId });
      window.close();
    }
  }

  btnQuickSearch.addEventListener('click', triggerSearch);
  quickSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') triggerSearch();
  });

  // Open Side Panel directly
  btnOpenSidePanel.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.windowId) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
      window.close();
    }
  });

  // Open Store in new tab
  btnOpenStore.addEventListener('click', async () => {
    await chrome.tabs.create({ url: `${apiUrl}/catalogue` });
    window.close();
  });

  // Open Dashboard in new tab
  btnOpenDashboard.addEventListener('click', async () => {
    await chrome.tabs.create({ url: `${apiUrl}/dashboard` });
    window.close();
  });

  // Open Estimator in new tab
  btnOpenEstimator.addEventListener('click', async () => {
    await chrome.tabs.create({ url: `${apiUrl}/estimation-devis` });
    window.close();
  });

  // Open settings in side panel
  linkOptions.addEventListener('click', async (e) => {
    e.preventDefault();
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.windowId) {
      await chrome.storage.local.set({ activeTab: 'settings' });
      await chrome.sidePanel.open({ windowId: tab.windowId });
      window.close();
    }
  });
});

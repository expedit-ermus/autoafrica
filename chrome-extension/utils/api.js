
// Pre-seeded high quality catalog database for instant offline/online search
const LOCAL_CATALOG = [
  {
    id: 'toy-amort-01',
    oem: '48510-09P10',
    title: 'Amortisseur Avant Droit Toyota Hilux Revo / Vigo (2015-2023)',
    make: 'Toyota',
    model: 'Hilux',
    category: 'suspension',
    condition: 'Neuf d\'origine',
    price: 48500,
    stock: 6,
    warehouse: 'Marcory Zone 4, Abidjan',
    warranty: 'Garantie 6 mois',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  },
  {
    id: 'toy-amort-02',
    oem: '48520-09P10',
    title: 'Amortisseur Avant Gauche Toyota Hilux Revo (2015-2023)',
    make: 'Toyota',
    model: 'Hilux',
    category: 'suspension',
    condition: 'Neuf d\'origine',
    price: 48500,
    stock: 5,
    warehouse: 'Marcory Zone 4, Abidjan',
    warranty: 'Garantie 6 mois',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  },
  {
    id: 'toy-plaq-01',
    oem: '04465-0K280',
    title: 'Jeu de 4 Plaquettes de Frein Avant Toyota Hilux / Fortuner',
    make: 'Toyota',
    model: 'Hilux / Fortuner',
    category: 'frein',
    condition: 'Neuf équipementier (Brembo/Akebono)',
    price: 24000,
    stock: 14,
    warehouse: 'Treichville Arras, Abidjan',
    warranty: 'Garantie 48h montage',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80'
  },
  {
    id: 'toy-filtre-01',
    oem: '90915-YZZD4',
    title: 'Filtre à Huile Toyota Land Cruiser Prado / Hilux 1KD/2GD',
    make: 'Toyota',
    model: 'Prado / Hilux',
    category: 'filtre',
    condition: 'Neuf d\'origine Denso',
    price: 7500,
    stock: 28,
    warehouse: 'Adjamé 220 Logements, Abidjan',
    warranty: '100% Authentique',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  },
  {
    id: 'hyu-rotule-01',
    oem: '51712-2C000',
    title: 'Disque de Frein Avant Ventilé Hyundai Tucson / Kia Sportage (2016-2022)',
    make: 'Hyundai',
    model: 'Tucson',
    category: 'frein',
    condition: 'Neuf Valeo',
    price: 38000,
    stock: 8,
    warehouse: 'Koumassi Boulevard du 7 Décembre, Abidjan',
    warranty: 'Garantie 48h montage',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80'
  },
  {
    id: 'hyu-amort-01',
    oem: '54651-D7000',
    title: 'Amortisseur Avant Hyundai Santa Fe / Tucson CRDi',
    make: 'Hyundai',
    model: 'Santa Fe / Tucson',
    category: 'suspension',
    condition: 'Occasion contrôlée (testée banc)',
    price: 32000,
    stock: 4,
    warehouse: 'Yopougon Zone Industrielle, Abidjan',
    warranty: 'Garantie 48h échange',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  },
  {
    id: 'peug-kit-01',
    oem: '1606450480',
    title: 'Kit Distribution + Pompe à Eau Peugeot 206 / 207 / 308 1.6 HDi',
    make: 'Peugeot',
    model: '206 / 207 / 308',
    category: 'moteur',
    condition: 'Neuf Gates / INA',
    price: 65000,
    stock: 9,
    warehouse: 'Treichville Port, Abidjan',
    warranty: 'Garantie 1 an / 50 000 km',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  },
  {
    id: 'peug-alt-01',
    oem: '5705AS',
    title: 'Alternateur 12V 150A Peugeot 3008 / 508 / Expert HDi',
    make: 'Peugeot',
    model: '3008 / 508',
    category: 'electricite',
    condition: 'Reconditionné garanti Valeo',
    price: 78000,
    stock: 3,
    warehouse: 'Marcory VGE, Abidjan',
    warranty: 'Garantie 3 mois',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  },
  {
    id: 'suzu-amort-01',
    oem: '41601-68L00',
    title: 'Jambe de Force Avant Suzuki Swift / Dzire (2012-2020)',
    make: 'Suzuki',
    model: 'Swift / Dzire',
    category: 'suspension',
    condition: 'Occasion 1er choix Japon/Dubaï',
    price: 28000,
    stock: 7,
    warehouse: 'Abobo Samaké, Abidjan',
    warranty: 'Garantie 48h',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  },
  {
    id: 'niss-crem-01',
    oem: '49001-4EA0A',
    title: 'Crémaillère de Direction Assistée Nissan Qashqai / X-Trail T32',
    make: 'Nissan',
    model: 'Qashqai / X-Trail',
    category: 'suspension',
    condition: 'Occasion testée',
    price: 110000,
    stock: 2,
    warehouse: 'Cocody Riviera 2, Abidjan',
    warranty: 'Garantie 3 mois',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=300&q=80'
  }
];

export async function searchParts({ query = '', make = '', category = '' }) {
  const { apiUrl = 'https://autoafrique-saas.vercel.app' } = await chrome.storage.local.get('apiUrl');

  // Try live API first
  try {
    const url = new URL(`${apiUrl}/api/v1/products`);
    if (query) url.searchParams.set('search', query);
    if (make) url.searchParams.set('make', make);
    if (category) url.searchParams.set('category', category);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const resp = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        return { source: 'api', results: data.products };
      } else if (Array.isArray(data) && data.length > 0) {
        return { source: 'api', results: data };
      }
    }
  } catch (err) {
    console.log('[AutoAfrique API] Fallback to local catalog dataset due to:', err.message);
  }

  // Filter local catalog
  const q = (query || '').toLowerCase().trim();
  const m = (make || '').toLowerCase().trim();
  const c = (category || '').toLowerCase().trim();

  const filtered = LOCAL_CATALOG.filter(item => {
    const matchesQuery = !q || 
      item.title.toLowerCase().includes(q) || 
      item.oem.toLowerCase().includes(q) || 
      item.make.toLowerCase().includes(q) || 
      item.model.toLowerCase().includes(q) ||
      item.warehouse.toLowerCase().includes(q);

    const matchesMake = !m || item.make.toLowerCase().includes(m);
    const matchesCat = !c || item.category.toLowerCase() === c;

    return matchesQuery && matchesMake && matchesCat;
  });

  return { source: 'catalog_abidjan', results: filtered };
}

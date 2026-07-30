import { Vehicle, Customer, Transaction, DashboardStats } from './types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1', make: 'Toyota', model: 'Corolla', year: 2022, price: 8500000, currency: 'XOF',
    mileage: 15000, condition: 'used', status: 'available', color: 'Blanc', fuelType: 'Essence',
    transmission: 'Automatique', images: ['/cars/corolla.jpg'], description: 'Toyota Corolla en excellent état, première main, tous les documents à jour.',
    location: 'Abidjan, Côte d\'Ivoire', sellerId: 's1', views: 234, createdAt: '2026-05-15', featured: true,
  },
  {
    id: '2', make: 'Mercedes-Benz', model: 'C200', year: 2023, price: 25000000, currency: 'XOF',
    mileage: 8000, condition: 'certified', status: 'available', color: 'Noir', fuelType: 'Diesel',
    transmission: 'Automatique', images: ['/cars/c200.jpg'], description: 'Mercedes C200 AMG Line, garantie constructeur, carnet d\'entretien complet.',
    location: 'Dakar, Sénégal', sellerId: 's2', views: 567, createdAt: '2026-05-20', featured: true,
  },
  {
    id: '3', make: 'Hyundai', model: 'Tucson', year: 2024, price: 18500000, currency: 'XOF',
    mileage: 2000, condition: 'new', status: 'available', color: 'Gris', fuelType: 'Diesel',
    transmission: 'Automatique', images: ['/cars/tucson.jpg'], description: 'Hyundai Tucson 2024, neuf, climatiseur bi-zone, caméra de recul.',
    location: 'Abidjan, Côte d\'Ivoire', sellerId: 's1', views: 189, createdAt: '2026-06-01', featured: false,
  },
  {
    id: '4', make: 'BMW', model: 'Série 3', year: 2021, price: 22000000, currency: 'XOF',
    mileage: 35000, condition: 'used', status: 'reserved', color: 'Bleu', fuelType: 'Essence',
    transmission: 'Automatique', images: ['/cars/bmw3.jpg'], description: 'BMW Série 3 330i, sport line, toit ouvrant, intérieur cuir.',
    location: 'Lagos, Nigeria', sellerId: 's3', views: 421, createdAt: '2026-04-10', featured: true,
  },
  {
    id: '5', make: 'Peugeot', model: '308', year: 2023, price: 12000000, currency: 'XOF',
    mileage: 12000, condition: 'used', status: 'available', color: 'Rouge', fuelType: 'Diesel',
    transmission: 'Manuelle', images: ['/cars/308.jpg'], description: 'Peugeot 308 allure, navigation, Apple CarPlay, radar de recul.',
    location: 'Ouagadougou, Burkina Faso', sellerId: 's4', views: 156, createdAt: '2026-05-28', featured: false,
  },
  {
    id: '6', make: 'Kia', model: 'Sportage', year: 2024, price: 19500000, currency: 'XOF',
    mileage: 500, condition: 'new', status: 'available', color: 'Blanc', fuelType: 'Hybride',
    transmission: 'Automatique', images: ['/cars/sportage.jpg'], description: 'Kia Sportage hybride, dernière génération, pack luxe, garantie 5 ans.',
    location: 'Accra, Ghana', sellerId: 's5', views: 312, createdAt: '2026-06-10', featured: true,
  },
  {
    id: '7', make: 'Toyota', model: 'Land Cruiser', year: 2022, price: 45000000, currency: 'XOF',
    mileage: 28000, condition: 'used', status: 'available', color: 'Beige', fuelType: 'Diesel',
    transmission: 'Automatique', images: ['/cars/lc.jpg'], description: 'Toyota Land Cruiser V8, full options, idéal pour le Sahel.',
    location: 'Bamako, Mali', sellerId: 's6', views: 445, createdAt: '2026-05-05', featured: true,
  },
  {
    id: '8', make: 'Nissan', model: 'Qashqai', year: 2023, price: 14500000, currency: 'XOF',
    mileage: 18000, condition: 'certified', status: 'available', color: 'Gris', fuelType: 'Essence',
    transmission: 'CVT', images: ['/cars/qashqai.jpg'], description: 'Nissan Qashqai tekna+, caméra 360°, alerte de franchissement de ligne.',
    location: 'Cotonou, Bénin', sellerId: 's7', views: 198, createdAt: '2026-06-05', featured: false,
  },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Amadou Diallo', email: 'amadou@email.com', phone: '+225 07 08 09 10', country: 'CI', totalPurchases: 3, lastContact: '2026-06-20', status: 'vip', notes: 'Client fidèle, préfère les SUV.' },
  { id: 'c2', name: 'Fatou Sow', email: 'fatou@email.com', phone: '+221 77 123 4567', country: 'SN', totalPurchases: 1, lastContact: '2026-06-18', status: 'customer', notes: 'A acheté une Corolla.' },
  { id: 'c3', name: 'Ibrahim Touré', email: 'ibrahim@email.com', phone: '+223 76 54 32 10', country: 'ML', totalPurchases: 0, lastContact: '2026-06-22', status: 'lead', notes: 'Intéressé par un Mercedes C200.' },
  { id: 'c4', name: 'Grace Mensah', email: 'grace@email.com', phone: '+233 24 567 8901', country: 'GH', totalPurchases: 2, lastContact: '2026-06-15', status: 'customer', notes: 'Achète régulièrement des Toyota.' },
  { id: 'c5', name: 'Kofi Asante', email: 'kofi@email.com', phone: '+233 50 111 2222', country: 'GH', totalPurchases: 0, lastContact: '2026-06-25', status: 'prospect', notes: 'Demande un devis pour 3 véhicules.' },
  { id: 'c6', name: 'Aïcha Koné', email: 'aicha@email.com', phone: '+225 05 66 77 88', country: 'CI', totalPurchases: 5, lastContact: '2026-06-21', status: 'vip', notes: 'Importatrice, achats en gros.' },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'sale', amount: 8500000, currency: 'XOF', status: 'completed', paymentMethod: 'orange_money', vehicleId: '1', customerId: 'c1', date: '2026-06-20', reference: 'TXN-2026-001' },
  { id: 't2', type: 'sale', amount: 25000000, currency: 'XOF', status: 'escrow', paymentMethod: 'wave', vehicleId: '2', customerId: 'c3', date: '2026-06-22', reference: 'TXN-2026-002' },
  { id: 't3', type: 'sale', amount: 18500000, currency: 'XOF', status: 'pending', paymentMethod: 'mtn_money', vehicleId: '3', customerId: 'c2', date: '2026-06-18', reference: 'TXN-2026-003' },
  { id: 't4', type: 'payment', amount: 500000, currency: 'XOF', status: 'completed', paymentMethod: 'moov_money', customerId: 'c4', date: '2026-06-15', reference: 'TXN-2026-004' },
  { id: 't5', type: 'sale', amount: 14500000, currency: 'XOF', status: 'completed', paymentMethod: 'bank_transfer', vehicleId: '8', customerId: 'c5', date: '2026-06-10', reference: 'TXN-2026-005' },
  { id: 't6', type: 'sale', amount: 45000000, currency: 'XOF', status: 'completed', paymentMethod: 'card', vehicleId: '7', customerId: 'c6', date: '2026-06-05', reference: 'TXN-2026-006' },
];

export const mockDashboardStats: DashboardStats = {
  totalVehicles: 247,
  totalSales: 38,
  totalRevenue: 425000000,
  pendingPayments: 12,
  monthlyGrowth: 15.8,
  conversionRate: 3.2,
};

export const makes = ['Toyota', 'Mercedes-Benz', 'BMW', 'Hyundai', 'Kia', 'Peugeot', 'Nissan', 'Honda', 'Ford', 'Volkswagen'];
export const cities = ['Abidjan', 'Dakar', 'Lagos', 'Accra', 'Bamako', 'Ouagadougou', 'Niamey', 'Cotonou', 'Lomé', 'Conakry'];

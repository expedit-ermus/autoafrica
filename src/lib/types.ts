export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  role: 'admin' | 'manager' | 'seller' | 'viewer';
  avatar?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  condition: 'new' | 'used' | 'certified';
  status: 'available' | 'sold' | 'reserved';
  color: string;
  fuelType: string;
  transmission: string;
  images: string[];
  description: string;
  location: string;
  sellerId: string;
  views: number;
  createdAt: string;
  featured: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalPurchases: number;
  lastContact: string;
  status: 'lead' | 'prospect' | 'customer' | 'vip';
  notes: string;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'purchase' | 'payment';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'escrow';
  paymentMethod: 'orange_money' | 'mtn_money' | 'wave' | 'moov_money' | 'bank_transfer' | 'card';
  vehicleId?: string;
  customerId: string;
  date: string;
  reference: string;
}

export interface DashboardStats {
  totalVehicles: number;
  totalSales: number;
  totalRevenue: number;
  pendingPayments: number;
  monthlyGrowth: number;
  conversionRate: number;
}

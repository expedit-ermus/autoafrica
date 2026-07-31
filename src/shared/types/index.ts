export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: unknown;
}

export interface RequestContext {
  userId?: string;
  tenantId?: string;
  role?: string;
  ip?: string;
  userAgent?: string;
}

export type Country = 'CI' | 'SN' | 'ML' | 'BF' | 'NE' | 'BJ' | 'TG' | 'GW' | 'NG' | 'GH';
export type Currency = 'XOF' | 'NGN' | 'GHS' | 'USD';

export interface Product {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  reference?: string | null;
  price: number;
  comparePrice?: number | null;
  currency?: string;
  stock: number;
  condition?: string | null;
  quality?: string | null;
  images?: string[] | string | null;
  model?: string | null;
  yearStart?: number | null;
  yearEnd?: number | null;
  brand?: { name?: string; slug?: string } | null;
  category?: { name?: string; slug?: string } | null;
  seller?: {
    id: string;
    firstName?: string;
    lastName?: string;
    shopName?: string | null;
    country?: string | null;
    city?: string | null;
    phone?: string | null;
  } | null;
  active?: boolean;
  views?: number;
  salesCount?: number;
  rating?: number;
  reviewCount?: number;
  _avgRating?: number | null;
  _reviewCount?: number;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: { id?: string; title?: string } | null;
}

export interface OrderTimeline {
  id: string;
  status: string;
  message?: string | null;
  actor?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus?: string;
  subtotal?: number;
  taxAmount?: number;
  totalAmount: number;
  total?: number;
  currency?: string;
  createdAt: string;
  items?: OrderItem[];
  buyer?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    country?: string;
    shopName?: string;
  };
  timeline?: OrderTimeline[];
  payments?: Payment[];
}

export interface Payment {
  id: string;
  status: string;
  amount: number;
  currency?: string;
  method: string;
  phone?: string | null;
  transactionId?: string | null;
  orderId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  createdAt: string;
  updatedAt?: string;
  order?: {
    id?: string;
    orderNumber?: string;
    totalAmount?: number;
    status?: string;
  } | null;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'TENANT_ADMIN'
  | 'SELLER'
  | 'BUYER'
  | 'WAREHOUSE_MANAGER'
  | 'DELIVERY_AGENT'
  | 'ACCOUNTANT'
  | 'SUPPORT'
  | 'MODERATOR';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  shopName?: string | null;
  description?: string | null;
  status?: string;
  mfaEnabled?: boolean;
  createdAt?: string | Date;
}

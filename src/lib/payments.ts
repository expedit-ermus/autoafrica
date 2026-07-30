export type MobileMoneyProvider = 'orange_money' | 'mtn_momo' | 'wave' | 'moov_money';

export interface MobileMoneyConfig {
  id: MobileMoneyProvider;
  name: string;
  shortCode: string;
  color: string;
  icon: string;
  countries: string[];
  fees: { percent: number; fixed: number };
  limits: { min: number; max: number };
  apiKey?: string;
  merchantId?: string;
}

export interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  provider: MobileMoneyProvider;
  phoneNumber: string;
  reference: string;
  description: string;
  vehicleId?: string;
  escrowEnabled: boolean;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  ussdCode?: string;
  pinRequired: boolean;
}

export interface EscrowTransaction {
  id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'created' | 'funded' | 'inspection' | 'released' | 'refunded' | 'disputed';
  paymentMethod: MobileMoneyProvider;
  createdAt: string;
  inspectionDeadline: string;
  inspectionPeriodDays: number;
  disputeReason?: string;
  releasedAt?: string;
}

export interface InstallmentPlan {
  id: string;
  vehicleId: string;
  buyerId: string;
  totalAmount: number;
  downPayment: number;
  monthlyPayment: number;
  duration: number;
  interestRate: number;
  currency: string;
  provider: MobileMoneyProvider;
  status: 'active' | 'completed' | 'defaulted';
  nextPaymentDate: string;
  paymentsMade: number;
}

export interface AgentNetwork {
  id: string;
  name: string;
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  supportedProviders: MobileMoneyProvider[];
  operatingHours: string;
  rating: number;
  verified: boolean;
}

export interface UssdSession {
  sessionId: string;
  phoneNumber: string;
  currentMenu: string;
  data: Record<string, string>;
  createdAt: string;
  expiresAt: string;
}

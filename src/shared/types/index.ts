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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
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

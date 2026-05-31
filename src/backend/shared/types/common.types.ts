export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface FilterParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

// Import centralized role definitions from shared/types/roles.ts
// This ensures consistency between frontend and backend
export { UserRole, isAdministrativeRole, isDepartmentalRole, isBusinessRole, isValidRole } from '../../../shared/types/roles';

export enum Permission {
  CUSTOMERS_READ = 'customers:read',
  CUSTOMERS_WRITE = 'customers:write',
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',
  NETWORK_READ = 'network:read',
  NETWORK_WRITE = 'network:write',
  PLANS_READ = 'plans:read',
  PLANS_WRITE = 'plans:write',
  ANALYTICS_READ = 'analytics:read',
  PAYMENTS_READ = 'payments:read',
  PAYMENTS_WRITE = 'payments:write',
  ADMIN_ALL = 'admin:all',
}

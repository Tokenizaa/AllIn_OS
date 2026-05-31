/**
 * Centralized Role Definitions
 * 
 * This file contains the official role definitions used across the entire application.
 * Both frontend and backend should import from this file to ensure consistency.
 * 
 * Architecture Decision:
 * - roles are stored in profiles table (NOT in customers)
 * - customer_type in customers table is for commercial classification only
 * - plan_id in customers table references the plans table
 */

export enum UserRole {
  // Administrative Roles
  ADMIN_MASTER = 'admin_master',
  GESTAO_ADMIN = 'gestao_admin',
  
  // Departmental Roles
  FINANCEIRO = 'financeiro',
  SUPORTE = 'suporte',
  LOGISTICA = 'logistica',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  AUDITOR = 'auditor',
  OPERADOR = 'operador',
  
  // Business Roles
  DISTRIBUIDOR = 'distribuidor',
  AFILIADO = 'afiliado',
  CLIENTE_FINAL = 'cliente_final',
}

/**
 * Role display names for UI
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN_MASTER]: 'Admin Master',
  [UserRole.GESTAO_ADMIN]: 'Gestão Admin',
  [UserRole.FINANCEIRO]: 'Financeiro',
  [UserRole.SUPORTE]: 'Suporte',
  [UserRole.LOGISTICA]: 'Logística',
  [UserRole.MARKETING]: 'Marketing',
  [UserRole.ANALYTICS]: 'Analytics',
  [UserRole.AUDITOR]: 'Auditor',
  [UserRole.OPERADOR]: 'Operador',
  [UserRole.DISTRIBUIDOR]: 'Distribuidor',
  [UserRole.AFILIADO]: 'Afiliado',
  [UserRole.CLIENTE_FINAL]: 'Cliente Final',
};

/**
 * Role categories for grouping
 */
export enum RoleCategory {
  ADMINISTRATIVE = 'administrative',
  DEPARTMENTAL = 'departmental',
  BUSINESS = 'business',
}

/**
 * Role to category mapping
 */
export const ROLE_CATEGORIES: Record<UserRole, RoleCategory> = {
  [UserRole.ADMIN_MASTER]: RoleCategory.ADMINISTRATIVE,
  [UserRole.GESTAO_ADMIN]: RoleCategory.ADMINISTRATIVE,
  [UserRole.FINANCEIRO]: RoleCategory.DEPARTMENTAL,
  [UserRole.SUPORTE]: RoleCategory.DEPARTMENTAL,
  [UserRole.LOGISTICA]: RoleCategory.DEPARTMENTAL,
  [UserRole.MARKETING]: RoleCategory.DEPARTMENTAL,
  [UserRole.ANALYTICS]: RoleCategory.DEPARTMENTAL,
  [UserRole.AUDITOR]: RoleCategory.DEPARTMENTAL,
  [UserRole.OPERADOR]: RoleCategory.DEPARTMENTAL,
  [UserRole.DISTRIBUIDOR]: RoleCategory.BUSINESS,
  [UserRole.AFILIADO]: RoleCategory.BUSINESS,
  [UserRole.CLIENTE_FINAL]: RoleCategory.BUSINESS,
};

/**
 * Helper function to check if a role is administrative
 */
export function isAdministrativeRole(role: UserRole): boolean {
  return ROLE_CATEGORIES[role] === RoleCategory.ADMINISTRATIVE;
}

/**
 * Helper function to check if a role is departmental
 */
export function isDepartmentalRole(role: UserRole): boolean {
  return ROLE_CATEGORIES[role] === RoleCategory.DEPARTMENTAL;
}

/**
 * Helper function to check if a role is business
 */
export function isBusinessRole(role: UserRole): boolean {
  return ROLE_CATEGORIES[role] === RoleCategory.BUSINESS;
}

/**
 * Type guard for UserRole
 */
export function isValidRole(value: string): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

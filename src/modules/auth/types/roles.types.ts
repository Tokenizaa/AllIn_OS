import { Permission, UserRole } from './auth.types';

export interface RolePermissions {
  [key: string]: Permission[];
}

export interface RoleConfig {
  role: UserRole;
  permissions: Permission[];
  canAccessAllModules?: boolean;
  description?: string;
}

export interface PermissionCheck {
  module: Permission['module'];
  action?: Permission['action'];
}

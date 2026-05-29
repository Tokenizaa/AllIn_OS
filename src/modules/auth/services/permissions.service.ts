import { Permission, UserRole } from '../types/auth.types';
import { getPermissionsByRole, hasPermission as checkPermission } from '../utils/role.utils';

export class PermissionsService {
  getPermissions(role: UserRole): Permission[] {
    return getPermissionsByRole(role);
  }

  hasPermission(role: UserRole, module: Permission['module'], action: Permission['action'] = 'read'): boolean {
    return checkPermission(role, module, action);
  }

  canAccessModule(role: UserRole, module: Permission['module']): boolean {
    if (role === 'admin_master') return true;
    const permissions = this.getPermissions(role);
    return permissions.some((p) => p.module === module);
  }

  canManageModule(role: UserRole, module: Permission['module']): boolean {
    if (role === 'admin_master') return true;
    const permissions = this.getPermissions(role);
    return permissions.some((p) => p.module === module && (p.action === 'all' || p.action === 'manage'));
  }
}

export const permissionsService = new PermissionsService();

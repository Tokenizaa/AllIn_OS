import { useContext } from 'react';
import { Permission, UserRole } from '../types/auth.types';
import { useSession } from './useSession';
import { getPermissionsByRole, hasPermission as checkPermission } from '../utils/role.utils';

export const usePermissions = () => {
  const { user } = useSession();

  const getPermissions = (): Permission[] => {
    if (!user) return [];
    return getPermissionsByRole(user.role);
  };

  const hasPermission = (module: Permission['module'], action: Permission['action'] = 'read'): boolean => {
    if (!user) return false;
    return checkPermission(user.role, module, action);
  };

  const canAccessModule = (module: Permission['module']): boolean => {
    if (!user) return false;
    if (user.role === 'admin_master') return true;
    const permissions = getPermissions();
    return permissions.some((p) => p.module === module);
  };

  const canManageModule = (module: Permission['module']): boolean => {
    if (!user) return false;
    if (user.role === 'admin_master') return true;
    const permissions = getPermissions();
    return permissions.some((p) => p.module === module && (p.action === 'all' || p.action === 'manage'));
  };

  return {
    permissions: getPermissions(),
    hasPermission,
    canAccessModule,
    canManageModule,
    isLoading: false,
    role: user?.role || null
  };
};

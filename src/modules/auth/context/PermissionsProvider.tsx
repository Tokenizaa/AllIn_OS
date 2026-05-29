import React, { createContext, useContext } from 'react';
import { Permission, UserRole } from '../types/auth.types';
import { permissionsService } from '../services/permissions.service';

interface PermissionsContextType {
  getPermissions: (role: UserRole) => Permission[];
  hasPermission: (module: Permission['module'], action?: Permission['action']) => boolean;
  canAccessModule: (module: Permission['module']) => boolean;
  canManageModule: (module: Permission['module']) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getPermissions = (role: UserRole): Permission[] => {
    return permissionsService.getPermissions(role);
  };

  const hasPermission = (module: Permission['module'], action: Permission['action'] = 'read'): boolean => {
    return permissionsService.hasPermission('admin_master', module, action);
  };

  const canAccessModule = (module: Permission['module']): boolean => {
    return permissionsService.canAccessModule('admin_master', module);
  };

  const canManageModule = (module: Permission['module']): boolean => {
    return permissionsService.canManageModule('admin_master', module);
  };

  const value: PermissionsContextType = {
    getPermissions,
    hasPermission,
    canAccessModule,
    canManageModule
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
};

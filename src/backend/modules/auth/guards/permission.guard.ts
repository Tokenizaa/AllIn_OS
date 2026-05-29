import { Permission } from "../../../shared/types/common.types";

export class PermissionGuard {
  static hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
    // Admin has all permissions
    if (userPermissions.includes(Permission.ADMIN_ALL)) {
      return true;
    }

    return userPermissions.includes(requiredPermission);
  }

  static hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    // Admin has all permissions
    if (userPermissions.includes(Permission.ADMIN_ALL)) {
      return true;
    }

    return requiredPermissions.some((permission) => userPermissions.includes(permission));
  }

  static hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    // Admin has all permissions
    if (userPermissions.includes(Permission.ADMIN_ALL)) {
      return true;
    }

    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [Permission.ADMIN_ALL],
  operator: [
    Permission.CUSTOMERS_READ,
    Permission.ORDERS_READ,
    Permission.ORDERS_WRITE,
    Permission.NETWORK_READ,
    Permission.PLANS_READ,
    Permission.ANALYTICS_READ,
    Permission.PAYMENTS_READ,
  ],
  distributor: [
    Permission.CUSTOMERS_READ,
    Permission.ORDERS_READ,
    Permission.NETWORK_READ,
    Permission.PLANS_READ,
    Permission.ANALYTICS_READ,
  ],
};

export function getPermissionsForRole(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

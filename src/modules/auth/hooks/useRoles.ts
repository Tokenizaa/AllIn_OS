import { UserRole } from '../types/auth.types';
import { isAdminRole, isDistributorRole, isCustomerRole } from '../utils/role.utils';
import { useSession } from './useSession';

export const useRoles = () => {
  const { user } = useSession();

  const isAdmin = (): boolean => {
    return user ? isAdminRole(user.role) : false;
  };

  const isDistributor = (): boolean => {
    return user ? isDistributorRole(user.role) : false;
  };

  const isCustomer = (): boolean => {
    return user ? isCustomerRole(user.role) : false;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    role: user?.role || null,
    isAdmin,
    isDistributor,
    isCustomer,
    hasRole,
    hasAnyRole
  };
};

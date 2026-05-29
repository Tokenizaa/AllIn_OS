// Context Providers
export { AuthProvider } from './context/AuthProvider';
export { SessionProvider } from './context/SessionProvider';
export { PermissionsProvider } from './context/PermissionsProvider';
export { DistributorProvider } from './context/DistributorProvider';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useSession } from './hooks/useSession';
export { usePermissions } from './hooks/usePermissions';
export { useDistributor as useAuthDistributor } from './hooks/useDistributor';
export { useCurrentCustomer } from './hooks/useCurrentCustomer';
export { useRoles } from './hooks/useRoles';

// Guards
export { AuthGuard as RouteGuard } from './guards/AuthGuard';
export { AuthGuard } from './guards/AuthGuard';
export { RoleGuard } from './guards/RoleGuard';
export { DistributorGuard } from './guards/DistributorGuard';
export { PublicGuard } from './guards/PublicGuard';

// Types
export type {
  UserRole,
  User,
  DistributorProfile,
  CustomerReferral,
  AuditLog,
  Permission,
  AdminInvite,
  ReferralMetadata,
  AuthState,
  AuthContextType,
  RegisterExtra,
  SessionData
} from './types/auth.types';

export type { SessionState, SessionContextType } from './types/session.types';
export type { RolePermissions, RoleConfig, PermissionCheck } from './types/roles.types';

// Services
export { authService } from './services/auth.service';
export { sessionService } from './services/session.service';
export { permissionsService } from './services/permissions.service';
export { distributorService } from './services/distributor.service';
export { customerService } from './services/customer.service';

// Utils
export { storageUtils, generateId, generateToken, delay } from './utils/auth.utils';
export {
  getPermissionsByRole,
  hasPermission,
  isAdminRole,
  isDistributorRole,
  isCustomerRole,
  ROLE_PERMISSIONS
} from './utils/role.utils';
export {
  getRoleRedirectPath,
  getLoginRedirectPath,
  shouldRedirectToLogin,
  extractReferralFromUrl
} from './utils/redirect.utils';

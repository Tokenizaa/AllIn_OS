import { UserRole } from '../types/auth.types';

export const getRoleRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'distributor':
      return '/office';
    case 'customer':
      return '/store';
    case 'admin_master':
    case 'gestão_admin':
    case 'finance':
    case 'financeiro':
    case 'support':
    case 'suporte':
    case 'logística':
    case 'marketing':
    case 'analytics':
    case 'auditor':
    case 'operador':
      return '/';
    default:
      return '/login';
  }
};

export const getLoginRedirectPath = (currentPath: string): string => {
  return `/login?redirect=${encodeURIComponent(currentPath)}`;
};

export const shouldRedirectToLogin = (isAuthenticated: boolean, currentPath: string): boolean => {
  const publicPaths = ['/login', '/register', '/auth/invite', '/loja', '/store'];
  const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));
  
  return !isAuthenticated && !isPublicPath;
};

export const extractReferralFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref');
  const currentPath = window.location.pathname;
  
  let potentialSponsor = refParam;
  if (!potentialSponsor && currentPath.includes('/ref/')) {
    const parts = currentPath.split('/ref/');
    if (parts[1]) {
      potentialSponsor = parts[1].split(/[/?#]/)[0];
    }
  }
  
  return potentialSponsor ? potentialSponsor.trim().toLowerCase() : null;
};

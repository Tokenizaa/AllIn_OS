import React, { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { UserRole } from '../types/auth.types';

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: { module: any; action?: any };
}

export const AuthGuard: React.FC<GuardProps> = ({ children, allowedRoles, requiredPermission }) => {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({
          to: '/login',
          search: { redirect: location.pathname }
        });
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'distributor') {
          navigate({ to: '/office' });
        } else if (user.role === 'customer') {
          navigate({ to: '/store' });
        } else {
          navigate({ to: '/' });
        }
        return;
      }

      if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action || 'read')) {
        navigate({ to: '/' });
      }
    }
  }, [user, loading, allowedRoles, requiredPermission, navigate, location.pathname, hasPermission]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
          <div className="absolute h-6 w-6 animate-ping rounded-full bg-primary/20" />
        </div>
        <p className="mt-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Iniciando ambiente de segurança...</p>
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;
  if (requiredPermission && !hasPermission(requiredPermission.module, requiredPermission.action || 'read')) return null;

  return <>{children}</>;
};

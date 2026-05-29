import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';

interface PublicGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicGuard: React.FC<PublicGuardProps> = ({ children, redirectTo = '/' }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: redirectTo });
    }
  }, [user, loading, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent" />
        </div>
        <p className="mt-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Carregando...</p>
      </div>
    );
  }

  if (user) return null;

  return <>{children}</>;
};

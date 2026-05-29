import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface DistributorGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const DistributorGuard: React.FC<DistributorGuardProps> = ({
  children,
  fallback = null
}) => {
  const { user, distributorProfile } = useAuth();
  
  if (!user || user.role !== 'distributor' || !distributorProfile) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

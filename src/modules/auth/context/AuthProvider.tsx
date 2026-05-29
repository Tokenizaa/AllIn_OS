import React from 'react';
import { SessionProvider } from './SessionProvider';
import { PermissionsProvider } from './PermissionsProvider';
import { DistributorProvider } from './DistributorProvider';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <PermissionsProvider>
        <DistributorProvider>
          {children}
        </DistributorProvider>
      </PermissionsProvider>
    </SessionProvider>
  );
};

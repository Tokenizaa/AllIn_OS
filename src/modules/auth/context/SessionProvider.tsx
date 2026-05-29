import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth.types';
import { SessionContextType, SessionState } from '../types/session.types';
import { sessionService } from '../services/session.service';
import { dataInitService } from '../services/data-init.service';

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SessionState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const initializeSession = async () => {
      try {
        dataInitService.initializeDefaultData();
        
        const user = await sessionService.restoreSession();
        setState({
          user,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('[SessionProvider] Error restoring session:', error);
        setState({
          user: null,
          loading: false,
          error: 'Failed to restore session'
        });
      }
    };

    initializeSession();
  }, []);

  const restoreSession = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const user = await sessionService.restoreSession();
      setState({
        user,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('[SessionProvider] Error restoring session:', error);
      setState({
        user: null,
        loading: false,
        error: 'Failed to restore session'
      });
    }
  };

  const clearSession = () => {
    sessionService.clearSession();
    setState({
      user: null,
      loading: false,
      error: null
    });
  };

  const saveSession = (user: User) => {
    sessionService.saveSession(user);
    setState(prev => ({ ...prev, user }));
  };

  const value: SessionContextType = {
    ...state,
    restoreSession,
    clearSession,
    saveSession,
    isAuthenticated: state.user !== null
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

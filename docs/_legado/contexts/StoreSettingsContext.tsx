import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';

// Tipo para as configurações da loja
type StoreSettings = {
  whatsapp: string;
  sponsorLink: string;
  updateSettings: (settings: { whatsapp?: string; sponsorLink?: string }) => void;
};

// Contexto com valores padrão
const StoreSettingsContext = createContext<StoreSettings>({
  whatsapp: '',
  sponsorLink: '',
  updateSettings: () => {},
});

// Hook para usar o contexto
export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings deve ser usado dentro de um StoreSettingsProvider');
  }
  return context;
};

// Provider do contexto
export const StoreSettingsProvider = ({ children }: { children: ReactNode }) => {
  // Carregar configurações do localStorage ao inicializar
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('storeSettings');
      return savedSettings 
        ? JSON.parse(savedSettings) 
        : { whatsapp: '5511999999999', sponsorLink: 'https://allinbrasil.com.br' };
    }
    return { whatsapp: '5511999999999', sponsorLink: 'https://allinbrasil.com.br' };
  });

  // Atualizar configurações e salvar no localStorage
  const updateSettings = useCallback((newSettings: { whatsapp?: string; sponsorLink?: string }) => {
    setSettings((prev: any) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('storeSettings', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Memoizar o valor do contexto
  const contextValue = React.useMemo(() => ({
    ...settings,
    updateSettings
  }), [settings, updateSettings]);

  return (
    <StoreSettingsContext.Provider value={contextValue}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export default StoreSettingsContext;
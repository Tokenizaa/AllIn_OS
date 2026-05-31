import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface StoreSettings {
  whatsapp: string;
  sponsorLink: string;
  storeName?: string;
  storeSlug?: string;
}

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (settings: Partial<StoreSettings>) => void;
}

const defaultSettings: StoreSettings = {
  whatsapp: '5511999999999',
  sponsorLink: 'https://allinbrasil.com.br',
  storeName: 'All In Brasil',
  storeSlug: 'allin-brasil',
};

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('storeSettings', JSON.stringify(updatedSettings));
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    // Return safe default instead of throwing to prevent app crash
    return {
      settings: defaultSettings,
      updateSettings: () => {
        console.warn('StoreSettingsProvider not found, settings update ignored');
      },
    };
  }
  return context;
};

import React, { createContext, useContext, ReactNode } from 'react';

interface SharedStyles {
  sectionStyles: string;
  cardStyles: string;
  titleStyles: string;
  subtitleStyles: string;
}

const StyleContext = createContext<SharedStyles | undefined>(undefined);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const styles: SharedStyles = {
    sectionStyles: "py-16 px-4",
    cardStyles: "bg-white/50 dark:bg-allin-bg-dark-1/50 backdrop-blur-sm rounded-2xl p-8 border border-allin-orange/20",
    titleStyles: "text-3xl md:text-4xl font-bold mb-4 text-allin-dark dark:text-allin-white",
    subtitleStyles: "text-lg text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto",
  };

  return <StyleContext.Provider value={styles}>{children}</StyleContext.Provider>;
};

export const useSharedStyles = (): SharedStyles => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useSharedStyles must be used within a StyleProvider');
  }
  return context;
};
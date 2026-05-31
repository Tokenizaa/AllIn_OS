import React, { createContext, useContext, ReactNode } from 'react';

export interface SharedStyles {
  section: string;
  card: string;
  title: string;
  subtitle: string;
}

const defaultStyles: SharedStyles = {
  section: 'py-16 px-4',
  card: 'bg-white/30 dark:bg-allin-bg-dark-2/30 rounded-lg border border-allin-orange/10',
  title: 'text-3xl md:text-4xl font-bold text-allin-dark dark:text-allin-white mb-4',
  subtitle: 'text-lg text-allin-dark/70 dark:text-allin-white/70',
};

const StyleContext = createContext<SharedStyles>(defaultStyles);

export const StyleProvider: React.FC<{ children: ReactNode; styles?: Partial<SharedStyles> }> = ({ 
  children, 
  styles = {} 
}) => {
  const mergedStyles: SharedStyles = { ...defaultStyles, ...styles };
  
  return (
    <StyleContext.Provider value={mergedStyles}>
      {children}
    </StyleContext.Provider>
  );
};

export const useSharedStyles = () => {
  const context = useContext(StyleContext);
  // Context has default value, so it will never be undefined
  return context || defaultStyles;
};

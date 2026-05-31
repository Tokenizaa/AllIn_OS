import React from 'react';

import { StoreInfo } from '@/components/store-data';
import { useSharedStyles } from '@/contexts/StyleContext';

const AboutStore = ({ storeInfo }: { storeInfo: StoreInfo }) => {
  const { sectionStyles, titleStyles } = useSharedStyles();

  return (
    <section className={sectionStyles}>
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className={titleStyles}>
          Sobre a <span className="text-allin-orange">{storeInfo.name}</span>
        </h2>
        <p className="text-xl text-allin-dark/80 dark:text-allin-white/80 max-w-3xl mx-auto leading-relaxed">
          {storeInfo.description || 'Loja especializada em produtos de qualidade para você.'}
        </p>
      </div>
    </section>
  );
};

export default AboutStore;

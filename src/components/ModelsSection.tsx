import React from 'react';

import ProductGallery from "@/components/features/products/ProductGallery";

const ModelsSection = () => {
  return (
    <section className="py-20 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2">
      <div className="container mx-auto px-4">
        <ProductGallery limit={4} />
      </div>
    </section>
  );
};

export default ModelsSection;

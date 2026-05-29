import React from 'react';

import OptimizedImage from '@/components/OptimizedImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSharedStyles } from '@/contexts/StyleContext';
import { Product } from '@/types/products';

interface Category {
  id: number;
  name: string;
  productCount: number;
}

interface StoreCategoriesProps {
  loading: boolean;
  categories: Category[];
  products: Product[];
  hidden?: boolean; // Nova propriedade para controlar a visibilidade
}

const StoreCategories: React.FC<StoreCategoriesProps> = ({
  loading,
  categories,
  products,
  hidden = false, // Valor padrão é false (visível)
}) => {
  // Se hidden for true, não renderiza nada
  if (hidden) {
    return null;
  }

  const { sectionStyles, titleStyles, subtitleStyles } = useSharedStyles();
  return (
    <section className={sectionStyles}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className={titleStyles}>
            Explore por <span className="text-allin-orange">Categorias</span>
          </h2>
          <p className={subtitleStyles}>
            Navegue pelas nossas categorias e encontre exatamente o que você procura.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3 animate-pulse mb-2" />
                  <div className="h-4 bg-allin-bg-light-3 dark:bg-allin-bg-dark-3 animate-pulse w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => {
              const mainProduct = products.find(p => p.categorias === category.name);
              return (
                <Card key={category.id} className="group cursor-pointer overflow-hidden bg-white/50 dark:bg-allin-bg-dark-1/50 backdrop-blur-sm border border-allin-orange/20 hover:border-allin-orange/50 transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    {mainProduct ? <OptimizedImage src={mainProduct.imgFluidSrc} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full bg-allin-bg-light-2 dark:bg-allin-bg-dark-2 flex items-center justify-center"><span className="text-allin-dark dark:text-allin-white">Imagem não disponível</span></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4"><h3 className="text-xl font-bold text-white mb-1">{category.name}</h3><p className="text-white/80 text-sm">{category.productCount} produtos</p></div>
                  </div>
                  <CardContent className="p-4"><Button variant="vibrant" className="w-full">Ver Produtos</Button></CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreCategories;
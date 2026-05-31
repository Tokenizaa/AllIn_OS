import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/utils/priceFormatter';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price?: string;
  tag?: string;
  onDetailsClick?: () => void;
  onAddToCart?: () => void;
  className?: string;
}

// Memoizar o componente para evitar re-renderizações desnecessárias
const ProductCardComponent: React.FC<ProductCardProps> = ({ 
  image, 
  title, 
  description, 
  price, 
  tag,
  onDetailsClick,
  onAddToCart,
  className = ''
}) => {
  const formattedPrice = formatPrice(price);

  return (
    <Card className={`overflow-hidden border border-allin-orange/40 shadow-lg hover:shadow-xl transition-all duration-300 bg-allin-bg-light-1 dark:bg-allin-bg-dark-1 group animate-slide-up glass-card h-full flex flex-col dark:dark:bg-allin-bg-dark-3 dark:dark:border-allin-bg-dark-2 ${className}`}>
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/400x400?text=Imagem+Indispon%C3%ADvel';
          }}
        />
        {tag && (
          <div className="absolute top-2 right-2 bg-allin-orange text-allin-dark text-xs font-bold px-2 py-1 rounded-full">
            {tag}
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold text-allin-orange line-clamp-1">
          {title}
        </CardTitle>
        <p className="text-sm text-allin-dark/80 dark:text-allin-white/80 line-clamp-2">
          {description.substring(0, 100)}...
        </p>
        <p className="text-xl font-bold text-allin-orange mt-2">
          {formattedPrice || 'Preço não disponível'}
        </p>
      </CardHeader>
      <CardContent className="p-4 mt-auto">
        <div className="flex gap-2">
          {onDetailsClick && (
            <Button 
              variant="vibrantOutline"
              className="flex-1"
              onClick={onDetailsClick}
            >
              Detalhes
            </Button>
          )}
          {onAddToCart && (
            <Button 
              variant="vibrant"
              className="flex-1"
              onClick={onAddToCart}
            >
              Comprar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Adicionar display name para facilitar debugging
ProductCardComponent.displayName = 'ProductCard';

// Exportar componente memoizado
const ProductCard = memo(ProductCardComponent);

export default ProductCard;
